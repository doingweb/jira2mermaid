import { join } from "jsr:@std/path";
import { it } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";
import { assertSnapshot } from "jsr:@std/testing/snapshot";
import { jira2mermaid } from "./main.ts";

it("renders Mermaid for the basic example CSV file (basic-example.csv)", async (context) => {
  const mermaid = await jira2mermaid(
    join(Deno.cwd(), "__fixtures__", "basic-example.csv")
  );

  await assertSnapshot(context, mermaid);
});

it('sanitizes the "Summary" field (weird-summaries.csv)', async (context) => {
  const mermaid = await jira2mermaid(
    join(Deno.cwd(), "__fixtures__", "weird-summaries.csv")
  );

  await assertSnapshot(context, mermaid);
});

it("just renders the boilerplate if there are no tickets (no-tickets.csv)", async (context) => {
  const mermaid = await jira2mermaid(
    join(Deno.cwd(), "__fixtures__", "no-tickets.csv")
  );

  await assertSnapshot(context, mermaid);
});

it("throws an error when the CSV file is empty (empty.csv)", async () => {
  await expect(
    jira2mermaid(join(Deno.cwd(), "__fixtures__", "empty.csv"))
  ).rejects.toThrow("CSV file is empty");
});
