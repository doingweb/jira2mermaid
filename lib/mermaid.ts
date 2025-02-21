import { Ticket } from "./Ticket.ts";

/** Maps Jira status strings to the style class names in the diagram */
const statusClassMap: Record<string, keyof typeof classDefs> = {
  "To Do": "toDo",
  "In Progress": "inProgress",
  PR: "pr",
  "Ready for QA": "pr",
  Done: "done",
  "Won't Do": "done",
};

/** The style classes we use in the diagram */
const classDefs = {
  toDo: { fill: "#f5f0e3", color: "#5c544b", stroke: "#5c544b" },
  inProgress: { fill: "#e8f0fe", color: "#3b5ba3", stroke: "#3b5ba3" },
  pr: { fill: "#f8e7ff", color: "#5a3b80", stroke: "#5a3b80" },
  done: { fill: "#e6f4ea", color: "#344a42", stroke: "#344a42" },
} as const;

export function generateMermaid(tickets: Ticket[]): string {
  const mermaidCodeLines = [
    '%%{init: {"flowchart": {"defaultRenderer": "elk"}} }%%',
    "graph LR",
    ...Object.entries(classDefs).map(
      ([className, styles]) =>
        `  classDef ${className} ${Object.entries(styles)
          .map(([key, value]) => `${key}:${value}`)
          .join(",")};`
    ),
  ];

  // Add nodes for each ticket
  mermaidCodeLines.push(
    ...tickets.map((ticket) => `  ${buildMermaidNodeForTicket(ticket)}`)
  );

  const ticketsByKey = new Map(tickets.map((ticket) => [ticket.key, ticket]));
  const ticketsById = new Map(tickets.map((ticket) => [ticket.id, ticket]));

  // Add edges for blocked tickets
  for (const ticket of tickets) {
    for (const blockedTicketId of ticket.blocks) {
      if (ticketsByKey.has(blockedTicketId)) {
        mermaidCodeLines.push(`  ${blockedTicketId} --> ${ticket.key}`);
      }
    }
  }

  // Add edges for sub-tasks
  for (const ticket of tickets) {
    if (
      ticket.type === "Sub-task" &&
      ticket.parentId &&
      ticketsById.has(ticket.parentId)
    ) {
      const parentTicket = ticketsById.get(ticket.parentId)!;
      mermaidCodeLines.push(`  ${ticket.key} -.-> ${parentTicket.key}`);
    }
  }

  // Add style class associations
  const classesToKeys = mapClassesToTicketKeys(tickets);
  mermaidCodeLines.push(
    ...Object.entries(classesToKeys).map(([className, keys]) => {
      return `  class ${keys.join(",")} ${className}`;
    })
  );

  return mermaidCodeLines.join("\n");
}

function buildMermaidNodeForTicket(ticket: Ticket): string {
  const content = `${ticket.key}<br>${sanitizeTitle(ticket.title)}`;

  let nodeRendering: string;
  switch (ticket.type) {
    case "Sub-task":
      nodeRendering = `(["${content}"])`;
      break;
    case "Story":
      nodeRendering = `[["${content}"]]`;
      break;
    default:
      nodeRendering = `("${content}")`;
  }

  return `${ticket.key}${nodeRendering}`;
}

function mapClassesToTicketKeys(
  tickets: Iterable<Ticket>
): Record<keyof typeof classDefs, string[]> {
  const classesToKeys = {} as Record<keyof typeof classDefs, string[]>;

  for (const ticket of tickets) {
    const classForStatus = statusClassMap[ticket.status];
    if (!classForStatus) {
      continue;
    }
    if (!classesToKeys[classForStatus]) {
      classesToKeys[classForStatus] = [];
    }

    classesToKeys[classForStatus].push(ticket.key);
  }

  return classesToKeys;
}

function sanitizeTitle(title: string) {
  let sanitized = title.replace(/"/g, "#quot;");
  sanitized =
    sanitized.length > 50 ? sanitized.substring(0, 50) + "..." : sanitized;
  return sanitized;
}
