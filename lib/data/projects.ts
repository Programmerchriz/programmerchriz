export interface Project {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  images: string[];
  liveUrl: string;
  githubUrl: string[];
  technologies: string[];
  features: string[];
  architecturalDecisions: {
    title: string;
    description: string;
  }[];
}

export const projects: Project[] = [
  {
    slug: "career-guidance-app",
    title: "Career Guidance App",
    shortDescription:
      "A career assessment platform that evaluates user interests and provides personalized career recommendations using the RIASEC model.",
    description:
      "Career Compass is a full-stack career guidance platform designed to help users better understand their interests, strengths, and potential career paths. Users complete a structured assessment, receive calculated category scores, and get personalized career recommendations based on their responses.",
    images: [
      "/images/career-compass-1.png",
      "/images/career-compass-2.png",
      "/images/career-compass-3.png",
    ],
    liveUrl: "https://careeer-compasss.vercel.app",
    githubUrl: [
      "https://github.com/Programmerchriz/career-guidance-app",
      "https://github.com/Programmerchriz/career-guidance-api",
    ],
    technologies: [
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
      "Neon Auth",
    ],
    features: [
      "Secure user authentication and account synchronization",
      "Multi-step career assessment flow",
      "Assessment progress tracking and resume functionality",
      "RIASEC-based career interest scoring",
      "Personalized career assessment summaries",
      "Responsive dashboard and assessment interface",
      "Persistent assessment history",
      "Backend validation and protected API routes",
    ],
    architecturalDecisions: [
      {
        title: "Separate frontend and backend applications",
        description:
          "The frontend and backend are maintained as separate applications, allowing each part of the system to be deployed, tested, and scaled independently.",
      },
      {
        title: "Modular backend structure",
        description:
          "Backend functionality is separated into routes, controllers, services, validation schemas, and database modules to improve maintainability.",
      },
      {
        title: "Relational data modelling",
        description:
          "PostgreSQL and Prisma are used to represent users, assessment questions, responses, and results with clear relationships and type-safe database access.",
      },
      {
        title: "Server-side assessment calculation",
        description:
          "Assessment scoring is handled by the backend to keep the calculation rules consistent and prevent users from manipulating results in the browser.",
      },
    ],
  },
  {
    slug: "vehicle-license-app",
    title: "Vehicle License Plate Recognition System",
    shortDescription:
      "An AI-powered Vehicle License Plate Recognition System. It provides secure authentication, vehicle management, OCR processing, and license plate detection.",
    description:
      "An AI-powered web application designed to automate vehicle registration, license plate recognition, and verification. The system enables authorized personnel to register vehicles, detect and recognize license plates from uploaded images or camera input, and instantly verify them against a secure database. It combines modern computer vision techniques with a responsive web interface to streamline vehicle identification while protecting sensitive owner information through role-based access control. Built with a modular architecture, the application is designed for scalability, maintainability, and future enhancements such as real-time camera streams, audit logging, and advanced reporting.",
    images: [
      "/images/vehicle-license-1.png",
      "/images/vehicle-license-2.png",
      "/images/vehicle-license-3.png",
    ],
    liveUrl: "https://vehicle-license.vercel.app",
    githubUrl: [
      "https://github.com/Programmerchriz/vehicle-plate",
      "https://github.com/Programmerchriz/vehicle-plate-api",
    ],
    technologies: [
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
      "Custom Auth",
    ],
    features: [
      "JWT-based authentication with role-based access control for Admin and Officer users",
      "Vehicle registration and management with CRUD operations, search, filtering, sorting, and pagination",
      "AI-powered license plate recognition using YOLO, OpenCV, and EasyOCR",
      "Automatic vehicle verification against registered records after recognition",
      "Role-aware privacy filtering for sensitive owner information during verification",
      "Responsive dashboard with vehicle management, recognition, and verification workflows",
      "OCR candidate selection with manual plate correction and re-verification",
      "Dashboard analytics with vehicle statistics and recent registration insights",
    ],
    architecturalDecisions: [
      {
        title: "Layered backend architecture",
        description:
          "The backend separates routers, services, schemas, models, and dependencies, keeping HTTP handling, business logic, validation, and database access modular and easy to maintain.",
      },
      {
        title: "Independent recognition and verification pipelines",
        description:
          "License plate recognition and vehicle verification are implemented as separate services, allowing OCR results to be corrected, re-verified, and reused without rerunning the entire recognition process.",
      },
      {
        title: "Shared frontend API client",
        description:
          "All frontend API communication is centralized through a reusable client that manages authentication headers, request timeouts, error handling, and consistent request behavior across the application.",
      },
      {
        title: "AI service optimization",
        description:
          "YOLO detection, image preprocessing, and OCR are encapsulated in dedicated singleton services to avoid repeated model loading, improve performance, and simplify future enhancements to the recognition pipeline.",
      },
    ]
  },
  {
    slug: "cryptocurrency-finance-app",
    title: "Cryptocurrency Finance App",
    shortDescription:
      "A modern cryptocurrency application for discovering assets, following market data, and viewing financial information.",
    description:
      "CoinGlobal is a responsive cryptocurrency finance application designed to present market information through a clean and approachable interface. It provides users with an efficient way to discover cryptocurrencies and inspect relevant asset information.",
    images: [
      "/images/coinglobal-1.png",
      "/images/coinglobal-2.png",
      "/images/coinglobal-3.png",
      "/images/coinglobal-4.png",
    ],
    liveUrl: "https://coin-global.vercel.app",
    githubUrl: [
      "https://github.com/Programmerchriz/coinglobal",
    ],
    technologies: [
      "TypeScript",
      "React",
      "Next.js",
      "Tailwind CSS",
      "PostgreSQL",
      "Prisma",
      "REST API",
      "Responsive Design",
    ],
    features: [
      "Cryptocurrency market overview",
      "Individual cryptocurrency information",
      "Market search and asset discovery",
      "Responsive finance dashboard",
      "Reusable data-display components",
      "Loading and error states",
      "Mobile-friendly navigation",
      "External cryptocurrency API integration",
    ],
    architecturalDecisions: [
      {
        title: "Reusable presentation components",
        description:
          "Market cards, data rows, and information sections are implemented as reusable components to keep the interface consistent.",
      },
      {
        title: "API-driven data layer",
        description:
          "Cryptocurrency information is retrieved from an external API instead of being stored directly within the frontend.",
      },
      {
        title: "Responsive-first layout",
        description:
          "The interface is designed to work across mobile, tablet, and desktop screen sizes without maintaining separate implementations.",
      },
      {
        title: "Separated loading and error states",
        description:
          "Asynchronous API states are handled explicitly so users receive clear feedback when data is loading or unavailable.",
      },
    ],
  },
  {
    slug: "inventory-management-app",
    title: "Inventory Management App",
    shortDescription:
      "An inventory application for tracking products, stock levels, and important inventory activity.",
    description:
      "The Inventory Management App provides a centralized interface for managing products and monitoring stock. It was designed to make common inventory operations straightforward while presenting important information through a responsive dashboard.",
    images: [
      "/images/inventory-1.png",
      "/images/inventory-2.png",
      "/images/inventory-3.png",
    ],
    liveUrl: "https://chris-inventory-management-app.vercel.app",
    githubUrl: [
      "https://github.com/chrisnwachukwu107/inventory-management",
    ],
    technologies: [
      "TypeScript",
      "React",
      "Next.js",
      "Tailwind CSS",
      "PostgreSQL",
      "Prisma",
      "REST API",
      "Responsive Design",
    ],
    features: [
      "Product creation and management",
      "Inventory quantity tracking",
      "Low-stock visibility",
      "Search and filtering",
      "Inventory dashboard statistics",
      "Responsive product tables",
      "Form validation",
      "Persistent product information",
    ],
    architecturalDecisions: [
      {
        title: "Centralized inventory data",
        description:
          "Product and stock information is managed through a central backend rather than being stored only in the user's browser.",
      },
      {
        title: "Reusable form components",
        description:
          "Shared input and validation patterns are used for product creation and editing to keep user interactions consistent.",
      },
      {
        title: "RESTful resource structure",
        description:
          "Inventory operations are organized around predictable product endpoints for creating, reading, updating, and deleting records.",
      },
      {
        title: "Responsive dashboard design",
        description:
          "The dashboard adapts its tables and summary cards to smaller screens so inventory information remains accessible on mobile devices.",
      },
    ],
  },
];

export const getProjectBySlug = (slug: string) => {
  return projects.find((project) => project.slug === slug);
};