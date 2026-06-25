import { redactContext } from "./redact";
import { ConsoleTransport } from "./transports/console";
import type { LogContext, LogEntry, LogLevel, Logger, LoggerOptions, Transport } from "./types";

const LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

function shouldLog(current: LogLevel, minimum: LogLevel): boolean {
  return LEVEL_ORDER[current] >= LEVEL_ORDER[minimum];
}

class MedLensLogger implements Logger {
  private readonly bindings: LogContext;

  constructor(
    private readonly service: string,
    private readonly level: LogLevel,
    private readonly transports: Transport[],
    bindings: LogContext = {},
  ) {
    this.bindings = bindings;
  }

  child(bindings: LogContext): Logger {
    return new MedLensLogger(this.service, this.level, this.transports, {
      ...this.bindings,
      ...bindings,
    });
  }

  debug(message: string, context?: LogContext): void {
    this.write("debug", message, context);
  }

  info(message: string, context?: LogContext): void {
    this.write("info", message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.write("warn", message, context);
  }

  error(message: string, context?: LogContext): void {
    this.write("error", message, context);
  }

  private write(level: LogLevel, message: string, context?: LogContext): void {
    if (!shouldLog(level, this.level)) {
      return;
    }

    const merged = redactContext({ ...this.bindings, ...context });
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      service: this.service,
      context: merged,
    };

    for (const transport of this.transports) {
      void transport.log(entry);
    }
  }
}

export function createLogger(options: LoggerOptions): Logger {
  const transports = options.transports ?? [new ConsoleTransport()];
  return new MedLensLogger(options.service, options.level ?? "info", transports);
}
