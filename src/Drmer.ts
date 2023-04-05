import { IJob } from './IJob';
import { IBridge } from './IBridge';
import { Readily } from './Readily';
import { global } from './global';

/**
 * The middleware that native(Android, iOS, Desktop etc) and JS talk to each other.
 * The JS side doesn't need to know which native platform it is running on. Calls to
 * the instance will be bridged to the bond bridge.
 * @example
 * import {Drmer} from "@drmer/core";
 * const drmer = new Drmer();
 * // 1. bind the bridge
 * drmer.bindBridge(bridge);
 * // or you can expose a global variable to `window` as name `androidBridge`, `browserBridge`, `desktopBridge`,
 * // `macBridge`, `iOSBridge`, `drmer` will automatically bind it.
 *
 * // 2. call native functions
 * drmer.run("AppService@test");
 * drmer.callJson("ProjectService@get", {
 *   "id": 1,
 * }).then((project) => {
 *  // process project
 *  console.log(project);
 * });
 * // or
 * (async () => {
 *   const project = await drmer.callJson("ProjectService@get", {
 *     "id": 1,
 *   });
 *   console.log(project);
 * })();
 *
 * // 3. native returns the results
 * drmer.dequeue("li123", {
 *   volume: 10,
 * });
 *
 * //
 * // When you needs native to call JS proactively, you can register an listener to
 * // an event on JS, then emit that event from native.
 *
 * // On JS
 * drmer.on("app.pause", () => {
 *   // do things when app pause
 * });
 *
 * // On native
 * drmer.emit("app.pause");
 * @memberof core
 */
class Drmer extends Readily
{
    private _bridge: IBridge | undefined;

    private jobs: Map<string, IJob> = new Map();

    private backCallbacks: (() => void)[] = [];

    private timeoutId: NodeJS.Timeout | undefined;

    /**
   * The current bond bridge
   */
    public get bridge(): IBridge | undefined
    {
        return this._bridge;
    }

    /**
   * Register for callback when this instance turns into
   * the ready state, will be called directly if it was ready.
   * This will also start waiting for the bridge.
   * @param fcn
   */
    public onReady(fcn: () => void): void
    {
        super.onReady(fcn);
        this.waitForBridge();
    }

    private waitForBridge()
    {
        if (this.bridge)
        {
            return;
        }
        // eslint-disable-next-line no-console
        console.log('waiting for active bridge');
        const bridges = [
            'androidBridge',
            'browserBridge',
            'desktopBridge',
            'macBridge',
            'iOSBridge',
        ];

        for (let i = 0; i < bridges.length; i++)
        {
            const bridge = global[bridges[i]];

            if (bridge)
            {
                // eslint-disable-next-line no-console
                console.log(`found bridge: ${bridges[i]}`);
                this.bindBridge(bridge);

                return;
            }
        }
        this.timeoutId = setTimeout(() =>
        {
            this.waitForBridge();
        }, 50);
    }

    /**
   * Unbind the bond bridge
   */
    public unbindBridge(): void
    {
        this._bridge = undefined;
        this.ready = false;
    }

    /**
   * Bind bridge manually, you need to unbind the bridge first if
   * other bridge is bond first. After the bridge is bond, this instance
   * will turn into the `ready` state.
   * @param bridge - Bridge that will handle the calls.
   */
    public bindBridge(bridge: IBridge): void
    {
        if (this._bridge)
        {
            console.error(
                'bridge bond, unbind first if you need bind another bridge'
            );

            return;
        }
        this._bridge = bridge;
        this.ready = true;
        clearTimeout(this.timeoutId);
    }

    /**
   * Bind the given bridge after some time.
   * This gives us a chance that we can bind other bridges before the given time.
   * For example, we can lazy bind the browser bridge when running on iOS, when the native
   * bridge on iOS is ready before the given time, we will use it. And our programs can also run
   * on browser with the given browser bridge.
   * ```js
   * import {bridge} from "@drmer/browser";
   * drmer.lazyBindBridge(bridge);
   * drmer.lazyBindBridge(bridge, 1000);
   * ```
   * @param bridge - bridge to be bound
   * @param timeout - milliseconds to wait to bind given bridge
   */
    public lazyBindBridge(bridge: IBridge, timeout = 500): void
    {
        setTimeout(() =>
        {
            this.bindBridge(bridge);
        }, timeout);
    }

