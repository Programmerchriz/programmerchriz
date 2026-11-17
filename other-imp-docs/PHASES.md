https://swift-topup-api.programmerchriz.xyz/api/v1
https://control-playoff-imitation.ngrok-free.dev/api/v1

I'm unable to go live on my platform because I've not been given my live details for the api. I've completed my KYC

GET https://api.bachs.io/v1/accounts/me
Authorization: Bearer <token>

Test user details:
{
  "username": "phase38c_test",
  "email": "phase38c_test@example.com",
  "password": "Phase38CTest123!",
  "displayName": "Phase 3.8 C Test"
}

RUN_DATABASE_TESTS=true node --test --test-concurrency=1 dist-test/test/commerce.phase-b.integration.test.js
RUN_DATABASE_TESTS=true node --test --test-concurrency=1 dist-test/test/payment.funding.integration.test.js
RUN_DATABASE_TESTS=true node --test --test-concurrency=1 dist-test/test/wallet.concurrency.integration.test.js


# SwiftTopUp Implementation Phases

## Delivery Target

SwiftTopUp is being built on a 3-week delivery timeline. The original EIG timeline is treated as source planning material, but implementation will be compressed into focused weekly phases.

# Week 1 - Project Foundation

## Goal

Establish the complete development foundation for SwiftTopUp and leave the codebase ready for Identity, Wallet, and Commerce development.

## Phase 1 - Project & Repository Setup

### Tasks

- Create project repositories
- Initialize Node.js + TypeScript backend
- Initialize React + TypeScript admin
- Configure Git
- Configure ESLint + Prettier
- Create base folder structure
- Add `AGENTS.md`
- Add `/docs`
- Add SOD, SAD and EIG

### Milestone

SwiftTopUp codebase initialized and development standards established.

## Phase 2 - Backend Foundation

### Tasks

- Express application setup
- Modular domain structure
- API versioning
- Health endpoint
- Request validation foundation
- Global error handling
- Structured logging
- Graceful shutdown

Initial domains:

```text
identity/
wallet/
commerce/
messaging/
rewards/
administration/
```

### Milestone

Backend architecture running locally.

## Phase 3 - Database & Infrastructure

### Tasks

- PostgreSQL setup
- Prisma setup
- Initial Prisma configuration
- Redis setup
- BullMQ foundation
- Docker
- Docker Compose
- Database/Redis health checks

The stack remains PostgreSQL + Prisma + Redis/BullMQ as defined in the EIG.

### Milestone

API, PostgreSQL and Redis running together.

## Phase 4 - Configuration & Developer Experience

### Tasks

- Environment configuration
- Environment validation
- `.env.example`
- Development scripts
- Build scripts
- Type checking
- Logging configuration
- Standard API responses/errors
- README setup

### Milestone

Another developer can clone the repository and run SwiftTopUp locally with minimal setup.

## Phase 5 - CI/CD Foundation

### Tasks

- GitHub Actions
- Install dependencies
- Lint
- Type check
- Tests
- Build verification
- Development/staging deployment preparation

### Milestone

Every push/PR automatically validates the codebase.




# Week 1 - Business Track

Your co-founder can handle these in parallel with engineering:

- Business registration
- WhatsApp Business setup
- Research/select VTU provider
- Research/select payment provider
- Brand identity
- Secure domain/social handles



# Week 2 Phases

## Phase 1 - Core Data Model and Env Cleanup

Tasks:
- Define minimal Prisma models for:
  - User
  - AuthSession
  - Wallet
  - LedgerAccount
  - LedgerEntry
  - WalletTransaction
  - VirtualAccount
  - Product
  - Purchase
- Add essential enums only:
  - user status
  - session status
  - wallet transaction type/status
  - ledger entry direction
  - product type
  - purchase status
  - provider type/status
- Add uniqueness constraints for:
  - username
  - email, if used
  - WhatsApp phone number
  - WhatsApp `waId`
  - wallet per user
  - virtual account number
  - provider references
  - idempotency keys
- Add Paystack-related env placeholders: e.g
  - `Paystack_SECRET_KEY`
  - `Paystack_WEBHOOK_SECRET`
  - `PAYMENT_PROVIDER`
- Establish the backend domain file pattern:
  - routes
  - controller
  - service
  - repository
  - schema
- Keep Prisma schema minimal and avoid reward/referral/admin models unless needed immediately.

Milestone:
SwiftTopUp has the minimum database and config foundation required for auth, wallets, funding, commerce, and WhatsApp MVP flows.


## Phase 2 - Identity + JWT/Session Auth

Tasks:
- Implement user registration.
- Validate unique username.
- Add password-based auth for API/admin usage.
- Hash passwords securely.
- Implement login.
- Issue JWT access token.
- Create refresh/session record in database.
- Implement refresh token/session rotation.
- Implement logout by revoking the active session.
- Add authenticated `GET /me` endpoint.
- Add basic user lookup by:
  - ID
  - username
  - WhatsApp phone number
  - WhatsApp `waId`
- Add WhatsApp account linking fields, but keep the actual WhatsApp flow for Phase 7.
- Add auth middleware for protected routes.
- Add validation schemas for all external input.
- Add focused tests for:
  - registration
  - duplicate username
  - login
  - invalid credentials
  - token-protected endpoint
  - logout/session revocation

Milestone:
Users can securely register, log in, maintain sessions, and access protected API routes.

## Phase 3 - Wallet + Double-Entry Ledger

Tasks:
- Automatically create internal wallet when a user signs up.
- Automatically create required wallet ledger accounts.
- Do not create external virtual account yet.
- Implement wallet balance read.
- Implement double-entry ledger posting service.
- Ensure every financial mutation uses a database transaction.
- Ensure every financial mutation accepts and enforces an idempotency key.
- Add wallet transaction history endpoint.
- Add wallet summary endpoint:
  - available balance
  - total credited
  - total debited
  - recent transactions
- Keep wallet active by default.
- Do not implement wallet inactivity, suspension, or deletion in MVP unless suspicious activity handling becomes necessary.

Milestone:
Every registered user has an internal wallet backed by an auditable double-entry ledger.

## Phase 4 - Virtual Account Provisioning + Paystack/Mock Provider

Tasks:
- Add payment provider abstraction with only the methods needed now:
  - create customer if needed
  - create virtual account
  - normalize deposit webhook
  - verify webhook signature
- Implement `MockPaymentProvider` for local development.
- Implement `PaystackPaymentProvider` minimally.
- Create virtual account only when user requests wallet funding for the first time.
- Store virtual account details:
  - account number
  - account name
  - bank name
  - provider
  - provider customer reference
  - provider account reference
- Return existing virtual account if already provisioned.
- Keep provider abstraction narrow. No multi-provider routing yet.
- Add tests for:
  - first funding request creates virtual account
  - repeated funding request returns existing account
  - provider failure does not create broken local records

Milestone:
Users can request funding details and receive a virtual account, using Paystack when available or mock provider during development.

## Phase 5 - Deposit Webhook + Wallet Funding

Tasks:
- Add Paystack deposit webhook endpoint.
- Verify webhook signature.
- Normalize incoming provider event.
- Validate required deposit fields:
  - amount
  - provider reference
  - virtual account reference/account number
  - customer reference, if available
- Match deposit to user wallet through virtual account.
- Make deposit processing idempotent.
- Credit wallet through double-entry ledger inside a transaction.
- Create wallet transaction record.
- Ignore or safely reject unsupported webhook events.
- Add tests for:
  - valid deposit webhook
  - duplicate webhook
  - invalid signature
  - unknown virtual account
  - malformed payload
  - successful wallet credit

Milestone:
Users can fund wallets through virtual account deposits, and duplicate provider webhooks cannot double-credit balances.

## Phase 6 - Commerce Purchase Pipeline

Tasks:
- Add product catalog for MVP:
  - airtime
  - data
- Add minimal product fields:
  - network
  - product type
  - name
  - amount/price
  - validity, for data plans
  - provider product code
  - active/inactive flag
- Add VTU provider abstraction with only the methods needed now:
  - fetch/seed products if needed
  - purchase airtime
  - purchase data
  - check purchase status, if supported
- Implement mock VTU provider first.
- Add real provider adapter only when provider choice/access is ready.
- Implement purchase creation.
- Validate user has sufficient balance.
- Debit wallet through ledger before fulfillment.
- Create purchase record with idempotency key.
- Fulfill purchase through provider or queue.
- Record purchase status:
  - pending
  - successful
  - failed
- Add failed-purchase refund foundation:
  - refund wallet if provider fulfillment fails after debit
  - keep it simple and transactional
- Add purchase history endpoint.
- Add tests for:
  - insufficient balance
  - duplicate purchase request
  - successful airtime purchase
  - successful data purchase
  - failed provider fulfillment
  - refund after failed fulfillment

Milestone:
A funded user can buy airtime or data through the API with wallet debit, provider fulfillment, and purchase history.

## Phase 7 - WhatsApp Registration/Balance/Purchase Bridge

Tasks:
- Add WhatsApp webhook verification endpoint.
- Receive inbound WhatsApp messages.
- Extract WhatsApp identity:
  - phone number / `waId`
  - profile name, when available
- Link inbound WhatsApp user to existing SwiftTopUp user.
- Support WhatsApp-first registration for users who start from WhatsApp.
- Store short-lived conversation state in Redis.
- Support only MVP commands/flows:
  - register
  - balance
  - fund wallet
  - buy airtime
  - buy data
  - purchase status
- Send outbound WhatsApp responses through messaging service.
- Use BullMQ only where useful:
  - outbound message delivery
  - purchase notifications
- Keep conversation engine simple:
  - command parser
  - state handler
  - response builder
- Add tests for:
  - webhook verification
  - inbound message parsing
  - registration flow
  - balance flow
  - purchase flow routing
  - unknown command fallback

Milestone:
Users can register, check balance, request funding details, and initiate airtime/data purchases through WhatsApp.

# Important Scope Notes

- Create internal wallet at signup.
- Create external virtual account only on first funding request.
- Do not delete inactive wallets or ledger records.
- Do not add wallet inactive/suspended/closed states unless needed for suspicious activity handling.
- Keep admin dashboard minimal for now.
- Do not implement rewards/referrals/cashback during these phases.
- Use Paystack as the intended payment provider, but keep mock provider available so development is not blocked by Paystack verification.
- Use provider abstraction, but avoid multi-provider routing until post-MVP.


N/B:
  - Add welcome message - Welcome to swift topup

Separate findings from the MVP documentation:
- Critical: add Meta webhook-signature verification; the current POST webhook does not use WHATSAPP_APP_SECRET.
- Critical: make debit/failure/refund recovery durable and reconcilable; failure marking and refund are separate operations.
- High: correct API package start scripts—the build emits dist/src/server.js and dist/src/worker.js.
- High: add authorization roles before exposing user lookup or catalog synchronization outside trusted operators.
- High: queue VTU fulfillment and reconcile pending provider purchases.
- High: persist messaging/delivery status and use durable inbound processing.
- Next: add observability, funding-expiry scheduling, stronger financial-concurrency controls, and integration/provider-contract tests.
For future AI, avoid treating “free” as production reliability. Gemini’s free tier is quota-limited and Google states free-tier content may be used to improve products; paid use changes that treatment. Gemini pricing, Gemini terms Groq also applies organization-level rate limits, while its paid tier provides higher capacity and spend controls. Groq rate limits, Groq spend limits Ollama can run locally, but shifts reliability, capacity, and operations responsibility to your infrastructure. Ollama API documentation


