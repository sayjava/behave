import matcher from "../../src/matchers/map";

test("return true if expected keys are empty", () => {
  const result = matcher({}, { name: "apple client" });

  expect(result).toMatchInlineSnapshot(`true`);
});

test("don't match missing keys", () => {
  const result = matcher({ job: "manager" }, { name: "apple client" });

  expect(result).toMatchInlineSnapshot(
    `[AssertionError: expected { name: 'apple client' } to contain key 'job']`
  );
});

test("match values", () => {
  const result = matcher(
    { job: "manager" },
    { name: "apple client", job: "manager" }
  );

  expect(result).toMatchInlineSnapshot(`true`);
});

test("don't match unequal values", () => {
  const result = matcher(
    { job: "manager", role: "mentor", id: 2 },
    { name: "apple client", job: "manager", role: "mentor", id: 1 }
  );

  expect(result).toMatchInlineSnapshot(
    `[AssertionError: key: id, does not match, 2 did not match 1: expected 1 to match /2/]`
  );
});

test("match regex values", () => {
  const result = matcher(
    { job: "manager", role: "mentor", id: "[0-9]" },
    { name: "apple client", job: "manager", role: "mentor", id: 1 }
  );

  expect(result).toMatchInlineSnapshot(`true`);
});

test("don't match regex values", () => {
  const result = matcher(
    { job: "manager", role: "mentor", id: "[a-z]" },
    { name: "apple client", job: "manager", role: "mentor", id: 1 }
  );

  expect(result).toMatchInlineSnapshot(
    `[AssertionError: key: id, does not match, [a-z] did not match 1: expected 1 to match /[a-z]/]`
  );
});
