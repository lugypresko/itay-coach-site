import { z } from "zod";

import {
  agentFactoryAgentNameOptions,
  agentFactoryPhaseOptions,
  agentFactoryVersion,
  approvedInsightSchema,
  claimLedgerEntrySchema,
  claimLedgerSchema,
  distributionAssetSchema,
  knowledgeAssetSchema,
  performanceSignalSchema,
  type AgentFactoryAgentName,
  type AgentFactoryPhase,
  type DistributionAsset,
  type KnowledgeAsset,
  type PerformanceSignal,
} from "./agentFactoryContracts";
import {
  agentPhaseMetadata,
  agentPromptShells,
  type AgentPromptShell,
} from "./agentFactoryPromptShells";

export interface AgentRegistryEntry {
  name: AgentFactoryAgentName;
  version: string;
  inputSchema: z.ZodTypeAny;
  outputSchema: z.ZodTypeAny;
  promptShell: AgentPromptShell;
  phase: {
    id: AgentFactoryPhase;
    order: number;
    description: string;
  };
}

const agentInputSchema = z
  .object({
    mission: z.string().trim().min(1),
    approvedInsightId: z.string().trim().min(1).optional(),
    sourceInsightIds: z.array(z.string().trim().min(1)).optional(),
    draftId: z.string().trim().min(1).optional(),
    targetQueries: z.array(z.string().trim().min(1)).optional(),
    targetEntities: z.array(z.string().trim().min(1)).optional(),
    context: z.record(z.string(), z.string()).optional(),
  })
  .strict();

const agentOutputSchema = z
  .object({
    summary: z.string().trim().min(1),
    artifacts: z.array(z.string().trim().min(1)).default([]),
    reviewStatus: z.enum(["draft", "in_review", "approved", "rejected"]),
    failureStates: z.array(z.string().trim().min(1)).default([]),
  })
  .strict();

function createRegistryEntry(name: AgentFactoryAgentName): AgentRegistryEntry {
  const phase = agentPhaseMetadata[name];

  return {
    name,
    version: agentFactoryVersion,
    inputSchema: agentInputSchema,
    outputSchema: agentOutputSchema,
    promptShell: agentPromptShells[name],
    phase: {
      id: phase.phase,
      order: phase.order,
      description: phase.description,
    },
  };
}

export const agentRegistry = agentFactoryAgentNameOptions.map((name) => createRegistryEntry(name));

export const agentRegistrySchema = z.array(
  z.object({
    name: z.enum(agentFactoryAgentNameOptions),
    version: z.literal(agentFactoryVersion),
    inputSchema: z.custom<z.ZodTypeAny>(),
    outputSchema: z.custom<z.ZodTypeAny>(),
    promptShell: z.enum(agentFactoryAgentNameOptions).or(z.any()),
  }),
);

export function getAgentRegistryEntry(name: AgentFactoryAgentName): AgentRegistryEntry | undefined {
  return agentRegistry.find((entry) => entry.name === name);
}

export {
  approvedInsightSchema,
  claimLedgerEntrySchema,
  claimLedgerSchema,
  distributionAssetSchema,
  knowledgeAssetSchema,
  performanceSignalSchema,
  type DistributionAsset,
  type KnowledgeAsset,
  type PerformanceSignal,
};
