# jira2mermaid

> Make a mermaid diagram of the dependencies between tickets from Jira.

## Usage

### Export from Jira

First, find the issues you're interested in. You can start from the Issues search page and do some JQL like:

```jql
parent=PROJ-123
```

This will get you the tickets under the PROJ-123 ticket. If you want all the tickets under an epic, try using [`parentEpic`](https://support.atlassian.com/jira-software-cloud/docs/jql-functions/#parentEpic).

Then in the top right is an _Export_ dropdown button. Click it and choose _Export CSV (all fields)_. This will get you a file to work with.

### Run this thing

Now you can simply feed that to this command:

```console
deno --allow-read main.ts jira-export.csv
```

This will output the Mermaid text to stdout.

## Development

Run the tests while you develop with:

```console
deno task test:watch
```

### Updating snapshots

When you need to change the input or have a new feature to implement, regenerate the snapshots with:

```console
deno task test:update
```

Use Git to view the changes.

See [the docs](https://jsr.io/@std/testing/doc/snapshot#updating-snapshots) for more.

## Deployment

To compile and install the command to `~/bin/`:

```console
deno task deploy
```

Then you can use it wherever:

```console
jira2mermaid jira-export.csv
```

If you have the [Mermaid CLI](https://github.com/mermaid-js/mermaid-cli), you can pipe directly to it and generate an SVG to share:

```console
jira2mermaid jira-export.csv | mmdc --input - --output tickets.svg
```
