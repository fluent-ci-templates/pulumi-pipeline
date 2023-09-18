import Client from "@fluentci.io/dagger";
import { filterObjectByPrefix, withEnvs } from "./lib.ts";

export enum Job {
  preview = "preview",
  up = "up",
}

export const exclude = [".git", ".fluentci", "node_modules"];

const PULUMI_VERSION = Deno.env.get("PULUMI_VERSION") || "latest";

const envs = filterObjectByPrefix(Deno.env.toObject(), [
  "PULUMI_",
  "GOOGLE_",
  "AWS_",
]);

export const preview = async (client: Client, src = ".") => {
  const context = client.host().directory(src);
  const baseCtr = withEnvs(
    client
      .pipeline(Job.preview)
      .container()
      .from(`pulumi/pulumi:${PULUMI_VERSION}`),
    envs
  );
  const ctr = baseCtr
    .withMountedCache("/root/.pulumi", client.cacheVolume("pulumi-cache"))
    .withMountedCache(
      "/app/node_modules",
      client.cacheVolume("pulumi-node-modules")
    )
    .withDirectory("/app", context, { exclude })
    .withWorkdir("/app")
    .withExec(["npm", "install"], { skipEntrypoint: true })
    .withExec(["preview", "--non-interactive"]);

  const result = await ctr.stdout();

  console.log(result);
};

export const up = async (client: Client, src = ".") => {
  const context = client.host().directory(src);
  const baseCtr = withEnvs(
    client.pipeline(Job.up).container().from(`pulumi/pulumi:${PULUMI_VERSION}`),
    envs
  );

  const ctr = baseCtr
    .withMountedCache("/root/.pulumi", client.cacheVolume("pulumi-cache"))
    .withMountedCache(
      "/app/node_modules",
      client.cacheVolume("pulumi-node-modules")
    )
    .withDirectory("/app", context, { exclude })
    .withWorkdir("/app")
    .withExec(["npm", "install"], { skipEntrypoint: true })
    .withExec(["up", "--yes", "--non-interactive"]);

  const result = await ctr.stdout();

  console.log(result);
};

export type JobExec = (
  client: Client,
  src?: string
) =>
  | Promise<void>
  | ((
      client: Client,
      src?: string,
      options?: {
        ignore: string[];
      }
    ) => Promise<void>);

export const runnableJobs: Record<Job, JobExec> = {
  [Job.preview]: preview,
  [Job.up]: up,
};

export const jobDescriptions: Record<Job, string> = {
  [Job.preview]: "Show a preview of updates to a stack's resources",
  [Job.up]: "Create or update the resources in a stack",
};
