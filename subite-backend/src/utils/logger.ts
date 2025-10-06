import { env } from "../config/env.js";

interface LogLevel {
  INFO: string;
  WARN: string;
  ERROR: string;
  DEBUG: string;
}

const LOG_LEVELS: LogLevel = {
  INFO: "info",
  WARN: "warn",
  ERROR: "error",
  DEBUG: "debug",
};

class Logger {
  private formatMessage(level: string, message: string, meta?: any): string {
    const timestamp = new Date().toISOString();
    const baseMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

    if (meta && Object.keys(meta).length > 0) {
      return `${baseMessage} ${JSON.stringify(meta)}`;
    }

    return baseMessage;
  }

  info(message: string, meta?: any): void {
    console.log(this.formatMessage(LOG_LEVELS.INFO, message, meta));
  }

  warn(message: string, meta?: any): void {
    console.warn(this.formatMessage(LOG_LEVELS.WARN, message, meta));
  }

  error(message: string, meta?: any): void {
    console.error(this.formatMessage(LOG_LEVELS.ERROR, message, meta));
  }

  debug(message: string, meta?: any): void {
    if (env.NODE_ENV === "development") {
      console.log(this.formatMessage(LOG_LEVELS.DEBUG, message, meta));
    }
  }
}

export const logger = new Logger();