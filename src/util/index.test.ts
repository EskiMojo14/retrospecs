import { describe, expect, it, vi } from "vitest";
import {
  assert,
  clamp,
  defaultNullish,
  emplace,
  groupBy,
  mapGroupBy,
  mergeSlottedContext,
} from ".";

describe("util / index", () => {
  describe("assert", () => {
    it.each([false, 0, "", null, undefined, NaN])(
      "should throw an error if the value is falsy, value: %s",
      (value) => {
        expect(() => {
          assert(value, "Foo");
        }).toThrow("Foo");
      },
    );
    it.each([true, 1, "a", {}, []])(
      "should not throw an error if the value is truthy: %s",
      (value) => {
        expect(() => {
          assert(value, "Foo");
        }).not.toThrow();
      },
    );
  });
  describe("clamp", () => {
    it("should clamp the value to the min", () => {
      expect(clamp(-1, 0, 10)).toBe(0);
    });
    it("should clamp the value to the max", () => {
      expect(clamp(11, 0, 10)).toBe(10);
    });
    it("should not clamp the value", () => {
      expect(clamp(5, 0, 10)).toBe(5);
    });
  });
  describe("groupBy", () => {
    const array = [
      { key: "a", value: 1 },
      { key: "a", value: 2 },
      { key: "b", value: 3 },
    ];
    it("should group by the key", () => {
      expect(groupBy(array, (item) => item.key)).toEqual({
        a: [
          { key: "a", value: 1 },
          { key: "a", value: 2 },
        ],
        b: [{ key: "b", value: 3 }],
      });
    });
    it("should allow derivation", () => {
      expect(
        groupBy(
          array,
          (item) => item.key,
          (item) => item.value,
        ),
      ).toEqual({
        a: [1, 2],
        b: [3],
      });
    });
  });
  describe("mapGroupBy", () => {
    const array = [
      { key: "a", value: 1 },
      { key: "a", value: 2 },
      { key: "b", value: 3 },
    ];
    it("should group by the key", () => {
      expect(mapGroupBy(array, (item) => item.key)).toEqual(
        new Map([
          [
            "a",
            [
              { key: "a", value: 1 },
              { key: "a", value: 2 },
            ],
          ],
          ["b", [{ key: "b", value: 3 }]],
        ]),
      );
    });
    it("should allow derivation", () => {
      expect(
        mapGroupBy(
          array,
          (item) => item.key,
          (item) => item.value,
        ),
      ).toEqual(
        new Map([
          ["a", [1, 2]],
          ["b", [3]],
        ]),
      );
    });
  });
  describe("emplace", () => {
    it("should insert a value if it does not exist", () => {
      const map = new Map<string, number>();
      const key = "foo";
      const value = 42;
      expect(map.has(key)).toBe(false);

      const insert = vi.fn(() => value);

      const result = emplace(map, key, {
        insert,
      });

      expect(map.get(key)).toBe(value);
      expect(result).toBe(value);
      expect(insert).toHaveBeenCalledWith(key, map);
    });
    it("should update a value if it exists", () => {
      const map = new Map<string, number>([["foo", 42]]);
      const key = "foo";
      const value = 42;
      expect(map.has(key)).toBe(true);

      const update = vi.fn((n: number) => ++n);

      const result = emplace(map, key, {
        update,
      });

      expect(result).toBe(value + 1);
      expect(map.get(key)).toBe(value + 1);
      expect(update).toHaveBeenCalledWith(value, key, map);
    });
    it("should throw an error if the key is not found and no insert handler is provided", () => {
      const map = new Map<string, number>();
      const key = "foo";
      expect(map.has(key)).toBe(false);

      expect(() => emplace(map, key, {})).toThrowErrorMatchingInlineSnapshot(
        `[Error: No insert provided for key not already in map]`,
      );
    });
    it("should return the value if it exists, even if no update handler is provided", () => {
      const map = new Map<string, number>([["foo", 42]]);
      const key = "foo";
      const value = 42;
      expect(map.has(key)).toBe(true);

      const result = emplace(map, key, {});

      expect(result).toBe(value);
    });
  });
  describe("defaultNullish", () => {
    interface Test {
      a: number;
      b: number | null;
      c: number | undefined;
      d?: number;
    }
    it("should return the value if it has no nullish properties", () => {
      const value: Test = { a: 1, b: 2, c: 3, d: 4 };
      const defaults = { a: 0, b: 0, c: 0, d: 0 };
      expect(defaultNullish(value, defaults)).toBe(value);
    });
    it("should return the value with the defaults if it has nullish properties", () => {
      const value: Test = { a: 1, b: null, c: undefined };
      const defaults = { a: 0, b: 0, c: 0, d: 0 };
      expect(defaultNullish(value, defaults)).toEqual({
        a: 1,
        b: 0,
        c: 0,
        d: 0,
      });
    });
  });
  describe("mergeSlottedContext", () => {
    it("should return provided value if no parent value", () => {
      expect(mergeSlottedContext(null, { foo: "bar" })).toEqual({ foo: "bar" });
    });
    it("should return parent value if no provided value", () => {
      expect(mergeSlottedContext({ foo: "bar" }, null)).toEqual({ foo: "bar" });
    });
    it("should merge provided and parent values", () => {
      expect(mergeSlottedContext({ foo: "bar" }, { bar: "baz" })).toEqual({
        foo: "bar",
        bar: "baz",
      });
    });
    it("should merge parent value into slots in value", () => {
      expect(
        mergeSlottedContext<{ foo?: string; bar?: string }, HTMLElement>(
          { foo: "bar" },
          { slots: { slot1: { bar: "baz" }, slot2: {} } },
        ),
      ).toEqual({
        slots: { slot1: { foo: "bar", bar: "baz" }, slot2: { foo: "bar" } },
      });
    });
    it("should merge value into slots in parent", () => {
      expect(
        mergeSlottedContext<{ foo?: string; bar?: string }, HTMLElement>(
          { slots: { slot1: { bar: "baz" }, slot2: {} } },
          { foo: "bar" },
        ),
      ).toEqual({
        slots: { slot1: { foo: "bar", bar: "baz" }, slot2: { foo: "bar" } },
      });
    });
    it("should merge slots in value and parent", () => {
      expect(
        mergeSlottedContext<{ foo?: string; bar?: string }, HTMLElement>(
          { slots: { slot1: { bar: "baz" }, slot2: {} } },
          { slots: { slot1: { foo: "bar" }, slot3: { foo: "bar" } } },
        ),
      ).toEqual({
        slots: {
          slot1: { foo: "bar", bar: "baz" },
          slot2: {},
          slot3: { foo: "bar" },
        },
      });
    });
  });
});
