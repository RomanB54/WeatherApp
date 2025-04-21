import { EventEmitter } from './EventEmitter';

describe('EventEmitter', () => {
  it('should add and trigger event listeners', () => {
    const emitter = new EventEmitter<{ testEvent: string }>();
    const testCallback = jest.fn();

    emitter.on('testEvent', testCallback);
    emitter.trigger('testEvent', 'testData');

    expect(testCallback).toHaveBeenCalledTimes(1);
    expect(testCallback).toHaveBeenCalledWith('testData');
  });

  it('should remove event listeners', () => {
    const emitter = new EventEmitter<{ testEvent: string }>();
    const testCallback = jest.fn();

    emitter.on('testEvent', testCallback);
    emitter.off('testEvent', testCallback);
    emitter.trigger('testEvent', 'testData');

    expect(testCallback).toHaveBeenCalledTimes(0);
  });

  it('should trigger event with no listeners', () => {
    const emitter = new EventEmitter<{ testEvent: string }>();
    emitter.trigger('testEvent', 'testData');
  });

  it('should handle the once method correctly', () => {
    const emitter = new EventEmitter<{ testEvent: string }>();
    const testCallback = jest.fn();

    emitter.once('testEvent', testCallback);
    emitter.trigger('testEvent', 'testData');
    emitter.trigger('testEvent', 'testData');

    expect(testCallback).toHaveBeenCalledTimes(1);
  });

  it('should handle multiple events', () => {
    const emitter = new EventEmitter<{ event1: string; event2: string }>();
    const callback1 = jest.fn();
    const callback2 = jest.fn();

    emitter.on('event1', callback1);
    emitter.on('event2', callback2);

    emitter.trigger('event1', 'data1');
    emitter.trigger('event2', 'data2');

    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback1).toHaveBeenCalledWith('data1');
    expect(callback2).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledWith('data2');
  });
});