# Post MVP Implementation:

## Phase 0 — Emergency Containment and Environment Reset
Objective
Prevent further Redis cost leakage and establish a clean baseline before development resumes.
Tasks
    • Keep the deployed Oracle API and worker stopped until the new Redis configuration is verified.
    • Confirm that old Upstash credentials are no longer present in:
        ◦ VM environment files.
        ◦ systemd services.
        ◦ deployment dashboards.
        ◦ local .env files.
        ◦ CI/CD secrets.
    • Rotate any remaining Redis, Paystack, VTPass, WhatsApp, and database credentials that may have been exposed.
    • Identify whether the previous deployment had:
        ◦ Multiple worker processes.
        ◦ A restart loop.
        ◦ Frequent health probes.
        ◦ Multiple API replicas.
        ◦ Redis connection failures and reconnect loops.
    • Record the previous Redis command volume, if available, for comparison.
Completion Criteria
    • No old deployment process is still connecting to Upstash.
    • New credentials are stored only in approved secret locations.
    • A clean staging environment is available.
    • The Redis provider and deployment topology are documented.
### Phase 0.1 — Emergency containment

Status: partially completed.

Completed:

- API stopped.
- Messaging worker stopped.
- Further Redis usage temporarily contained.

Remaining verification:

- Confirm no duplicate worker process is running.
- Confirm no old Upstash process is connected.
- Record the current Layerbase command baseline.

### Phase 0.2 — Test Redis TCP KeepAlive

Objective: determine whether connection instability is contributing to the command volume.

Tasks:

- Add a TCP `keepAlive` option to the shared ioredis configuration.
- Use a conservative delay such as 30–60 seconds.
- Deploy only to the stopped/staging environment first.
- Run the worker without sending WhatsApp messages.
- Compare:
  - `total_commands_processed`
  - `cmdstat_auth`
  - `cmdstat_client`
  - `total_connections_received`
  - Redis reconnect logs

Success criteria:

- Fewer connection closures and reconnects.
- No repeated `AUTH` or connection setup commands.
- No new Redis errors.

Important: even if this succeeds, BullMQ’s normal idle polling will still remain.

### Phase 0.3 — Confirm the remaining BullMQ traffic

Tasks:

- Start only one worker.
- Run `INFO commandstats` once before the test.
- Wait five minutes without opening or refreshing the Layerbase query repeatedly.
- Run `INFO commandstats` once after the test.
- Compare:

```text
cmdstat_bzpopmin
cmdstat_evalsha
cmdstat_eval
cmdstat_info
```

Interpretation:

- High `BZPOPMIN` and `EVALSHA`: normal BullMQ idle polling.
- High `AUTH`, `CLIENT`, or connection totals: reconnect problem.
- High `INFO`: monitoring/query-console activity.

### Phase 0.4 — Decision gate

If KeepAlive significantly reduces the commands:

- Keep BullMQ.
- Retain KeepAlive.
- Continue monitoring reconnects and idle command volume.
- Do not redesign the queue yet.

If KeepAlive does not significantly reduce the commands:

- Continue with the low-cost consumer redesign.
- Do not keep adjusting `drainDelay`.
- Do not add periodic `PING` or `INFO` commands.

### Phase 0.5 — Select the replacement queue mechanism

Recommended approach:

- Keep BullMQ for other queues or future use.
- Replace only the outbound WhatsApp messaging consumer.
- Use a Redis Stream consumer group with a blocking read.
- Keep the existing `enqueueWhatsappTextMessage()` service interface.
- Avoid reading BullMQ’s internal Redis keys directly.

A Redis Stream consumer can block for 6–8 seconds while idle, producing approximately one blocking command per interval, while still waking immediately when a message arrives.

This is safer than creating a custom consumer around BullMQ’s internal keys.

### Phase 0.6 — Implement the staging consumer

Tasks:

- Create a dedicated outbound messaging stream.
- Create a consumer group.
- Append outbound messages to the stream.
- Read messages using a blocking consumer.
- Acknowledge only after WhatsApp delivery succeeds.
- Add retry and dead-letter handling.
- Preserve the current message payload and delivery logs.

BullMQ would no longer consume the outbound messaging queue, but it would not necessarily need to be removed from the entire project.

### Phase 0.7 — Reliability testing

Test:

- Empty queue for at least one hour.
- Single message.
- Multiple messages.
- Provider failure.
- Worker restart.
- Redis reconnect.
- Crash before acknowledgement.
- Duplicate inbound webhook.
- Graceful systemd shutdown.

Success criteria:

- No lost messages.
- No uncontrolled duplicates.
- Pending messages recover after restart.
- Idle command volume meets the target.

### Phase 0.8 — Controlled deployment

Tasks:

- Deploy the new consumer with the API stopped initially.
- Run test messages.
- Monitor Layerbase usage and worker logs.
- Confirm only one consumer is active.
- Keep the existing BullMQ worker available for rollback.

### Phase 0.9 — Phase completion

Phase 0 is complete when:

- KeepAlive has been tested.
- The source of idle Redis commands is documented.
- Idle traffic is reduced to the agreed target.
- Message delivery remains reliable.
- Rollback has been tested.
- The final Redis provider and worker topology are documented.

So, the engineer’s advice adds a low-risk test in Phase 0.2, but it does not remove the original queue redesign from the plan unless it demonstrably reduces the idle command count.

## Phase 1 — Worker Cost Bug and Layerbase Redis Migration
Objective
Stop unnecessary background Redis calls while preserving immediate processing of new WhatsApp jobs.
Root-Cause Hypothesis
The current worker creates a BullMQ worker without explicitly configuring its idle behavior:
Worker → BullMQ idle queue waiting → Redis
BullMQ’s idle waiting and stalled-job checks can generate recurring Redis commands even when no jobs exist. The reported volume of over 400,000 calls suggests that this may be combined with one or more of the following:
    • Multiple worker processes.
    • A process restart loop.
    • Frequent health probes.
    • Redis connection failures and reconnect attempts.
    • Unused queue objects opening additional connections.
    • Aggressive stalled-job checks.
This must be confirmed with instrumentation before deployment.
Tasks
Worker configuration
    • Configure the BullMQ worker’s idle wait explicitly.
    • Start with a configurable idle interval of approximately 5 minutes.
    • Allow the interval to be increased to 10 or 15 minutes after testing.
    • Configure the stalled-job check interval explicitly instead of relying on defaults.
    • Keep the worker event-driven: a newly added job should wake the blocking Redis command immediately.
    • Do not replace BullMQ with a JavaScript timer that actively polls Redis.
    • Ensure only one production messaging worker instance is running initially.
    • Confirm that worker restart policies do not create a crash loop.
Redis connection design
    • Separate API producer connections from worker connections.
    • Use one connection for API conversation state and queue producers.
    • Use the correct blocking connection behavior for the worker.
    • Avoid creating unused queue instances until the related worker exists.
    • Review whether the currently unused commerceQueue should remain initialized.
    • Add connection lifecycle logging for:
        ◦ connect.
        ◦ ready.
        ◦ reconnect.
        ◦ error.
        ◦ close.
    • Add worker metrics for:
        ◦ jobs waiting.
        ◦ jobs active.
        ◦ jobs completed.
        ◦ jobs failed.
        ◦ job age.
        ◦ worker restarts.
Layerbase Redis
Layerbase exposes a standard Redis protocol endpoint as well as an HTTP-compatible endpoint. BullMQ should use the native Redis protocol, not the REST endpoint. Layerbase requires TLS and SNI configuration for Node.js clients on its shared Redis port, including ioredis and BullMQ. This must be included in the connection configuration. Layerbase Redis connection guide
The migration must verify support for:
    • Native Redis TCP connections.
    • TLS.
    • SNI.
    • Blocking commands.
    • Lua scripts.
    • Transactions and pipelines.
    • TTL and SET NX.
    • BullMQ-compatible Redis operations.
BullMQ depends on Redis-client capabilities such as connection lifecycle handling, command registration, pipelines, transactions, and duplicated blocking connections. BullMQ connection guide
Monitoring and test call
The worker itself should not send an artificial Redis request every few minutes just to stay active.
Recommended design:
    • BullMQ worker idle wait: approximately 5 minutes initially.
    • Stalled-job check: approximately 5 minutes initially.
    • External health canary: every 10–15 minutes.
    • Health endpoint: checked on demand by the canary.
    • No application-level setInterval that constantly polls Redis.
Testing
    • Run the worker with an empty queue for at least 30–60 minutes.
    • Measure Redis command activity during idle periods.
    • Run the same test with one queued message.
    • Confirm that new jobs are processed immediately.
    • Simulate Redis disconnects and restarts.
    • Confirm that the worker does not restart repeatedly.
    • Confirm graceful shutdown closes all Redis connections.
    • Test duplicate worker startup and document the expected behavior.
Completion Criteria
    • Idle Redis activity is limited to the configured BullMQ housekeeping interval and connection maintenance.
    • New WhatsApp messages are delivered without unnecessary delay.
    • Worker restarts are visible and bounded.
    • API and worker use the same Layerbase Redis database.
    • The new deployment produces materially lower Redis command usage than the previous deployment.

## Phase 2 — Admin Authentication, API, Dashboard, and KPIs
Objective
Create a secure operational dashboard for monitoring users, wallets, purchases, products, providers, and system health.
Backend Tasks
Admin authorization
    • Add a minimal administrator role to the identity model.
    • Add admin authentication or a dedicated admin identity flow.
    • Add admin authorization middleware.
    • Restrict the following operations to administrators/operators:
        ◦ User lookup.
        ◦ Product synchronization.
        ◦ Product visibility changes.
        ◦ Purchase and funding inspection.
        ◦ Reconciliation operations.
    • Add an audit log for administrator actions.
    • Do not expose unrestricted customer PII to every authenticated user.
Administration API
Add read-only and controlled-action endpoints for:
    • Dashboard summary.
    • Users.
    • Wallets.
    • Wallet transactions.
    • Funding intents.
    • Purchases.
    • Products.
    • Provider health.
    • Queue and worker status.
    • Failed and pending operations.
    • Reconciliation exceptions.
Controllers should remain thin. Aggregation and filtering logic should belong in the administration service and repository layers.
Dashboard KPIs
The initial dashboard should show:
Category	Metrics
Users	Total users, new users, active WhatsApp users, disabled users
Wallets	Total funded wallets, successful funding volume, pending funding, failed funding
Commerce	Purchase count, purchase volume, successful purchases, failed purchases, refunded purchases
Performance	Purchase success rate, average fulfillment duration, pending purchase age
Products	Active products, products by network, top data plans, product-sync status
Messaging	Messages queued, delivered, failed, retried, oldest pending message
Providers	Paystack status, VTPass status, WhatsApp status, recent provider failures
Infrastructure	API status, worker status, PostgreSQL status, Redis status, Redis latency
Frontend Tasks
    • Add admin login.
    • Add authenticated API client.
    • Add session-expiry handling.
    • Add dashboard overview page.
    • Add users and wallet view.
    • Add purchases and funding view.
    • Add products and catalog controls.
    • Add provider and worker health view.
    • Add date-range filters.
    • Add loading, empty, error, and degraded-state UI.
    • Keep the admin application separate from the public client.
