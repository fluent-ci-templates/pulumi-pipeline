import { env } from "../../deps.ts";
import * as jobs from "./jobs.ts";

const { preview, runnableJobs } = jobs;

export default async function pipeline(src = ".", args: string[] = []) {
  if (args.length > 0) {
    await runSpecificJobs(args as jobs.Job[]);
    return;
  }

  await preview(
    src,
    env.get("PULUMI_STACK") || "dev",
    env.get("PULUMI_ACCESS_TOKEN") || ""
  );
}

async function runSpecificJobs(args: jobs.Job[]) {
  for (const name of args) {
    const job = runnableJobs[name];
    if (!job) {
      throw new Error(`Job ${name} not found`);
    }
    await job(
      ".",
      env.get("PULUMI_STACK") || "dev",
      env.get("PULUMI_ACCESS_TOKEN") || ""
    );
  }
}
