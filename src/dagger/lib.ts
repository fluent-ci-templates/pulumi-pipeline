import { Container } from "@fluentci.io/dagger";

export function filterObjectByPrefix<T>(
  obj: Record<string, T>,
  prefix: string[]
): Record<string, T> {
  const filteredObject: Record<string, T> = {};

  for (const key in obj) {
    for (const p of prefix) {
      if (key.startsWith(p)) {
        filteredObject[key] = obj[key];
      }
    }
  }

  return filteredObject;
}

export function withEnvs(ctr: Container, envs: Record<string, string>) {
  for (const key in envs) {
    ctr = ctr.withEnvVariable(key, envs[key]);
  }
  return ctr;
}
