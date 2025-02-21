import { readCsv } from "./lib/csv.ts";
import { generateMermaid } from "./lib/mermaid.ts";

if (import.meta.main) {
  await main();
}

async function main() {
  if (Deno.args.length !== 1) {
    console.error(
      "Usage: jira2mermaid <csv_file_path>",
      "\n\nTurns a Jira issue search CSV export into a Mermaid diagram showing blocking dependencies."
    );
    Deno.exit(1); // Exit with error code
  }

  console.log(await jira2mermaid(Deno.args[0]));
}

export async function jira2mermaid(csvFilePath: string) {
  const tickets = await readCsv(csvFilePath);
  return generateMermaid(tickets);
}
