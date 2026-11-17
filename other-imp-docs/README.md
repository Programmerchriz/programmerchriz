# SwiftTopUp API and Worker

SwiftTopUp is a WhatsApp-first Nigerian VTU platform. Customers fund an NGN wallet, select a service, confirm the charge, and receive fulfillment through the configured provider. The code supports airtime, data, electricity, cable TV, and selected exam products, with separate public/affiliate and administration React applications.

This README is the main implementation and operations guide. It describes inspected source as of **2 November 2026**, not evidence of a completed live launch. Provider approvals, deployed credentials, VM configuration, and successful live transactions require separate verification. Tests were inspected, but were not executed for this documentation update.

## Reading this workspace

- [Client README](../client/README.md): public website and affiliate dashboard.
- [Admin README](../admin/README.md): operations dashboard and frontend setup.
- [Project phases](../PHASES.md): implementation history and planned work; historical completion statements are not test results.
- [Documentation index](../docs/README.md), [SOD](../docs/SwiftTopUp-SOD.pdf), [SAD](../docs/SwiftTopUp-SAD.pdf), [EIG](../docs/SwiftTopUp-EIG.pdf), and [implementation guide](../docs/SwiftTopUp-EIG-implementation.pdf): product requirements and architectural intent.
- [Security runbook](docs/phase-3.8-a-security.md): application controls and example edge configuration. Its deployment examples and dated audit findings do not establish current production state.

`api/`, `client/`, and `admin/` are separate application directories with their own packages; the inspected workspace contains separate Git repositories. Run package commands in the relevant directory. Parent-relative documentation links assume the workspace layout below; those documents may be unavailable in an API-only checkout.

## Implemented capabilities and launch status

| Area              | Implemented in source                                                                                                                                                       | Boundary or activation requirement                                                                                                                                                  |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Identity          | REST registration/login, JWT access tokens, refresh sessions, WhatsApp identity creation/linking, password and username changes                                             | Live WhatsApp credentials are needed for actual bot and credential delivery.                                                                                                        |
| Wallet funding    | Bachs hosted transfer checkout, Paystack temporary transfer instructions, optional Paystack permanent accounts, funding contact persistence, fee quotes and signed webhooks | Real provider settings and settlement payloads must be verified. Permanent account creation is disabled by default.                                                                 |
| Airtime/data      | MTN, Airtel, Glo and 9mobile catalog, selection, quotes, wallet debit and fulfillment                                                                                       | VTPass account activation, service access, balance and current catalog determine live availability. Generated airtime denominations are NGN 100, 200, 500 and 1,000.                |
| Electricity       | Prepaid/postpaid products for Ikeja, Eko, Abuja, Kano, Enugu, Port Harcourt, Ibadan, Kaduna, Jos, Benin, Yola and Aba                                                       | Meter verification and explicitly verified per-service fees are required. A listed service is not proof the biller is reachable.                                                    |
| Cable TV          | DSTV, GOtv and StarTimes packages; verified DSTV/GOtv renewal amounts                                                                                                       | StarTimes renewal is unavailable; select a package.                                                                                                                                 |
| Exam products     | WAEC result checker, WAEC registration and available JAMB variations                                                                                                        | Current provider variations and verification rules apply. NECO and NABTEB are not implemented.                                                                                      |
| Messaging         | Durable text intake, conversation state, deterministic commands, optional AI intent interpretation, confirmation, outbound attempts and delivery statuses                   | Voice/audio is not implemented. Some funding follow-ups require the optional AI path.                                                                                               |
| Referrals/rewards | Referral codes and attribution, qualification, versioned profit-share policies, separate reward balances, affiliate reporting                                               | No reward payout, withdrawal, transfer into the spending wallet, or credited-reward reversal workflow.                                                                              |
| Administration    | RBAC, KPIs, users/wallets/purchases/funding/product views, sync and visibility controls, exceptions and rewards APIs                                                        | Some health views report configuration or `UNKNOWN`, rather than probing worker/provider readiness. Rewards management has backend APIs but no corresponding admin rewards screens. |

### Current operational context

The following account and launch facts were supplied by the project owner for this update; they were not verified against remote accounts:

- Paystack returned `feature_unavailable` for Dedicated NUBAN on the current business account. Keep `PAYSTACK_PERMANENT_ACCOUNTS_ENABLED=false` until the necessary registration and provider approval are obtained.
- The intended permanent-account bank is `titan-paystack`. `PAYSTACK_PREFERRED_BANK` is used for dedicated account creation; it does not configure temporary `/charge` funding.
- VTPass identity verification is pending. Implemented adapters do not establish live account approval or completed live tests.
- Redis has moved to Upstash. The application uses the native Redis TCP/TLS URL, not Upstash's REST API. Deployment connectivity still requires verification.
- A separate fresh production PostgreSQL database has been created. Initialize it with the configured migrations; do not import old users or balances.
- Production settings are to be updated in the VM's environment before deployment. Local `.env.production` does not automatically configure the VM or systemd.

