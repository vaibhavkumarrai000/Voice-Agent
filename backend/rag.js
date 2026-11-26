import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Knowledge Base
let knowledgeBase = {};
try {
  const kbPath = path.join(__dirname, 'knowledgeBase.json');
  const rawKb = fs.readFileSync(kbPath, 'utf-8');
  knowledgeBase = JSON.parse(rawKb);
  console.log('📚 [RAG] Loaded knowledge base successfully.');
} catch (err) {
  console.error('❌ [RAG] Error reading knowledgeBase.json:', err.message);
}

/**
 * Normalized Document Chunks indexed from knowledgeBase.json.
 * Each chunk has metadata, content, and weighted semantic keywords.
 */
const KNOWLEDGE_CHUNKS = [
  // 1. Product Overview
  {
    id: 'kb_product_overview',
    category: 'Product & Vision',
    title: 'FortiCRM Pro Overview & Value Proposition',
    source: 'knowledgeBase.json -> product',
    keywords: ['forticrm', 'product', 'crm', 'autonomous', 'voice', 'sales', 'agent', 'revenue', 'pipeline', 'overview', 'features', 'platform', 'zero-admin'],
    content: `${knowledgeBase?.product?.name || 'FortiCRM Pro'}: ${knowledgeBase?.product?.tagline || ''} ${knowledgeBase?.product?.overview || ''}. Combines autonomous voice AI, real-time BANT qualification, and 1-click CRM synchronization.`,
  },

  // 2. Pricing - Starter & Growth Tiers
  {
    id: 'kb_pricing_growth_starter',
    category: 'Pricing',
    title: 'Starter & Growth Pricing Tiers',
    source: 'knowledgeBase.json -> pricing.tiers',
    keywords: ['pricing', 'price', 'cost', 'tier', 'seat', 'starter', 'growth', 'month', 'annual', 'cheap', 'package', '99', '49', 'licensing', 'afford', 'budget'],
    content: `Pricing Tiers:
- Starter ($49/seat/mo): For 1-5 reps; core pipeline, email sync, standard support.
- Growth ($99/seat/mo, Most Popular): For 5-30 reps; includes Autonomous Voice & Chat Qualification Agent, real-time BANT qualification, automated meeting scheduling, HubSpot 1-click migration, and 4-hour SLA support.
- Annual discount: 15% off total annual commitment.`,
  },

  // 3. Pricing - Enterprise Tier
  {
    id: 'kb_pricing_enterprise',
    category: 'Pricing',
    title: 'Enterprise Tier & Custom Integrations',
    source: 'knowledgeBase.json -> pricing.tiers.enterprise',
    keywords: ['enterprise', 'pricing', 'custom', 'scale', 'large', 'sla', 'unlimited', 'dedicated', 'csm', '199', 'volume', 'quote', 'contract'],
    content: `Enterprise Tier ($199/seat/month): Designed for teams with 30+ reps. Includes dedicated Solutions Engineer, SOC 2 Type II compliance pack, custom HIPAA BAA, Enterprise SSO (SAML 2.0/Okta), 99.99% uptime SLA, and custom AI fine-tuning with zero data retention.`,
  },

  // 4. Security, SOC 2 & HIPAA Compliance
  {
    id: 'kb_security_soc2_hipaa',
    category: 'Security & Compliance',
    title: 'SOC 2 Type II, HIPAA, and Data Encryption',
    source: 'knowledgeBase.json -> securityCompliance',
    keywords: ['security', 'soc2', 'soc 2', 'compliance', 'compliant', 'hipaa', 'gdpr', 'encrypt', 'encryption', 'aes-256', 'tls', 'safe', 'privacy', 'audit', 'schellman', 'iso', 'infosec'],
    content: `Security & Compliance Attestation:
- SOC 2 Type II Certified (audited annually by Schellman & Co.).
- HIPAA Compliant with standard Business Associate Agreement (BAA) for healthcare workflows.
- ISO/IEC 27001:2022 certified, GDPR and CCPA compliant.
- End-to-end encryption: AES-256 at rest, TLS 1.3 enforced for all voice streaming and API traffic. Regional data residency available in US, EU, and APAC.`,
  },

  // 5. AI Data Privacy & Ephemeral Voice Guarantee
  {
    id: 'kb_ai_privacy_guarantee',
    category: 'Security & Compliance',
    title: 'AI Privacy Policy: Zero Public Model Training',
    source: 'knowledgeBase.json -> securityCompliance.aiPrivacyGuarantee',
    keywords: ['ai', 'privacy', 'training', 'train', 'retention', 'voice', 'model', 'proprietary', 'confidential', 'audio', 'recordings', 'listen', 'leak', 'safe'],
    content: `Enterprise AI Privacy Guarantee:
FortiCRM Pro STRICTLY DOES NOT train public foundation models on customer conversations, voice recordings, or CRM data. Voice streams are processed in ephemeral memory buffers and immediately purged post-transcription unless explicit compliance archiving is configured.`,
  },

  // 6. HubSpot Migration & Zero Downtime
  {
    id: 'kb_hubspot_migration',
    category: 'Migration',
    title: 'HubSpot 1-Click Migration & Zero-Downtime Guarantee',
    source: 'knowledgeBase.json -> hubspotMigration',
    keywords: ['hubspot', 'migration', 'migrate', 'switch', 'import', 'export', 'transfer', 'transition', 'downtime', 'contacts', 'properties', 'history', 'connector', 'salesforce'],
    content: `HubSpot Migration Capabilities:
- 1-Click Turnkey Migration connector takes under 45 minutes for standard instances.
- Zero Downtime Guarantee: Dual-sync capability allows teams to test FortiCRM Pro while HubSpot runs simultaneously with zero lead loss.
- 100% Data Preservation: Retains all contacts, companies, deals, custom properties, notes, and call recordings.
- Complimentary 14-day transition overlap period with no double billing. Dedicated Migration Engineer for 15+ seats.`,
  },

  // 7. Objection 1: Locked into Legacy Contract (HubSpot/Salesforce)
  {
    id: 'kb_objection_locked_contract',
    category: 'Objection Handling',
    title: 'Objection: Locked into Existing Contract (HubSpot / Salesforce)',
    source: 'knowledgeBase.json -> salesObjectionHandlers[0]',
    keywords: ['locked', 'contract', 'agreement', 'remaining', 'months', 'double', 'pay', 'paying', 'offset', 'buyout', 'credit', 'annual', 'current', 'stuck', 'renew'],
    content: `Objection Strategy — Locked into Contract:
Acknowledge the timing. Solution: FortiCRM Pro offers our 'Seamless Transition Bridge Program'—we credit up to 6 months of FortiCRM Pro licensing to offset your remaining legacy vendor contract. Set up your sandbox and 1-click migration now so your reps hit the ground running with zero double billing.`,
  },

  // 8. Objection 2: Data Security & AI Listening Concerns
  {
    id: 'kb_objection_data_security',
    category: 'Objection Handling',
    title: 'Objection: AI Listening, Compliance & Infosec Governance',
    source: 'knowledgeBase.json -> salesObjectionHandlers[1]',
    keywords: ['objection', 'security', 'infosec', 'governance', 'listening', 'spying', 'cloud', 'breach', 'policy', 'legal', 'risk'],
    content: `Objection Strategy — Security & Infosec:
Reassure enterprise zero-retention guarantee. FortiCRM Pro is SOC 2 Type II certified and HIPAA compliant with signed BAAs. Transcripts and audio are encrypted in-transit (TLS 1.3) and at-rest (AES-256). We can provide Schellman's latest SOC 2 audit report and DPA package immediately.`,
  },

  // 9. Objection 3: Rep Adoption & Learning Curve
  {
    id: 'kb_objection_adoption_curve',
    category: 'Objection Handling',
    title: 'Objection: Sales Rep Tool Fatigue & Learning Curves',
    source: 'knowledgeBase.json -> salesObjectionHandlers[2]',
    keywords: ['adoption', 'reps', 'learning', 'curve', 'complicated', 'complex', 'hate', 'fatigue', 'time', 'training', 'difficult', 'friction'],
    content: `Objection Strategy — Rep Adoption:
FortiCRM Pro operates on a 'Zero-Admin' philosophy. Reps don't need to do manual data entry; the autonomous voice agent automatically extracts BANT metrics, logs call summaries, and updates deal stages directly. Rep onboarding takes under 30 minutes, with a 94% 30-day active adoption rate.`,
  },

  // 10. Scheduling, Calendar Booking & Multilingual Demo
  {
    id: 'kb_scheduling_multilingual',
    category: 'Capabilities',
    title: 'Calendar Booking & Multi-Language Support (English/Hindi)',
    source: 'knowledgeBase.json -> faq',
    keywords: ['demo', 'booking', 'schedule', 'calendar', 'google meet', 'zoom', 'appointment', 'meeting', 'language', 'hindi', 'english', 'multilingual', 'time', 'tomorrow'],
    content: `Automated Booking & Language Features:
- Real-time bi-directional integration with Google Calendar and Microsoft 365 to verify rep availability and hold calendar slots instantly.
- Native multilingual support for English (US, UK, Indian accents) and Hindi, dynamically detecting customer dialect preferences during voice calls.`,
  },
];

