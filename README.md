# AI Todo Agent

A minimal CLI todo agent built with TypeScript and Claude, demonstrating two agentic patterns side-by-side.

## What this teaches

| Pattern | How it works |
|---|---|
| **ReAct loop** | Your code parses Claude's JSON responses and manually dispatches tool calls. Every reasoning step is visible. |
| **Native tool use** | Claude decides which tools to call. You define schemas and execute results. Clean, modern approach. |

Both agents share the same database layer and tool functions — the only difference is the loop implementation.

## Stack

- **Runtime:** Node.js + TypeScript (tsx)
- **AI:** Anthropic Claude (`claude-haiku-4-5`)
- **Database:** PostgreSQL via Drizzle ORM
- **CLI:** chalk + readline-sync

## Getting started

```bash
# 1. Start Postgres
docker compose up -d

# 2. Configure env
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env

# 3. Install & migrate
npm install
npm run migrate

# 4. Run
npm run dev:react    # ReAct loop — shows PLAN → ACTION → OBSERVATION → AGENT
npm run dev:native   # Native tool use — shows ACTION → OBSERVATION → AGENT
```

## Project structure

```
src/
  config/       env validation (Zod)
  db/           schema + Drizzle connection
  tools/        5 shared CRUD functions
  agents/
    react/      custom JSON ReAct loop
    native/     Anthropic native tool use
  cli/          chalk renderer + readline loop
```

## Example session (ReAct)

```
>> add a todo to buy milk

[PLAN] I will create a new todo with the text 'buy milk'.
[ACTION] createTodo(buy milk)
[OBSERVATION] 3
[AGENT] Done! Added 'buy milk' to your list.
```