Paystack documents DVA availability for registered businesses that have completed its go-live process, with additional customer validation for some business categories. See [Dedicated Virtual Accounts](https://paystack.com/docs/payments/dedicated-virtual-accounts/). The current adapter does not implement a complete customer KYC flow merely because the request schema accepts BVN-related fields.

## Repository and architecture

```text
swift-topup/
├── api/                         # Backend repository; this README
├── admin/                       # Operations React application
├── client/                      # Public site and affiliate React application
├── docs/                        # Product/architecture/implementation documents
└── PHASES.md

api/
├── prisma.config.ts             # CLI database URL and migration directory
├── prisma/
│   ├── schema.prisma
│   ├── migrations/              # Configured migration history
│   └── generated/               # Generated Prisma client; do not hand-edit
├── src/
│   ├── config/                  # Validated environment, Prisma, Redis
│   ├── domains/
│   │   ├── identity/
│   │   ├── wallet/
│   │   ├── commerce/
│   │   ├── messaging/
│   │   ├── rewards/
│   │   └── administration/
│   ├── infra/
│   │   ├── ai/                  # Optional intent gateway and adapters
│   │   ├── payments/            # Bachs, Paystack, mock, routing and fees
│   │   ├── vtu/                 # VTPass and mock providers
│   │   ├── messaging/           # WhatsApp Cloud and mock outbound adapters
│   │   ├── queues/              # Active Redis Streams, workers and scheduler
│   │   ├── database/
│   │   └── redis/
│   ├── routes/                  # /api/v1 route composition
│   ├── scripts/                 # Admin bootstrap and reward policy seed
│   ├── shared/                  # HTTP, logging, caches, shutdown helpers
│   ├── app.ts
│   ├── server.ts                # HTTP entry point
│   └── worker.ts                # Messaging + commerce worker entry point
├── test/
└── .github/workflows/ci.yml
```

The backend uses Node.js, Express, strict TypeScript, Zod, PostgreSQL, Prisma 7 with the PostgreSQL driver adapter, and ioredis. Both frontends use React, TypeScript and Vite.

```mermaid
flowchart LR
  WA[WhatsApp Cloud API] --> API[Express API]
  Web[Public affiliate and admin apps] --> API
  API --> Domains[Shared domain services]
  Worker[Worker process] --> Domains
  Domains <--> PG[(PostgreSQL)]
  Domains <--> Redis[(Redis state and streams)]
  Domains --> Payments[Bachs / Paystack]
  Domains --> VTU[VTPass]
  Domains -. Optional intent interpretation .-> AI[Configured AI providers]
  Worker --> WA
```

This is a modular monolith: one backend codebase, shared domain services and database, with separate HTTP and worker processes. It avoids separate network services for each domain while allowing business modules and provider adapters to evolve independently. It is not a microservice deployment.

Routes apply authentication, authorization and Zod validation. Controllers translate HTTP requests and responses. Services implement business rules and coordinate other domains through their services. Repositories own persistence; provider adapters translate external APIs. Commerce receives a wallet debit operation inside its transaction so purchase creation and financial posting commit together.

### Processes and storage

| Component               | Responsibility                                                                                                                                                  |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| API, `src/server.ts`    | REST, webhook validation/persistence, authentication, domain calls and asynchronous inbound processing scheduling.                                              |
| Worker, `src/worker.ts` | Outbound WhatsApp stream, pending inbound recovery, commerce fulfillment/refunds, reconciliation, referral/reward recovery, funding expiry and catalog refresh. |
| PostgreSQL              | Durable users/sessions, wallet ledger, funding requests/receipts, products/purchases/jobs/attempts, messaging records, referrals/rewards and audit logs.        |
| Redis                   | Conversation state, admission counters, AI budgets/limits, payment cooldowns, outbound and commerce streams and stream retry bookkeeping.                       |
| Local process caches    | Five-minute sliding wallet-summary cache; invalidation is local to the process. Purchase history reads PostgreSQL on every request.                              |

**Active processing uses Redis Streams and PostgreSQL jobs, not BullMQ workers.** BullMQ remains a dependency and `infra/queues/queues.ts` contains an unused queue definition; the running API/worker paths do not import it. Inbound messages are durable database events, not an inbound Redis Stream.

| Active stream                     | Consumer group                | Purpose                                                          |
| --------------------------------- | ----------------------------- | ---------------------------------------------------------------- |
| `swifttopup:whatsapp:outbound`    | `swifttopup-whatsapp-senders` | Text replies and typing indicators.                              |
| `swifttopup:commerce:fulfillment` | `swifttopup-commerce-workers` | Fulfillment/refund job IDs and referral qualification event IDs. |

Both consumers use blocking `XREADGROUP`, acknowledgement with `XACK`, and pending-entry recovery with `XAUTOCLAIM`. Blocking reads wait up to 30 seconds; pending entries become reclaimable after 30 seconds, with reclaim checks approximately every 60 seconds. These are code constants, not environment settings.

WhatsApp failures have a three-attempt stream policy and `swifttopup:whatsapp:outbound:dlq`. Commerce declares similar constants but does not actively implement a commerce DLQ or three-attempt cap. Unresolved commerce jobs remain subject to database recovery/requery.

## End-to-end workflows

### Inbound WhatsApp message to outbound delivery

1. Meta calls `POST /api/v1/messaging/whatsapp/webhook`. Express captures the original JSON bytes for signature verification. Global IP admission runs before domain routes; the route verifies `X-Hub-Signature-256` before its WhatsApp-specific limiter and payload processing.
2. Text messages are inserted as `WhatsappInboundEvent` records, deduplicated by provider message ID. A database conversation sequence orders received events for each WhatsApp identity. Delivery-status updates are also persisted where their outbound provider ID is already known.
3. The API acknowledges with HTTP 200 after persistence, then processes asynchronously. A worker recovery timer checks pending inbound events every five seconds. Database claims prevent another process from simultaneously processing the same claimed event.
4. Identity resolves the WhatsApp ID, links a known phone where appropriate, or creates a WhatsApp-first user with a wallet. Disabled users are rejected.
5. Messaging uses Redis conversation state, explicit commands, billing handlers and, when enabled, the intent gateway. Financial details are resolved and validated by services, and purchases require confirmation.
6. Text replies create durable outbound database records before Redis enqueue. The sender worker records attempts, calls the WhatsApp adapter, persists the provider message ID/status and acknowledges the stream entry.
7. Meta's later sent/delivered/read/failed callbacks update delivery state. Provider acceptance (`SENT`) is not proof the customer read or received the message.

Inbound states are `RECEIVED → PROCESSING → PROCESSED`, with `FAILED` eligible for recovery and stale processing leases reclaimable after five minutes. Ordering follows the database's receipt sequence, not a guarantee that Meta delivers events in original sender order.

Outbound recovery re-enqueues queued database records whose stream ID is absent. Pending stream entries are reclaimed after interruption. This is at-least-once processing: a crash after external acceptance but before local persistence can produce a duplicate send. There is no distributed exactly-once guarantee, automatic DLQ replay, or stream trimming policy.

### Conversation behavior and AI boundary

Electricity, cable TV and exam-PIN requests are parsed deterministically when their intent is clear. The bot retains supplied provider, product, account, amount, meter type and quantity details while collecting missing information. Provider aliases and product descriptions are resolved against the active catalog; ambiguous choices remain explicit menus. Corrections invalidate the previous verification summary and signed quote, then require fresh verification and confirmation. Named cable packages select a package change; explicit current-package renewals retain renewal behavior. Once submission begins, uncertain purchases retain their original signed quote and cannot be edited into a different purchase.

Commands include registration, balance, wallet funding, airtime/data browsing, funding/purchase status, cancellation, referral/reward reporting and affiliate access. The legacy purchase menu captures a displayed option, recipient phone and explicit confirmation. Billing handlers collect meter/smartcard/profile details and verify them before a signed quote is confirmed.

Conversation state expires after ten minutes. AI purchase drafts and signed purchase quotes have five-minute validity windows. A conversation timeout does not cancel an already committed purchase or erase stored funding contact details.

The optional gateway is actually wired through [conversation-intent.service.ts](src/domains/messaging/conversation-intent.service.ts). It supports Gemini, Groq, Cerebras, Hugging Face and DeepSeek, with structured intent validation, confidence checks, rollout gates, budgets, provider limits, circuit breakers and phone redaction. **There is no OpenAI adapter or active OpenAI integration in this source.**

`AI_ENABLED=false` is the default. Unknown natural-language input then falls back to help. There is also a current gap: `fund wallet` starts an amount prompt, but subsequent replies in that funding flow are routed through AI interpretation. Do not assume the entire funding conversation works in deterministic-only mode. The REST funding service remains available independently of AI. Live AI enablement, chosen models and complete bot journeys require configuration and operational testing.

AI returns intent; it cannot authorize a debit. The server resolves active products, recipient, price, user ownership, expiry, available funds and idempotency. The existing AI `SELF` recipient scope resolves the sender's phone; saved names such as “Ebuka” have no contact-book lookup.

### First-time and returning wallet funding

With the conversational intent path enabled:

1. A funding intent collects the desired wallet credit and missing email, first name and last name. Missing fields can be requested together. The bot does not infer funding names from the WhatsApp display name.
2. The draft uses explicitly supplied values first, then saved wallet funding contact values. Login email is only a final email fallback where no funding email is available.
3. The wallet service validates and saves `fundingEmail`, `fundingFirstName` and `fundingLastName` on `Wallet` before provider initialization. They survive failed or abandoned funding and conversation expiry. Saving them does not change `User.email`, login credentials or wallet ownership.
4. A returning user reuses those details and supplies only missing information/amount. The REST route still expects its complete validated customer body; the bot hydrates that body internally.
5. If the wallet already has an active permanent account, it is returned. Otherwise the service selects a temporary funding route, calculates its fee quote and persists the funding request before calling the provider.
6. Bachs returns a hosted checkout URL restricted to `NGN_BANK_TRANSFER`; its hosted page supplies payment instructions. Paystack temporary funding calls `/charge` and returns temporary bank details. The mock adapter supplies synthetic instructions but does not automatically credit money.

Temporary funding requests nominally expire after 30 minutes; a provider-returned expiry takes precedence. The worker expires overdue intents at startup and on its configured cleanup interval. A correctly matched, verified late payment may still settle an expired intent.

Keep these fields distinct:

| Field                  | States                                       | Meaning                                              |
| ---------------------- | -------------------------------------------- | ---------------------------------------------------- |
| `FundingIntent.status` | `PENDING`, `SUCCESSFUL`, `FAILED`, `EXPIRED` | Payment outcome/lifetime.                            |
| `initializationStatus` | `CREATING`, `READY`, `REJECTED`, `UNKNOWN`   | Whether remote instructions were safely initialized. |

An optional request `idempotencyKey` scopes a stable reference to the wallet. WhatsApp uses its inbound message ID. Reusing ready instructions returns the same result; a changed amount conflicts. A creating/unknown result returns `FUNDING_INITIALIZATION_PENDING` rather than making another remote request. Already-paid or expired instruction reuse is rejected. There is no automatic provider polling/recovery for unknown funding initialization; inspect the stored reference and provider dashboard.

### Fees, routing and payment confirmation

Temporary `amount` means **desired wallet credit**. The application calculates `feeAmount` and `totalPayable` using integer-kobo gross-up, including fees on the gross amount, Paystack's flat-fee threshold and caps. For example, Bachs defaults produce credit `1000.00`, fee `15.23`, payable `1015.23`. Funding fees do not become spendable wallet credit.

The configured fee must be deducted from the merchant's gross receipt; do not also enable provider-side customer fee pass-through. Verify that checkout requests exactly `totalPayable`. Sender-bank charges are outside this quote. Permanent-account deposits credit the received amount less the reported processing fee, with configured permanent pricing used if Paystack omits the fee.

Routing is asymmetric:

- `PAYMENT_PROVIDER=mock`: mock only.
- `paystack`: Paystack only.
- `bachs`: Bachs first, optionally Paystack fallback. Redis shares cooldown state across processes, scoped to payment mode/provider.
- A known Bachs cooldown routes a new request to Paystack when enabled. Explicit Bachs HTTP 401/403/429 initialization rejection can trigger same-request fallback with a new fee calculation.
- Timeout, connection error, 5xx, malformed success or a database error after provider creation leaves uncertainty. It does **not** trigger immediate replacement checkout or failover. A provider may already have accepted the request.

For payment completion:

1. Source-specific webhook routes verify raw-body signatures independently of the currently selected primary provider.
2. Bachs processes eligible NGN `collection.succeeded` / `SUCCEEDED` events for `BACHS_ACCOUNT_ID`. `checkout.completed` is not wallet payment evidence. Paystack processes eligible NGN `charge.success` transfer events.
3. Normalized deposits use a unique `(provider, providerReference)` receipt. Receipt matching/claiming, funding-intent claim and balanced wallet credit share a database transaction. Duplicate callbacks reuse one financial result.
4. Temporary attribution checks the saved checkout/reference, currency, exact payable amount and adequate net settlement. A second distinct payment for an already-claimed intent is reviewed. Paystack permanent deposits must identify a known active account.
5. Unknown Bachs checkouts, mismatched amounts/references and missing or insufficient settlement evidence produce `REVIEW` receipts without guessing a wallet owner. Some invalid/unsupported payloads are ignored before receipt creation; not every rejected event becomes a review row.
6. New wallet credits invalidate the local summary cache and attempt a durable outbound confirmation. Notification creation occurs after the financial commit; notification failure is logged without reversing the credit.

The fee shown before checkout is an upfront quote used to calculate the gross
payment required for the requested wallet credit. After payment, funding checks
use Bachs-reported NGN fee/settlement evidence, including authenticated payment
retrieval when live recovery is required. The quoted percentage is not treated
as an observed final processing fee. USD amounts are not substituted for NGN
fees, and fee-rounding excesses do not increase the saved requested wallet credit.

Bachs live processing requires final fee evidence. When an eligible signed
collection has conflicting settlement evidence or no usable fee, the Bachs
adapter retrieves its charge through authenticated
`GET /v1/payments/{charge_id}` before opening the wallet transaction.

Recovery requires a fully paid, successful NGN bank-transfer payment matching
the collection's charge ID, checkout ID, funding reference, currency and exact
gross amount. The adapter uses the payment's NGN `fees.amount` and
`fees.currency`, with `fee_paid_by=merchant`. Split payments are not supported
by this recovery path. The API key must permit payment retrieval.

Failed, unavailable, incomplete or mismatched verification preserves the
original deposit evidence. Conflicts remain `REVIEW` receipts with reason
`DEPOSIT_SETTLEMENT_CONFLICT`; unresolved missing fees produce
`DEPOSIT_SETTLEMENT_MISSING`. A later provider-supported signed redelivery can
retry verification.

Two narrowly scoped sandbox compatibility cases are supported:

- Missing final fees may use the saved quote under the existing test-mode,
  sandbox-key and saved-sandbox-checkout checks.
- A positive merchant fee accompanied by settlement equal to gross may be
  accepted only in test mode with a sandbox key and saved sandbox checkout URL.
  The saved Bachs checkout ID, funding reference, currency and quoted gross
  must match exactly, and gross minus the reported fee must cover the saved
  requested wallet credit.

The gross-settlement exception handles observed sandbox payloads; it is not
used as a live settlement rule. Neither sandbox case bypasses signature,
account, ownership, funding-intent claim or financial idempotency checks.

All money comparisons use integer kobo. A matched checkout credits its saved
requested wallet amount only when the applicable evidence permits it. Small
fee-rounding excesses do not increase the requested credit.

A reviewed charge can complete once after valid recovery. Previously credited
charges retain their credited status on redelivery. Events previously ignored
before receipt creation require provider-supported signed redelivery.

`REVIEW` receipts require operator investigation using database/provider evidence. There is no funding-review UI or general replay endpoint. Correct the underlying issue and use provider-supported signed redelivery where appropriate; never manually guess ownership from amount, email, payer narration or timing.

Sources: [wallet service](src/domains/wallet/wallet.service.ts), [repository](src/domains/wallet/wallet.repository.ts), [routing](src/infra/payments/payment-provider.router.ts), [fee arithmetic](src/infra/payments/funding-fees.ts).

### Browsing, confirmation, debit, fulfillment and receipt

1. Product sync imports the selected provider's catalog. Customer listing includes active products with usable pricing; deterministic data ranking and normalized descriptions drive WhatsApp menus.
2. The customer selects a product and recipient. Stored option IDs preserve the mapping between displayed numbers and products even when the catalog changes. Unavailable selections require restarting selection.
3. Electricity meters, cable smartcards and JAMB profiles are verified before quoting. Electricity amounts must satisfy provider limits. WAEC allows quantity 1–10; JAMB requires one verified profile and the approved published amount with zero added provider fee.
4. `POST /commerce/purchases/quote` returns a five-minute, user-bound signed quote containing immutable product/provider/environment, recipient/bill parameters, face amount, verified fee and retail charge.
5. The customer explicitly confirms. The service checks the signed details, active product and current provider/environment. Legacy airtime/data clients may use `expectedPrice` instead; stale prices fail before debit. Electricity, cable and exam purchases require a quote token.
6. A single database transaction creates the purchase, posts the wallet debit and stores a durable fulfillment job. Insufficient funds or any transaction failure rolls all of these back.
7. Redis enqueue wakes the commerce worker. A failed enqueue does not erase the committed job; reconciliation finds and re-enqueues it. New HTTP purchases return 202, usually `PENDING`, with a purchase ID; duplicate requests return 200 with the existing result.
8. Before the first external call, the worker persists its claim and a stable VTPass request ID using the Lagos date prefix. It sends the snapshotted provider code, amount and bill parameters.
9. Delivered results store the receipt and actual supplier debit. Definitive failure creates a refund job. Uncertain results are requeried using the same request ID.
10. WhatsApp initially reports a queued transaction. Verified completion queues an automatic receipt notification for the purchaser's linked WhatsApp account. Final status and available receipts also remain accessible through `purchase status` and owner-authenticated purchase history.

Receipts can include prepaid electricity token/units/KCT1/KCT2 and exam PIN/serial/token data. These are sensitive customer fulfillment values; examples and logs should not publish real receipts.

### Pending results, refunds and reconciliation

A timeout does not prove failure. VTPass may have accepted a purchase before the connection failed. The worker attempts requery, then persists `AWAITING_REQUERY` when the result remains uncertain. Later processing **requeries the original request**, rather than purchasing again, changing supplier or crossing sandbox/live environments.

```mermaid
flowchart TD
  Confirm[Confirmed quote] --> Tx[Purchase + wallet debit + durable job]
  Tx --> Call[One initial provider submission]
  Call -->|Delivered, complete evidence| Success[Successful and settled]
  Call -->|Timeout or ambiguity| Pending[Awaiting requery]
  Pending --> Requery[Requery original request ID]
  Requery -->|Still uncertain| Pending
  Requery -->|Delivered, complete evidence| Success
  Call -->|Definitive failure| Refund[Durable refund job]
  Requery -->|Definitive failure or observed reversal| Refund
  Refund --> Refunded[Idempotent full-charge refund]
```

Purchase statuses are `PENDING`, `SUCCESSFUL`, `FAILED` and `REFUNDED`; fulfillment jobs separately track `QUEUED`, `PROCESSING`, `AWAITING_REQUERY`, `SUCCEEDED` and `FAILED`.

A delivered purchase can be `SUCCESSFUL` while its job still awaits requery for missing actual supplier debit, conflicting cost, missing prepaid token or incomplete exam PIN quantity. A financial exception remains open, and completed settlement/reward qualification is withheld. Delivery and financial completeness are separate facts.

Refund jobs return the **stored full customer charge**, once, through the wallet ledger. Failures remain recoverable and visible as exceptions. Refund qualification events subtract previously applied referral spend. They do not implement a reversal of an already credited affiliate reward.

Startup and periodic reconciliation reset stale job leases, discover due jobs, reconstruct missing jobs for debited pending purchases, recover missing refunds and referral events, and flag ledger inconsistencies. Financial exception fingerprints avoid creating a new exception for the same finding on every scan. Attempt fencing prevents stale claim results from overwriting newer processing.

VTPass notifications use `POST /api/v1/commerce/webhooks/vtpass`. Register `https://YOUR_API_HOST/api/v1/commerce/webhooks/vtpass` in the VTPass account for the matching environment. The published callback contract has no signature; callback contents never authorize fulfillment, a refund or a wallet mutation. A validated notification durably schedules an existing matching transaction for authenticated requery, then returns HTTP 200 with `{"response":"success"}`. Notices received during an active attempt are retained and scheduled after that attempt finishes. Reconciliation publishes the due job, so the handler does not wait for provider calls or enqueue to Redis; the existing global admission limiter still requires Redis. Unknown references, repeated notifications and variation notifications do not create purchases. Verified reversals use the existing refund path. Internal reconciliation does not replace comparing provider statements, bank settlement and ledger records.

Sources: [fulfillment](src/domains/commerce/commerce.fulfillment.service.ts), [reconciliation](src/domains/commerce/commerce.reconciliation.service.ts), [commerce worker](src/infra/queues/commerce.worker.ts), [VTPass requery documentation](https://vtpass.com/documentation/re-query-services/) and [response-code guidance](https://vtpass.com/documentation/response-codes/).

### Purchase completion notifications and selectable WhatsApp catalogs

Numbered airtime/data catalogs retain the exact displayed product IDs and ordering
for ten minutes. Replies such as `12` or `Option 12 to 08011111111` resolve against
that stored list. A selected plan remains selected while the recipient is collected.
A uniquely described size in that list, including `1TB` (1000GB), can also select a
plan. Availability and the current price are checked before a new five-minute
confirmation is shown. Selecting a menu row never submits a purchase by itself.

Verified delivery records `Purchase.completionNotificationPending` in the same
transaction as the purchase result. The commerce worker schedules a purchaser
notification immediately and reconciliation recovers interrupted scheduling.
`WhatsappOutboundMessage.deduplicationKey` prevents repeated callbacks or competing
notification attempts from creating another completion message. Existing messaging
recovery publishes queued outbox rows every five seconds; successful delivery
therefore does not require another inbound purchase-status command. WhatsApp
transport retries retain the existing delivery semantics.

Completion messages go to the purchaser's linked WhatsApp identity and include the
stored product name, charge, reference and available receipt fields. Required
prepaid tokens or exam PINs must be present before those completion messages are
scheduled. Missing settlement costs continue through reconciliation independently
of a complete delivery receipt. Historical rows start with the pending flag false.

Register the matching VTPass account's callback as
`https://YOUR_API_HOST/api/v1/commerce/webhooks/vtpass`. It acknowledges validated
notifications with `{"response":"success"}` and schedules authenticated requery;
callback content is not treated as financial proof. Reconciliation also works when
callbacks are delayed or absent.

Create migration `purchase_completion_outbox` against a development database and
commit its generated migration directory. API CI applies the full migration history
to its temporary PostgreSQL database and runs the completion-outbox integrity tests.
VM deployment loads `/home/ubuntu/swifttopup-api/.env`, generates/builds, runs
`migrate deploy` and `migrate status`, then restarts both services. Both systemd
units must use that same EnvironmentFile. A migration failure stops before restart.

No additional environment variables are required. Notifications currently use the
existing text-message provider; completion after WhatsApp's customer-service window
requires an approved utility template, which this change does not configure.

### Catalog synchronization and presentation

With `VTU_PROVIDER=vtpass`, the worker starts a catalog sync after both consumers are ready, then every **five minutes**. [product-sync.scheduler.ts](src/infra/queues/product-sync.scheduler.ts) prevents overlap within that worker, logs success/failure, retries at the next interval and waits for an active sync during shutdown. The interval is fixed in code.

Manual operator/admin sync uses the same commerce service. Changes to fees require a re-sync. Missing provider products become inactive; conflicting variation identities and unparseable data offers are quarantined rather than guessed. Data sync starts from the provider face price so markup does not compound.

Existing ranking uses exact provider price per GB, network, size/validity/restriction buckets, deterministic ties and social-offer representatives. Specific-size searches inspect the full matching bucket and can show up to two alternatives with different validities. This is explainable catalog selection, not measured popularity from purchase volumes.

WhatsApp uses normal text with bold network/section headings, `POPULAR`/`OTHERS` where appropriate, continuous selection numbers and message splitting around complete plan entries. Long catalogs are not limited to the first twenty products. Bonus allowances and night/app/tariff/device restrictions are retained. Unknown or conflicting validity is omitted from customer messages and kept in internal metadata; no invented 30-day default is displayed.

Operational limits: scheduling coordination is process-local, so run one scheduler worker per environment. Sync can reactivate provider-listed products previously hidden by an administrator. Refresh cannot detect an outage for a product still listed by VTPass; verification/purchase errors must be handled separately.

## Financial correctness and accounting

### Double-entry wallet

Each NGN wallet has `WALLET_BALANCE`, `FUNDING_CLEARING`, `PURCHASE_CLEARING` and `ADJUSTMENT_CLEARING` accounts. The service checks equal debit/credit totals before posting.

| Operation       | Debit               | Credit              |
| --------------- | ------------------- | ------------------- |
| Funding         | `FUNDING_CLEARING`  | `WALLET_BALANCE`    |
| Purchase        | `WALLET_BALANCE`    | `PURCHASE_CLEARING` |
| Purchase refund | `PURCHASE_CLEARING` | `WALLET_BALANCE`    |

Available balance is ledger credits minus debits on the balance account. Persisted monetary values use Prisma Decimal/PostgreSQL decimal; funding arithmetic uses integer kobo. This is application wallet accounting, not a claim of a complete company treasury/general-ledger system.

For concurrent spend protection, the transaction updates `Wallet.mutationVersion`, acquiring the wallet row lock, before reading funds and posting the debit. Another transaction must wait and re-evaluate funds after the earlier mutation. The ledger validates postings and writes transaction/entries atomically; Redis is not the financial lock or balance authority.

Unique wallet transaction keys, provider deposit identities, purchase keys, job identities and refund keys make repeat processing reuse existing financial outcomes. Signed quote IDs define one purchase intent while valid. A new quote/key defines another intent; a pending purchase must be checked using its original ID rather than retried as an unrelated purchase.

See [wallet.ledger.ts](src/domains/wallet/wallet.ledger.ts), [wallet.repository.ts](src/domains/wallet/wallet.repository.ts) and [commerce.repository.ts](src/domains/commerce/commerce.repository.ts).

### Retail price versus settlement

For VTPass products, the shared pricing helper calculates:

- **DATA:** round upward to whole NGN after `(provider face amount × 1.10) + verified fixed provider fee`.
- **Other services:** round upward to whole NGN after `provider selling amount + verified fixed provider fee`, without a SwiftTopUp percentage markup.
- **Mock catalog:** its configured prices, without VTPass's data markup.

For example, a DATA face amount of `1499.01` with zero verified fee produces retail `1649.00`. Customer menus and new quotes use the same helper. Existing signed quotes retain their confirmed charge until expiry; historical purchases/refunds retain the original charge.

A provider convenience fee, wallet funding fee, SwiftTopUp markup and supplier commission are different amounts. Final supplier cost comes from delivered VTPass transaction `total_amount`, not an assumed catalog price or estimated commission. Platform profit is the customer charge less actual provider debit. Missing cost stays unavailable and is surfaced in settlement/metrics, rather than treated as zero profit cost. See [commerce.pricing.ts](src/domains/commerce/commerce.pricing.ts) and [VTPass commission documentation](https://vtpass.com/documentation/understanding-how-vtpass-commission-works/).

### Referrals and rewards

Referral codes and immutable attribution are implemented. A referred user's cumulative qualifying successful, non-refunded spend reaches qualification at NGN 1,000. Durable qualification events and unique purchase/event identities prevent double application.

Versioned policies snapshot the tier and profit share used for eligible settled purchases. The initial policy seed defines:

| Confirmed referrals | Tier                | Share of positive platform profit |
| ------------------- | ------------------- | --------------------------------- |
| 30–59               | `T1`                | 5%                                |
| 60–149              | `T2`                | 10%                               |
| 150–299             | `T3`                | 15%                               |
| 300+                | `AFFILIATE_PARTNER` | 40%                               |

These are seeded application policy values, not an immutable promise: review the active database policy. Settlement cost must be known, and reward credits use transactional account locking and a pending-to-credited claim. Processing can be suspended/reconciled through admin-only controls.

`ReferralRewardBalance` is separate from the spendable wallet. No payout, withdrawal, reward-to-wallet transfer or credited-reward reversal exists. Refunded purchases can reduce qualification spend and downgrade qualification, but reporting currently returns zero reversed rewards. Do not describe all cashback or reversal plans in historical documents as completed.

### Guarantee boundaries

Implemented protections include balanced application postings, database transactions, wallet serialization, unique identities, durable jobs, claims, result fencing and requery. They do not establish distributed exactly-once processing or provider fulfillment guarantees.

Wallet summaries have a five-minute **sliding**, per-process cache. Invalidation in the worker does not invalidate another API process's wallet cache, so displayed balances may lag; debit decisions still read authoritative transactional ledger state. Purchase history reads PostgreSQL on every request so status changes and delivered receipts from a separate worker are visible on the next read.

## Configuration and provider setup

[.env.example](.env.example) is a template; [env.ts](src/config/env.ts) is the validation/default source of truth. The tables below describe code defaults. The example explicitly overrides some defaults, including global/authentication rate limits. Empty optional secrets are treated as absent. Use placeholders in shared documentation and never copy real credentials into a README or frontend bundle.

### Environment loading

| Execution context | Actual loading behavior                                                                                                                                                                                                                      |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| API/worker        | `dotenv/config` loads `.env` relative to the process working directory. Existing process environment values take precedence.                                                                                                                 |
| Prisma CLI        | `prisma.config.ts` imports `dotenv/config`, reads `DATABASE_URL`, and selects `prisma/schema.prisma` plus `prisma/migrations`. It does not use the whole application environment validator.                                                  |
| Deployment shell  | The workflow changes into `/home/ubuntu/swifttopup-api`; it does not source an environment file. Prisma's own dotenv import can load that directory's `.env`.                                                                                |
| systemd           | Service environment, `WorkingDirectory` and `ExecStart` determine configuration. Unit files are not committed, so their effective values require VM inspection. Shell exports in an SSH session do not configure an already running service. |
| `.env.production` | Not automatically selected by application or Prisma dotenv imports. Explicit file selection is required if this filename is used.                                                                                                            |
| Vite frontends    | `VITE_*` values are build-time public configuration, using Vite's environment modes; see the frontend READMEs.                                                                                                                               |

For an explicitly selected file, examples are:

```bash
# Run from api/; replace the path with the actual protected file.
DOTENV_CONFIG_PATH=/absolute/path/production.env npx prisma migrate deploy
DOTENV_CONFIG_PATH=/absolute/path/production.env npx prisma generate
node --env-file=/absolute/path/production.env dist/src/server.js
node --env-file=/absolute/path/production.env dist/src/worker.js
```

These examples do not alter the committed deployment workflow or systemd units. If the VM uses `/home/ubuntu/swifttopup-api/.env`, keep both service environments and Prisma CLI pointed at the intended fresh production database and the same production Redis instance.

### Core and authentication

| Variables                                                               | Default / requirement                                                                                                                                    |
| ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NODE_ENV`                                                              | `development`; accepts `development`, `test`, `production`.                                                                                              |
| `PORT`                                                                  | `8000`; deployment health probe expects `8002`.                                                                                                          |
| `DATABASE_URL`, `REDIS_URL`                                             | Required URLs. Use native Redis protocol; production requires `rediss://`.                                                                               |
| `CORS_ORIGIN`                                                           | Comma-separated origin URLs; defaults to `http://localhost:5173`. Include both frontend origins when using two ports. Production requires HTTPS origins. |
| `TRUST_PROXY_HOPS`                                                      | `0`; production requires at least `1`. Match the real trusted proxy count.                                                                               |
| `MAX_REQUEST_BODY_BYTES`                                                | `1048576` bytes; maximum accepted configured limit is 1 MiB.                                                                                             |
| `JWT_ACCESS_TOKEN_SECRET`                                               | Required in production; development-only fallback otherwise. Also signs purchase quotes, so rotation affects unexpired quotes/tokens.                    |
| `ACCESS_TOKEN_TTL_MINUTES`, `REFRESH_TOKEN_TTL_DAYS`                    | `15` minutes, `30` days.                                                                                                                                 |
| `PASSWORD_RESET_TOKEN_TTL_MINUTES`                                      | `15` minutes.                                                                                                                                            |
| `PASSWORD_CHANGE_CODE_TTL_MINUTES`, `PASSWORD_CHANGE_CODE_MAX_ATTEMPTS` | `10` minutes, `5` attempts.                                                                                                                              |

### Admission controls

Limits are Redis-backed and return 429 with `Retry-After` when exceeded; Redis admission failure returns 503. Names ending in `PER_MINUTE` still use the associated configurable window where one exists.

| Limit                          | Code default | Window setting/default                   |
| ------------------------------ | ------------ | ---------------------------------------- |
| `GLOBAL_REQUESTS_PER_MINUTE`   | 300          | `GLOBAL_RATE_LIMIT_WINDOW_SECONDS=60`    |
| `USER_REQUESTS_PER_MINUTE`     | 40           | Fixed 60 seconds                         |
| `LOGIN_REQUESTS_PER_WINDOW`    | 10           | `LOGIN_RATE_LIMIT_WINDOW_SECONDS=180`    |
| `REGISTER_REQUESTS_PER_WINDOW` | 10           | `REGISTER_RATE_LIMIT_WINDOW_SECONDS=180` |
| `WHATSAPP_REQUESTS_PER_MINUTE` | 60           | `WHATSAPP_RATE_LIMIT_WINDOW_SECONDS=60`  |
| `FUNDING_REQUESTS_PER_WINDOW`  | 10           | `FUNDING_RATE_LIMIT_WINDOW_SECONDS=300`  |
| `PURCHASE_REQUESTS_PER_WINDOW` | 20           | `PURCHASE_RATE_LIMIT_WINDOW_SECONDS=300` |
| `ADMIN_REQUESTS_PER_MINUTE`    | 60           | `ADMIN_RATE_LIMIT_WINDOW_SECONDS=60`     |

The example file sets global requests to 120 and login/registration requests to 30. Choose deliberate operational values rather than assuming the example equals validator defaults.

### Funding providers

| Variables                                                   | Default / requirement                                                                                                   |
| ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `PAYMENT_PROVIDER`                                          | `mock`; accepts `mock`, `paystack`, `bachs`.                                                                            |
| `PAYMENT_MODE`                                              | `test`; accepts `test`, `live`.                                                                                         |
| `PAYMENT_FALLBACK_ENABLED`                                  | `true`; applies to Bachs-to-Paystack routing.                                                                           |
| `PAYMENT_REQUEST_TIMEOUT_MS`                                | `10000` milliseconds, accepted range 100–60000.                                                                         |
| `PAYMENT_PROVIDER_COOLDOWN_SECONDS`                         | `30` seconds.                                                                                                           |
| `BACHS_API_KEY`, `BACHS_WEBHOOK_SECRET`, `BACHS_ACCOUNT_ID` | Required for Bachs primary. Account ID matches event `organization_id`.                                                 |
| `BACHS_SUCCESS_URL`                                         | Optional return URL; returning to it does not credit a wallet.                                                          |
| `PAYSTACK_SECRET_KEY`                                       | Required for Paystack primary or enabled Bachs fallback; also needed operationally for real permanent account creation. |
| `PAYSTACK_PREFERRED_BANK`                                   | `test-bank`; only dedicated account provisioning uses it.                                                               |
| `PAYSTACK_PERMANENT_ACCOUNTS_ENABLED`                       | `false`; controls new real permanent accounts. Existing active accounts are reused.                                     |
| `FUNDING_INTENT_CLEANUP_INTERVAL_MS`                        | `60000` milliseconds, minimum 1000.                                                                                     |

Bachs hosts are selected in the adapter from payment mode: `https://sandbox-api.bachs.io` or `https://api.bachs.io`. Bachs keys must start with `sk_sandbox_` for test or `sk_live_` for live. Paystack uses `https://api.paystack.co` with `sk_test_` or `sk_live_`. Keep both webhook signing credentials while either provider has outstanding payments.

| Funding fee setting                       | Code default                |
| ----------------------------------------- | --------------------------- |
| `BACHS_TRANSFER_FEE_BPS`                  | `150` (1.5%)                |
| `BACHS_TRANSFER_FEE_CAP`                  | `2000.00` NGN               |
| `PAYSTACK_TRANSFER_FEE_BPS`               | `150` (1.5%)                |
| `PAYSTACK_TRANSFER_FLAT_FEE`              | `100.00` NGN                |
| `PAYSTACK_TRANSFER_FLAT_FEE_WAIVER_BELOW` | `2500.00` NGN gross payment |
| `PAYSTACK_TRANSFER_FEE_CAP`               | `2000.00` NGN               |
| `PAYSTACK_PERMANENT_FEE_BPS`              | `100` (1%)                  |
| `PAYSTACK_PERMANENT_FEE_CAP`              | `300.00` NGN                |

One basis point is 0.01%; percentage fees round upward to the next kobo. Caps apply to the calculated total fee; zero cap means uncapped. Paystack's temporary flat fee applies at/above the gross-payment threshold. These are application settings that must match the account's actual terms.

At this review, published [Bachs fees](https://docs.bachs.io/for-you/fees) list checkout bank transfer at 1.5% capped at NGN 2,000. Published [Paystack pricing](https://paystack.com/pricing) lists local transactions at 1.5% + NGN 100, the flat-fee waiver below NGN 2,500, a NGN 2,000 cap, and DVA deposits at 1% capped at NGN 300. These public rates do not prove account-specific fees or eligibility. Paystack [Pay with Transfer](https://paystack.com/docs/payments/payment-channels/#pay-with-transfer) is a temporary transaction-account flow, distinct from DVA provisioning.

### VTPass and commerce

| Variables                                                  | Default / requirement                                               |
| ---------------------------------------------------------- | ------------------------------------------------------------------- |
| `VTU_PROVIDER`                                             | `mock`; accepts `mock`, `vtpass`.                                   |
| `VTPASS_API_KEY`, `VTPASS_PUBLIC_KEY`, `VTPASS_SECRET_KEY` | All required when selecting VTPass.                                 |
| `VTPASS_BASE_URL`                                          | `https://sandbox.vtpass.com/api`; live is `https://vtpass.com/api`. |
| `VTPASS_REQUEST_TIMEOUT_MS`                                | `10000` milliseconds, maximum 60000.                                |
| `VTPASS_PROVIDER_FEES`                                     | JSON string object; defaults to `{}`. See exact format below.       |
| `COMMERCE_RECONCILIATION_INTERVAL_MS`                      | `60000` milliseconds, minimum 1000.                                 |
| `COMMERCE_PENDING_PURCHASE_AGE_MS`                         | `30000` milliseconds.                                               |
| `COMMERCE_JOB_STALE_AFTER_MS`                              | `120000` milliseconds.                                              |

GET requests send `api-key` and `public-key`; POST requests send `api-key` and `secret-key`. Sandbox/live keys and service provisioning must match the base URL. See official [authentication](https://vtpass.com/documentation/authentication/) and [environment/provisioning instructions](https://vtpass.com/documentation/integrating-api/).

In the matching VTPass account, save API AUTHENTICATION TYPE as `API keys` or `all` and copy the static API key plus the current generated public/secret pair. Keep actual credentials in the ignored `.env` or service environment; `.env.example` must contain placeholders. A successful catalog GET does not validate account access: authenticated `/balance` or `/requery` can still reject the same configuration with HTTP 401. The isolated runner performs an authenticated requery check and records the failure before submitting new tests.

Reconcile outstanding sandbox purchases using their original environment before switching the provider URL/keys. Purchases snapshot their environment, and mismatches are treated as uncertain rather than submitted against another environment. Do not assume saved URLs also preserve historical credentials.

`VTPASS_PROVIDER_FEES` is a **SwiftTopUp environment setting**, not a VTPass dashboard configuration. It maps exact service IDs to verified fixed convenience fees in NGN, using string values matching `^\d+(?:\.\d{1,2})?$`.

```dotenv
# Syntax illustration only: replace with fees verified for your account/services.
VTPASS_PROVIDER_FEES='{"ikeja-electric":"0.00","eko-electric":"100.00"}'
```

The amounts above are examples, not confirmed electricity fees. Numeric JSON values, negative amounts, percentages and values with more than two decimal places are rejected. An empty object means no explicit overrides; it does not establish zero fees.

Explicit service entries override metadata for services that use the fee resolver. Electricity and other variation services otherwise read VTPass's `content.convinience_fee` from `/service-variations`: supported fixed amounts, fixed `N`/`₦` values and zero-percentage forms such as `0%` can establish a fee. Missing/unsupported/nonzero-percentage metadata leaves the fee unknown and the product inactive. A failed electricity metadata lookup leaves that service inactive while other services can sync. Airtime rows explicitly use zero fee in the current adapter. Provider commission remains a discount on supplier cost, separate from convenience fees; final settlement uses the actual transaction `total_amount`. Re-sync after changing an override.

### VTPass sandbox activation evidence

From `api/`, run `npm run vtpass:sandbox` for usage without network requests or file writes. Use `npm run vtpass:sandbox -- --run` to discover the catalog, submit the sandbox tests and generate Request ID evidence. The runner accepts only `https://sandbox.vtpass.com/api`, rejects redirects, uses documented sandbox destinations and does not import the application database, wallet, Redis or messaging code. It tests every configured service, electricity meter type, configured airtime amount and current exam variation, with representative data/cable packages rather than every tariff. Results are saved in [the report](docs/vtpass-sandbox-report.md) and [the journal](docs/vtpass-sandbox-journal.json).

Each run first checks authenticated `/requery` access; authentication/transport failure stops it before new purchases. The journal is saved before each purchase submission. Resume the same journal after interruptions; submitted requests are requeried with their existing IDs and are never submitted to `/pay` again. `--run --requery-only` checks outstanding submitted transactions without creating new purchases. The generated report records actual responses and separates passed, failed and incomplete tests; it omits credentials, customer details and token/PIN values. These are isolated provider tests, not proof that the deployed API, worker, callback delivery or wallet flow works end to end.

Register the callback only after the backend containing this route has been deployed and both services are running. Use the VTPass dashboard's callback trigger to verify HTTP delivery; that trigger alone cannot confirm a purchase. Sandbox Request IDs from this runner should be submitted to VTPass support for API provisioning. Confirm live account pricing and fees separately; sandbox observations do not establish live commercial terms.

### WhatsApp

| Variables                                           | Default / requirement                                                                          |
| --------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID` | Select the real outbound Cloud adapter when both are present. Required in production.          |
| `WHATSAPP_APP_SECRET`                               | Raw-body webhook verification secret; required in production.                                  |
| `WHATSAPP_VERIFY_TOKEN`                             | GET subscription verification token; development fallback exists, production requires a value. |
| `WHATSAPP_API_BASE_URL`, `WHATSAPP_API_VERSION`     | `https://graph.facebook.com`, `v23.0`; production base URL must use HTTPS.                     |
| `WHATSAPP_APP_ID`, `WHATSAPP_BUSINESS_ID`           | Optional identifiers accepted by configuration; not substitutes for token/phone ID.            |

Configure the Meta callback as `https://YOUR_API_HOST/api/v1/messaging/whatsapp/webhook`, verify its GET challenge with the chosen token, and enable message/status webhook delivery for the intended phone number. POST requests need the correct app-secret signature over the original bytes. Confirm subscription and account permissions externally.

For local mock sending, leave the access token and phone-number ID empty. Nonempty placeholder strings from the example select the real adapter and will fail as credentials; there is no separate WhatsApp provider environment switch.

### Optional intent gateway

AI integration is optional in configuration, with the funding conversation limitation described above. Supported provider names are `gemini`, `groq`, `cerebras`, `huggingface`, `deepseek`.

| Variables                                                                                            | Code defaults / purpose                                                                                                   |
| ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `AI_ENABLED`, `AI_DETERMINISTIC_ONLY`                                                                | `false`, `false`; master opt-in and emergency gate.                                                                       |
| `AI_PRIMARY_PROVIDER`, `AI_FALLBACK_PROVIDERS`                                                       | `gemini`, empty list; fallback is comma-separated. The example file configures additional fallbacks.                      |
| `AI_TRAFFIC_PERCENTAGE`, `AI_ROLLOUT_SALT`                                                           | `100`, development salt; rollout salt accepts at least 16 characters.                                                     |
| `AI_USER_ALLOWLIST`, `AI_USER_DENYLIST`                                                              | Empty comma-separated actor lists.                                                                                        |
| `AI_MODEL_GEMINI`, `AI_MODEL_GROQ`, `AI_MODEL_CEREBRAS`, `AI_MODEL_HUGGINGFACE`, `AI_MODEL_DEEPSEEK` | No model defaults in the validator; supply valid current model IDs for selected providers. Example-file IDs are examples. |
| `GEMINI_API_KEY`, `GROQ_API_KEY`, `CEREBRAS_API_KEY`, `HUGGINGFACE_API_KEY`, `DEEPSEEK_API_KEY`      | Required with model settings for the primary and configured fallbacks when AI is enabled.                                 |
| `AI_MIN_INTENT_CONFIDENCE`                                                                           | `0.75`.                                                                                                                   |
| `AI_REQUEST_TIMEOUT_MS`, `AI_MAX_OUTPUT_TOKENS`, `AI_MAX_CONTEXT_MESSAGES`                           | `8000` ms, `512` tokens, `12` messages.                                                                                   |
| `AI_GLOBAL_DAILY_REQUEST_BUDGET`, `AI_PER_USER_DAILY_REQUEST_LIMIT`                                  | `1000`, `20`.                                                                                                             |
| `AI_PROVIDER_RETRY_LIMIT`, `AI_OUT_OF_SCOPE_WARNING_TTL_HOURS`                                       | `1`, `24` hours.                                                                                                          |
| `AI_CIRCUIT_FAILURE_THRESHOLD`, `AI_CIRCUIT_COOLDOWN_MS`, `AI_CIRCUIT_HALF_OPEN_PROBES`              | `3`, `30000` ms, `1`.                                                                                                     |

Each uppercase provider prefix (`GEMINI`, `GROQ`, `CEREBRAS`, `HUGGINGFACE`, `DEEPSEEK`) also has `AI_<PROVIDER>_ENABLED=true`, `_PRIORITY` (10/20/30/40/50 respectively), `_MAX_REQUESTS_PER_MINUTE=30`, `_MAX_DAILY_REQUESTS=1000`, `_MAX_DAILY_TOKENS=500000`, `_TIMEOUT_MS=8000` and `_FALLBACK_ELIGIBLE=true`. Verify provider/model availability separately; this README makes no claim that example models or free-tier limits are current.

## Local development

### Prerequisites and installation

Use **Node.js 24** for a common toolchain across these applications, plus npm, PostgreSQL and native-protocol Redis. API/admin packages declare Node `>=22`; inspected Prisma 7 requires at least 22.12 on Node 22, and the client's ESLint 10 requires at least 22.13 on that release line. The test command also uses Node's experimental test-isolation option. No Docker/Compose setup is committed here.

From the workspace root:

```bash
cd api
npm ci
cp .env.example .env
```

Edit the local development `.env` with local/disposable services and mock providers. A minimal configuration is:

```dotenv
NODE_ENV=development
PORT=8000
TRUST_PROXY_HOPS=0
CORS_ORIGIN=http://localhost:5173,http://localhost:5174
DATABASE_URL=postgresql://USER:PASSWORD@127.0.0.1:5432/swifttopup_dev
REDIS_URL=redis://127.0.0.1:6379
JWT_ACCESS_TOKEN_SECRET=REPLACE_WITH_A_PRIVATE_DEVELOPMENT_SECRET
PAYMENT_PROVIDER=mock
VTU_PROVIDER=mock
AI_ENABLED=false
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
```

Generate the client, then apply the existing schema migrations to the development database:

```bash
npx prisma generate
npx prisma migrate deploy
npx prisma migrate status
```

`generate` creates code in `prisma/generated`; it does not create tables or apply migrations. `migrate deploy` applies the configured migration history without creating a new migration. Use `npx prisma migrate dev --name DESCRIPTIVE_CHANGE` only when intentionally developing a schema change against a development database; this documentation task requires none.

Prisma reads `prisma/migrations`, not the stray nested `api/prisma/migrations` directory inside this API checkout. Do not manually apply that duplicate cleanup SQL as an additional migration.

Start in separate terminals from `api/`:

```bash
npm run dev
```

```bash
npm run worker
```

The API defaults to `http://localhost:8000`; the worker has no HTTP port. Expect the API startup log, Redis readiness, and both worker readiness messages. With VTPass selected, expect `Product catalog synchronized` or a logged sync failure after startup. Mock mode does not run the periodic VTPass scheduler; populate its catalog using a protected operator/admin sync request when needed.

```bash
curl --fail --silent --show-error http://localhost:8000/api/v1/health
```

With dependencies available, expect HTTP 200 and `data.status="ok"`, `data.dependencies.database="ok"`, `data.dependencies.redis="ok"`. An unavailable dependency yields 503; Redis admission failure can return 503 before the health handler runs. HTTP startup alone is not a readiness check.

Follow the [admin](../admin/README.md) and [client](../client/README.md) guides to start the frontends. Use admin port 5173 and client port 5174, and allow both origins in API CORS.

### Checks, tests and builds

From `api/`:

| Command | Behavior |
| --- | --- |
| `npm run lint` | ESLint. |
| `npm run typecheck` | TypeScript with no emitted output. |
| `npm run check` | Lint and typecheck. |
| `npm test` | Compile tests and run serially in one process with database-gated cases disabled and providers mocked. |
| `npm run test:db` | Compile tests and run the selected database suites serially, with each file in a separate process and providers mocked. |
| `npm run build` | Emit the application and imported generated client files into `dist`. |
| `npm run ci` | Lint, typecheck, ordinary tests and production build. Database-gated cases are disabled. |
| `npm run format:check` | Check formatting without rewriting files. |
| `npm run security:audit` | Local secret-exposure checks; inspect output privately. |
| `npm run security:dependencies` | Network-backed npm production dependency audit. |
| `npm start` / `npm run start:worker` | Run `dist/src/server.js` / `dist/src/worker.js`. |

The start scripts already match the emitted paths.

Ordinary tests mock domain and provider behavior. The test command explicitly sets `RUN_DATABASE_TESTS=false`, so a previously exported value cannot enable database cases accidentally. Module imports may still initialize Redis clients.

```bash
npm run ci

```

## Deployment and operations

### CI/CD behavior

The API's [GitHub workflow](.github/workflows/ci.yml) validates pushes/PRs for `main`, `develop` and `staging`, and supports manual dispatch. Validation checks out the API repository, uses Node 22, installs with `npm ci`, runs `npx prisma generate`, then `npm run ci`.

The workflow provisions PostgreSQL and Redis services, generates Prisma Client and applies the migration history before running `npm run ci`. Separate steps enable and run the PostgreSQL purchase-completion outbox and payment-funding suites. The remaining opt-in database suites require separate validation. Its dependency-audit step is commented out; run the current audit when required.

Only a successful **push to `main`** triggers the deployment job. PRs and manual dispatch do not satisfy that deployment condition. The job uses SSH secrets `DEPLOY_HOST`, `DEPLOY_PORT`, `DEPLOY_USER`, `DEPLOY_SSH_PRIVATE_KEY`, and `DEPLOY_KNOWN_HOSTS` with strict host-key checking.

On the VM it runs, in order:

```bash
cd /home/ubuntu/swifttopup-api
git pull --ff-only origin main
npm ci
npx prisma migrate deploy
npx prisma generate
npm run build
sudo -n systemctl restart swifttopup-api.service swifttopup-worker.service
sudo -n systemctl is-active swifttopup-api.service
sudo -n systemctl is-active swifttopup-worker.service
```

It then probes `http://127.0.0.1:8002/api/v1/health`, up to 30 attempts, with request timeouts and delays. Restart failure prints service status and recent journals. There is no implemented automatic rollback or zero-downtime release mechanism. Migrations happen before build/restart; a later failure does not undo already applied migrations.

### Fresh production database and bootstrap

Before the first production deployment:

1. Set the intended fresh production `DATABASE_URL`, production Redis URL and approved live provider/WhatsApp settings in the environment actually used by Prisma and both systemd services. Keep permanent account creation disabled for the current account.
2. Apply the configured migrations with `npx prisma migrate deploy`, then verify with `npx prisma migrate status`. Do not copy old user/balance data or substitute schema pushing/resetting for the migration history.
3. Generate Prisma Client and build. Database migrations change tables; client generation changes application code. Both are required when deploying schema-related changes.
4. Bootstrap the administrator and review/seed the initial reward policy deliberately. Neither deployment migrations nor startup create the first admin automatically.
5. Start API and worker, verify services/logs/health, initial catalog sync, and controlled provider journeys after account activation. No live test completion is implied by these instructions.

The latest configured migrations include payment routing/fees, expanded VTPass services/catalog snapshots, and `20261102042731_launch_b_persist_funding_profile`. Existing wallets begin with null funding contact fields; a fresh database starts without users, balances or catalog rows. Full replay of the migration chain must be verified on the intended database environment; it was not run for this update.

For [bootstrap-admin.ts](src/scripts/bootstrap-admin.ts), supply these process/environment values privately:

| Variable                                                | Requirement                                    |
| ------------------------------------------------------- | ---------------------------------------------- |
| `ADMIN_BOOTSTRAP_CONFIRM`                               | Exact value `SWIFTTOPUP_CREATE_FIRST_ADMIN`.   |
| `ADMIN_BOOTSTRAP_USERNAME`                              | 3–32 lowercase letters, digits or underscores. |
| `ADMIN_BOOTSTRAP_PASSWORD`                              | At least 12 characters.                        |
| `ADMIN_BOOTSTRAP_EMAIL`, `ADMIN_BOOTSTRAP_DISPLAY_NAME` | Optional.                                      |

Then run from `api/` with the intended database loaded:

```bash
npm run admin:bootstrap
```

Expect `Created administrator account: USERNAME`. This creates an admin identity directly, not a funded wallet. The existing-admin guard is commented out; username/email uniqueness is not an enforced one-admin-only bootstrap rule. Clear bootstrap secret values after use.

After reviewing the policy values described above, the actual idempotent initial-policy entry point is:

```bash
npx tsx src/scripts/seed-reward-policy.ts
```

It ensures policy version 1 and prints its version/tier count. An existing version 1 is reused; inspect the active policy rather than assuming the command overwrites terms.

### Services, health and logs

Committed deployment references establish these names and paths:

| Item                                                          | Repository evidence                                                                              |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| VM application directory                                      | `/home/ubuntu/swifttopup-api`                                                                    |
| systemd services                                              | `swifttopup-api.service`, `swifttopup-worker.service`                                            |
| Compiled entry points                                         | `dist/src/server.js`, `dist/src/worker.js`                                                       |
| Deployment health URL                                         | `http://127.0.0.1:8002/api/v1/health`                                                            |
| Application default port                                      | `8000`; set `PORT=8002` for the current VM probe unless the deployment is intentionally changed. |
| Public hostname, actual unit files and environment file paths | Not established by committed configuration; verify on the VM.                                    |

Read-only operational checks on the VM include:

```bash
sudo systemctl --no-pager --full status swifttopup-api.service swifttopup-worker.service
sudo journalctl -u swifttopup-api.service -u swifttopup-worker.service -n 100 --no-pager
curl --fail --silent --show-error http://127.0.0.1:8002/api/v1/health
```

Health checks probe PostgreSQL and Redis; they do not test VTPass/Bachs/Paystack fulfillment or WhatsApp delivery. Admin worker status can remain `UNKNOWN`, and some provider indicators reflect configured keys rather than network probes. Check actual worker readiness, pending work and logs. The security runbook's Nginx/TLS examples require external application/verification; the workflow does not install or validate Nginx certificates.

Logs include request and operation identifiers where available. Use funding provider references, purchase/job IDs, wallet transaction IDs and WhatsApp provider IDs to correlate evidence. Do not paste raw secrets, full webhook bodies or live exam/electricity receipts into public logs or support notes.

### Outstanding operational confirmations

Before describing the deployment as live and verified, confirm:

- The effective systemd `WorkingDirectory`, `ExecStart`, environment file paths and `PORT`; the public API hostname, proxy topology, TLS and webhook routing.
- That Prisma CLI, API and worker use the intended fresh production database and the same production Upstash TCP/TLS instance, with one intended scheduler worker.
- Paystack account approval/permanent-account enablement, VTPass identity/API/service activation, available provider balances, and account-specific funding/convenience fees.
- The intended optional AI enablement and current provider/model settings, including the complete funding follow-up behavior on the main bot.
- Successful controlled live funding with signed settlement evidence, purchase fulfillment with actual supplier debit and complete receipts, recovery/refunds, and WhatsApp delivery. These were not performed for this update.
- Backup restoration, deployment rollback and edge/secret permissions on the actual VM. Committed examples do not establish that these are configured.

### Timers, recovery and shutdown

| Task                                    | Timing / behavior                                                                                 |
| --------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Durable messaging recovery              | Every 5 seconds; process pending inbound events and queue outbound rows missing stream IDs.       |
| Commerce reconciliation/reward recovery | On worker startup, then `COMMERCE_RECONCILIATION_INTERVAL_MS` (default 60 seconds).               |
| Funding expiry cleanup                  | On startup, then `FUNDING_INTENT_CLEANUP_INTERVAL_MS` (default 60 seconds).                       |
| Pending fulfillment requery             | Driven by persisted due jobs; unresolved results are typically scheduled around 30 seconds later. |
| Product synchronization                 | VTPass only, immediately after readiness and every fixed 5 minutes; local overlap suppression.    |

On SIGINT/SIGTERM, the API stops HTTP acceptance with a ten-second server-close timer, then disconnects Prisma and Redis. The worker clears timers, disconnects blocking clients, awaits consumer loops and active catalog sync, then disconnects shared Redis. This is not a complete bounded drain of every timer-launched callback. WhatsApp's outbound fetch currently has no explicit request timeout, so a stuck external request can delay worker shutdown.

### Troubleshooting and operational limits

| Symptom                                          | Check                                                                                                                                                                       |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| API starts but requests/health return 503        | Redis TCP/TLS connectivity and rate-limit admission, then PostgreSQL connectivity/migrations. The API does not wait for infrastructure readiness before listening.          |
| No bot replies                                   | Signatures, correct phone subscription, persisted inbound events, worker readiness, outbound stream pending/DLQ, real-vs-mock adapter selection, and conversation/AI gates. |
| Funding prompts do not progress with AI disabled | The current funding follow-up path uses the gateway; distinguish this from REST funding availability.                                                                       |
| Funding initialization remains pending           | Inspect the saved provider/reference and dashboard; do not create another checkout for an uncertain result. There is no automatic unknown-initialization recovery.          |
| Payment received but not credited                | Inspect normalized receipt status/reason, signatures, checkout ownership, exact gross amount and final settlement evidence. Duplicates may already have credited once.      |
| Purchase remains pending                         | Inspect job/attempts, original request/environment, due requery and financial exceptions. Do not retry as a fresh purchase.                                                 |
| Delivered purchase lacks cost/token/PINs         | Delivery may be successful while settlement/receipt completion remains unresolved; requery and inspect exception evidence.                                                  |
| Electricity unavailable                          | Check service catalog convenience-fee metadata or a verified override, re-sync, account/service activation and biller verification. Unknown fees leave products inactive.    |
| Product reappears after being hidden             | Current sync reactivates listed provider products; visibility suppression is not sticky across sync.                                                                        |
| UI balance/status lags                           | Wallet summary cache invalidation is local and expiry is sliding. Purchase history now reads PostgreSQL; check worker jobs and frontend refresh for purchase status.         |

Further current limits:

- A permanently failing earliest inbound event can be retried without backoff/attempt cap and block later events for that WhatsApp identity; recovery loops can repeatedly encounter it.
- Outbound recovery does not cover every lost-stream/delivery ambiguity. Only queued rows missing a stream ID are re-enqueued by the database scan; early/unknown delivery callbacks are skipped, not buffered.
- No automatic DLQ replay, stream retention/trimming, active worker heartbeat or external alert delivery is implemented.
- Multiple workers duplicate the catalog timer because coordination is local. Increasing replicas also exposes cache freshness and provider-budget/topology questions; keep the intended single-scheduler topology until addressed.
- Funding confirmations are post-commit notifications, and final purchase receipts are retrieved on request. Do not promise guaranteed push notifications for every completed operation.
- Provider balances, approval, upstream availability, statement reconciliation, backup restoration, edge controls and a tested rollback procedure are operational requirements, not guarantees established by source.
- No throughput, uptime, load-test result or launch approval is claimed here.

## API and developer reference

All routes below are relative to `/api/v1`. Protected requests use `Authorization: Bearer ACCESS_TOKEN`. Money fields are decimal strings unless the specific schema says otherwise.

### Route groups

| Group             | Important routes                                                                                                                                                  | Access                                                                                                     |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Health            | `GET /health`                                                                                                                                                     | No bearer; global admission still applies.                                                                 |
| Identity          | `POST /identity/register`, `/login`, `/refresh`, `/logout`, `/password/reset`                                                                                     | Public validated routes; login/registration have specific rate limits.                                     |
| Identity profile  | `GET /identity/me`, `PATCH /identity/me/username`, `POST /identity/me/password`, `/me/password/challenge`, `/me/password/confirm`                                 | Bearer/session checks.                                                                                     |
| User lookup       | `GET /identity/users/:userId`, `/users/by-username/:username`, `/users/by-whatsapp-phone/:whatsappPhone`, `/users/by-whatsapp-wa-id/:whatsappWaId`                | Bearer; these routes are not admin-only.                                                                   |
| Wallet            | `GET /wallet/summary`, `/wallet/transactions?limit=20`; `POST /wallet/funding/account`, `/funding/permanent-account`, `/funding/permanent-account/dismiss-prompt` | Bearer; funding initialization is rate-limited. Transaction limit 1–50.                                    |
| Payment callbacks | `POST /wallet/funding/webhooks/bachs`, `/wallet/funding/webhooks/paystack`                                                                                        | Provider signature, not bearer.                                                                            |
| VTPass callback | `POST /commerce/webhooks/vtpass` | No bearer; bounded notification schedules authenticated requery of an existing matching transaction. |
| Commerce          | `GET /commerce/products?type=DATA&network=MTN`, `/commerce/purchases`; `POST /commerce/purchases/quote`, `/commerce/purchases`                                    | Bearer/owner scoping; purchase routes have specific admission limits. History returns latest 30 purchases. |
| Catalog sync      | `POST /commerce/products/sync`                                                                                                                                    | `OPERATOR` or `ADMIN`.                                                                                     |
| WhatsApp          | `GET` and `POST /messaging/whatsapp/webhook`                                                                                                                      | Verify-token challenge / Meta signature.                                                                   |
| Rewards           | `GET /rewards/me`, `/referrals`, `/progress`, `/leaderboard`, `/transactions`                                                                                     | Bearer; own reporting with validated pagination where supported.                                           |
| Administration    | `/administration/*`                                                                                                                                               | Bearer plus `OPERATOR`/`ADMIN` and admin rate limits; selected mutations require `ADMIN`.                  |

Administration includes authorization, dashboard summary, users, wallets and ledger transactions, funding intents, purchases, products, provider/worker status, failed/pending operations, reconciliation exceptions and AI status. Mutations include product sync/visibility. Rewards reporting/policies/exceptions are exposed under `/administration/rewards`; policy creation, reconciliation and processing suspension require `ADMIN`. Inspect [administration.routes.ts](src/domains/administration/administration.routes.ts) for exact methods.

There is no public funding-profile/status GET endpoint, per-purchase GET endpoint, generic customer refund endpoint, reward payout endpoint or funding-review action route. Bot status helpers are internal services; do not invent corresponding URLs.

### Request examples

These illustrate request bodies only; they are not commands to perform live transactions. Use actual catalog IDs from the selected environment and keep provider credentials on the server.

`POST /api/v1/wallet/funding/account`:

```json
{
  "amount": "1000.00",
  "email": "customer@example.com",
  "firstName": "Ada",
  "lastName": "Okafor",
  "phoneNumber": "08000000000",
  "idempotencyKey": "funding-example-0001"
}
```

Temporary instructions return 201, including desired credit, fee/payable amounts and the selected provider's checkout or account details; an existing permanent account returns 200. Use the returned instructions, not assumptions about the primary provider.

`POST /api/v1/commerce/purchases/quote` for a data product:

```json
{
  "productId": "REPLACE_WITH_ACTIVE_PRODUCT_ID",
  "recipientPhone": "08000000000"
}
```

Use the returned `data.quoteToken` and confirm via `POST /api/v1/commerce/purchases`:

```json
{
  "productId": "REPLACE_WITH_ACTIVE_PRODUCT_ID",
  "recipientPhone": "08000000000",
  "idempotencyKey": "purchase-example-0001",
  "quoteToken": "REPLACE_WITH_RETURNED_QUOTE_TOKEN"
}
```

Other quote fields are optional `billersCode` (5–20 digits), decimal-string `amount`, integer `quantity` (1–10) and `subscriptionType` (`change` or `renew`), with service-specific requirements. Legacy airtime/data confirmation can supply `expectedPrice` instead of the token. Purchase idempotency keys are 16–120 characters; funding keys are optional 8–128 characters.

Normal JSON responses use `{ "success": true, "data": ... }` with an optional `requestId`; errors use `{ "success": false, "error": { "code": ..., "message": ..., "details": ... } }`. The WhatsApp GET verification responds with plain challenge text. New purchase responses include `data.purchase`, `duplicate`, `pending` and `refunded`; HTTP 202 means accepted for background processing, not delivered.

### Authentication and callbacks

Passwords use salted scrypt. Access tokens are HMAC-signed JWTs with a session ID; refresh tokens are stored hashed and rotated. Bearer authentication checks the live session, user status and current role. Logout revokes the refresh session. Generated affiliate credentials require first-password change; the auth middleware permits only password-change routes until completed. WhatsApp-issued reset tokens expire and password reset revokes active sessions. Username changes are limited to two per rolling 30 days.

Webhook requirements are distinct:

- **Meta:** `X-Hub-Signature-256`, HMAC-SHA256 over the preserved request bytes, with the app secret.
- **Paystack:** `x-paystack-signature`, raw-body HMAC-SHA512 with the Paystack secret key.
- **Bachs:** prefers `x-bachs-signature-v2`, falls back to `x-bachs-signature`; HMAC-SHA256 over `timestamp.rawBody`, with an inline or `x-bachs-timestamp` timestamp and five-minute tolerance. Multiple `v1` signatures support rotation. See [official webhook signing instructions](https://docs.bachs.io/guides/webhooks/overview) and [collection event fields](https://docs.bachs.io/guides/webhooks/events/collection-succeeded).

Register Bachs and Paystack callbacks separately at the paths above. A valid signature proves origin, not that amount, owner, currency and settlement are acceptable. Never validate a reconstructed JSON string in place of the original body.

### Main data relationships and conventions

[Prisma schema](prisma/schema.prisma) defines:

- `User` with sessions, optional wallet, WhatsApp identity, referral profile/attribution and separate reward balance.
- `Wallet` with funding contact, ledger accounts, transactions/entries, virtual accounts and funding intents.
- `FundingDepositReceipt` with unique provider payment identity and credit/review outcome.
- `Product` with provider code, service type, face amount, verified fee and activation state.
- `Purchase` with immutable confirmed charge and provider/environment snapshots; fulfillment/refund jobs, attempts, provider events, receipts and financial exceptions track execution.
- WhatsApp conversations/events, outbound messages/attempts and delivery events for durable messaging.
- Referral qualification events, policy/tier/reward snapshots, reward processing controls and admin audit records.

Use strict TypeScript, validate external data, keep controllers thin and follow existing domain/service/repository/provider boundaries. Financial changes require transactional, idempotent behavior and meaningful concurrency/failure tests. Follow the applicable `AGENTS.md` and current phase scope; architectural documents are not permission to implement later features.

## Technical decisions and interview preparation

| Question                                                  | Answer grounded in this implementation                                                                                                                                                                                                                                                     |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Why a modular monolith?                                   | Wallet, commerce, identity and messaging share one codebase and PostgreSQL transaction boundary. This keeps deployment and transactional coordination manageable for a small product while retaining domain/provider boundaries. API and background work run as separate processes.        |
| Why PostgreSQL for financial state?                       | Ledger rows, unique payment identities, wallet locks and purchase/job creation need durable atomic transactions. Redis supports coordination and transport, while PostgreSQL remains the financial authority.                                                                              |
| What happens if Redis is unavailable?                     | Admission fails with 503, state/queue-dependent journeys stop and workers cannot consume normally. Existing ledger/jobs remain durable in PostgreSQL and can be recovered after connectivity returns; the system is not fully functional without Redis.                                    |
| How is double spending prevented?                         | A wallet row mutation inside the transaction serializes competing debits before balance calculation. Funds and balanced entries are checked/written in the same transaction. A cached balance is never sufficient authorization.                                                           |
| How are duplicate webhooks handled?                       | Provider-specific signatures are verified, then unique receipt/transaction identities and transactional funding-intent claiming ensure one credit. A second distinct charge for an already-paid request is reviewed rather than silently credited again.                                   |
| What if a provider times out after accepting a purchase?  | The initial request ID and durable attempt already exist. The result remains ambiguous and the worker requeries that same request; it does not submit another purchase.                                                                                                                    |
| Why not retry a pending purchase with a new key?          | A new key is a new financial intent and can debit/buy twice. Recovery follows the original purchase and request ID until evidence establishes its outcome.                                                                                                                                 |
| Why can the quoted price differ from supplier settlement? | Retail includes configured markup/fees and rounding; supplier commission affects actual debit. The application stores the customer charge and later records actual `total_amount`; unknown settlement is not guessed.                                                                      |
| How are jobs recovered?                                   | PostgreSQL jobs/leases/due times survive API/worker failure. Timed reconciliation re-enqueues due work; Redis consumer groups reclaim pending entries. Messaging additionally scans durable inbound and unqueued outbound records.                                                         |
| What are the scaling limits?                              | Catalog coordination is local, caches are per process, inbound failure handling lacks a cap/backoff, provider calls consume external limits, and no benchmark establishes capacity. Replicas require deliberate scheduler, cache, recovery and provider-budget planning.                   |
| Which guarantees are conditional?                         | Database idempotency/transactions protect local financial effects. External delivery, final settlement evidence, Redis retention, systemd environment, provider approvals, backups and edge controls depend on providers and deployment. There is no blanket exactly-once or uptime claim. |

## New features to be rolled out

These are planned product directions, not completed features or implementation commitments for this documentation change.

1. **Contact book and saved recipients.** Save a recipient's name, phone number and network so “send 5GB to Ebuka” can resolve a saved contact. Ask the user to choose when names are ambiguous, then confirm the actual recipient, network, plan and charge. Support “send 3GB to me” and “send it to my number” consistently across flows. AI `SELF` already resolves the sender's phone; saved named contacts and consistent deterministic self-recipient handling remain planned.
2. **Better product ranking and catalog.** Improve relevance, ordering, discoverability and presentation while preserving restrictions, known validity and clear prices. Existing deterministic price-per-GB/bucket selection and mobile formatting are the baseline; measured popularity, richer discovery and ranking administration remain future improvements.
3. **Audio and voice processing.** Let users send voice messages and receive text or voice responses according to their preference, while retaining explicit confirmation of financial details. Voice processing is not implemented, and no vendor is selected by this plan.

## Suggested features

These are suggestions for consideration, not committed work:

1. **Funding review workspace.** Show `REVIEW` deposit receipts, matching evidence and investigation notes in the admin app, with controlled handling of signed redelivery. This would reduce direct database inspection without weakening attribution checks.
2. **Support cases linked to transaction references.** Let a customer raise an issue against a purchase/funding reference and let operators track its resolution. Existing status/history views would supply context without requiring the customer to repeat the entire conversation.
3. **Opt-in renewal reminders.** Remind customers about a known data/cable expiry or bill renewal, linking back to a newly quoted purchase. Unknown validity should never generate an invented expiry, and reminders should not debit automatically.
4. **Low-balance notifications.** Offer a customer-selected wallet threshold and a funding shortcut. This can reduce failed purchase attempts while keeping notifications optional and deduplicated.
5. **External operational alerts.** Notify operators about aged unresolved purchases, review deposits, DLQ growth and service failures. Existing logs/exceptions provide inputs; alert delivery and actionable thresholds would add value beyond the current dashboards.
6. **Automated backup-restore evidence.** Regularly restore a database backup into an isolated environment and record migration/integrity checks. This would turn an operational recovery requirement into repeatable evidence without touching production balances.
