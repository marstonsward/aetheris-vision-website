import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export const REGULATED_FRAMEWORKS = ['cmmc', 'fisma', 'hipaa', 'pci-dss'] as const;
export type RegulatedFramework = typeof REGULATED_FRAMEWORKS[number];

interface ClientProfile {
  companyName: string;
  industry: string;
  revenue: string;
  location: string;
  primaryAudience: string;
  budgetRange: string;
  specialRequirements: string;
  objectives: string[];
  complianceNeeds: string[];
}

const FRAMEWORK_BRIEFS: Record<RegulatedFramework, string> = {
  cmmc: `CMMC Level 1-2 (Cybersecurity Maturity Model Certification).
Level 1: 17 practices, FAR 52.204-21, annual self-attestation, for systems handling FCI (Federal Contract Information). Engagement: $5,800-$16,500.
Level 2: 110 practices, NIST SP 800-171, C3PAO assessment required, for systems handling CUI (Controlled Unclassified Information). Engagement: $27,000-$79,000.
Infrastructure requirement for L2: must migrate from standard Vercel/Neon to AWS GovCloud + RDS in VPC.
Key deliverables: SSP, POA&M, SPRS score worksheet, security architecture diagram, pre-assessment mock review.
Watch for: client may not know if they handle FCI vs CUI — ask specifically about contract vehicle and data type.`,

  fisma: `FISMA / NIST Risk Management Framework (RMF).
Applies to: federal agency systems and contractor-operated systems on behalf of agencies.
Requires Authority to Operate (ATO) before the system can go live in a federal environment.
7 RMF steps: Prepare, Categorize (FIPS 199), Select (NIST SP 800-53 controls), Implement, Assess, Authorize, Monitor.
Hosting requirement: must use FedRAMP-authorized platform (AWS GovCloud, Azure Government, Google Cloud Government). Standard Vercel/Neon is not acceptable.
Key deliverables: SSP (~150 pages), SAP, SAR, POA&M, ATO package for Authorizing Official.
Engagement: $62,000-$124,000 full cycle; $2,000-$5,000/mo ongoing monitoring retainer.
Watch for: who is the federal agency, who is the AO, is there an existing SSP or is this a new system.`,

  hipaa: `HIPAA (Health Insurance Portability and Accountability Act).
Applies to: covered entities (healthcare providers, health plans, clearinghouses) and their business associates.
Critical: standard Vercel/Neon hosting is NOT HIPAA-eligible. Must move to AWS with signed BAA. Infrastructure cost adds $150-600/mo.
Technical safeguards required: access control, audit logging, data integrity controls, TLS 1.2+ enforced.
PHI must be encrypted at application layer (AES-256-GCM) — platform encryption alone is insufficient.
BAA chain: AV signs BAA with client, AV signs BAA with AWS (and any other sub-processors).
Key deliverables: BAA, PHI data map, risk analysis, breach notification procedure, workforce training policy.
Engagement: $16,000-$42,000 plus infrastructure cost increase.
Watch for: client must confirm ePHI is in scope (not just healthcare adjacent), identify all 18 PHI identifier types in use.`,

  'pci-dss': `PCI DSS v4.0 (Payment Card Industry Data Security Standard).
SAQ A: Fully outsourced payment via Stripe hosted checkout — minimal AV scope, lowest cost.
SAQ A-EP: Custom payment form using Stripe.js on client side — broader scope, stricter requirements.
SAQ D: Merchant processes/stores/transmits card data directly — full scope, QSA required, very expensive.
Cardinal rule: card data must never touch AV-built servers. Always use Stripe tokenization and hosted elements.
Key deliverables: completed SAQ, CDE (Cardholder Data Environment) boundary diagram, security policy documentation.
Engagement: $8,600-$21,200 depending on SAQ level.
Watch for: determine SAQ level first — most small business clients are SAQ A if using Stripe Payment Links or Checkout.`,
};

export async function generateComplianceScoping(profile: ClientProfile): Promise<string> {
  const triggered = profile.complianceNeeds.filter(
    (f): f is RegulatedFramework => (REGULATED_FRAMEWORKS as readonly string[]).includes(f)
  );

  if (triggered.length === 0) return '';

  const frameworkContext = triggered
    .map(f => `=== ${f.toUpperCase()} ===\n${FRAMEWORK_BRIEFS[f]}`)
    .join('\n\n');

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1500,
    messages: [{
      role: 'user',
      content: `You are a security compliance consultant at Aetheris Vision LLC preparing an internal scoping brief. A client just submitted a project intake form selecting regulated compliance frameworks that require a scoping call before any pricing or SOW is issued.

CLIENT PROFILE:
Company: ${profile.companyName}
Industry: ${profile.industry}
Revenue Range: ${profile.revenue || 'Not provided'}
Location: ${profile.location}
Primary Audience: ${profile.primaryAudience}
Budget Selected on Form: ${profile.budgetRange}
Project Objectives: ${profile.objectives.join(', ') || 'Not specified'}
All Compliance Needs Selected: ${profile.complianceNeeds.join(', ')}
Special Requirements: ${profile.specialRequirements || 'None stated'}

REGULATED FRAMEWORKS TRIGGERED: ${triggered.join(', ').toUpperCase()}

FRAMEWORK REFERENCE:
${frameworkContext}

Write a concise internal scoping brief. Structure it exactly as follows (plain text, no markdown symbols):

RISK FLAGS
List immediate concerns: budget mismatch (note if selected budget is far below framework minimums), industry indicators, missing information that affects scope.

SCOPING CALL AGENDA
List 6-8 specific questions for this client. Make them specific to their industry and selections, not generic.

PRELIMINARY ARTIFACT LIST
List what AV will deliver if this engagement proceeds, organized by framework.

INFRASTRUCTURE IMPACT
Describe hosting/stack changes required versus the standard Vercel/Neon setup.

ESTIMATED ENGAGEMENT RANGE
Give a realistic dollar range and timeline for this specific client combination.

Keep it actionable and specific. This goes directly to Marston to prepare for the scoping call.`,
    }],
  });

  const content = message.content[0];
  if (content.type !== 'text') return '';
  return content.text;
}
