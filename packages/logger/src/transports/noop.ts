import type { LogEntry, Transport } from "../types";

export class NoOpTransport implements Transport {
  log(_entry: LogEntry): void {
    // intentionally empty
  }
}
