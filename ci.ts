import Client, { connect } from "https://sdk.fluentci.io/v0.1.9/mod.ts";
import {
  preview,
  up,
} from "https://pkg.fluentci.io/pulumi_pipeline@v0.1.1/mod.ts";

function pipeline(src = ".") {
  connect(async (client: Client) => {
    await preview(client, src);
    await up(client, src);
  });
}

pipeline();
