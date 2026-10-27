import { describe, expect, it } from "vitest";
import en from "./en.json";
import ka from "./ka.json";

type Tree = { [key: string]: string | Tree };

function leafPaths(tree: Tree, prefix = ""): string[] {
  return Object.entries(tree).flatMap(([key, value]) =>
    typeof value === "string"
      ? [`${prefix}${key}`]
      : leafPaths(value, `${prefix}${key}.`),
  );
}

function leafValues(tree: Tree): string[] {
  return Object.values(tree).flatMap((value) =>
    typeof value === "string" ? [value] : leafValues(value),
  );
}

describe("UI messages", () => {
  it("define the same keys in English and Georgian", () => {
    expect(leafPaths(ka).sort()).toEqual(leafPaths(en).sort());
  });

  it.each([
    ["en", en],
    ["ka", ka],
  ])("have no empty strings (%s)", (_, messages) => {
    expect(leafValues(messages).filter((v) => v.trim() === "")).toEqual([]);
  });
});
