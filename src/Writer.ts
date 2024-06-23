import type { BunFile } from "bun";
import { file as bunFile } from "bun";

export class Writer {
  private queue: string | undefined;
  private current: string | undefined;
  private isLocked: boolean = false;

  private file: BunFile;

  constructor(file: string | URL) {
    this.file = bunFile(file);
  }

  private async _write() {
    if (!this.current) return;

    this.isLocked = true;
    try {
      await Bun.write(this.file, this.current);
    } catch (error) {
      console.error("Failed to write to file:", error);
    } finally {
      this.current = this.queue;
      this.queue = undefined;
      this.isLocked = false;

      if (this.current) {
        await this._write();
      }
    }
  }

  public async write(data: string) {
    if (this.isLocked) {
      this.queue = data;
    } else {
      this.current = data;
      await this._write();
    }
  }
}
