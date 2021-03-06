import "mocha";
import { assert } from "chai";

import { Semigroup, combine } from "../src/semigroup";
import { Monoid, identity } from "../src/monoid";
import Sum from "../src/monoids/sum";

describe("monoid", () => {
  it("can combine and id", () => {
    combine(Sum.create(12), Sum.create(1)).identity();
  });
});

export function testMonoid<M extends Monoid<M>>(name: string, monoid: M): void {
  describe("monoid " + name, () => {
    it("has identity element", () => {
      assert.deepEqual(
        monoid.identity().combine(monoid),
        monoid.combine(monoid.identity())
      );
      assert.deepEqual(
        identity(monoid).combine(monoid),
        monoid.combine(monoid.identity())
      );
    });
  });
}

class TestSemigroup<A> implements Semigroup<TestSemigroup<A>> {
  constructor(private list: A[]) {}
  combine(b: TestSemigroup<A>): TestSemigroup<A> {
    return new TestSemigroup(this.list.concat(b.list));
  }
}

const s = <A>(...a: A[]) => new TestSemigroup(a);

class TestMonoid<A> implements Monoid<TestMonoid<A>> {
  constructor(private list: A[]) {}
  identity() {
    return new TestMonoid([]);
  }
  combine(b: TestMonoid<A>): TestMonoid<A> {
    return new TestMonoid(this.list.concat(b.list));
  }
}

const m = <A>(...a: A[]) => new TestMonoid(a);

describe("monoid", () => {
  describe("combine", () => {
    it("combines two elements", () => {
      assert.deepEqual(combine(s(1, 2, 3), s(4, 5)), s(1, 2, 3, 4, 5));
    });
    it("combines three elements", () => {
      assert.deepEqual(combine(s(1, 2), s(3), s(4, 5)), s(1, 2, 3, 4, 5));
    });
    it("combines strings", () => {
      assert.strictEqual(
        combine("foo", "bar", "baz", "lorem"),
        "foobarbazlorem"
      );
    });
    it("combines arrays", () => {
      assert.deepEqual(combine([1, 2], [3], [4], [5, 6]), [1, 2, 3, 4, 5, 6]);
    });
  });
  describe("identity", () => {
    it("has empty string as identity", () => {
      assert.deepEqual(identity(String), "");
    });
    it("has empty array as identity", () => {
      assert.deepEqual(identity(Array), []);
      ``;
    });
  });
});
