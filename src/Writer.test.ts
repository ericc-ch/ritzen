import { beforeAll, describe, expect, it, afterAll } from "bun:test";
import fs from "node:fs/promises";
import path from "node:path";
import { Writer } from "./Writer";

const dirPath = path.join(process.cwd(), ".test");

describe("tulis", () => {
  beforeAll(async () => {
    await fs.mkdir(dirPath);
  });

  afterAll(async () => {
    await fs.rm(dirPath, { force: true, recursive: true });
  });

  it("should handle file URL correctly", async () => {
    const content = "URL Test";

    const filePath = path.join(dirPath, "test.txt");
    const fileURL = Bun.pathToFileURL(filePath);

    const writerURL = new Writer(fileURL);
    await writerURL.write(content);

    const contentURL = await Bun.file(fileURL).text();
    expect(contentURL).toBe(content);
  });

  it("should handle race conditions and write correctly", async () => {
    const max = 1000;

    const filePath = path.join(dirPath, "test.txt");
    const writer = new Writer(filePath);
    const promises = [];

    // Test race condition
    for (let i = 1; i <= max; ++i) {
      promises.push(writer.write(String(i)));
    }

    // All promises should resolve
    await Promise.all(promises);
    const content = await Bun.file(filePath).text();
    expect(parseInt(content)).toBe(max);
  });
});
