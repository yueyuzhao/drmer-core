import { EventEmitter } from './EventEmitter';

/**
 * Classes that extend this classes will have a `ready` state,
 * and you can delay to run your functions when the instance turns
 * into the `ready` state.
 * @memberof core
 */
class Readily extends EventEmitter
{
    private _ready = false;

    protected readyCallbacks: (() => void)[] = [];

    /**
   * Whether this instance is ready, set `true` to this field
   * will mark this instance as ready, and will run the callback
   * functions registered by `onReady`.
   */
    public get ready(): boolean
    {
        return this._ready;
    }

    public set ready(ready: boolean)
    {
        this._ready = ready;
        if (ready)
        {
            do
            {
                const fcn = this.readyCallbacks.pop();

                if (typeof fcn === 'function')
                {
                    fcn();
                }
            } while (this.readyCallbacks.length > 0);
        }
    }

    /**
   * Register for callback when this instance turns into
   * the ready state, will be called directly if it was ready.
   * @param fcn
   */
    public onReady(fcn: () => void): void
    {
        if (this._ready)
        {
            if (fcn)
            {
                fcn();
            }

            return;
        }
        this.readyCallbacks.push(fcn);
    }

    public destroy(): void
    {
        this.readyCallbacks.length = 0;
        this._ready = false;
    }
}

export {
    Readily,
};
