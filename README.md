# Pulumi Pipeline

[![fluentci pipeline](https://img.shields.io/badge/dynamic/json?label=pkg.fluentci.io&labelColor=%23000&color=%23460cf1&url=https%3A%2F%2Fapi.fluentci.io%2Fv1%2Fpipeline%2Fpulumi_pipeline&query=%24.version)](https://pkg.fluentci.io/pulumi_pipeline)
![deno compatibility](https://shield.deno.dev/deno/^1.37)
[![](https://img.shields.io/codecov/c/gh/fluent-ci-templates/pulumi-pipeline)](https://codecov.io/gh/fluent-ci-templates/pulumi-pipeline)

A ready-to-use CI/CD Pipeline for managing your infrastructure with [Pulumi](https://www.pulumi.com/).

## 🚀 Usage

Run the following command in your project:

```bash
fluentci run pulumi_pipeline
```

Or, if you want to use it as a template:

```bash
fluentci init -t pulumi
```

This will create a `.fluentci` folder in your project.

Now you can run the pipeline with:

```bash
fluentci run .
```

## Environment variables

| Variable            | Description                                                                |
| ------------------- | -------------------------------------------------------------------------- |
| PULUMI_ACCESS_TOKEN | The Pulumi access token to use for authenticating with the Pulumi service. |
| PULUMI_STACK        | The name of the stack to operate on.                                       |
| PULUMI_VERSION      | The version of the Pulumi CLI to use. Defaults to `latest`.                |

## Jobs

| Job     | Description                                      |
| ------- | ------------------------------------------------ |
| preview | Show a preview of updates to a stack's resources |
| up      | Create or update the resources in a stack        |

```graphql
preview(
  googleApplicationCredentials: String, 
  src: String!, 
  stack: String!, 
  token: String!
): String

up(
  googleApplicationCredentials: String, 
  src: String!, 
  stack: String!, 
  token: String!
): String

```
## Programmatic usage

You can also use this pipeline programmatically:

```ts
import { preview, up } from "https://pkg.fluentci.io/pulumi_pipeline@v0.2.1/mod.ts";

await preview();
// await up();
```
