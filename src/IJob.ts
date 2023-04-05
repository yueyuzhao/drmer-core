/**
 * Data structure for native call tasks
 * @memberof core
 */
interface IJob
{
    /**
   * Whether we need to convert the result to JSON object
   */
    needsJson?: boolean;
    /**
   * Is this a onetime call or we should continuously return the result
   */
    listen?: boolean;

    /**
   * If the caller needs the result, a Promise will be returned.
   * This field will be the Promise.resolve function.
   */
    callback?: (res: object | string) => void;
}

export {
    IJob,
};
