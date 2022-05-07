import {
  EventEmitter as BasicEventEmitter,
  EventNames,
} from "eventemitter3";

/**
 * Event emitter, the ScratchJr packages make a lot use of EventEmitter to decouple.
 * ```js
 * const emitter = new EventEmitter();
 * const cb = (msg) => {
 *   // do something
 *   console.log(msg);
 * };
 * // register event listener
 * emitter.on("hello", cb);
 * // fire the event
 * emitter.emit("hello", "world");
 * // unregister the listener
 * emitter.off("hello", cb);
 * ```
 * For more usage please see the official document {@link https://github.com/primus/eventemitter3}.
 * @memberof core
 */
class EventEmitter extends BasicEventEmitter {
  /**
   * Fires an event with args, this will call each of the listeners registered for the given event.
   * @param event - the event id
   * @param args - related arguments
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  emit<T extends EventNames<string | symbol>>(event: T, ...args: any): boolean {
    // TODO: add counter to events
    // console.log(this, event);

    return super.emit(event, ...args);
  }
}

export {
  EventEmitter,
}