Completion Criteria
    • A non-admin user cannot access admin endpoints.
    • Administrators can view important operational metrics without querying the database directly.
    • Failed, pending, and refunded financial operations are clearly visible.
    • Product sync and worker health are visible.
    • Sensitive data is minimized and access is auditable.


### Phase 2.1 — Admin roles and authorization

Backend only:

- Add `CUSTOMER`, `OPERATOR`, and `ADMIN` roles.
- Reuse the existing JWT/session login.
- Add admin/operator authorization middleware.
- Add secure admin bootstrap through a one-time CLI or controlled seed process.
- Protect the administration route namespace.
- Add non-admin rejection tests.

Commit:

```text
feat(admin): add role-based administration authorization

Added:
- User roles and admin authorization middleware.
- Protected administration route foundation.
- Secure admin bootstrap path.

Tests:
- Reject unauthenticated requests.
- Reject customer users.
- Allow operator and administrator users.
```

### Phase 2.2 — Audit logging and privacy boundaries

Backend only:

- Add an administrator audit log model.
- Record actor, action, resource, outcome, request ID, IP, and user agent.
- Redact phone numbers, email addresses, and sensitive metadata by default.
- Add audit logging for controlled actions.
- Add repository and service tests.

Commit:

```text
feat(admin): add audited operator actions and PII boundaries

Added:
- Administrator audit log persistence.
- Audited action service.
- Default PII minimization rules.

Tests:
- Audit success and failure outcomes.
- Verify customer data is not exposed by default.
```

### Phase 2.3 — Administration read model and KPI aggregation

Backend only:

- Add administration repositories and service layer.
- Implement date-range validation.
- Build the dashboard summary contract for:
  - users
  - wallets and funding
  - purchases
  - performance
  - products
  - messaging
  - providers
  - infrastructure
- Keep aggregation logic out of controllers.
- Add tests for empty data, date ranges, and totals.

Commit:

```text
feat(admin): add operational KPI aggregation

Added:
- Administration repositories.
- Dashboard KPI aggregation service.
- Date-range filtering and summary contracts.

Tests:
- KPI totals and status breakdowns.
- Empty and degraded data states.
- Date-range boundary behavior.
```

### Phase 2.4 — Protected administration API

Backend only:

- Add thin controllers and validated routes for:
  - dashboard summary
  - users
  - wallets
  - wallet transactions
  - funding intents
  - purchases
  - products
  - provider health
  - worker and queue status
  - failed and pending operations
  - reconciliation exceptions
- Add controlled product visibility and synchronization actions.
- Add authorization and audit tests for every controlled action.

Commit:

```text
feat(api): expose protected administration operations

Added:
- Administration API endpoints.
- Product visibility and synchronization actions.
- Provider, worker, and reconciliation endpoints.

Tests:
- Authorization boundaries.
- Request validation.
- Audit records for controlled actions.
```

At this point, the complete backend data and KPI contract will exist before frontend work begins.

### Phase 2.5 — Admin frontend authentication and shell

Frontend:

- Add admin login.
- Add authenticated API client.
- Add token refresh and session-expiry handling.
- Add protected routes.
- Add sidebar navigation, top bar, account menu, and global status area.
- Replace the placeholder in `admin/src/App.tsx`.
- Preserve the current blue shadcn theme in [index.css](/home/Programmerchriz/Desktop/projects/pern/swift-topup/admin/src/index.css).

Commit:

```text
feat(admin-ui): add authenticated administration shell

Added:
- Admin login flow.
- Authenticated API client.
- Session expiry handling.
- Protected dashboard shell and navigation.

Updated:
- Admin application placeholder layout.
- Existing shadcn theme integration.
```

### Phase 2.6 — Dashboard overview and KPI presentation

Frontend:

- Add date-range filters.
- Add KPI cards.
- Add trend and status visualizations.
- Add funding, commerce, messaging, provider, and infrastructure summaries.
- Add loading, empty, error, and degraded-state views.
- Add responsive desktop-first layout.
- Add frontend caching with Tanstack Query, cache requests for 5 minutes and invalidate after any transaction

### Phase 2.7 — Operational resource views

Frontend:

- Users and wallet inspection.
- Purchases and funding inspection.
- Products and catalog controls.
- Provider and worker health.
- Failed, pending, refunded, and reconciliation views.
- Redacted customer information by default.
- Controlled action confirmations.

## Phase 3 — AI-First WhatsApp Conversation Engine

### Objective

Make natural-language conversation the primary WhatsApp interaction model while keeping all financial operations under deterministic server control.

SwiftTopUp will use a custom internal AI gateway that connects directly to supported model providers.

Initial providers:

- Gemini
- DeepSeek
- Groq
- Cerebras
- Hugging Face Inference Providers

Local model inference is excluded from this phase.

The gateway will initially live inside the API under the infrastructure layer. It should not become a separate deployed service until traffic or operational complexity justifies extracting it.

---

### Non-negotiable transaction boundary

The model must never directly debit a wallet or execute a purchase.

The server flow must remain:

1. Receive and deduplicate the WhatsApp message.
2. Send the message to the internal AI gateway.
3. Receive a structured intent draft.
4. Validate the draft with Zod.
5. Resolve the product and price from the database.
6. Create a pending confirmation state.
7. Send the user one concise confirmation prompt.
8. Wait for explicit user confirmation.
9. Reload the product and price from the database.
10. Execute the existing commerce service with an idempotency key.
11. Send the final result.

A customer-initiated wallet debit must never occur before explicit confirmation.

Automated refunds and financial reversals after failed provider fulfillment remain system operations and must not wait for another user confirmation.

The model must never:

- Debit a wallet.
- Choose the authoritative product price.
- Mark a purchase successful.
- Fulfill a provider transaction.
- Create a refund decision.
- Mutate wallet or purchase status.
- Decide that a user has confirmed a transaction.

---

### AI provider strategy

The custom gateway will support direct provider APIs through provider-specific adapters.

The gateway must not assume that every provider supports the same:

- Request format.
- Response format.
- Structured-output capability.
- Tool-calling capability.
- Token accounting.
- Error format.
- Rate limits.
- Context window.
- Retry behavior.

Provider selection must be capability-based rather than simple round-robin rotation.

The gateway should select a provider based on:

- Provider availability.
- Model capability.
- Structured-output support.
- Current rate-limit state.
- Latency.
- Configured priority.
- Estimated cost.
- Provider-specific failure history.

The gateway must not rotate accounts or keys to bypass provider limits or provider terms.

---

### Phase 3.1 — Custom AI Gateway Foundation

### Objective

Create the internal gateway contract and provider-independent request flow.

### Tasks

- Create an AI infrastructure module.
- Define a provider-independent AI request interface.
- Define a normalized AI response interface.
- Define provider error categories:
  - rate limited
  - timeout
  - unavailable
  - authentication failure
  - invalid request
  - invalid model response
  - unsupported capability
- Add environment configuration for:
  - AI enablement
  - primary provider
  - fallback providers
  - provider model names
  - request timeout
  - maximum output tokens
  - maximum conversation context
  - global daily request budget
  - per-user request limit
  - provider retry limit
- Keep all provider API keys server-side.
- Do not expose provider keys to the client or WhatsApp layer.
- Add a gateway-level request identifier.
- Add request latency measurement.
- Add provider usage tracking.
- Add structured gateway logs without storing unnecessary personal data.
- Redact or normalize phone numbers before sending them to providers where possible.
- Add a strict SwiftTopUp business-scope policy for every provider.
- Treat provider output as untrusted and validate it with Zod.
- Reject prompt-injection attempts that request policy overrides, secrets, tools, wallet debits, or transaction execution.
- Return a server-owned capability overview for the first out-of-scope request.
- Store the out-of-scope warning state in Redis with a 24-hour TTL per user.
- Ignore subsequent out-of-scope requests until the warning TTL expires.
- Keep guardrail responses separate from financial execution.
- Never allow the model to return authoritative prices, product IDs, wallet balances, debit authorization, or transaction success.

The gateway should expose one internal operation similar to:

- Interpret a user message.
- Return a validated conversation intent draft.
- Report provider metadata separately from the intent.

The messaging domain must not know whether the response came from Gemini, DeepSeek, Groq, Cerebras, or Hugging Face.

### Milestone

The API can request AI interpretation through one internal interface without depending on a specific provider.

---

### Phase 3.2 — Direct Provider Adapters

### Objective

Connect the custom gateway to direct model APIs.

### Tasks

Implement provider adapters for:

- Gemini.
- DeepSeek.
- Groq.
- Cerebras.
- Hugging Face Inference Providers.

Each adapter must handle:

- Authentication.
- Provider-specific endpoint URLs.
- Provider-specific request format.
- Provider-specific response extraction.
- Provider-specific error mapping.
- Timeout handling.
- Usage metadata extraction.
- Model capability reporting.
- Structured-output support.
- Tool-calling support where available.

Each provider configuration should support:

- Enabled or disabled state.
- Model name.
- Priority.
- Maximum requests per minute.
- Maximum daily requests.
- Maximum token budget.
- Request timeout.
- Fallback eligibility.

The first implementation should avoid adding a third-party gateway dependency. Use the existing server-side HTTP client or native `fetch` unless a provider SDK provides clear value.

Provider adapters must be independently testable with mocked HTTP responses.

### Milestone

SwiftTopUp can send the same intent-extraction request to multiple direct providers through a consistent internal gateway contract.

---

### Phase 3.3 — Conversation Contract and Intent Extraction

### Objective

Define what the model may understand and return.

### Initial intent schema

The model may return:

- `BALANCE`
- `FUND_WALLET`
- `BUY_DATA`
- `BUY_AIRTIME`
- `LIST_PRODUCTS`
- `PURCHASE_STATUS`
- `CANCEL`
- `RESTART`
- `HELP`
- `UNKNOWN`

It may also return:

- Network.
- Product type.
- Recipient phone number.
- Airtime amount.
- Requested data size.
- Validity preference.
- Category preference.
- Missing fields.
- Confidence score.
- Clarification reason.
- Whether the request appears to be for the user or another person.

The model must not return authoritative:

- Product price.
- Product ID.
- Wallet balance.
- Purchase status.
- Transaction success.
- Debit authorization.
- Provider reference.
- Refund status.

### Tasks

- Define the intent schema with Zod.
- Define the JSON Schema representation used by compatible providers.
- Prefer structured JSON responses.
- Support a safe fallback for providers that cannot enforce JSON Schema:
  - request JSON-only output
  - parse the response
  - validate with Zod
  - reject malformed or unsafe output
- Reject:
  - malformed JSON
  - unknown intents
  - unsupported fields
  - missing required fields
  - invalid phone numbers
  - invalid amounts
  - invalid confidence values
  - low-confidence requests
- Add a prompt contract that clearly separates:
  - user message
  - available SwiftTopUp capabilities
  - allowed intent fields
  - prohibited financial decisions
- Keep provider prompts short and task-specific.
- Avoid sending full historical conversation context when a compact conversation state is sufficient.

### Example

For:

> Send 2GB data to 08012345678

The AI may return:

