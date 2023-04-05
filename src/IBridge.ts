/**
 * Native bridge interface, all bridges must provide a method
 * called `postMessage` to receive data from JS or webview.
 * @memberof core
 */
interface IBridge
{
    /**
   * Send messages to the bridge, the message structure is like
   * ```json
   * {
   *   "method": "ProjectService@delete",
   *   "payload": {
   *     "id": 1
   *   }
   * }
   * ```
   * @param data - the data that needs to be processed
   */
    postMessage(data: string): void;
}

export {
    IBridge,
};
