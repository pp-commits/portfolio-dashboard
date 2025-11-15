
export class RateLimiter {
  private queue: Array<() => void> = [];
  private running = 0;

  /**
   * @param concurrency max concurrent requests
   * @param minDelayMs minimum delay between requests (per slot)
   */
  constructor(private concurrency = 2, private minDelayMs = 300) {}

  private next() {
    if (this.queue.length === 0) return;
    if (this.running >= this.concurrency) return;

    const job = this.queue.shift()!;
    this.running++;
    job();
    // when job resolves, decrement running and schedule next
  }

  public async schedule<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const wrapper = () => {
        // run the function
        fn()
          .then((res) => {
            resolve(res);
          })
          .catch((err) => reject(err))
          .finally(() => {
            // throttle next run by minDelay
            setTimeout(() => {
              this.running--;
              this.next();
            }, this.minDelayMs);
          });
      };

      this.queue.push(wrapper);
      this.next();
    });
  }
}

// export a shared limiter tuned for web scraping
export const defaultLimiter = new RateLimiter(3, 300); // 3 concurrent, 300ms gap