- Intent: `BUY_DATA`
- Data size: `2GB`
- Recipient phone: normalized number
- Missing field: possibly network
- Confidence: provider-generated confidence value

It must not return:

- A product ID.
- A price.
- A debit instruction.

### Milestone

The backend can safely convert natural-language messages into validated intent drafts independent of the selected AI provider.

---

### Phase 3.4 — AI-First Routing, Product Resolution, and Confirmation

### Objective

Make AI interpretation the primary conversation path while preserving deterministic fallback behavior.

### Tasks

- Add a `conversationIntentService`.
- Use AI interpretation for ordinary natural-language messages.
- Keep deterministic handling for:
  - explicit `YES`
  - explicit `NO`
  - cancellation
  - restart
  - duplicate inbound messages
  - active confirmation states
- Preserve fixed commands as fallback aliases.
- Support Nigerian phone-number formats:
  - `08012345678`
  - `080 1234 5678`
  - `+2348012345678`
  - `2348012345678`
- Normalize phone numbers before they reach commerce services.
- Detect missing information.
- Ask only for the missing field.
- Detect ambiguity instead of guessing:
  - multiple possible networks
  - multiple matching products
  - unclear recipient
  - unclear amount
  - unclear product type
- Add a confidence threshold.
- Route low-confidence responses to deterministic fallback handling.
- Add server-side product resolution using the current active catalog.
- Never trust product IDs, prices, product names, or network values from the model without reloading authoritative data.
- If one product matches, create a pending purchase draft.
- If multiple products match, show a concise selection.
- If no product matches, provide a useful fallback for products within that range.

Example

> Send 2GB mtn data to 08012345678

If no 2GB Plan for MTN is found, it must return data plans within the range for that network:

- Intent: `BUY_DATA`
- The closest 4 data plans to 2GB - 2 higher, 2 lower. If there's none lower, it should return the closest 4 higher and vice versa
- Recipient phone: normalized number
- Confidence: provider-generated confidence value

If the network and specific plan were not detected, it must return data plans within the range for all 4 networks:

- Intent: `BUY_DATA`
-  The closest 2 data plans to 2GB - 1 higher, 1 lower. If there's none lower, it should return the closest 2 higher and vice versa
- Recipient phone: normalized number
- Missing field: network
- Confidence: provider-generated confidence value
- 2 MTN, 2 AIRTEL, 2 GLO, 2 9MOBILE.

It must not return:

- A product ID.
- A price.
- A debit instruction.
- Store pending action state containing:
  - user ID
  - WhatsApp ID
  - intent
  - product ID
  - authoritative price
  - recipient phone
  - creation time
  - expiry time
  - draft identifier
  - conversation version
- Bind pending actions to the user and conversation.
- Reject confirmations for:
  - expired actions
  - another user
  - another product
  - completed actions
  - cancelled actions
- Send one concise confirmation message.

Example:

    You are about to buy:

    Product: MTN 2GB Data
    Recipient: 08012345678
    Amount: NGN 500

    Reply "YES" to confirm or "NO" to cancel.

### Milestone

A user can describe a supported request in one message and receive a server-generated confirmation without depending on exact command wording.

---

### Phase 3.5 — Confirmation-Gated Execution and Provider-Safe Operations

### Objective

Connect confirmed intents to the existing domain services.

### Tasks

- Handle confirmation deterministically without another AI request.
- Accept confirmation only when an active pending action exists.
- Support:
  - `YES`
  - `CONFIRM`
  - `NO`
  - `CANCEL`
- Do not treat a standalone `YES` as authorization when no pending action exists.
- On confirmation:
  - reload the product
  - reload the current price
  - verify the current wallet balance through the database-backed wallet path
  - call `commerceService.createPurchase()`
  - pass a stable idempotency key
- Keep the AI gateway out of:
  - wallet debit
  - purchase creation
  - provider fulfillment
  - refund decisions
  - transaction status mutation
- Add natural-language handling for:
  - balance
  - funding
  - purchase status
  - cancellation
  - product listing
  - help
- Return one compact response per action where possible.
- Avoid unnecessary progress messages that increase WhatsApp outbound traffic.
- Handle:
  - insufficient balance
  - unavailable product
  - provider failure
  - pending provider result
  - successful purchase
  - automatic refund after failed fulfillment
- Clear pending state after:
  - successful confirmation
  - cancellation
  - expiry
  - unrecoverable failure
- Preserve the existing transaction idempotency behavior.
- Ensure retries after provider or WhatsApp failures do not cause duplicate wallet debits.

### Milestone

A user can send one natural-language purchase request, confirm the server-generated summary, and execute the existing commerce and wallet services safely.

---

### Phase 3.6 — AI-Powered Conversation UX Polishing

### Objective

Make AI the primary handler for natural conversation throughout the interaction, while allowing the backend to take control only when a transaction, debit, credit, or irreversible operation must occur.

The conversation should follow the user’s latest intent instead of forcing users to complete rigid server-defined flows.

### Core interaction rule

```text
New message
  ├─ Explicit YES/CONFIRM/NO/CANCEL → deterministic backend handling
  ├─ Financial execution already started → transaction-status handling
  └─ Everything else → AI interpretation with current context
```

AI may interpret, clarify, redirect, and replace the current conversation intent.

The backend remains authoritative for:

- Amount validation
- Product and price resolution
- Payment creation
- Wallet crediting
- Wallet debiting
- Purchase creation
- Provider fulfillment
- Refunds
- Transaction status changes
- Confirmation authorization

### Conversation state redesign

Separate conversational context from transactional state.

### Conversational context

Used by the AI to understand the ongoing discussion:

- Current user intent
- Previously supplied fields
- Missing information
- Recent user and assistant messages
- Conversation version
- Expiry time

This context must not force a rigid response format.

### Transactional state

Created only when the backend requires a transaction boundary:

- Pending purchase confirmation
- Pending wallet funding payment
- Execution status
- Transaction identifier
- Idempotency key
- Ownership information
- Expiry time

Transactional state must remain server-controlled and must not be interpreted as ordinary conversational state.

### AI-first routing

Update message routing so that:

- Exact `YES` and `CONFIRM` remain deterministic.
- Exact `NO` and `CANCEL` remain deterministic.
- Restart remains deterministic.
- Duplicate messages remain deterministic.
- Natural-language messages always go through AI unless an irreversible transaction is already executing.
- Active conversational context is supplied to AI as compact state.
- The AI can determine whether the user is continuing, changing, or abandoning the previous request.

Examples:

- `2k`
- `2 thousand naira`
- `I want to fund with two thousand`
- `Actually, check my balance`
- `Forget that, show me data plans`
- `I changed my mind; buy airtime instead`

These must not be processed by rigid command parsers.

### Intent replacement and flow abandonment

When a user sends a new natural-language request:

- The AI determines whether it continues the current request.
- If it represents a new intent, the existing conversational draft is replaced.
- The old missing-field request is discarded.
- The user does not need to send `CANCEL`.
- The new request is handled immediately.

Example:

```text
Bot: How much do you want to fund?
User: 2k
Bot: ...
User: Actually, check my balance
Bot: Available balance: NGN ...
```

The server must not interpret `check my balance` as a funding amount.

### Transaction boundary behavior

Before execution:

- AI may continue the conversation.
- AI may collect missing fields.
- AI may clarify ambiguity.
- AI may replace the current request.
- Pending drafts may be safely discarded.

At confirmation:

- Backend creates the authoritative confirmation summary.
- `YES` and `CONFIRM` are handled without another AI request.
- `NO` and `CANCEL` clear the pending transactional draft.
- Any other natural-language message may abandon the pending draft and return to AI routing.

After execution begins:

- The transaction cannot be silently replaced.
- The backend owns the response.
- New messages must be routed to transaction status, cancellation rules, or a separate new conversation.
- Idempotency and wallet protections remain unchanged.

### Natural-language amount interpretation

Support conversational monetary expressions, including:

- `2k`
- `2 thousand`
- `2 thousand naira`
- `₦2,000`
- `2000`
- `one thousand five hundred`
- `fund it with five k`

The AI extracts the requested amount, but the backend must:

- Normalize the amount.
- Convert it into the authoritative money representation.
- Reject invalid or ambiguous amounts.
- Enforce minimum and maximum limits.
- Never trust model-generated wallet balances or transaction results.

### Funding wallet UX

The funding flow should become:

1. AI identifies the funding intent.
2. AI asks for the amount only when missing.
3. AI understands conversational amount expressions.
4. Backend validates the normalized amount.
5. Backend creates the payment or funding transaction.
6. Backend returns the payment instructions or confirmation.
7. Wallet credit occurs only through the existing verified payment path.

The server must not force users to reply with a strict numeric format.

### Purchase UX

The purchase flow should remain AI-driven until execution requires backend authority:

1. AI identifies the product request.
2. AI collects missing information conversationally.
3. AI detects changed intent or abandonment.
4. Backend resolves the active catalog.
5. Backend creates the authoritative pending purchase draft.
6. Backend sends one confirmation summary.
7. `YES` or `CONFIRM` triggers deterministic execution.
8. Any other new natural-language request can replace the unexecuted draft.

### Response ownership

AI-owned responses:

- Clarifying questions
- Missing-field requests
- Intent changes
- Help and capability explanations
- Natural-language conversation
- Ambiguity explanations

Backend-owned responses:

- Product names and prices
- Wallet balances
- Payment references
- Debit or credit results
- Purchase status
- Provider fulfillment results
- Refund results
- Confirmation summaries
- Transaction failures

AI must never fabricate backend-owned values.

### Required state transitions

Implement and test transitions for:

- Natural-language request → AI interpretation
- Missing field → conversational follow-up
- Existing draft → new intent replacement
- Existing confirmation → new request abandonment
- Explicit `YES` → backend execution
- Explicit `NO` → draft cancellation
- Expired draft → state cleanup
- Execution started → transaction-owned handling
- Duplicate inbound message → idempotent ignore

### Tests and acceptance coverage

Add tests for:

- `2k` as a valid funding amount.
- `2 thousand naira` as a valid funding amount.
- Invalid and ambiguous monetary phrases.
- Switching from funding to balance without `CANCEL`.
- Switching from funding to data purchase without `CANCEL`.
- Replacing a pending purchase draft with a new request.
- Natural-language cancellation.
- Explicit `YES` and `CONFIRM` bypassing AI.
- Explicit `NO` and `CANCEL` clearing the pending draft.
- New messages not overriding an already executing transaction.
- Transaction state remaining user-bound and idempotent.
- AI never supplying authoritative prices, balances, product IDs, or transaction results.

### Milestone

A user can interact naturally with SwiftTopUp without memorizing commands or response formats.

The AI can interpret conversational follow-ups, understand expressions such as `2k`, abandon stale flows when the user changes direction, and hand control to the backend only when a verified financial transaction must be created or executed.

### Phase 3.7 — Evaluation, Quotas, Monitoring, and Controlled Rollout

### Objective

Validate the custom gateway and AI conversation path before exposing it to real users.

Phase 3.7 also includes abuse prevention and capacity readiness for a possible
initial traffic target of 1,000 active users. This target is a load-testing and
operational-readiness target, not a guarantee that the current deployment can
support that traffic without measurement.

### Evaluation dataset

Create test examples containing:

