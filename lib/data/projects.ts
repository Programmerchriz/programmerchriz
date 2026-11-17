export type ProjectRepository =
  | { label: string; visibility: "public"; url: string }
  | { label: string; visibility: "private"; url?: never };

export interface ProjectImage {
  src: string;
  alt: string;
  caption: string;
}

export interface ProjectNote { title: string; description: string }

export interface Project {
  slug: string;
  displayName: string;
  title: string;
  category: string;
  contribution: string;
  /** Lower numbers appear first on the homepage. Slugs remain stable. */
  order: number;
  status: { label: string; detail: string };
  shortDescription: string;
  description: string;
  images?: ProjectImage[];
  liveLink?: { label: string; url: string };
  repositories?: ProjectRepository[];
  technologies: string[];
  features: string[];
  architecturalDecisions: ProjectNote[];
  challenges?: ProjectNote[];
  outcomes?: ProjectNote[];
  limitations?: string[];
  evidenceNotes?: string[];
}

// Keep private repository URLs out of this public content model entirely.
export const projects: Project[] = [
  {
    "slug": "swifttopup",
    "displayName": "SwiftTopUp",
    "title": "SwiftTopUp",
    "category": "Payments & messaging",
    "contribution": "Full-stack product engineering",
    "order": 10,
    "status": {
      "label": "Built · provider rollout in progress",
      "detail": "The public website and affiliate interface are available. Backend capabilities are documented in source; full live funding and fulfillment journeys have not been verified."
    },
    "shortDescription": "WhatsApp-first top-ups and bills, backed by a double-entry wallet and durable fulfillment.",
    "description": "SwiftTopUp brings airtime, data, electricity, cable TV and available exam PIN purchases into a guided WhatsApp conversation. I built the backend around verifiable money movement and recoverable provider operations, with React applications for the public website, affiliate workspace and administration. The product includes wallet funding, purchase confirmation, delivery updates and referral reward accounting.",
    "liveLink": {
      "label": "Visit SwiftTopUp website",
      "url": "https://swifttopup.vercel.app"
    },
    "repositories": [
      {
        "label": "API & worker repository",
        "visibility": "private"
      },
      {
        "label": "Public & affiliate repository",
        "visibility": "private"
      },
      {
        "label": "Administration repository",
        "visibility": "private"
      }
    ],
    "images": [
      {
        "src": "/images/swifttopup/website.png",
        "alt": "SwiftTopUp public website with top-ups and bills introduction and an illustrated WhatsApp conversation.",
        "caption": "Public website. The embedded WhatsApp conversation is a product illustration."
      },
      {
        "src": "/images/swifttopup/how-it-works.png",
        "alt": "SwiftTopUp website explaining the WhatsApp purchase flow.",
        "caption": "How it works. The chat illustrates verification and explicit purchase confirmation."
      },
      {
        "src": "/images/swifttopup/services.png",
        "alt": "SwiftTopUp website service cards in dark mode.",
        "caption": "Service overview in dark mode. Availability depends on provider configuration and activation."
      },
      {
        "src": "/images/swifttopup/affiliate.png",
        "alt": "SwiftTopUp affiliate workspace showing referral progress, tiers and reward balance.",
        "caption": "Affiliate workspace: attribution, qualification progress and reward accounting. This screen is not evidence of user adoption."
      }
    ],
    "technologies": [
      "TypeScript",
      "Node.js",
      "Express",
      "PostgreSQL",
      "Prisma",
      "Redis Streams",
      "React",
      "Vite",
      "TanStack Query",
      "WhatsApp Cloud API"
    ],
    "features": [
      "WhatsApp purchase flows for airtime, data, electricity, cable TV and supported WAEC/JAMB products, subject to provider availability.",
      "Deterministic catalog selection, recipient validation, expiring quotes and explicit confirmation before a purchase.",
      "Double-entry wallet accounting with concurrent-spend protection and idempotent credits, debits and refunds.",
      "Signed funding webhooks with provider-side verification of transaction identity, amount, currency and settlement.",
      "Durable fulfillment jobs, provider-status requery, refunds and reconciliation after interrupted or uncertain operations.",
      "Persisted messaging intake, outbound intentions and purchaser completion receipts, including supported tokens and PIN fields.",
      "React public website and authenticated affiliate workspace for referrals, tiers and reward balances. A separate React admin application supports operations.",
      "Optional AI intent interpretation is disabled by default. Server code validates products, recipients, quotes and financial actions. AI configuration is required for some conversational funding follow-ups."
    ],
    "architecturalDecisions": [
      {
        "title": "One modular backend, separate API and worker processes",
        "description": "Identity, wallet, commerce, messaging, rewards and administration are modules in a TypeScript modular monolith. The HTTP API and background worker run as separate processes over shared PostgreSQL data. Provider adapters isolate funding, fulfillment and messaging integrations without presenting the system as microservices."
      },
      {
        "title": "Double-entry accounting with serialized wallet mutations",
        "description": "Money is calculated in integer kobo and persisted with balanced account postings. A PostgreSQL row update locks the wallet before balance checks, serializing competing spends. Creating a purchase, recording its debit and persisting its fulfillment job share a database transaction; Redis is not the authority for a wallet balance."
      },
      {
        "title": "Verify funding before applying a financial effect",
        "description": "Raw-body signatures authenticate provider callbacks. Provider verification then checks the expected reference, ownership, amount, currency and settled state. Unique idempotency keys prevent a duplicate callback from creating another credit; ambiguous results remain under review instead of guessing who should receive funds."
      },
      {
        "title": "Recover uncertain fulfillment without a fresh purchase",
        "description": "A durable job stores the provider request ID before the external call. Timeouts and ambiguous responses lead to requery with that same ID, rather than a new purchase or blind provider failover. Leases and stale-attempt checks protect competing workers. Terminal failures use idempotent refunds, while reconciliation recovers unfinished work."
      },
      {
        "title": "Persist messaging intentions and completion notifications",
        "description": "Signed inbound WhatsApp events are persisted and deduplicated before processing. PostgreSQL stores outbound intentions and delivery attempts; Redis Streams wake workers. A successful purchase records the need for a purchaser receipt, and reconciliation repairs interrupted scheduling. A unique outbound key suppresses duplicate scheduling, while an external send can still be repeated if acceptance happens before a local failure is recorded."
      },
      {
        "title": "Reduce Redis polling while preserving recovery",
        "description": "Blocking Redis Streams reads replace frequent idle queue activity. The recorded comparison fell from 212.9 to 28 commands per minute; the latter came from 280 commands over ten minutes. That is about 86.8% fewer commands and proportionally lower command-based Upstash cost at the same per-command rate. Pending-message claiming and database reconciliation retain recovery work, so command use is reduced rather than eliminated. Recovery intervals trade promptness for background activity."
      }
    ],
    "challenges": [
      {
        "title": "Competing spends and repeated callbacks",
        "description": "Database locking, balanced postings, atomic purchase creation and unique financial keys keep retries and concurrent requests from applying the same financial effect twice."
      },
      {
        "title": "A provider timeout is an unknown result",
        "description": "Persist the request identity, hold a recoverable state and requery before deciding to fulfill or refund. This avoids treating every network failure as a failed purchase."
      },
      {
        "title": "A process can stop between a commit and a notification",
        "description": "Persist the notification intention and recover missing scheduling from durable records. Queue delivery is at least once, with idempotent database effects."
      }
    ],
    "outcomes": [
      {
        "title": "86.8% lower command-based Redis cost in the recorded comparison",
        "description": "212.9 → 28 commands/minute. Upstash pay-as-you-go charges scale with commands, so the measured activity has a proportional command-cost reduction at an unchanged unit rate. This is a historical rate comparison, not a measured whole-month invoice or a reduction in all infrastructure costs."
      },
      {
        "title": "Recoverable purchases and financial effects",
        "description": "Wallet postings, durable jobs, stable provider request IDs, reconciliation and refunds are implemented in the backend. These are source-supported capabilities; no live transaction volume or availability target is claimed."
      },
      {
        "title": "Separate customer, affiliate and operations surfaces",
        "description": "React applications cover the public website, affiliate referral workspace and administrative operations. Purchases and wallet funding run through WhatsApp and the backend rather than a public web checkout."
      }
    ],
    "limitations": [
      "Service availability depends on provider credentials, activation, product configuration and successful verification. The latest supplied sandbox report did not complete provider authentication; full live funding and fulfillment remain unverified.",
      "Delivery is at least once. Idempotency protects financial effects and notification scheduling, but cannot guarantee exactly one physical message after an uncertain external send.",
      "Optional AI interpretation and provider-specific funding paths require configuration. Permanent funding accounts require approval; not every adapter capability is enabled.",
      "Referral rewards have separate accounting. Reward withdrawal, reward-to-wallet transfer, voice processing and a contact book are not completed functionality.",
      "The recorded Redis comparison reflects the observed activity and recovery settings. It is not a controlled monthly billing study."
    ],
    "evidenceNotes": [
      "Implementation evidence: API/worker source, architecture overview and operational notes supplied by the project owner. These repositories are private.",
      "Redis evidence: recorded PHASES comparison of 212.9 commands/minute against 280 commands over ten minutes (28/minute), with the owner confirming Upstash pay-as-you-go billing.",
      "Interface evidence: four owner-supplied screenshots of the public site and affiliate workspace. Marketing chat illustrations do not demonstrate a completed live payment.",
      "Provider status: supplied sandbox report updated 16 November 2026. Source and historical tests establish implementation details, not verified production operation."
    ]
  },
  {
    "slug": "career-guidance-app",
    "title": "Career Guidance App",
    "shortDescription": "Career discovery through structured assessments, saved progress and RIASEC-based recommendations.",
    "description": "Career Compass is a full-stack career guidance platform designed to help users better understand their interests, strengths, and potential career paths. Users complete a structured assessment, receive calculated category scores, and get personalized career recommendations based on their responses.",
    "images": [
      {
        "src": "/images/career-compass-1.png",
        "alt": "Assessment platform interface.",
        "caption": "Assessment platform interface."
      },
      {
        "src": "/images/career-compass-2.png",
        "alt": "Career Compass assessment and guidance interface.",
        "caption": "Career Compass assessment and guidance interface."
      },
      {
        "src": "/images/career-compass-3.png",
        "alt": "Career Compass results and account interface.",
        "caption": "Career Compass results and account interface."
      }
    ],
    "technologies": [
      "TypeScript",
      "React",
      "Tailwind CSS",
      "React Router",
      "Tanstack Query",
      "Framer Motion",
      "Node.js",
      "Express",
      "OpenAI API",
      "PostgreSQL",
      "Prisma",
      "Rest API",
      "Neon Auth"
    ],
    "features": [
      "Secure user authentication and account synchronization",
      "Multi-step career assessment flow",
      "Assessment progress tracking and resume functionality",
      "RIASEC-based career interest scoring",
      "Personalized career assessment summaries",
      "Responsive dashboard and assessment interface",
      "Persistent assessment history",
      "Backend validation and protected API routes"
    ],
    "architecturalDecisions": [
      {
        "title": "Separate frontend and backend applications",
        "description": "The frontend and backend are maintained as separate applications, allowing each part of the system to be deployed, tested, and scaled independently."
      },
      {
        "title": "Modular backend structure",
        "description": "Backend functionality is separated into routes, controllers, services, validation schemas, and database modules to improve maintainability."
      },
      {
        "title": "Relational data modelling",
        "description": "PostgreSQL and Prisma are used to represent users, assessment questions, responses, and results with clear relationships and type-safe database access."
      },
      {
        "title": "Server-side assessment calculation",
        "description": "Assessment scoring is handled by the backend to keep the calculation rules consistent and prevent users from manipulating results in the browser."
      }
    ],
    "repositories": [
      {
        "label": "Frontend repository",
        "visibility": "public",
        "url": "https://github.com/Programmerchriz/career-guidance-app"
      },
      {
        "label": "Backend repository",
        "visibility": "public",
        "url": "https://github.com/Programmerchriz/career-guidance-api"
      }
    ],
    "liveLink": {
      "label": "Visit web demo",
      "url": "https://careeer-compasss.vercel.app"
    },
    "displayName": "Career Compass",
    "category": "Assessment platform",
    "contribution": "Full-stack engineering",
    "order": 30,
    "status": {
      "label": "Built · web demo",
      "detail": "Assessment, scoring and saved progress are documented in the existing project and CV."
    },
    "challenges": [
      {
        "title": "Keep an assessment recoverable",
        "description": "A multi-step assessment needs to survive a return visit. Persisted responses and progress let people resume instead of starting over."
      },
      {
        "title": "Keep scoring consistent",
        "description": "Calculate interest scores on the server and validate submitted responses before producing recommendations."
      }
    ],
    "outcomes": [
      {
        "title": "Resume an unfinished assessment",
        "description": "Saved progress addresses the lost-progress problem described in my CV."
      },
      {
        "title": "A complete assessment workflow",
        "description": "Authentication, responses, scoring and assessment history are connected through a separate API."
      }
    ],
    "limitations": [
      "Recommendations are guidance based on assessment responses, rather than a guarantee of career fit.",
      "No published adoption figures or controlled outcome study are available."
    ],
    "evidenceNotes": [
      "Sources: existing project documentation and CV. The resume-progress outcome is CV-reported; no numerical improvement is claimed."
    ]
  },
  {
    "slug": "vehicle-license-app",
    "title": "Vehicle License Plate Recognition System",
    "shortDescription": "Detect plates, verify registered vehicles and control access to owner information.",
    "description": "A vehicle registration and verification application combining a React interface with a Python API. Authorized staff register vehicles, submit an image for plate detection and OCR, correct a candidate when necessary, and verify it against registered records. Role-aware responses restrict sensitive owner information.",
    "images": [
      {
        "src": "/images/vehicle-license-1.png",
        "alt": "Vehicle registry dashboard and recent registration activity.",
        "caption": "Vehicle registry dashboard and recent registration activity."
      },
      {
        "src": "/images/vehicle-license-2.png",
        "alt": "Vehicle recognition workflow.",
        "caption": "Vehicle recognition workflow."
      },
      {
        "src": "/images/vehicle-license-3.png",
        "alt": "Recognized plate and registered vehicle details.",
        "caption": "Recognized plate and registered vehicle details."
      }
    ],
    "technologies": [
      "TypeScript",
      "React",
      "Tailwind CSS",
      "React Router",
      "Tanstack Query",
      "Framer Motion",
      "Python",
      "FastAPI",
      "PostgreSQL",
      "SQLAlchemy",
      "OpenCV",
      "YOLO",
      "EasyOCR",
      "Rest API",
      "Custom Auth"
    ],
    "features": [
      "JWT-based authentication with role-based access control for Admin and Officer users",
      "Vehicle registration and management with CRUD operations, search, filtering, sorting, and pagination",
      "AI-powered license plate recognition using YOLO, OpenCV, and EasyOCR",
      "Automatic vehicle verification against registered records after recognition",
      "Role-aware privacy filtering for sensitive owner information during verification",
      "Responsive dashboard with vehicle management, recognition, and verification workflows",
      "OCR candidate selection with manual plate correction and re-verification",
      "Dashboard analytics with vehicle statistics and recent registration insights"
    ],
    "architecturalDecisions": [
      {
        "title": "Layered backend architecture",
        "description": "The backend separates routers, services, schemas, models, and dependencies, keeping HTTP handling, business logic, validation, and database access modular and easy to maintain."
      },
      {
        "title": "Independent recognition and verification pipelines",
        "description": "License plate recognition and vehicle verification are implemented as separate services, allowing OCR results to be corrected, re-verified, and reused without rerunning the entire recognition process."
      },
      {
        "title": "Shared frontend API client",
        "description": "All frontend API communication is centralized through a reusable client that manages authentication headers, request timeouts, error handling, and consistent request behavior across the application."
      },
      {
        "title": "AI service optimization",
        "description": "YOLO detection, image preprocessing, and OCR are encapsulated in dedicated singleton services to avoid repeated model loading, improve performance, and simplify future enhancements to the recognition pipeline."
      }
    ],
    "repositories": [
      {
        "label": "Frontend repository",
        "visibility": "public",
        "url": "https://github.com/Programmerchriz/vehicle-plate"
      },
      {
        "label": "Backend repository",
        "visibility": "public",
        "url": "https://github.com/Programmerchriz/vehicle-plate-api"
      }
    ],
    "liveLink": {
      "label": "Visit web demo",
      "url": "https://vehicle-license.vercel.app"
    },
    "displayName": "Vehicle Recognition",
    "category": "Computer vision",
    "contribution": "Full-stack engineering",
    "order": 20,
    "status": {
      "label": "Built · web demo",
      "detail": "Registration, image-based recognition and verification are implemented. Continuous camera streams remain future work."
    },
    "challenges": [
      {
        "title": "Reduce repeated model work",
        "description": "Keep detection and OCR services loaded between requests, and reuse recognition results during verification instead of rerunning the image pipeline."
      },
      {
        "title": "Make recognition correctable",
        "description": "OCR can return ambiguous candidates. Candidate selection and manual correction give an officer a way to verify the intended plate."
      }
    ],
    "outcomes": [
      {
        "title": "~20% faster OCR processing",
        "description": "My CV records a change from roughly 16 seconds to under 13 seconds after optimizing image handling and OCR. This is a reported project comparison, not a published benchmark."
      },
      {
        "title": "Recognition and verification stay separate",
        "description": "A corrected plate can be checked against vehicle records without processing the image again."
      }
    ],
    "limitations": [
      "Image quality and the OCR models affect recognition results; manual correction remains part of the workflow.",
      "Continuous camera streams, audit logging and advanced reporting are future enhancements.",
      "No accuracy benchmark or independently reproduced latency measurement is published."
    ],
    "evidenceNotes": [
      "Sources: existing project description and architecture notes; OCR timings are reported in my CV."
    ]
  },
  {
    "slug": "cryptocurrency-finance-app",
    "title": "Cryptocurrency Finance App",
    "shortDescription": "A responsive cryptocurrency dashboard for finding assets and reading market data.",
    "description": "CoinGlobal is a responsive cryptocurrency finance application designed to present market information through a clean and approachable interface. It provides users with an efficient way to discover cryptocurrencies and inspect relevant asset information.",
    "images": [
      {
        "src": "/images/coinglobal-1.png",
        "alt": "Coin Global market dashboard.",
        "caption": "Coin Global market dashboard."
      },
      {
        "src": "/images/coinglobal-2.png",
        "alt": "Coin Global asset information.",
        "caption": "Coin Global asset information."
      },
      {
        "src": "/images/coinglobal-3.png",
        "alt": "Coin Global market interface.",
        "caption": "Coin Global market interface."
      },
      {
        "src": "/images/coinglobal-4.png",
        "alt": "Coin Global application view.",
        "caption": "Coin Global application view."
      }
    ],
    "technologies": [
      "TypeScript",
      "React",
      "Next.js",
      "Tailwind CSS",
      "PostgreSQL",
      "Prisma",
      "REST API",
      "Responsive Design"
    ],
    "features": [
      "Cryptocurrency market overview",
      "Individual cryptocurrency information",
      "Market search and asset discovery",
      "Responsive finance dashboard",
      "Reusable data-display components",
      "Loading and error states",
      "Mobile-friendly navigation",
      "External cryptocurrency API integration"
    ],
    "architecturalDecisions": [
      {
        "title": "Reusable presentation components",
        "description": "Market cards, data rows, and information sections are implemented as reusable components to keep the interface consistent."
      },
      {
        "title": "API-driven data layer",
        "description": "Cryptocurrency information is retrieved from an external API instead of being stored directly within the frontend."
      },
      {
        "title": "Responsive-first layout",
        "description": "The interface is designed to work across mobile, tablet, and desktop screen sizes without maintaining separate implementations."
      },
      {
        "title": "Separated loading and error states",
        "description": "Asynchronous API states are handled explicitly so users receive clear feedback when data is loading or unavailable."
      }
    ],
    "repositories": [
      {
        "label": "Application repository",
        "visibility": "public",
        "url": "https://github.com/Programmerchriz/coinglobal"
      }
    ],
    "liveLink": {
      "label": "Visit web demo",
      "url": "https://coin-global.vercel.app"
    },
    "displayName": "Coin Global",
    "category": "Market data",
    "contribution": "Full-stack engineering",
    "order": 40,
    "status": {
      "label": "Built · web demo",
      "detail": "Market discovery and asset information are documented in the existing project."
    },
    "challenges": [
      {
        "title": "Make changing data understandable",
        "description": "Use reusable asset views and explicit loading and error states to keep external market data understandable across screen sizes."
      }
    ],
    "outcomes": [
      {
        "title": "Market discovery in one interface",
        "description": "Search, market overviews and individual asset information share a responsive presentation layer."
      }
    ],
    "limitations": [
      "Market availability and freshness depend on the external data provider.",
      "No verified adoption or performance figures are available."
    ],
    "evidenceNotes": [
      "Sources: existing portfolio project description and CV. Outcomes describe implemented functionality rather than measured usage."
    ]
  },
  {
    "slug": "inventory-management-app",
    "title": "Inventory Management App",
    "shortDescription": "Manage products, track stock and find low-stock items from a shared dashboard.",
    "description": "The Inventory Management App provides a centralized interface for managing products and monitoring stock. It was designed to make common inventory operations straightforward while presenting important information through a responsive dashboard.",
    "images": [
      {
        "src": "/images/inventory-1.png",
        "alt": "Inventory management dashboard.",
        "caption": "Inventory management dashboard."
      },
      {
        "src": "/images/inventory-2.png",
        "alt": "Inventory product management interface.",
        "caption": "Inventory product management interface."
      },
      {
        "src": "/images/inventory-3.png",
        "alt": "Inventory application view.",
        "caption": "Inventory application view."
      }
    ],
    "technologies": [
      "TypeScript",
      "React",
      "Next.js",
      "Tailwind CSS",
      "PostgreSQL",
      "Prisma",
      "REST API",
      "Responsive Design"
    ],
    "features": [
      "Product creation and management",
      "Inventory quantity tracking",
      "Low-stock visibility",
      "Search and filtering",
      "Inventory dashboard statistics",
      "Responsive product tables",
      "Form validation",
      "Persistent product information"
    ],
    "architecturalDecisions": [
      {
        "title": "Centralized inventory data",
        "description": "Product and stock information is managed through a central backend rather than being stored only in the user's browser."
      },
      {
        "title": "Reusable form components",
        "description": "Shared input and validation patterns are used for product creation and editing to keep user interactions consistent."
      },
      {
        "title": "RESTful resource structure",
        "description": "Inventory operations are organized around predictable product endpoints for creating, reading, updating, and deleting records."
      },
      {
        "title": "Responsive dashboard design",
        "description": "The dashboard adapts its tables and summary cards to smaller screens so inventory information remains accessible on mobile devices."
      }
    ],
    "repositories": [
      {
        "label": "Application repository",
        "visibility": "public",
        "url": "https://github.com/chrisnwachukwu107/inventory-management"
      }
    ],
    "liveLink": {
      "label": "Visit web demo",
      "url": "https://chris-inventory-management-app.vercel.app"
    },
    "displayName": "Inventory Management",
    "category": "Business application",
    "contribution": "Application engineering",
    "order": 50,
    "status": {
      "label": "Built · web demo",
      "detail": "Product management, stock visibility and dashboard functionality are documented in the existing portfolio."
    },
    "challenges": [
      {
        "title": "Keep product operations consistent",
        "description": "Centralize product data and reuse form validation across creation and editing, with searchable tables for routine inventory work."
      }
    ],
    "outcomes": [
      {
        "title": "A shared view of product stock",
        "description": "Persistent product records, quantity tracking and low-stock visibility bring common inventory operations into one application."
      }
    ],
    "limitations": [
      "The available evidence describes application functionality; it does not establish a production deployment or business savings."
    ],
    "evidenceNotes": [
      "Source: existing portfolio project metadata and screenshots. No additional operational metrics have been supplied."
    ]
  }
];

export const getFeaturedProjects = () => [...projects].sort((a, b) => a.order - b.order);
export const getProjectBySlug = (slug: string) => projects.find((project) => project.slug === slug);
