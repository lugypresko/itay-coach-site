export type LeadPersona =
  | "individual"
  | "cto_vp_sponsor"
  | "people_hr_sponsor"
  | "referral_influencer"
  | "not_a_fit";

export type LeadSupportIntent = "self" | "managers" | "leadership_layer";

export interface LeadQualificationInput {
  name: string;
  workEmail: string;
  role: string;
  company: string;
  supportIntent: LeadSupportIntent;
  challenge: string;
  timing: string;
  managerCount?: string;
  teamCount?: string;
  sponsorRole?: string;
  initiativeStatus?: string;
  attribution?: Record<string, string>;
}

export interface LeadQualification extends LeadQualificationInput {
  persona: LeadPersona;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function classifyLeadPersona(role: string, supportIntent: LeadSupportIntent): LeadPersona {
  const normalizedRole = role.trim().toLowerCase();
  if (supportIntent === "self") return "individual";
  if (/people|hr|human resources|talent/.test(normalizedRole)) return "people_hr_sponsor";
  if (/cto|chief technology|vp engineering|vp r&d|head of engineering|engineering director/.test(normalizedRole)) {
    return "cto_vp_sponsor";
  }
  if (/referral|advisor|consultant|mentor/.test(normalizedRole)) return "referral_influencer";
  return "not_a_fit";
}

export function validateLeadQualification(input: LeadQualificationInput): string[] {
  const errors: string[] = [];
  if (!input.name.trim()) errors.push("name");
  if (!emailPattern.test(input.workEmail.trim())) errors.push("workEmail");
  if (!input.role.trim()) errors.push("role");
  if (!input.company.trim()) errors.push("company");
  if (!input.challenge.trim()) errors.push("challenge");
  if (!input.timing.trim()) errors.push("timing");
  if (input.supportIntent !== "self" && input.supportIntent !== "managers" && input.supportIntent !== "leadership_layer") {
    errors.push("supportIntent");
  }
  return errors;
}

export function buildLeadQualification(input: LeadQualificationInput): LeadQualification {
  return {
    ...input,
    name: input.name.trim(),
    workEmail: input.workEmail.trim().toLowerCase(),
    role: input.role.trim(),
    company: input.company.trim(),
    challenge: input.challenge.trim(),
    timing: input.timing.trim(),
    persona: classifyLeadPersona(input.role, input.supportIntent),
  };
}