- Nigerian English phrasing.
- Spelling mistakes.
- Abbreviations.
- Slang.
- Incomplete requests.
- Multiple intents in one message.
- Ambiguous networks.
- Invalid phone numbers.
- Invalid amounts.
- Confirmation bypass attempts.
- Expired confirmations.
- Repeated confirmations.
- Duplicate WhatsApp messages.
- Prompt injection attempts.
- Provider error responses.
- Malformed model responses.

### User-input learning and evaluation data governance

User messages should improve the conversation system through a controlled
evaluation and feedback pipeline. Do not automatically train or fine-tune a
provider on raw production messages in real time.

Implement:

- A versioned Nigerian English evaluation dataset.
- Examples covering Nigerian phrasing, spelling mistakes, abbreviations, slang,
  incomplete requests, intent changes, and mixed-intent messages.
- Expected intent labels and expected extracted fields for every example.
- Expected safety outcomes for invalid phones, invalid amounts, low confidence,
  confirmation bypasses, prompt injection, and out-of-scope requests.
- Recorded-message evaluation that runs against the gateway contract without
  calling live financial providers.
- Dataset version, prompt version, model/provider version, confidence, fallback
  result, latency, and validation outcome for each evaluation run.
- A redacted feedback sample pipeline for production messages that removes or
  masks phone numbers, email addresses, names, account numbers, provider
  references, tokens, and other sensitive financial data before storage.
- Retention limits, access controls, encryption, auditability, and a process for
  excluding users or messages from evaluation data where required.
- A protected holdout dataset that is never used to tune prompts or models.

The first improvement loop should use labels, prompt changes, schema changes,
deterministic routing, and product-resolution fixes. Fine-tuning may be evaluated
later only after the redaction, consent, retention, dataset-versioning, and
holdout controls are in place. AI training data must never contain wallet
balances, payment credentials, raw webhook payloads, or unredacted customer
identifiers.

### Metrics

Measure:

- Intent accuracy.
- Field extraction accuracy.
- Product resolution accuracy.
- Clarification rate.
- Deterministic fallback rate.
- Provider failure rate.
- Gateway failure rate.
- Model latency.
- Provider latency.
- Outbound messages per completed purchase.
- Confirmation bypass count.
- Duplicate debit count.
- Insufficient-balance handling.
- Provider failure handling.
- Token usage.
- Estimated provider cost.
- Provider quota consumption.
- Invalid structured-response rate.

### Provider controls

Add:

- Provider-specific circuit breakers.
- Per-provider request counters.
- Per-user AI request limits.
- Global daily request budget.
- Configurable provider priority.
- Provider disable switches.
- Automatic fallback for timeouts, rate limits, and temporary provider failures.
- Deterministic-only emergency mode.
- Provider health status for administration monitoring.

Fallback rules must not retry financial execution through another AI provider. AI fallback applies only to intent interpretation before confirmation.

### Request admission, WhatsApp authenticity, and abuse prevention

The API must use layered protection. Application rate limiting alone cannot stop
an HTTP flood from consuming the Node.js process, so the edge layer and the API
layer must both enforce limits.

#### Edge admission controls

Add protection before requests reach the API process through the reverse proxy,
WAF, or managed API gateway:

- Per-IP request limits with burst controls.
- Connection limits and request timeouts.
- Maximum request-body size.
- Blocking rules for repeated abusive IPs and malformed traffic.
- Separate limits for the WhatsApp webhook, authentication routes, health checks,
  and ordinary API routes.
- Monitoring for rejected requests, origin IPs, and upstream saturation.
- Correct proxy header rewriting and an explicit Express `trust proxy` policy.

When a request is rejected at the edge, it should not consume application CPU,
database connections, Redis operations, or AI-provider quota. Edge protection is
the only practical way to reject traffic before it reaches the server; in-process
rate limiting remains necessary as defense in depth.

#### WhatsApp webhook authenticity

The WhatsApp webhook must not trust a caller-provided `whatsappWaId` as an API
key or authentication credential.

Before parsing or processing the webhook body:

- Verify Meta's `X-Hub-Signature-256` using `WHATSAPP_APP_SECRET` and the exact
  raw request body.
- Reject missing, malformed, or invalid signatures.
- Validate the signed payload shape and require a valid sender WhatsApp ID.
- Normalize and bind the sender identity only after signature verification.
- Keep the existing message-ID deduplication after authenticity validation.
- Create or link a SwiftTopUp user only from an authenticated Meta webhook.
- Record signature failures and abuse signals without storing unnecessary payload
  content.

The public API may continue to expose webhook verification, health, and controlled
authentication routes. Customer wallet and purchase actions must enter through a
verified WhatsApp message or an explicitly authenticated API client. A hidden
per-user API key must not replace webhook signature verification.

#### Application rate-limit dimensions

Use Redis-backed, shared limits so limits remain consistent when multiple API or
worker instances run:

- IP address for unauthenticated routes and broad flood protection.
- Username-plus-IP for login brute-force protection.
- Authenticated user ID for direct API routes.
- Verified `whatsappWaId` for WhatsApp conversation and AI limits.
- Route and operation type for expensive actions such as AI interpretation,
  wallet funding, product synchronization, and purchase creation.
- Global limits for total inbound traffic, AI requests, outbound WhatsApp
  delivery, database work, and provider calls.

At minimum, add strict limits for:

- `POST /identity/login`.
- `POST /identity/register`.
- `POST /messaging/whatsapp/webhook`.
- AI interpretation requests.
- Wallet-funding account creation.
- Purchase creation.
- Administration actions.

Every application throttle must return a controlled `429` response with a safe
`Retry-After` value where appropriate. Rejected requests must not call the AI
gateway, database mutation services, payment providers, or VTU providers.

#### Abuse controls

Add:

- Temporary blocks for identities or IPs that repeatedly exceed limits.
- Progressive cooldowns instead of permanent automatic bans.
- A denylist and allowlist mechanism for operations staff.
- Per-user daily financial-operation limits.
- Per-user concurrent-flow limits.
- Purchase and funding velocity checks.
- AI prompt-injection and malformed-input counters.
- Outbound WhatsApp budget and provider-throttle handling.
- Alerts for spikes in rejected requests, failed signatures, duplicate messages,
  duplicate purchases, and repeated confirmation attempts.
- A deterministic-only emergency mode that can disable AI without disabling the
  verified WhatsApp flow.

Rate limiting must not be implemented only by trusting an arbitrary forwarded IP
header. The deployment proxy must overwrite forwarded headers, and the API must
document the exact trusted proxy topology.

### AI provider circuit breakers and cost controls

Add a shared per-provider circuit breaker with:

- Closed, open, and half-open states.
- Failure thresholds by provider and error category.
- Cooldown periods with jitter.
- A bounded half-open probe count.
- Redis-backed state for multi-instance deployments.
- Automatic fallback only for intent interpretation.
- No provider fallback after a financial operation has started.

Track and alert on:

- Provider request count.
- Provider failure count by category.
- Provider timeout count.
- Invalid structured-response count.
- Provider fallback count.
- Provider latency percentiles.
- Input and output token usage.
- Estimated cost.
- Quota consumption.
- Circuit-breaker state changes.

### Feature flags

Add feature flags for:

- AI conversation enabled.
- AI provider selection.
- AI model selection.
- AI traffic percentage.
- Per-user AI access.
- Deterministic-only mode.
- Provider-specific enablement.

Feature flags must be server-side and evaluated before an AI request is sent.
Support:

- Global AI enablement.
- Deterministic-only emergency mode.
- AI traffic percentage.
- Per-user AI access.
- Provider selection.
- Model selection.
- Provider-specific enablement.

Traffic allocation must be deterministic for a user during a rollout window so
the same WhatsApp user does not switch unpredictably between AI and deterministic
behavior on every message.

### Rollout

1. Unit tests with mocked provider responses.
2. Contract tests for every provider adapter.
3. Local tests using recorded user messages.
4. Staging with mock payment and VTU providers.
5. Internal WhatsApp test number.
6. Small beta user group.
7. Controlled production rollout.
8. Continuous monitoring and provider cost review.

Add capacity and abuse-readiness gates to the rollout:

9. Load-test the API, Redis, PostgreSQL, AI gateway, and messaging worker with a
   defined workload representing 1,000 active users.
10. Test bursts, malformed requests, invalid signatures, repeated messages,
    repeated confirmations, login attacks, and rotating IP addresses.
11. Confirm that edge throttling rejects traffic before it reaches the API and
    that application throttling protects shared Redis, PostgreSQL, and provider
    resources.
12. Confirm that a single abusive WhatsApp identity cannot consume global AI,
    database, worker, or outbound-message capacity.
13. Confirm that API replicas can share Redis conversation state, quotas, locks,
    idempotency claims, and rate limits safely.
14. Confirm per-user message ordering when more than one API instance is active.
15. Define rollback thresholds for latency, error rate, provider cost, queue
    depth, Redis usage, and financial-operation anomalies.

### Capacity and hosting decision gate

The initial target is 1,000 active users. Before changing providers, measure:

- Peak inbound webhook requests per second.
- Peak messages per WhatsApp identity.
- AI requests per second and daily volume.
- API latency percentiles.
- Redis command volume and latency.
- PostgreSQL connection and query load.
- Messaging-stream backlog and oldest pending message.
- Provider request rates and response latency.
- Node.js memory and CPU usage.
- Number of API and worker instances required to maintain the target SLOs.

Keep the API stateless with shared PostgreSQL and Redis before adding a second
runtime. The current in-process inbound ordering chain must be replaced or
augmented with a distributed per-identity ordering mechanism before horizontal
API scaling is considered safe.

Hosting options are a decision gate, not an automatic migration:

- Keep the Oracle VM as the primary runtime while its measured capacity and
  reliability meet the target.
- Use a managed edge/WAF or reverse proxy in front of the primary runtime before
  adding another application host.
- Use Render for staging or a secondary runtime only after shared Redis,
  PostgreSQL, webhook routing, deployment, and observability are designed. Its
  free service tier does not provide multi-instance scaling; autoscaling requires
  a paid workspace.
- Evaluate AWS or Azure after estimating database, Redis, WAF, gateway, egress,
  and observability costs. Promotional free credits or free service allowances
  must not be treated as a guaranteed production budget.
- Do not split live traffic between Oracle and Render merely to balance load.
  Multi-runtime traffic requires shared state, consistent migrations, signed
  webhook routing, distributed ordering, and an explicit failover plan.

The phase is complete only when the chosen deployment topology has passed the
1,000-active-user load test, has enforced edge and application limits, and has a
tested rollback path.

### Milestone

The custom AI gateway is provider-independent, observable, quota-aware, reversible, and unable to bypass confirmation or financial idempotency.

---

### Important implementation decision

The system will be AI-first at the conversation layer, but AI will never control the financial layer.

The target architecture is:

    WhatsApp message
            ↓
    SwiftTopUp custom AI gateway
            ↓
    Gemini / Groq / Cerebras / Hugging Face / DeepSeek
            ↓
    Structured intent draft
            ↓
    Zod validation
            ↓
    Server-side product and price resolution
            ↓
    Pending confirmation state
            ↓
    Explicit user confirmation
            ↓
    Existing wallet and commerce services
            ↓
    Provider fulfillment