/**
 * Synonym map to expand user queries for robust semantic recall
 */
const SYNONYMS = {
  price: ['pricing', 'cost', 'seat', 'tier', 'dollars', 'budget', 'afford', 'rate', 'licensing'],
  hubspot: ['migration', 'switch', 'import', 'transfer', 'crm', 'salesforce'],
  security: ['soc2', 'compliance', 'hipaa', 'gdpr', 'encryption', 'privacy', 'safe', 'audit'],
  contract: ['locked', 'annual', 'renew', 'buyout', 'credit', 'double', 'remaining'],
  demo: ['schedule', 'meeting', 'booking', 'calendar', 'call', 'talk'],
  reps: ['adoption', 'learning', 'complex', 'fatigue', 'salespeople'],
};

/**
 * Tokenize and normalize query text
 */
function tokenize(text = '') {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2);
}

/**
 * Fast, clean keyword + semantic scoring retrieval function.
 * Returns the top 2 most relevant knowledge base entries.
 *
 * Designed with a clean interface that can be dropped directly into
 * MongoDB Atlas Vector Search ($vectorSearch aggregation) in production:
 *
 * ```javascript
 * // Future MongoDB Atlas Vector Search drop-in:
 * // const results = await collection.aggregate([
 * //   { $vectorSearch: { queryVector: embedding, path: "embedding", numCandidates: 10, limit: 2 } }
 * // ]).toArray();
 * ```
 *
 * @param {string} query - The prospect user message or topic query
 * @param {object} options - Optional configuration (e.g., topK)
 * @returns {Array} Top matching knowledge base entries
 */