    public close(): void
    {
        const backCallbacks = this.backCallbacks;

        do
        {
            const callbackFn = backCallbacks.pop();

            if (callbackFn)
            {
                callbackFn();
            }
        } while (backCallbacks.length > 0);
    }

    /**
   * Generate a uniq id that will be used by callbacks
   * @private
   */
    private getId()
    {
        let id: string;

        do
        {
            id = `li${new Date().getTime()}${Math.floor(Math.random() * 1000)}`;
            if (!this.jobs.has(id))
            {
                return id;
            }
            // eslint-disable-next-line no-constant-condition
        } while (true);
    }

    /**
   * Send commands to native
   * Use this if you need the results.
   * Use `run` instead if you don't needs the results.
   * @param method - Method signature
   * @param params - Arguments
   */
    public call(method: string, params?: object | string): Promise<any>
    {
        return this.remoteCall(method, false, params);
    }

    /**
   * Send commands to native
   * Use this if you need to deserialize the result by JSON.
   * Use `run` instead if you don't needs the results.
   * @param method - Method signature
   * @param params - Arguments
   */
    public callJson(method: string, params?: object | string): Promise<any>
    {
        return this.remoteCall(method, true, params);
    }

    private remoteCall(method: string, needsJson: boolean, params?: object | string)
    {
        return new Promise((resolve: any) =>
        {
            this.onReady(() =>
            {
                const id = this.getId();

                this.jobs.set(id, {
                    needsJson,
                    callback: resolve,
                });
                this.bridge.postMessage(
                    JSON.stringify({
                        id,
                        method,
                        params,
                    })
                );
            });
        });
    }

    /**
   * Call native and get live results
   * @param method - Method signature
   * @param params - payload
   * @param cbFn - callback listener
   * @return job id
   */
    public live(method: string, params?: object | string | (() => void), cbFn?: (() => void)): string | null
    {
        if (typeof params === 'function')
        {
            cbFn = params as (() => void);
            params = undefined;
        }

        const id = this.getId();

        this.onReady(() =>
        {
            this.jobs.set(id, {
                listen: true,
                callback: cbFn,
            });

            this.bridge.postMessage(
                JSON.stringify({
                    id,
                    method,
                    params,
                })
            );
        });

        return id;
    }

    /**
   * Unregister for native live jobs
   * @param id - job id
   */
    public die(id: string): void
    {
        this.jobs.delete(id);
    }

    /**
   * Send commands to native
   * Use this if you don't need the results.
   * Use `call` or `callJson` if you need to get the result.
   * @param method - Method signature id
   * @param params - Arguments
   */
    public run(method: string, params?: object | string): void
    {
        this.onReady(() =>
        {
            this.bridge.postMessage(
                JSON.stringify({
                    method,
                    params,
                })
            );
        });
    }

    /**
   * This is called by the native parts to return results
   * for remote calls.
   * @param id - Job id
   * @param res - Results
   */
    public dequeue(id: string, res: object | string): void
    {
        if (!id || !this.jobs.has(id))
        {
            return;
        }
        const job = this.jobs.get(id);

        if (typeof job?.callback === 'function')
        {
            if (job.needsJson)
            {
                if (typeof res === 'string')
                {
                    res = JSON.parse(res);
                }
            }
            else
            if (typeof res === 'object')
            {
                res = JSON.stringify(res);
            }
            job.callback(res);
        }
        if (job?.listen)
        {
            return;
        }
        this.jobs.delete(id);
    }

    public destroy(): void
    {
        super.destroy();
        if (this.timeoutId)
        {
            clearTimeout(this.timeoutId);
        }
        this._bridge = undefined;
        this.jobs.clear();
    }
}

export { Drmer };
