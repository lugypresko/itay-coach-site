import { VisibilityMonitorAgent } from "../monitoring";
import type { QueryAuthorityReviewInput, VisibilityMonitorReport } from "../monitoring";

export interface VisibilityMonitoringWorkflowConfig {
  ownedDomains: string[];
  competitorRegistry?: import("../monitoring").CompetitorRegistry;
}

export function createVisibilityMonitoringWorkflow(config: VisibilityMonitoringWorkflowConfig) {
  const agent = new VisibilityMonitorAgent(config);

  return {
    run(input: QueryAuthorityReviewInput): VisibilityMonitorReport {
      return agent.run(input);
    },
  };
}
