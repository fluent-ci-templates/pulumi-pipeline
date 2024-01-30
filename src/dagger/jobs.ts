import { Directory, Secret, dag } from "../../deps.ts";
import {
  filterObjectByPrefix,
  withEnvs,
  getDirectory,
  getPulumiAccessToken,
} from "./lib.ts";

export enum Job {
  preview = "preview",
  up = "up",
}

export const exclude = [".git", ".fluentci", "node_modules"];

const envs = filterObjectByPrefix(Deno.env.toObject(), [
  "PULUMI_",
  "GOOGLE_",
  "AWS_",
]);

/**
 * @function
 * @description Show a preview of updates to a stack's resources
 * @param {string | Directory} src
 * @param {string} stack
 * @param {string | Secret} token
 * @param {string} pulumiVersion
 * @param {string} googleApplicationCredentials
 * @returns {Promise<string>}
 */
export async function preview(
  src: Directory | string,
  stack: string,
  token: Secret | string,
  pulumiVersion = "latest",
  googleApplicationCredentials?: string
): Promise<string> {
  const GOOGLE_APPLICATION_CREDENTIALS =
    Deno.env.get("GOOGLE_APPLICATION_CREDENTIALS") ||
    googleApplicationCredentials;
  const PULUMI_STACK = Deno.env.get("PULUMI_STACK") || stack;

  const PULUMI_VERSION = Deno.env.get("PULUMI_VERSION") || pulumiVersion;

  const context = await getDirectory(dag, src);
  const secret = await getPulumiAccessToken(dag, token);

  if (!secret) {
    console.error("PULUMI_ACCESS_TOKEN env var is required");
    Deno.exit(1);
  }

  const baseCtr = withEnvs(
    dag
      .pipeline(Job.preview)
      .container()
      .from(`pulumi/pulumi:${PULUMI_VERSION}`),
    envs
  );
  const ctr = baseCtr
    .withSecretVariable("PULUMI_ACCESS_TOKEN", secret)
    .withEnvVariable(
      "GOOGLE_APPLICATION_CREDENTIALS",
      GOOGLE_APPLICATION_CREDENTIALS || ""
    )
    .withMountedCache("/root/.pulumi", dag.cacheVolume("pulumi-cache"))
    .withMountedCache(
      "/app/node_modules",
      dag.cacheVolume("pulumi-node-modules")
    )
    .withDirectory("/app", context, { exclude })
    .withWorkdir("/app")
    .withExec(["npm", "install"], { skipEntrypoint: true })
    .withExec(["preview", "--non-interactive", "--stack", PULUMI_STACK]);

  const result = await ctr.stdout();
  return result;
}

/**
 * @function
 * @description Create or update the resources in a stack
 * @param {string | Directory} src
 * @param {string} stack
 * @param {string | Secret} token
 * @param {string} pulumiVersion
 * @param {string} googleApplicationCredentials
 * @returns {Promise<string>}
 */
export async function up(
  src: Directory | string,
  stack: string,
  token: Secret | string,
  pulumiVersion = "latest",
  googleApplicationCredentials?: string
): Promise<string> {
  const GOOGLE_APPLICATION_CREDENTIALS =
    Deno.env.get("GOOGLE_APPLICATION_CREDENTIALS") ||
    googleApplicationCredentials;
  const PULUMI_STACK = Deno.env.get("PULUMI_STACK") || stack;
  const PULUMI_VERSION = Deno.env.get("PULUMI_VERSION") || pulumiVersion;

  const context = await getDirectory(dag, src);
  const secret = await getPulumiAccessToken(dag, token);
  const baseCtr = withEnvs(
    dag.pipeline(Job.up).container().from(`pulumi/pulumi:${PULUMI_VERSION}`),
    envs
  );

  if (!secret) {
    console.error("PULUMI_ACCESS_TOKEN env var is required");
    Deno.exit(1);
  }

  const ctr = baseCtr
    .withSecretVariable("PULUMI_ACCESS_TOKEN", secret)
    .withEnvVariable(
      "GOOGLE_APPLICATION_CREDENTIALS",
      GOOGLE_APPLICATION_CREDENTIALS || ""
    )
    .withMountedCache("/root/.pulumi", dag.cacheVolume("pulumi-cache"))
    .withMountedCache(
      "/app/node_modules",
      dag.cacheVolume("pulumi-node-modules")
    )
    .withDirectory("/app", context, { exclude })
    .withWorkdir("/app")
    .withExec(["npm", "install"], { skipEntrypoint: true })
    .withExec(["up", "--yes", "--non-interactive", "--stack", PULUMI_STACK]);

  const result = await ctr.stdout();
  return result;
}

export type JobExec = (
  src: Directory | string,
  stack: string,
  token: Secret | string,
  pulumiVersion?: string,
  googleApplicationCredentials?: string
) => Promise<string>;

export const runnableJobs: Record<Job, JobExec> = {
  [Job.preview]: preview,
  [Job.up]: up,
};

export const jobDescriptions: Record<Job, string> = {
  [Job.preview]: "Show a preview of updates to a stack's resources",
  [Job.up]: "Create or update the resources in a stack",
};
