import type { LogEntry, Transport } from "../types";

export class ConsoleTransport implements Transport {
  constructor(private readonly pretty = process.env.NODE_ENV !== "production") {}

  log(entry: LogEntry): void {
    if (this.pretty) {
      const prefix = `[${entry.level.toUpperCase()}]${entry.service ? ` ${entry.service}` : ""}`;
      if (entry.context) {
        console[entry.level === "debug" ? "debug" : entry.level](
          prefix,
          entry.message,
          entry.context,
        );
      } else {
        console[entry.level === "debug" ? "debug" : entry.level](prefix, entry.message);
      }
      return;
    }

    console.log(JSON.stringify(entry));
  }
}
