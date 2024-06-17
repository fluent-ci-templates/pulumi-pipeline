# Pulumi Pipeline

[![fluentci pipeline](https://img.shields.io/badge/dynamic/json?label=pkg.fluentci.io&labelColor=%23000&color=%23460cf1&url=https%3A%2F%2Fapi.fluentci.io%2Fv1%2Fpipeline%2Fpulumi_pipeline&query=%24.version)](https://pkg.fluentci.io/pulumi_pipeline)
![deno compatibility](https://shield.deno.dev/deno/^1.41)
[![dagger-min-version](https://img.shields.io/badge/dagger-v0.11.7-blue?color=3D66FF&labelColor=000000)](https://dagger.io)
[![](https://jsr.io/badges/@fluentci/pulumi)](https://jsr.io/@fluentci/pulumi)
[![ci](https://github.com/fluent-ci-templates/pulumi-pipeline/actions/workflows/ci.yml/badge.svg)](https://github.com/fluent-ci-templates/pulumi-pipeline/actions/workflows/ci.yml)

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

## 🧩 Dagger Module

Use as a [Dagger](https://dagger.io) module:

```bash
dagger install github.com/fluent-ci-templates/pulumi-pipeline@main
```

Call a function from the module:

```bash
dagger call preview \
  --src . \
  --stack dev \
  --token env:PULUMI_ACCESS_TOKEN \
  --google-application-credentials ./fluentci-086b644d4c53.json
dagger call up \
  --src . \
  --stack dev \
  --token env:PULUMI_ACCESS_TOKEN \
  --google-application-credentials ./fluentci-086b644d4c53.json
```

## 🛠️ Environment variables

| Variable            | Description                                                                |
| ------------------- | -------------------------------------------------------------------------- |
| PULUMI_ACCESS_TOKEN | The Pulumi access token to use for authenticating with the Pulumi service. |
| PULUMI_STACK        | The name of the stack to operate on.                                       |
| PULUMI_VERSION      | The version of the Pulumi CLI to use. Defaults to `latest`.                |

## ✨ Jobs

| Job     | Description                                      |
| ------- | ------------------------------------------------ |
| preview | Show a preview of updates to a stack's resources |
| up      | Create or update the resources in a stack        |

```typescript
preview(
  src: Directory | string,
  stack: string,
  token: Secret | string,
  pulumiVersion = "latest",
  googleApplicationCredentials?: string
): Promise<string>

up(
  src: Directory | string,
  stack: string,
  token: Secret | string,
  pulumiVersion = "latest",
  googleApplicationCredentials?: string
): Promise<string>

```

## 👨‍💻 Programmatic usage

You can also use this pipeline programmatically:

```ts
import { preview, up } from "jsr:@fluentci/pulumi";

await preview(
  ".", 
  Deno.env.get("PULUMI_STACK") || "dev",
  Deno.env.get("PULUMI_ACCESS_TOKEN")!
);

await up(
  ".", 
  Deno.env.get("PULUMI_STACK") || "dev",
  Deno.env.get("PULUMI_ACCESS_TOKEN")!
);
```