The initial gateway will remain an internal API module. It may later be extracted into a separate service if provider traffic, scaling, or operational requirements justify it.

### Completion criteria

Phase 3 is complete when:

- Natural-language requests are the primary conversation path.
- Direct providers can be switched without changing the messaging domain.
- At least two providers support the intent-extraction flow.
- Provider failures fall back safely.
- Fixed commands remain available as fallback.
- AI responses are schema-validated.
- Product prices are always loaded from the server.
- Every customer-initiated debit requires explicit confirmation.
- Confirmation cannot be reused or applied to another action.
- Existing wallet and commerce idempotency remains intact.
- AI usage, failures, latency, quotas, and costs are observable.
- The system can be switched back to deterministic-only mode immediately.

## Phase 3.8 roadmap

### 3.8-A — Security and admission controls

Includes:

- Apply the operator/admin restriction above.
- Document and verify Nginx/WAF limits, trusted proxy hops, body limits, TLS, and webhook routing.
- Review secret exposure, credential scope, rotation, and production environment separation.
- Run dependency and configuration security audits.

Acceptance:

- Customer synchronization attempts return `403`.
- Invalid WhatsApp signatures are rejected before processing.
- Edge limits reject abusive traffic before Node.js.
- No production secrets appear in source, logs, or bundles.

### 3.8-B — Durable WhatsApp messaging

Requires Prisma migration and worker changes.

- Persist inbound WhatsApp events before acknowledgement.
- Add a distributed per-`whatsappWaId` ordering mechanism.
- Persist outbound message attempts and provider IDs.
- Process WhatsApp delivery-status webhooks.
- Link inbound/outbound records to users and related purchases.

Acceptance:

- A process crash after acknowledgement does not lose an inbound message.
- Multiple API replicas preserve per-user ordering.
- Every outbound message has durable status and retry history.
- Delivery-status changes are idempotent.

### 3.8-C — VTU fulfillment and financial recovery

Requires new persistence models and durable workers.

- Move provider fulfillment to a durable queue/workflow.
- Add provider timeout, retry, and ambiguous-result policies.
- Reconcile pending purchases.
- Make refunds recoverable after process interruption.
- Add duplicate-provider-event handling.
- Add financial reconciliation jobs and operator-visible exceptions.

Acceptance:

- No purchase remains silently debited without a recoverable state.
- Provider ambiguity never causes an unsafe second purchase.
- Failed refunds are retried and surfaced.
- Reconciliation exceptions are actionable and auditable.

### 3.8-D — Financial concurrency and funding cleanup

Requires migration and transaction changes.

- Serialize concurrent wallet mutations at database level.
- Add scheduled expiration of temporary funding intents (30 minutes from paystack).
- Verify idempotency under concurrent requests.
- Add tests for concurrent debits and process interruption.

Acceptance:

- Concurrent purchases cannot overspend a wallet.
- Expired funding intents are cleaned without requiring a webhook or user request.
- Duplicate financial events remain idempotent.

### 3.8-E — Evidence and launch gates

Requires Oracle/Nginx/Redis/provider access.

- Run a 1,000-active-user load test.
- Test API replicas, Redis sharing, queue backlog, provider limits, and ordering.
- Configure alerts for wallet, provider, Redis, queue, webhook, refund, and reconciliation failures.
- Verify backup/restore and rollback procedures.
- Complete staged provider smoke tests.

Launch gate:

- Load-test evidence recorded.
- Edge and application throttles verified.
- Database and Redis restore verified.
- Pending purchases and refunds recoverable.
- Rollback procedure executed successfully.


## Phase 4.1 — Referral and rewards

Implement:

- Referral attribution and immutable referral ownership.
- Self-referral and abuse prevention.
- Eligibility rules and reward limits.
- Idempotent reward ledger entries.
- Reversal for refunded or failed purchases.
- Admin visibility and WhatsApp reporting.

Dependencies: stable purchase/reconciliation events and finalized ledger recovery.

Tests: attribution, duplicate events, self-referral, reward caps, refund reversal, concurrent claims.


### Phase 4.1A — Referral identity and immutable attribution

Milestone: every user receives a permanent referral identity.

Implement:

- Generate a unique referral code for every new user.
- Referral code format: exactly six alphabetic characters.
- No numbers or symbols.
- Store/display codes in uppercase, while accepting input case-insensitively.
- Referral codes remain unchanged when usernames change.
- Add optional referral-code capture during REST registration.
- Add referral-code capture during WhatsApp onboarding.
- Include the user’s referral code in the welcome message.
- Reject self-referrals.
- Reject invalid or unavailable referral codes.
- Store immutable referrer-to-referred-user ownership.
- Ensure one referred user can have only one referrer.
- Backfill referral codes for existing users.

Recommended code format:

```text
[A-Z]{6}
```

Tests:

- Six-character code generation.
- Alphabetic-only validation.
- Code uniqueness.
- Case-insensitive code lookup.
- REST registration attribution.
- WhatsApp attribution.
- Self-referral rejection.
- Duplicate attribution rejection.
- Concurrent attribution attempts.
- Stable code after username changes.

### Phase 4.1B — Referral qualification and progress

Milestone: referrals become confirmed after qualifying spending.

Rules:

- Only successful, settled purchases count.
- Funding wallet money does not count.
- Failed purchases do not count.
- Pending purchases do not count.
- Refunded purchases must be reversed from qualifying progress.
- A referred user qualifies after cumulative successful purchases reach `NGN 1,000`.
- Each referred user counts only once toward the referrer’s confirmed referral count.

Implement:

- Cumulative qualifying-spend tracking.
- Referral qualification state.
- Qualification timestamp.
- Confirmed referral count.
- Pending referral count.
- Durable processing from successful purchase events.
- Recovery after interrupted processing.

Tests:

- Spend below `NGN 1,000`.
- Spend exactly `NGN 1,000`.
- Spend above `NGN 1,000`.
- Multiple purchases reaching the threshold.
- Duplicate purchase events.
- Failed and pending purchases excluded.
- Refunded purchase reversal.
- Concurrent qualifying purchases.

### Phase 4.1C — Tier configuration and changing profit-share policies

Milestone: tier status and profit-share rules are configurable and effective-dated.

Initial tiers:

| Tier | Confirmed referrals | Profit-share rate |
|---|---:|---:|
| T1 | 30–59 | 5% |
| T2 | 60–149 | 10% |
| T3 | 150–299 | 15% |
| Affiliate Partner | 300+ | 40% |

Reward formula:

```text
platformProfit = customerPrice - providerCost
affiliateReward = platformProfit × tierPercentage
```

Implement:

- Store tier thresholds and percentages in database configuration.
- Highest currently reached tier determines the percentage for future eligible profit.
- Tier changes do not retroactively recalculate previous rewards.
- Store the applied tier and percentage on every reward event.
- Store provider cost and platform profit immutably when the purchase settles.
- Support effective-dated reward-policy versions.
- Allow a new policy to change or disable profit sharing after investor funding milestones.
- Do not represent profit sharing as a guaranteed lifetime entitlement.
- Existing rewards remain valid after a policy changes.
- New settled purchases use the policy active at settlement time.

A policy version should support fields similar to:

```text
effectiveFrom
effectiveUntil
status
changeReason
```

The investor-capital threshold should initially be an administrative policy change, not an automatic financial calculation. Automatic investor-capital integration can be added later if required.

There are no reward caps.

Tests:

- Tier boundaries at 30, 60, 150, and 300.
- Just-below-boundary cases.
- Correct profit-share formula.
- Provider cost persistence.
- Highest-tier selection.
- No artificial reward cap.
- New policy applies only to future eligible rewards.
- Historical rewards remain unchanged after a policy change.
- Disabled policy stops new rewards.

### Phase 4.1D — Idempotent reward ledger and reversals

Milestone: rewards become durable financial records.

Implement:

- Reward-credit wallet transaction type.
- Reward-reversal wallet transaction type.
- Double-entry ledger postings using the existing wallet ledger.
- Unique reward-event idempotency keys.
- Reward event linked to:
  - referrer;
  - referred user;
  - purchase;
  - tier;
  - policy version;
  - platform profit;
  - applied percentage.
- Reward reversal for refunded or failed purchases.
- Idempotent retry after process interruption.
- Concurrency protection for simultaneous reward processing.

Do not create an unofficial separate reward balance. Reward credits should use the existing financial ledger.

Tests:

- One reward for one eligible event.
- Duplicate event replay.
- Concurrent reward processing.
- Refund reversal.
- Duplicate reversal.
- Process interruption and retry.
- Historical reward remains unchanged after policy changes.
- Reward amount is not capped.

### Phase 4.1E — Username changes and affiliate access

Milestone: users can use the affiliate system without losing referral identity.

Implement:

- Username changes limited to two changes in a rolling 30-day period.
- Username uniqueness and validation.
- Username-change audit history.
- Referral code remains unchanged after username changes.
- Login works with the new username.
- Affiliate dashboard login using username and password.
- Generated password for users who do not yet have one.
- Password must be stored only as a hash.
- Password is shown or delivered only to the user through a verified channel.
- Password is never logged or visible to SwiftTopUp employees.
- Add a prominent warning:

```text
Never share your password with anyone, including SwiftTopUp employees.
```

For usability, the generated password should be easy to type and remember while still meeting the existing minimum password requirements. A forced password change on first login must be implemented.

Tests:

- Valid username change.
- Duplicate username.
- Invalid username.
- Third change within 30 days.
- Change after the rolling window.
- Concurrent username changes.
- Referral code remains unchanged.
- Generated password login.
- Password hash storage.
- Password warning display.
- First-login password change.
- Password reset and expiry behavior.

### Phase 4.1F — Rewards API, administration, and WhatsApp reporting

Milestone: users and administrators can inspect referral and reward data.

Customer endpoints:

```text
GET /rewards/me
GET /rewards/referrals
GET /rewards/progress
GET /rewards/leaderboard
GET /rewards/transactions
```

Administration endpoints:

```text
GET /administration/rewards/summary
GET /administration/rewards/referrals
GET /administration/rewards/transactions
GET /administration/rewards/policies
POST /administration/rewards/policies
GET /administration/rewards/exceptions
POST /administration/rewards/reconcile
```

Implement:

- Referral code display.
- Confirmed and pending referral counts.
- Current tier.
- Next-tier progress.
- Current profit-share percentage.
- Earned, pending, and reversed rewards.
- Active reward-policy version.
- Historical policy information for each reward.
- Admin filters and audit logs.
- Manual suspension of reward processing.
- WhatsApp reports:
  - `referrals`
  - `rewards`
  - `my rank`
  - `referral code`

Leaderboard rules:

- Display usernames only.
- Do not display email, phone number, WhatsApp ID, or wallet information.
- Use pagination.
- Rank by confirmed referrals.
- Use deterministic tie-breaking.

Tests:

- Authenticated access.
- Admin authorization.
- Pagination.
- Privacy masking.
- Policy visibility.
- WhatsApp reports.
- Leaderboard ordering.
- Reconciliation output.

### Phase 4.1G — Affiliate client dashboard

Milestone: affiliates can use the referral system from the browser.

Client routes:

```text
/affiliate-login
/affiliate-dashboard
```

Implement:

