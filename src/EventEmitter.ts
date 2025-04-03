type Handler = (args?: string) => void;

export class EventEmitter<EventMap> {
  events = {} as { [key in keyof EventMap]: Handler[] };

  on<T extends keyof EventMap>(event: T, cb: Handler): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(cb);
  }

  off<T extends keyof EventMap>(event: T, cb: Handler): void {
    this.events[event] = this.events[event]?.filter((c) => c !== cb);
  }

  trigger<T extends keyof EventMap>(event: T, data?: string): void {
    this.events[event]?.forEach((cb) => cb(data));
  }

  once<T extends keyof EventMap>(event: T, cb: Handler): void {
    const wrapper = (data?: string) => {
      cb(data);
      this.off(event, wrapper);
    };
    this.on(event, wrapper);
  }
}
