import Client, { connect } from "../../deps.ts";
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

export const preview = async (
  src = ".",
  stack?: string,
  token?: string,
  googleApplicationCredentials?: string
) => {
  const GOOGLE_APPLICATION_CREDENTIALS =
    Deno.env.get("GOOGLE_APPLICATION_CREDENTIALS") ||
    googleApplicationCredentials;
  const PULUMI_STACK = Deno.env.get("PULUMI_STACK") || stack;
  const PULUMI_ACCESS_TOKEN = Deno.env.get("PULUMI_ACCESS_TOKEN") || token;
  if (!PULUMI_STACK) {
    throw new Error("PULUMI_STACK env var is required");
  }

  await connect(async (client: Client) => {
    const context = client.host().directory(src);
    const baseCtr = withEnvs(
      client
        .pipeline(Job.preview)
        .container()
        .from(`pulumi/pulumi:${PULUMI_VERSION}`),
      envs
    );
    const ctr = baseCtr
      .withEnvVariable("PULUMI_ACCESS_TOKEN", PULUMI_ACCESS_TOKEN || "")
      .withEnvVariable(
        "GOOGLE_APPLICATION_CREDENTIALS",
        GOOGLE_APPLICATION_CREDENTIALS || ""
      )
      .withMountedCache("/root/.pulumi", client.cacheVolume("pulumi-cache"))
      .withMountedCache(
        "/app/node_modules",
        client.cacheVolume("pulumi-node-modules")
      )
      .withDirectory("/app", context, { exclude })
      .withWorkdir("/app")
      .withExec(["npm", "install"], { skipEntrypoint: true })
      .withExec(["preview", "--non-interactive", "--stack", PULUMI_STACK]);

    const result = await ctr.stdout();

    console.log(result);
  });
  return "Done";
};

export const up = async (
  src = ".",
  stack?: string,
  token?: string,
  googleApplicationCredentials?: string
) => {
  const GOOGLE_APPLICATION_CREDENTIALS =
    Deno.env.get("GOOGLE_APPLICATION_CREDENTIALS") ||
    googleApplicationCredentials;
  const PULUMI_STACK = Deno.env.get("PULUMI_STACK") || stack;
  const PULUMI_ACCESS_TOKEN = Deno.env.get("PULUMI_ACCESS_TOKEN") || token;
  if (!PULUMI_STACK) {
    throw new Error("PULUMI_STACK env var is required");
  }

  await connect(async (client: Client) => {
    const context = client.host().directory(src);
    const baseCtr = withEnvs(
      client
        .pipeline(Job.up)
        .container()
        .from(`pulumi/pulumi:${PULUMI_VERSION}`),
      envs
    );

    const ctr = baseCtr
      .withEnvVariable("PULUMI_ACCESS_TOKEN", PULUMI_ACCESS_TOKEN || "")
      .withEnvVariable(
        "GOOGLE_APPLICATION_CREDENTIALS",
        GOOGLE_APPLICATION_CREDENTIALS || ""
      )
      .withMountedCache("/root/.pulumi", client.cacheVolume("pulumi-cache"))
      .withMountedCache(
        "/app/node_modules",
        client.cacheVolume("pulumi-node-modules")
      )
      .withDirectory("/app", context, { exclude })
      .withWorkdir("/app")
      .withExec(["npm", "install"], { skipEntrypoint: true })
      .withExec(["up", "--yes", "--non-interactive", "--stack", PULUMI_STACK]);

    const result = await ctr.stdout();

    console.log(result);
  });
  return "Done";
};

export type JobExec = (
  src?: string,
  stack?: string,
  token?: string
) =>
  | Promise<string>
  | ((
      src?: string,
      stack?: string,
      token?: string,
      options?: {
        ignore: string[];
      }
    ) => Promise<string>);

export const runnableJobs: Record<Job, JobExec> = {
  [Job.preview]: preview,
  [Job.up]: up,
};

export const jobDescriptions: Record<Job, string> = {
  [Job.preview]: "Show a preview of updates to a stack's resources",
  [Job.up]: "Create or update the resources in a stack",
};
