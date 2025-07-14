import { http, HttpResponse } from "msw";
import { setupWorker } from "msw/browser";
import { z } from "zod";
import { faker } from "@faker-js/faker";
import type { BaseEntity } from "@/types/base";
import { Storage } from "@/utils/localStorage";
import type { Filter, Response } from "@/types/response";

export class MockServer<T extends BaseEntity> {
  private worker: ReturnType<typeof setupWorker>;
  private storage: Storage<T>;
  private schema: z.ZodSchema<T>;
  private factory: () => Omit<T, keyof BaseEntity>;

  constructor(
    path: string,
    schema: z.ZodSchema<T>,
    factory: () => Omit<T, keyof BaseEntity>,
    seedCount = 50
  ) {
    this.storage = new Storage<T>(`mock_${path}`);
    this.schema = schema;
    this.factory = factory;

    this.seed(seedCount);
    this.worker = setupWorker(...this.handlers(path));
  }

  private seed(count: number): void {
    if (this.storage.count() > 0) return;

    faker.seed(123);
    for (let i = 0; i < count; i++) {
      const data = this.factory();
      const item = {
        ...data,
        id: faker.string.uuid(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
      } as T;
      this.storage.set(item.id, item);
    }
  }

  private deserializeDates = (item: T): T => {
    const deserialized = { ...item };

    if (typeof deserialized.createdAt === "string") {
      deserialized.createdAt = new Date(deserialized.createdAt);
    }
    if (typeof deserialized.updatedAt === "string") {
      deserialized.updatedAt = new Date(deserialized.updatedAt);
    }

    return deserialized;
  };

  private filter(items: T[], filter: Filter<T>): T[] {
    let result = items;

    // Search
    if (filter._search) {
      const term = filter._search.toLowerCase();
      result = result.filter((item) =>
        Object.values(item as Record<string, any>).some((val) =>
          String(val).toLowerCase().includes(term)
        )
      );
    }

    // Property filters
    Object.entries(filter).forEach(([key, value]) => {
      if (!key.startsWith("_") && value !== undefined) {
        result = result.filter((item) => {
          const itemValue = (item as any)[key];
          // Convert both values to string for comparison
          const itemStr = String(itemValue);
          const filterStr = String(value);
          return itemStr === filterStr;
        });
      }
    });

    // Sorting
    if (filter._sort) {
      const order = filter._order || "asc";
      const sortField = filter._sort;

      result.sort((a, b) => {
        const aVal = (a as any)[sortField];
        const bVal = (b as any)[sortField];

        let aCompare = aVal;
        let bCompare = bVal;

        if (aVal instanceof Date) aCompare = aVal.getTime();
        if (bVal instanceof Date) bCompare = bVal.getTime();

        const comparison =
          aCompare < bCompare ? -1 : aCompare > bCompare ? 1 : 0;
        return order === "desc" ? -comparison : comparison;
      });
    }

    return result;
  }

  private paginate(items: T[], page = 1, limit = 20): Response<T[]> {
    const start = (page - 1) * limit;
    const total = items.length;
    const totalPages = Math.ceil(total / limit);

    return {
      data: items.slice(start, start + limit),
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  private parseQuery(url: string): Filter<T> {
    const params = new URL(url).searchParams;
    const filter: any = {};

    params.forEach((value, key) => {
      if (key === "_page" || key === "_limit") {
        filter[key] = +value;
      } else if (key === "_all") {
        filter[key] = value === "true";
      } else {
        filter[key] = value;
      }
    });

    return filter;
  }

  private handlers(path: string) {
    const basePath = `/${path}`;

    return [
      // GET /{path}
      http.get(basePath, async ({ request }) => {
        const filter = this.parseQuery(request.url);
        const items = Object.values(this.storage.getAll()).map(
          this.deserializeDates
        );
        const filtered = this.filter(items, filter);

        if (filter._all) {
          return HttpResponse.json({
            data: filtered,
            meta: {
              total: filtered.length,
              page: 1,
              limit: filtered.length,
              totalPages: 1,
            },
          });
        }

        const result = this.paginate(filtered, filter._page, filter._limit);
        return HttpResponse.json(result);
      }),

      // GET /{path}/:id
      http.get(`${basePath}/:id`, ({ params }) => {
        const item = this.storage.get(params.id as string);
        return item
          ? HttpResponse.json({ data: this.deserializeDates(item) })
          : HttpResponse.json({ error: "Not found" }, { status: 404 });
      }),

      // POST /{path}
      http.post(basePath, async ({ request }) => {
        try {
          const body = await request.json();
          const item = {
            ...(body as Record<string, any>),
            id: faker.string.uuid(),
            createdAt: new Date(),
            updatedAt: new Date(),
          } as T;

          this.schema.parse(item);
          this.storage.set(item.id, item);
          return HttpResponse.json({ data: item }, { status: 201 });
        } catch (error) {
          console.error("POST Error:", error);
          return HttpResponse.json(
            {
              error: "Invalid data",
              details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 400 }
          );
        }
      }),

      // PUT /{path}/:id
      http.put(`${basePath}/:id`, async ({ params, request }) => {
        try {
          const id = params.id as string;
          const existing = this.storage.get(id);
          if (!existing) {
            return HttpResponse.json({ error: "Not found" }, { status: 404 });
          }
          const prevData = this.deserializeDates(existing);

          const bodyText = await request.text();
          const body = JSON.parse(bodyText);

          const updated = {
            ...(prevData as Record<string, any>),
            ...(body as Record<string, any>),
            id,
            createdAt: prevData.createdAt, // Keep original createdAt
            updatedAt: new Date(),
          } as T;

          this.schema.parse(updated);
          this.storage.set(id, updated);
          return HttpResponse.json({ data: updated });
        } catch (error) {
          console.error("PUT Error:", error);
          return HttpResponse.json(
            {
              error: "Invalid data",
              details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 400 }
          );
        }
      }),

      // DELETE /{path}/:id
      http.delete(`${basePath}/:id`, ({ params }) => {
        const deleted = this.storage.delete(params.id as string);
        return deleted
          ? new HttpResponse(null, { status: 204 })
          : HttpResponse.json({ error: "Not found" }, { status: 404 });
      }),
    ];
  }

  async start(): Promise<void> {
    await this.worker.start({ onUnhandledRequest: "bypass" });
  }

  async stop(): Promise<void> {
    await this.worker.stop();
  }

  add(data: Omit<T, keyof BaseEntity>): T {
    const item = {
      ...(data as Record<string, any>),
      id: faker.string.uuid(),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as T;
    this.storage.set(item.id, item);
    return item;
  }

  clear(): void {
    this.storage.clear();
  }

  count(): number {
    return this.storage.count();
  }
}