- Login form.
- Token/session handling.
- Referral code display and copy action.
- Referral-link sharing.
- Confirmed referral count.
- Pending qualification progress.
- Current tier.
- Next-tier progress.
- Current profit-share rate.
- Reward history.
- Reversal history.
- Active policy information.
- Global leaderboard.
- Mobile-responsive design.
- Loading, empty, error, and unauthorized states.
- Password warning during login/password setup.

Do not start this phase until the API contracts and reward ledger behavior from phases 4.1A–4.1F are stable.

### Phase 4.1H — Abuse prevention, reconciliation, and release hardening

Milestone: the system is safe to operate and recover.

Implement:

- Multiple-account abuse signals.
- Same-wallet and same-payment-account checks.
- Excessive referral velocity detection.
- Suspicious reward activity flags.
- Referral and reward suspension controls.
- Reward reconciliation job.
- Policy-version reconciliation.
- Existing-user backfill verification.
- Admin audit review.
- Terms and privacy-policy updates.
- Full API, worker, and client CI checks.
- End-to-end referral flow testing.

Tests:

- Self-referral.
- Multiple-account patterns.
- Suspended users.
- Suspended referrers.
- Concurrent claims.
- Duplicate purchase events.
- Refund reversals.
- Reward-policy changes.
- Reconciliation recovery.
- Full REST-to-ledger flow.
- Full WhatsApp-to-ledger flow.


### Phase 4.2 — Product ranking and catalog discovery

Implement:

- Deterministic ranking by network, type, price, value, and popularity.
- Purchase-volume aggregation.
- Explainable ranking responses.
- Cache and refresh strategy.
- Provider/catalog manipulation protection.
- Admin controls and ranking tests.

Dependencies: durable purchase events and reliable product synchronization.

### Phase 4.3 — Audio and voice processing

Implement:

- Signed WhatsApp media validation and safe download boundaries.
- MIME, size, duration, and rate limits.
- Speech-to-text provider abstraction.
- Transcript validation and PII handling.
- Deterministic confirmation before financial actions.
- Text fallback, cost limits, and abuse controls.

Dependencies: durable inbound messaging and confirmed financial-action boundaries.

## Launch phases — updated 2026-10-24

### Launch Phase A — funding transaction verification

- Give funding callback transactions a 10-second acquisition budget and a
  15-second execution budget, matching existing project transaction patterns.
- Keep financial mutations atomic and duplicate deliveries idempotent.
- Await every concurrent integration-test operation before fixture cleanup.
- Disconnect Redis and Prisma after standalone PostgreSQL funding tests.
- Re-run concurrency, separate-owner and rollback tests on an isolated database.
- Replace local funding fee estimates with provider-managed customer fees in
  the next payment change. Preserve requested wallet credit and existing intents.
- Do not enable provider fee pass-through while local fee gross-up remains active.
- Confirm provider fee settings and available amount/fee response fields before
  promising an exact provider-supplied total inside WhatsApp.

### Launch Phase A — Bachs settlement payload compatibility

- Accept absent, null and "None" settlement amounts as unavailable.
- Calculate NGN fees only from explicitly NGN-denominated evidence.
- Reject contradictory fee and settlement evidence.
- Permit a matched sandbox checkout to credit its stored wallet amount without
  final fee data only with test mode, a sandbox key and a stored sandbox URL.
- Keep unknown actual fees unknown in deposit receipts.
- Keep live payments without usable fee evidence in REVIEW.
- Preserve signed callback verification, exact amount/reference matching,
  transactional wallet credit and duplicate protection.
- Cover sandbox credit, one confirmation on replay, live-mode protection,
  currency handling and checkout.completed exclusion.
- Sandbox recovery and live fee/settlement verification remain operational checks.

### Launch Phase A follow-up — funding callback verification

Status: pending application and sandbox verification.

- Supplied sandbox logs show requests to the Paystack callback route rejected
  with INVALID_PAYSTACK_WEBHOOK_SIGNATURE. Confirm the originating delivery in
  Bachs and correct its endpoint or forwarding destination.
- Bachs must deliver collection.succeeded to
  /api/v1/wallet/funding/webhooks/bachs using that endpoint's signing secret.
- After correcting configuration, resend the original successful event and
  verify one wallet credit, a CREDITED deposit receipt and WhatsApp confirmation.
- Resending the same event must not create another credit or confirmation.
- Temporary funding messages retain credit, processing fee, total payable and
  payment details, followed by: "You have 30 minutes to make the payment".
- Add regression coverage for temporary bank details and hosted checkout messages.
- The current Bachs adapter uses hosted checkout in sandbox and live mode.
  Direct temporary account details inside WhatsApp remain a launch requirement,
  pending a verified Bachs server-to-server bank-transfer API contract.

### Phase B — VTPass, VTU services, pricing and simpler data selection

Phase A verification has been accepted.

Provider and services:

- VTPass is the only external VTU provider; retain MOCK_VTU for tests.
- Support airtime/data, prepaid/postpaid electricity, DSTV/GOtv/StarTimes,
  WAEC result-checker/registration PINs and available JAMB variations.
- Verify meters, smartcards and JAMB profiles before confirmation.
- Cable renewal uses the verified Renewal_Amount; a package change uses the
  selected variation. JAMB requires one verified profile at the published price.
- Deliver electricity tokens/units and exam PIN/serial information through the
  owner's purchase status and authenticated purchase history.

Pricing:

- New customer purchase totals use the whole-naira ceiling after markup and
  verified mandatory provider fees. DATA keeps its 10% markup on the displayed
  VTPass price; other services have no SwiftTopUp markup. Re-sync starts from
  the provider amount, never from a previously marked-up retail price.
- Supplier accounting and wallet funding fees retain their required precision.
  Existing signed quotes and historical charges are unchanged; refunds return
  the actual stored charge. Block any JAMB total above its approved price.
- Other services have no SwiftTopUp markup: charge the provider selling amount
  plus any verified mandatory provider convenience fee. Earn commission separately.
- Funding fees remain independent. Commission rules are not guessed or required
  for this upfront pricing policy.
- Read fixed provider fees from service metadata where supplied. Configure verified
  per-transaction NGN fees in VTPASS_PROVIDER_FEES when metadata is unavailable.
  Unknown fees disable those products; electricity must have verified fee entries.
- Calculate settled provider cost from the provider's actual total_amount debit.
  Profit = confirmed retail charge minus that actual debit. Keep missing or
  conflicting settlement costs under reconciliation; do not issue rewards from
  guessed costs.

Catalog and presentation:

- Normalize whitespace and explicit validity, including '30 days' and '24 hours'.
  Oneoff, Weekend and Night alone do not establish a duration.
- Separate social offers, retaining one representative per platform/network.
- For ordinary data, group by network, validity, eligibility restrictions and size
  bucket; choose the cheapest displayed provider price per GB using exact arithmetic
  and deterministic code/id tie-breaking.
- Buckets: [1,2), [2,5), [5,10), [10,20), [20,50), [50,100), [100,infinity) GB.
- A specific size request uses the full matching bucket, preserving alternatives
  across validities. Missing-network requests show up to two picks per network.
- Rows: '3GB ₦770 - 7 days'. Show each network as a heading; retain actual quantities,
  night breakdowns and essential app/device restrictions. Hide wholesale categories.
- Persist displayed option IDs and continuous numbering. Split long responses
  without silently discarding ordinary plans after the first twenty items.

Financial and delivery integrity:

- Store immutable provider code, face amount, route/environment, bill parameters
  and confirmed retail charge with the transactional wallet debit and job.
- Bind five-minute signed quotes to their owner and purchase details. Repeated
  confirmation of one signed quote reuses its financial intent.
- Generate a valid Lagos-date VTPass request ID once before the first submission.
  Concurrent claims permit only one initial purchase; stale attempt results are fenced.
- Requery that same request ID after uncertainty. Never submit a second purchase,
  change supplier or cross environments to resolve a timeout.
- Keep delivered purchases awaiting reconciliation when settlement cost or required
  receipt fields are absent. Preserve debit/refund and reward idempotency.
- Invalidate purchase-status caches after fulfillment/refund updates.

Verification and rollout:

- Named migration: launch_b_vtpass_services_and_catalog. Existing purchases retain
  their historical prices; do not invent snapshots for old pending transactions.
- Apply and verify in sandbox first. Reconcile existing pending purchases before
  switching the VTPass environment and keys; then sync the live catalog.
- API CI and generated Prisma schema validated in an isolated source copy.
- New PostgreSQL tests cover concurrent initial claims, immutable settlement costs,
  missing actual debit and rollback on debit failure. Run them against an isolated
  test database before accepting Phase B.
- Live account provisioning, provider fees and end-to-end receipts remain manual
  operational verification. The existing AI chain is unchanged; OpenAI is cancelled.

### Phase B follow-up — catalog readability, service intents and visibility

API CI and PostgreSQL purchase/funding/wallet checks passed. Mobile presentation
and configured provider fees still require operational verification.

- Render catalogs using normal WhatsApp text with bold network/section headings.
  Show simple plans as allowance, price and known validity on one line.
  For plans with extra details, show allowance and price on the first line,
  then known validity and complete bonus/restriction details on the next.
  Keep a blank line between plans. Do not pad columns or use monospace tables.
  Allow native mobile text wrapping without truncating offers.
- Show POPULAR and OTHERS for full network/all-network catalogs. For a specific
  purchase size with no network, show up to two relevant picks per network
  without section headings. Preserve shared ordering and stored option IDs.
- Keep complete short plan entries together when splitting long messages; retain
  Unicode safety and compatibility with existing fenced messages.
- Derive current catalog customer prices from the same exact whole-naira pricing
  helper used by new quotes/debits. Stale Product.price values must not leak kobo
  into new menus. Sync the catalog to refresh stored product prices; preserve
  signed quotes, historical charges, supplier precision and stored-charge refunds.
- Prefer valid explicit provider days, then unambiguous name durations, then
  duration tokens in actual VTPass data codes. Conflicting durations stay unclear.
  Monthly/yearly labels do not invent a day count. Omit unavailable validity from
  every menu entry while retaining complete bonus/restriction details. Preserve
  internal unknown/conflict keys and stored metadata; no extra database flag.
- Quarantine conflicting variation identities, including glo-mega-75000. Do not
  invent a corrected Glo 1TB code or annual duration.
- Natural billing requests retain verification, known-fee availability, signed
  quotes, explicit confirmation and financial idempotency. Electricity remains
  inactive without verified per-service VTPASS_PROVIDER_FEES entries; sandbox
  selection alone does not establish fee availability.
- Admin metrics retain actual charges/refunds, verified settled supplier debit,
  known profit and explicit missing settlement/receipt counts. Unknown amounts
  remain unavailable; profit never treats missing supplier cost as zero.
- No new files, dependencies or migration for this mobile presentation follow-up.
  Test Android and iOS with default/enlarged text, both themes, cross-network
  shortlists, long social descriptions and selections from split messages.

### Launch follow-up — remembered wallet funding contact

- Store validated funding email, first name and last name on the wallet before
  checkout initialization. Keep the contact after failed or abandoned funding.
- Reuse the stored contact in later WhatsApp funding conversations, including
  after conversation state expires. Explicitly supplied fields take precedence.
- Keep the funding email separate from login identity and never infer funding
  names from the WhatsApp display name.
- Existing wallets start without a saved funding contact and collect it once
  on the next funding attempt. Preserve the current Bachs checkout wording.
