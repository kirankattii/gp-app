import winston from "winston";

const isProduction = process.env.NODE_ENV === "production";

// ⭐ Development Format (Colorful + Pretty)
const devFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ level, message, timestamp, stack }) => {
    return stack
      ? `[${timestamp}] ${level}: ${message}\n${stack}`
      : `[${timestamp}] ${level}: ${message}`;
  }),
);

// ⭐ Production Format (JSON logs for servers / PM2 / Docker)
const prodFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json(),
);

const logger = winston.createLogger({
  level: isProduction ? "info" : "debug",
  format: isProduction ? prodFormat : devFormat,
  defaultMeta: { service: "green-peddle-backend" },
  transports: [
    // 🔵 Console logging (always enabled)
    new winston.transports.Console(),

    // 🔴 Log errors to file (optional but useful)
    new winston.transports.File({
      filename: "error.log",
      level: "error",
    }),

    // 🔵 Log everything to combined.log
    new winston.transports.File({
      filename: "combined.log",
    }),
  ],
});

export default logger;
