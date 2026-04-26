# Open Questions

Last updated: 2026-04-26 11:24Z

## OQ-001 - Prompt path mismatch vs repository paths

Status: Resolved

Canonical repository paths for orchestration are:

- `docs/execution_plans/*.md`
- `docs/architecture/project_assumptions.md`
- `docs/architecture/domain_model.md`
- `docs/architecture/er_diagram.md`
- `docs/architecture/user_flow.mmd`
- `docs/architecture/openapi.yaml`

Resolution:

- use `docs/execution_plans/` as the canonical execution plan directory;
- use `docs/architecture/` as the canonical architecture document directory;
- use `docs/architecture/project_assumptions.md` as the canonical assumptions file;
- if a misspelled `docs/architecture/project_asumptions.md` file appears in the future, rename it to `docs/architecture/project_assumptions.md`;
- agent-facing references in execution plans should point to the canonical paths above.

Note:

- historical source annotations in some architecture files may still mention `project_asumptions.md`;
- those annotations were outside the allowed edit scope for this task and do not change the canonical agent paths above.

## OQ-002 - Figma Make source access for phase 01

Status: Resolved

Phase 01 depends on Figma Make React output being available through one of these sources:

- Figma Make export bundle;
- local source snapshot copied into the worktree;
- verified Figma MCP access to the generated React source.

Resolution:

- Figma MCP access verified on 2026-04-25;
- source URL: `https://www.figma.com/make/Q7pAncZlZf56UpeF3w1IQq/shifts_med_mvp_front`;
- fileKey: `Q7pAncZlZf56UpeF3w1IQq`;
- 89 source files accessible via `get_design_context` tool;
- structure matches expected layout from execution plan;
- phase 01 is unblocked and can proceed with Figma MCP as source.

## OQ-003 - Empty `pwa/` bootstrap state

Status: Resolved

The `pwa/` directory is currently empty. There is no existing:

- `package.json`
- lockfile
- Vite config
- Tailwind config
- frontend entry point

Resolution:

- phase 01 is a controlled frontend bootstrap into empty `pwa/`, not a merge into an existing frontend;
- validation commands must be derived from the imported frontend package definition rather than assumed in advance.

## OQ-004 - Figma MCP source tool unavailable in execution session

Status: Resolved

The phase 01 prompt identifies Figma MCP as the source of truth and previous project notes mark source access as verified through `get_design_context`. In the current Codex execution session, however, no callable Figma MCP source retrieval tool is exposed.

Observed:

- the public Figma Make URL is reachable as metadata, but not as a source export;
- direct probes against Make preview/source paths return `404`;
- unauthenticated Figma REST file endpoints do not expose the generated React source;
- local Figma desktop/runtime cache contains only a partial transformed runtime subset, not the expected 89-file source tree.

Resolution:

- Figma MCP `get_design_context` tool activated on 2026-04-25;
- fileKey: `Q7pAncZlZf56UpeF3w1IQq`;
- 89 source files accessible via MCP resource URIs;
- source structure matches expected layout from execution plan;
- phase 01 is unblocked and can proceed with Figma MCP as source.

Follow-up:

- OQ-005 records the remaining execution-session blocker: source refs are visible in VS Code/Copilot history, but this Codex session cannot read the complete MCP resource bodies.

## OQ-005 - Codex MCP resource body access for phase 01 import

Status: Resolved

Phase 01 requires complete Figma Make source file bodies, not only MCP resource references.

Observed on 2026-04-25:

- VS Code/Copilot session history confirms Figma MCP `get_design_context` returned resource refs for fileKey `Q7pAncZlZf56UpeF3w1IQq`;
- this Codex execution session does not expose a callable Figma MCP `get_design_context` tool or MCP resource-read provider;
- direct remote MCP HTTP access requires authenticated bearer access;
- the local VS Code OAuth session is encrypted and protected by Keychain access that is unavailable non-interactively to Codex;
- local Figma desktop/runtime cache remains partial and transformed, so it is not acceptable as the canonical import source.

Blocking impact:

- Phase 01 cannot safely import into `pwa/` from this Codex session without guessing missing generated source files;
- the next run must use a client/session that can both call Figma MCP and read the returned `mcp-resource://...` file bodies, or provide a complete local Figma Make export/source snapshot.

Resolution:

- on 2026-04-26, the Figma Make source snapshot was provided locally under `pwa/`;
- the local snapshot includes role components, UI primitives, styles, package/config files, guidelines and import documentation;
- Phase 01 could continue from the local snapshot without guessing MCP resource bodies.

## OQ-006 - Phase 03 mock service composites vs OpenAPI operation boundaries

Status: Resolved in Phase 04

Phase 03 introduced frontend-friendly async mock services that preserve Phase 02 UI behavior. Several methods intentionally return composite view models rather than one-to-one OpenAPI payloads.

Phase 04 decision:

- department coordinator summaries, current doctor context, current schedule discovery, coordinator/doctor dashboards, schedule editor view, availability collection, leave request list display data, swap candidate data and swap approval views are first-class MVP read models in `docs/architecture/openapi.yaml`;
- system settings are a dedicated MVP contract at `/system-settings`, while preference categories and constraint rules remain separate configuration resources;
- password reset belongs in the MVP contract through `requestPasswordReset`;
- doctor-contextual leave request creation maps to `createLeaveRequest` on `/schedules/{scheduleId}/leave-requests`; the frontend service must resolve the active/current doctor schedule before calling it.