- Named migration: launch_b_persist_funding_profile. Generate the Prisma client
  and run API CI plus the funding PostgreSQL suite on an isolated database.
- Verify Upstash TCP/TLS connectivity and inbound/outbound/commerce stream
  consumption from the deployed API and worker before the live rollout.

### Launch follow-up — scheduled catalog refresh and live configuration

- With VTPass selected, sync the product catalog when the worker becomes ready
  and every five minutes afterward using the same commerce service as the
  protected manual endpoint. Skip overlapping runs within that worker.
- Log successful refreshes and failures, retry at the next interval and await
  any active sync during worker shutdown. Run one scheduler worker per environment.
- Catalog refresh reflects provider listings and prices; it cannot infer an
  outage for products that remain listed. Existing sync visibility rules apply,
  including reactivating listed products previously hidden by an administrator.
- Correct compiled API/worker startup paths to dist/src/server.js and
  dist/src/worker.js. Explicitly load the intended production environment file.
- Configure live payment keys, signing secrets, organization ID and VTPass live
  URL/keys on both API and worker; use the main bot's WhatsApp configuration.
- Resolve pending sandbox purchases with their original environment before
  switching. Confirm verified provider fees, live signed funding settlement,
  fulfillment receipts and actual provider debit on the main bot.
- No additional database migration or dependency for scheduling. Live provider
  configuration and main-bot verification remain operational checks.

## Manual operational checks

These cannot be proven by repository tests:

- Verify Nginx/WAF rate limits, request-size limits, TLS, proxy headers, and webhook routing.
- Confirm `TRUST_PROXY_HOPS` matches the real proxy topology.
- Test Layerbase Redis TLS/SNI connectivity from the Oracle VM.
- Confirm exactly one intended worker topology and inspect Redis stream pending/DLQ counts.
- Run the 1,000-active-user load test with malformed requests, invalid signatures, duplicate messages, confirmation retries, and rotating IPs.
- Verify PostgreSQL backup restoration into an isolated database.
- Test deployment rollback and systemd health checks.
- Run Paystack, VTPass, and WhatsApp sandbox/live smoke tests with signed webhooks.
- Confirm provider credentials are least-privilege and rotation procedures work.


## Redis stream vs BullMQ queues
398 - 118 = 280 commands during the test
280 / 10 minutes = 28 commands per minute

Previous: 212.9 commands/minute
Current: 28 commands/minute

Reduction = ((212.9 - 28) / 212.9) × 100
Reduction ≈ 86.8 be 

Gemini, DeepSeek, Groq, Cerebras, and Hugging Face.

Prompts:
  For everything described, don't build it yet, draft out an updated plan with phases 4.1A, 4.1B... so that we can build it step by step and have a fully functional referral and rewards system. Draft out the plan now, and also give me a prompt to start a new conversation with the implementation of phase 4.1A, it should understand the context fully first before starting the implementation. When drafting out the phases for implementation, don;t just create phases for the sake of populating the number of phases, each phase should accomplish a reasonable milestone. Remember, the new conversation is for better and more optimal responses and the prompt should contain all the required context
  Here's some more info:

  Remember:
  - Go through the project folder first before any implementation or fixes
  - Give me the list of files to create with "touch", excluding prisma migration file. You should give me the migration command with the migration name for any schema related changes
  - Give me the code to copy-paste but if the changes are lengthy, give me the full updated code for the file. Any file that requires 4+ changes should be considered too long and the full updated code for that file should be provided.
  - If you need to run certain commands, give them to me with the expected output and I'd send you the logs to confirm everything is going as expected. Do this for all applicable including migrations and tests
  - Give me a detailed commit message after the phase is completed
  - Give me tests for implemented features to make sure they're returning the expected response
  - Update required parts of already implemented tests to fit any change that'd affect the test result
  - All this should come from one response unless there's an important context you need or architectural decision confirmation

  - But I have one rule change, write directly into the files, but list them in order first so I can go through the changes and understand the flow.

The tests have passed, now based on the changes made for the phase 3.8C Implementation, what do I need to check for to confirm everything was implemented correctly? I want to run the api and worker to test the changes, plus any other thing that needs to be checked


Below is the updated plan with only the clarified requirements incorporated.

# xoxoxoxo 

Tasks
- Go through PR and CodeRabbit summary
- Get more detailed README explanation in an OVERVIEW.md file
- Switch to live mode for payment and vtu provider
- Study OVERVIEW.md file to fully understand Swift Topup's architecture and be able to explain in simple terms to others
- Revamp portfolio

Request IDs
MTN Data: 202611070739c84887e75ff0448fbf51829bdd6a97b7
AIRTEL Data: 20261107081621f43f19f45540a9a98a6282dafb6b99
9MOBILE Data: 202611070817b91915954d9d4135b3e338e50f135a4c
GLO Data: 202611070815059e7bbbc4da4f5faab99d1927465616

MTN Airtime: 202611070756e902d0dca1564c3f8873c165c1cdaa37
AIRTEL Airtime: 202611070756c6b26a19ef9c4c3d8d9f5ba3505a40b8
9MOBILE Airtime: 202611070757c5866a8231794374bfcc405a890ae5cf 
GLO Airtime: 202611070814db3c2ed3309749e88ab4df4a124a8b07

IKEDC – Ikeja Electric API: 2026111009268d6a2f26a03f4385b69b8fb3fb5f7cad
EKEDC – Eko Electricity API: 202611100930352aea246a574f4fad3c5bebe0a3d6de
KEDCO – Kano Electricity API: 2026111009348d910b6b93ac4ecd845b9ef3afdc6ad2
PHED – Port Harcourt Electric API: 2026111009365bd732c1e1684c39acea9042cdefe324
JED – Jos Electricity API: 2026111009370118f116e86647a5b2c55a9210985d31
IBEDC – Ibadan Electricity API: 20261110093879d73480abd04f14aecc2638506a0369
KAEDCO – Kaduna Electric API: 202611100939b1910d2d501c491babc907da469be466
AEDC – Abuja Electric API: 202611100939c782d4c4cd5548a38cb6278a9d87fc4b
EEDC – Enugu Electric API: 20261110094216f72bdbd052492a8634043f6fd5eaff
BEDC – Benin Electric API: 20261110094376434098ad4346d697dc5b485785775a
ABA – ABA Electric API: 202611100943946d074e7a6d4941bc0690ad1702f927
YEDC – YOLA Electric API: 202611100944a162fd9e2a984f75a900a2579ec02f32

WAEC Result Checker: 20261110095163d5419cf51e4ce89406762749aac50f

DSTV Subscription API: 202611101001f9d674f771e84d8aa07e32f2749028e7
GOTV Subscription API: 2026111010020c00844567314e7d873527e1183b5a17
Startimes Subscription API: 202611101004263cd0fcec6f40a3803a53f23f25b2a5

Questions:
What does the stament "explicit current-package renewals retain renewal behavior. " mean? Line 144
Line 165: "A correctly matched, verified late payment may still settle an expired intent", how do I fix this?
Line 188: "Timeout, connection error, 5xx, malformed success or a database error after provider creation leaves uncertainty. It does not trigger immediate replacement checkout or failover. A provider may already have accepted the request.", we need to fix this, once a provider generates an account and the response from the provider is uncertain, since the account has not been sent to the user, we should attempt to use the 2nd provider. It's better for less unpredictability and swift response to the user.
Line 196: "Unknown Bachs checkouts, mismatched amounts/references and missing or insufficient settlement evidence produce REVIEW receipts without guessing a wallet owner. Some invalid/unsupported payloads are ignored before receipt creation; not every rejected event becomes a review row.", we need to fix this, any mismatch should be saved for a review, it's a better experience for the customer.
Line 197: "New wallet credits invalidate the local summary cache and attempt a durable outbound confirmation. Notification creation occurs after the financial commit; notification failure is logged without reversing the credit.", I don't really understand this, but if the amount was not received, we should not credit the user's wallet or the credit should be reversed.
Line 206: "Bachs live processing requires final fee evidence. When an eligible signed collection has conflicting settlement evidence or no usable fee, the Bachs adapter retrieves its charge through authenticated GET /v1/payments/{charge_id} before opening the wallet transaction.", what does this mean? Also if a user attempts to deposit 1k and the total to be paid is 1,015.23, but they end up paying 1500, what would happen to the overdraft? Do I need to handle that exception?
"Failed, unavailable, incomplete or mismatched verification preserves the original deposit evidence. Conflicts remain REVIEW receipts with reason DEPOSIT_SETTLEMENT_CONFLICT; unresolved missing fees produce DEPOSIT_SETTLEMENT_MISSING. A later provider-supported signed redelivery can retry verification.", is there a better way to resolve conflicting payments? So users funds is not held for a long period incase of mistakes from their end.
"A positive merchant fee accompanied by settlement equal to gross may be accepted only in test mode with a sandbox key and saved sandbox checkout URL. The saved Bachs checkout ID, funding reference, currency and quoted gross must match exactly, and gross minus the reported fee must cover the saved requested wallet credit.", this statement is a bit confusing, break it down for me to understand better. Also, if there's a slight miscalculation in kobo that increases the amount the user would receive (e.g 1,000.10 instead of 1,000.00), we should credit the user. The only time there should be a conflict to resolve is if it's underpaid, it's a drastically different amount (e.g 3k paid instead of 1k). And for any drastic amount, we should be able to handle it with what bachs provides.
"REVIEW receipts require operator investigation using database/provider evidence. There is no funding-review UI or general replay endpoint. Correct the underlying issue and use provider-supported signed redelivery where appropriate; never manually guess ownership from amount, email, payer narration or timing.", to avoid any major dispute in the future, we need to have a UI on the admin dashboard for checking funding under review, it needs it's own page and it should suit the already established theme of the app
"Legacy airtime/data clients may use expectedPrice instead; stale prices fail before debit.", what does this mean?
"A single database transaction creates the purchase, posts the wallet debit and stores a durable fulfillment job. Insufficient funds or any transaction failure rolls all of these back.", is this the best way to do it? What if we checked the user's balance before attempting to execute the transaction?
I want users to be able to view their purchase history on their affiliate dashboard. We need to add a purchase history section to the current affiliate dashboard, and when the user clicks "View more", it takes them to the pagination page of the dashboard. This page doesn't need to be a "new page", it should be part of the sidebar menu.
264*
"Verified delivery records Purchase.completionNotificationPending in the same transaction as the purchase result. The commerce worker schedules a purchaser notification immediately and reconciliation recovers interrupted scheduling. WhatsappOutboundMessage.deduplicationKey prevents repeated callbacks or competing notification attempts from creating another completion message. Existing messaging recovery publishes queued outbox rows every five seconds; successful delivery therefore does not require another inbound purchase-status command. WhatsApp transport retries retain the existing delivery semantics.", I'm struggling to understand this
"Operational limits: scheduling coordination is process-local, so run one scheduler worker per environment. Sync can reactivate provider-listed products previously hidden by an administrator. Refresh cannot detect an outage for a product still listed by VTPass; verification/purchase errors must be handled separately.", if a product is not available but listed by VTPass, that should not be too much of an issue, cuz once the user tries to purchase the product, VTPass gives us an error response. Don't we handle the verification/purchase errors already?



