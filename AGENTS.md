You are able to use the Svelte MCP server, where you have access to comprehensive Svelte 5 and SvelteKit documentation. Here's how to use the available tools effectively:

## Available Svelte MCP Tools:

### 1. list-sections

Use this FIRST to discover all available documentation sections. Returns a structured list with titles, use_cases, and paths.
When asked about Svelte or SvelteKit topics, ALWAYS use this tool at the start of the chat to find relevant sections.

### 2. get-documentation

Retrieves full documentation content for specific sections. Accepts single or multiple sections.
After calling the list-sections tool, you MUST analyze the returned documentation sections (especially the use_cases field) and then use the get-documentation tool to fetch ALL documentation sections that are relevant for the user's task.

### 3. svelte-autofixer

Analyzes Svelte code and returns issues and suggestions.
You MUST use this tool whenever writing Svelte code before sending it to the user. Keep calling it until no issues or suggestions are returned.

### 4. playground-link

Generates a Svelte Playground link with the provided code.
After completing the code, ask the user if they want a playground link. Only call this tool after user confirmation and NEVER if code was written to files in their project.

## This app

SvelteKit + [remult](https://remult.dev) + [firstly](https://firstly.fun), TypeScript, Tailwind v4.
Entities are the contract: declare a field once and the REST API, the types, the admin UI
and the validation follow. There is no hand-written API layer - do not add one.

| Where                                   | What                                                                     |
| --------------------------------------- | ------------------------------------------------------------------------ |
| `src/modules/<feature>/`                | a feature: entity, server code, remote functions, UI                     |
| `src/lib/server/api.ts`                 | the whole backend: entities, modules, session                            |
| `src/lib/server/db.ts`                  | data provider: postgres when `DATABASE_URL` is set, JSON files otherwise |
| `src/modules/auth/`                     | User entity, session, guard, login-as                                    |
| `src/lib/`                              | what every feature shares: roles, site, ui primitives                    |
| `src/routes/api/[...remult]/+server.ts` | mounts the API                                                           |
| `src/routes/+page.svelte`               | public landing; the app itself lives under `/app`                        |
| `src/routes/app/internal/*`             | backstage pages (users, crons, mails, SQL)                               |

Rules of the house:

- New feature = a folder in `src/modules/`, starting with its entity. Never write a fetch handler for CRUD.
- Server-only files end in `.server.ts` - SvelteKit then refuses to bundle them for the browser.
- Permissions live on the entity (`allowApiRead`, `allowApiUpdate`, `apiPrefilter`), never in the UI.
  The UI may hide a button; the server is what refuses.
- Use `FF_Entity`, not `@Entity` (same signature, plus changelog).
- In components read data with `ff(E).many(...)` / `ff(E).one(...)`; use `repo(E)` in handlers and on the server.
- Never import from `$lib/server/*` in client code - keep secrets server-side.

The full patterns live in skills installed straight from the source repos
(`npm run skills` to install, `npm run skills:update` to refresh): `remult/remult` and `jycouet/firstly`.
Don't hand-edit them and don't copy their content here - they move with the libraries.
