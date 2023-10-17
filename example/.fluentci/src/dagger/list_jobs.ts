import { brightGreen } from "../../deps.ts";
import { runnableJobs, jobDescriptions, Job } from "./jobs.ts";
import { stringifyTree } from "../../deps.ts";

const tree = {
  name: brightGreen("pulumi_pipeline"),
  children: (Object.keys(runnableJobs) as Job[]).map((job) => ({
    name: jobDescriptions[job]
      ? `${brightGreen(job)} - ${jobDescriptions[job]}`
      : brightGreen(job),
    children: [],
  })),
};

console.log(
  stringifyTree(
    tree,
    (t) => t.name,
    (t) => t.children
  )
);
