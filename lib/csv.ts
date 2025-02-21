import * as csv from "@std/csv";
import { HeaderIndexes } from "./HeaderIndexes.ts";
import { Ticket } from "./Ticket.ts";

export async function readCsv(csvFilePath: string): Promise<Ticket[]> {
  const csvContents = await Deno.readTextFile(csvFilePath);
  const [headerRow, ...rows] = csv.parse(csvContents);

  if (!headerRow) {
    throw new Error("CSV file is empty");
  }

  const headerIndexes: HeaderIndexes = findHeaderIndexes(headerRow);

  const tickets: Ticket[] = [];
  for (const row of rows) {
    const ticket: Ticket = {
      key: row[headerIndexes["Issue key"]],
      id: row[headerIndexes["Issue id"]],
      type: row[headerIndexes["Issue Type"]] as Ticket["type"],
      title: row[headerIndexes["Summary"]].trim(),
      status: row[headerIndexes["Status"]],
      parentId: row[headerIndexes["Parent"]],
      blocks: headerIndexes["Inward issue link (Blocks)"]
        .map((i) => row[i])
        .filter(Boolean), // Remove empty strings
    };
    tickets.push(ticket);
  }

  return tickets;
}

function findHeaderIndexes(headerRow: string[]): HeaderIndexes {
  const headerIndexes: Partial<HeaderIndexes> = {};
  for (let i = 0; i < headerRow.length; i++) {
    const header = headerRow[i];
    switch (header as keyof HeaderIndexes) {
      case "Issue key":
        headerIndexes["Issue key"] = i;
        break;
      case "Issue id":
        headerIndexes["Issue id"] = i;
        break;
      case "Issue Type":
        headerIndexes["Issue Type"] = i;
        break;
      case "Summary":
        headerIndexes["Summary"] = i;
        break;
      case "Status":
        headerIndexes["Status"] = i;
        break;
      case "Parent":
        headerIndexes["Parent"] = i;
        break;
      case "Inward issue link (Blocks)":
        if (!headerIndexes["Inward issue link (Blocks)"]) {
          headerIndexes["Inward issue link (Blocks)"] = [];
        }
        headerIndexes["Inward issue link (Blocks)"].push(i);
        break;
    }
  }
  return headerIndexes as HeaderIndexes;
}
