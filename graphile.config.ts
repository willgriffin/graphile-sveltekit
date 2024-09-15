import type {} from "graphile-config";
import type {} from "graphile-worker";

const preset = {
  worker: {
    connectionString: process.env.DATABASE_URL,
    concurrentJobs: 5,
    fileExtensions: [".js", ".cjs", ".mjs", ".ts", ".cts", ".mts"],
    taskDirectory: "tasks",
  },
};

export default preset;