import type { Task } from "graphile-worker";

const task: Task = async (inPayload) => {

  console.log({inPayload});
};

export default task;
