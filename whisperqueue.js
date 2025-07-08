// whisperQueue.js
// A lightweight, sequential async queue — tasks whisper in one at a time.

class WhisperQueue {
  constructor() {
    this.queue = [];
    this.executing = false;
  }

  /**
   * Adds an async function to the queue.
   * @param {Function} task - An async function that returns a Promise.
   */
  enqueue(task) {
    if (typeof task !== 'function') throw new Error('Task must be a function returning a Promise');
    this.queue.push(task);
    this._processQueue();
  }

  async _processQueue() {
    if (this.executing) return;
    this.executing = true;

    while (this.queue.length) {
      const task = this.queue.shift();
      try {
        await task();
      } catch (e) {
        console.warn('[WhisperQueue] Task failed silently:', e);
      }
    }

    this.executing = false;
  }

  /**
   * Clears any remaining tasks in the queue.
   */
  clear() {
    this.queue = [];
  }
}

// Example usage:
// const queue = new WhisperQueue();
// queue.enqueue(async () => { console.log('Task 1'); await new Promise(r => setTimeout(r, 500)); });
// queue.enqueue(async () => { console.log('Task 2'); });
// queue.enqueue(async () => { console.log('Task 3'); });

export default WhisperQueue;
