interface LogContext {
  [key: string]: unknown;
}

interface LogEntry {
  timestamp: string;
  level: "info" | "error" | "warn" | "debug";
  message: string;
  context?: LogContext;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

const isDevelopment =
  typeof process !== "undefined" && process.env.NODE_ENV === "development";

function formatLogEntry(entry: LogEntry): string {
  if (isDevelopment) {
    return `[${entry.timestamp}] ${entry.level.toUpperCase()}: ${entry.message}${
      entry.context
        ? `\nContext: ${JSON.stringify(entry.context, null, 2)}`
        : ""
    }${
      entry.error
        ? `\nError: ${entry.error.name}: ${entry.error.message}${
            entry.error.stack ? `\nStack: ${entry.error.stack}` : ""
          }`
        : ""
    }`;
  }

  return JSON.stringify(entry);
}

function createLogEntry(
  level: LogEntry["level"],
  message: string,
  context?: LogContext,
  error?: Error
): LogEntry {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
  };

  if (context) {
    entry.context = context;
  }

  if (error) {
    entry.error = {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  return entry;
}

export function logInfo(message: string, context?: LogContext): void {
  const entry = createLogEntry("info", message, context);
  console.log(formatLogEntry(entry));
}

export function logError(error: Error | unknown, context?: LogContext): void {
  const errorObj = error instanceof Error ? error : new Error(String(error));
  const entry = createLogEntry("error", errorObj.message, context, errorObj);
  console.error(formatLogEntry(entry));
}

export function logWarn(message: string, context?: LogContext): void {
  const entry = createLogEntry("warn", message, context);
  console.warn(formatLogEntry(entry));
}

export function logDebug(message: string, context?: LogContext): void {
  if (isDevelopment) {
    const entry = createLogEntry("debug", message, context);
    console.debug(formatLogEntry(entry));
  }
}
