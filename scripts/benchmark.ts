import fs from "node:fs/promises";
import path from "node:path";
import { Writer } from "../src";

const KB = 1024;
const MB = KB * 1024;

const KB_1 = Buffer.alloc(KB, "x").toString();
const MB_1 = Buffer.alloc(MB, "x").toString();
const MB_10 = Buffer.alloc(MB * 10, "x").toString();

const dirPath = path.join(process.cwd(), ".benchmark");

await fs.rm(dirPath, { force: true, recursive: true });
await fs.mkdir(dirPath);

const fsFile = path.join(dirPath, "fs.txt");
const ritzenFile = path.join(dirPath, "ritzen.txt");

const ritzen = new Writer(ritzenFile);

async function fsBenchmark(data: string) {
  console.time("fs");
  for (let i = 0; i < 1000; i++) {
    await fs.writeFile(fsFile, `${data}${i}`);
  }
  console.timeEnd("fs");
}

async function ritzenBenchmark(data: string) {
  console.time("ritzen");
  const promises = Array(1000)
    .fill(0)
    .map((_, i) => ritzen.write(`${data}${i}`));
  await Promise.all(promises);
  console.timeEnd("ritzen");
}

console.log("Write 1KB data to the same file x 1000");
await fsBenchmark(KB_1);
await ritzenBenchmark(KB_1);

console.log("Write 1MB data to the same file x 1000");
await fsBenchmark(MB_1);
await ritzenBenchmark(MB_1);

console.log("Write 10MB data to the same file x 1000");
await fsBenchmark(MB_10);
await ritzenBenchmark(MB_10);

const fsResult = await Bun.file(fsFile).text();
const ritzenResult = await Bun.file(ritzenFile).text();

console.log(
  "Check if the files are identical: ",
  fsResult === ritzenResult ? "✓" : "✗"
);
