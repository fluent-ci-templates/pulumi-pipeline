import {
  queryType,
  makeSchema,
  dirname,
  join,
  resolve,
  stringArg,
  nonNull,
} from "../../deps.ts";

import { preview, up } from "./jobs.ts";

const Query = queryType({
  definition(t) {
    t.string("preview", {
      args: {
        src: nonNull(stringArg()),
        stack: nonNull(stringArg()),
        token: nonNull(stringArg()),
        googleApplicationCredentials: stringArg(),
      },
      resolve: async (_root, args, _ctx) =>
        await preview(
          args.src,
          args.stack,
          args.token,
          args.googleApplicationCredentials
        ),
    });
    t.string("up", {
      args: {
        src: nonNull(stringArg()),
        stack: nonNull(stringArg()),
        token: nonNull(stringArg()),
        googleApplicationCredentials: stringArg(),
      },
      resolve: async (_root, args, _ctx) =>
        await up(
          args.src,
          args.stack,
          args.token,
          args.googleApplicationCredentials
        ),
    });
  },
});

export const schema = makeSchema({
  types: [Query],
  outputs: {
    schema: resolve(join(dirname(".."), dirname(".."), "schema.graphql")),
    typegen: resolve(join(dirname(".."), dirname(".."), "gen", "nexus.ts")),
  },
});