export function retrieveContext(query = '', options = { topK: 2 }) {
  if (!query || typeof query !== 'string' || !query.trim()) {
    // Return default overview and pricing if empty
    return [KNOWLEDGE_CHUNKS[0], KNOWLEDGE_CHUNKS[1]];
  }

  const queryTokens = tokenize(query);

  // Expand query tokens with synonyms
  const expandedTokens = new Set(queryTokens);
  for (const token of queryTokens) {
    for (const [key, synList] of Object.entries(SYNONYMS)) {
      if (token === key || synList.includes(token)) {
        expandedTokens.add(key);
        synList.forEach((s) => expandedTokens.add(s));
      }
    }
  }

  const lowerQuery = query.toLowerCase();

  // Score each chunk
  const scoredChunks = KNOWLEDGE_CHUNKS.map((chunk) => {
    let score = 0;
    const lowerTitle = chunk.title.toLowerCase();
    const lowerContent = chunk.content.toLowerCase();

    // 1. Exact phrase boost
    if (lowerContent.includes(lowerQuery) || lowerTitle.includes(lowerQuery)) {
      score += 25;
    }

    // 2. Title keyword matches (High weight)
    for (const token of expandedTokens) {
      if (lowerTitle.includes(token)) {
        score += 8;
      }
    }

    // 3. Document keyword tags match (High weight)
    for (const kw of chunk.keywords) {
      if (expandedTokens.has(kw) || lowerQuery.includes(kw)) {
        score += 6;
      }
    }

    // 4. Content token frequency match
    for (const token of queryTokens) {
      const occurrences = (lowerContent.match(new RegExp(`\\b${token}`, 'g')) || []).length;
      score += Math.min(occurrences * 2, 8);
    }

    return {
      ...chunk,
      score,
      relevanceScore: Math.min(99, Math.round(50 + score * 1.5)),
    };
  });

  // Sort descending by score
  scoredChunks.sort((a, b) => b.score - a.score);

  const topK = options.topK || 2;
  const topMatches = scoredChunks.slice(0, topK);

  return topMatches.map(({ id, category, title, source, content, relevanceScore }) => ({
    id,
    category,
    title,
    source,
    content,
    relevanceScore,
  }));
}

export default {
  retrieveContext,
  KNOWLEDGE_CHUNKS,
};
