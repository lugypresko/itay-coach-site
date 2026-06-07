import path from "node:path";
import { fileURLToPath } from "node:url";

import { postgresAdapter } from "@payloadcms/db-postgres";
import { buildConfig } from "payload";

import {
  AgentRuns,
  CaseStudies,
  ClusterPages,
  ContentJobs,
  EmailSubscribers,
  FAQs,
  Frameworks,
  GlossaryTerms,
  EntityPages,
  InternalLinks,
  LeadMagnets,
  Media,
  PillarPages,
  ResearchSources,
  Users,
} from "./src/payload/collections";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: "users",
    importMap: {
      baseDir: path.resolve(dirname, "src/app/(payload)"),
      importMapFile: path.resolve(dirname, "src/app/(payload)/admin/importMap.js"),
    },
  },
  collections: [
    Users,
    Media,
    EntityPages,
    PillarPages,
    ClusterPages,
    Frameworks,
    CaseStudies,
    FAQs,
    GlossaryTerms,
    LeadMagnets,
    EmailSubscribers,
    ResearchSources,
    InternalLinks,
    ContentJobs,
    AgentRuns,
  ],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL ?? "",
    },
  }),
  graphQL: {
    disable: false,
  },
  routes: {
    admin: "/admin",
    api: "/api",
    graphQL: "/graphql",
    graphQLPlayground: "/graphql-playground",
  },
  secret: process.env.PAYLOAD_SECRET ?? "replace-me-in-production",
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3000",
  typescript: {
    outputFile: "src/payload-types.ts",
  },
});
