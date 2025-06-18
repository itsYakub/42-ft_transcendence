import path from "node:path";
import envSchema from "env-schema";

const schema = {
  type: "object",
  required: ["PORT", "LOG_LEVEL", "NODE_ENV"],
  properties: {
    PORT: {
      type: "number",
      default: 3000,
    },
    LOG_LEVEL: {
      type: "string",
      default: "info",
    },
    NODE_ENV: {
      type: "string",
      default: "development",
      enum: ["development", "testing", "production", "staging"],
    },
  },
};

const config = envSchema({
  schema: schema,
  dotenv: {
    path: path.join(import.meta.dirname, "../../.env"),
  },
});

const envConfig = {
  port: config.PORT,
  logLevel: config.LOG_LEVEL,
  nodeEnv: config.NODE_ENV,
};

export default envConfig;
