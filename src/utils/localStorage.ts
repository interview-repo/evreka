export class Storage<T = any> {
  private prefix: string;

  constructor(prefix: string = "app") {
    this.prefix = prefix;
  }

  private key(id: string): string {
    return `${this.prefix}:${id}`;
  }

  set(id: string, data: T): boolean {
    try {
      localStorage.setItem(this.key(id), JSON.stringify(data));
      return true;
    } catch {
      return false;
    }
  }

  get(id: string): T | null {
    try {
      const item = localStorage.getItem(this.key(id));
      if (!item) return null;

      const parsed = JSON.parse(item);

      return parsed;
    } catch {
      return null;
    }
  }

  delete(id: string): boolean {
    try {
      localStorage.removeItem(this.key(id));
      return true;
    } catch {
      return false;
    }
  }

  getAll(): Record<string, T> {
    const items: Record<string, T> = {};
    const prefix = `${this.prefix}:`;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(prefix)) {
        const id = key.replace(prefix, "");
        const data = this.get(id);
        if (data) items[id] = data;
      }
    }

    return items;
  }

  clear(): void {
    const prefix = `${this.prefix}:`;
    const keysToDelete: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(prefix)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach((key) => localStorage.removeItem(key));
  }

  count(): number {
    return Object.keys(this.getAll()).length;
  }

  exists(id: string): boolean {
    return this.get(id) !== null;
  }
}
