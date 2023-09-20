import { assertEquals } from "../../deps.ts";
import { filterObjectByPrefix } from "./lib.ts";

Deno.test(function filterObjectByPrefixTest() {
  const actual = filterObjectByPrefix({ a: "a", b: "b", c: "c" }, ["a", "b"]);
  const expected = { a: "a", b: "b" };
  assertEquals(actual, expected);
});
