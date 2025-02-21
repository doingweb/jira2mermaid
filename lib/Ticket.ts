export type Ticket = {
  /**
   * The Jira internal ID for this ticket
   *
   * @example 12345
   */
  id: string;
  /**
   * The identifier we usually use for this ticket
   *
   * @example "PROJ-123"
   */
  key: string;
  /**
   * The type of the ticket
   *
   * @example "Story"
   */
  type: "Story" | "Task" | "Sub-task";
  title: string;
  status: string;
  /** Jira ID of this ticket's parent */
  parentId: string;
  /** Keys of tickets this ticket blocks */
  blocks: string[];
};
