/**
 * Mock data representing realistic conversational states for HelpingHand AI B2B sales call.
 * Designed to make live coding interview demonstrations instantaneous and engaging.
 */

export const INITIAL_TRANSCRIPT_EN = [
  {
    id: 1,
    speaker: 'agent',
    name: 'HelpingHand AI',
    time: '10:02:15 AM',
    text: "Welcome to HelpingHand AI! This is Taylor calling. I saw your team requested information regarding our autonomous sales qualification platform. Did I catch you at a reasonable time?",
    highlight: false,
  },
  {
    id: 2,
    speaker: 'lead',
    name: 'Alex Chen (VP Sales Ops, TechScale Inc.)',
    time: '10:02:24 AM',
    text: "Hey Taylor. Yeah, I have about five minutes before my next meeting. We're currently using HubSpot, but our reps are spending 8 hours a week manually logging notes and pipeline updates, so we're evaluating automated alternatives.",
    highlight: true,
  },
  {
    id: 3,
    speaker: 'agent',
    name: 'HelpingHand AI',
    time: '10:02:40 AM',
    text: "That's a classic bottleneck we hear from fast-scaling teams. HelpingHand AI is built on zero-admin architecture—it automatically transcribes calls, qualifies inbound leads using BANT frameworks, and syncs updates to your deals in real-time. Plus, we offer a 1-click zero-downtime migration wizard from HubSpot.",
    highlight: false,
  },
  {
    id: 4,
    speaker: 'lead',
    name: 'Alex Chen',
    time: '10:03:02 AM',
    text: "That sounds promising, but we still have 7 months remaining on our HubSpot enterprise agreement. We really can't double-pay for two CRMs right now.",
    highlight: true,
  },
  {
    id: 5,
    speaker: 'agent',
    name: 'HelpingHand AI',
    time: '10:03:22 AM',
    text: "Totally understand, Alex. To solve that, we offer our 'Seamless Transition Bridge Program' where we credit up to 6 months of HelpingHand AI licensing to offset your remaining HubSpot contract. We can migrate your historical data to a sandbox now with zero downtime so your team is ready on day one without double billing.",
    highlight: false,
  },
];

export const INITIAL_TRANSCRIPT_HI = [
  {
    id: 1,
    speaker: 'agent',
    name: 'HelpingHand AI',
    time: '10:02:15 AM',
    text: "HelpingHand AI में आपका स्वागत है! मैं टेलर बोल रहा हूँ। आपकी टीम ने हमारे ऑटोनॉमस सेल्स क्वालिफिकेशन प्लेटफॉर्म के बारे में जानकारी माँगी थी। क्या अभी 2 मिनट बात करने का सही समय है?",
    highlight: false,
  },
  {
    id: 2,
    speaker: 'lead',
    name: 'Alex Chen (VP Sales Ops)',
    time: '10:02:30 AM',
    text: "हाँ टेलर, बोलिए। हम अभी HubSpot इस्तेमाल कर रहे हैं पर सेल्स टीम का काफी समय मैन्युअल डेटा एंट्री में खराब हो रहा है।",
    highlight: true,
  },
  {
    id: 3,
    speaker: 'agent',
    name: 'HelpingHand AI',
    time: '10:02:48 AM',
    text: "बिल्कुल एलेक्स, HelpingHand AI आपकी कॉल्स और लीड्स को BANT फ्रेमवर्क के जरिए अपने आप क्वालिफाई और सिंक करता है। साथ ही HubSpot से 1-क्लिक सीमलेस माइग्रेशन भी उपलब्ध है।",
    highlight: false,
  },
];

export const INITIAL_BANT = {
  budget: {
    status: true,
    label: 'Budget',
    detail: '$50k - $75k annual SaaS budget allocated for sales automation & CRM',
    confidence: '95%',
  },
  authority: {
    status: true,
    label: 'Authority',
    detail: 'Alex Chen (VP of Sales Operations) + CTO approval required for InfoSec',
    confidence: '90%',
  },
  need: {
    status: true,
    label: 'Need',
    detail: 'Eliminate 8+ hrs/week of manual CRM logging per rep & automate lead qualification',
    confidence: '98%',
  },
  timeline: {
    status: true,
    label: 'Timeline',
    detail: 'Pilot rollout targeted within 30 days before start of next quarter',
    confidence: '85%',
  },
};

export const INITIAL_RAG_SNIPPET = {
  query: 'HubSpot contract lock-in & migration policy',
  category: 'Contractual Objection & Migration',
  source: 'knowledgeBase.json -> salesObjectionHandlers.obj_01_locked_contract',
  relevance: 98,
  snippet: "Seamless Transition Bridge Program: HelpingHand AI credits up to 6 months of licensing to offset remaining legacy HubSpot contracts. 1-click zero-downtime dual sync connector preserves all historical deals, contacts, custom properties, and call recordings.",
};

export const INITIAL_APPOINTMENTS = [
  {
    id: 'apt_101',
    title: '30-min Technical Architecture & Migration Review',
    dateTime: 'Tomorrow • 2:30 PM - 3:00 PM EST',
    host: 'Jordan Lee (Principal Solutions Engineer)',
    attendee: 'Alex Chen (VP Sales Ops, TechScale)',
    status: 'Confirmed',
    location: 'Google Meet',
    calendarSynced: true,
  },
];

export const INITIAL_SUMMARY = {
  leadName: 'Alex Chen',
  company: 'TechScale Inc. (120 Reps)',
  opportunityStage: 'Sales Qualified Lead (SQL) -> Technical Evaluation',
  executiveRecap: 'VP of Sales Ops experiencing severe rep friction from manual CRM data entry on HubSpot. Strong intent to automate B2B outbound qualification with voice AI.',
  keyPainPoints: [
    'Reps spending 8 hrs/week on administrative CRM data entry instead of selling',
    '7 months remaining on existing HubSpot contract causing budget lock-in anxiety',
    'Strict InfoSec requirements regarding SOC 2 Type II and customer data privacy',
  ],
  agreedNextSteps: [
    'Send Schellman SOC 2 Type II audit report & DPA packet to Alex and InfoSec team',
    'Apply 6-Month Transition Credit to offset remaining HubSpot contract period',
    'Host 30-min live migration sandbox walkthrough on Google Meet tomorrow at 2:30 PM EST',
  ],
};

export const INTERVIEW_SIMULATION_EVENTS = [
  {
    label: 'Raise SOC 2 Security Concern',
    leadText: "One quick question about compliance: we work with healthcare clients. Is your AI model SOC 2 Type II and HIPAA compliant, and do you train on our voice data?",
    agentReply: "Security is non-negotiable for us. HelpingHand AI is SOC 2 Type II certified and HIPAA compliant with standard BAAs. We have a strict zero-data-retention guarantee—your voice recordings and customer transcripts are never used to train public AI foundation models.",
    ragSnippet: {
      query: 'SOC 2 Type II & HIPAA compliance policy',
      category: 'Security & Compliance',
      source: 'knowledgeBase.json -> securityCompliance',
      relevance: 99,
      snippet: "SOC 2 Type II certified (audited by Schellman). HIPAA compliant with BAA. AES-256 encryption at rest, TLS 1.3 in transit. AI Privacy Guarantee: Customer voice streams are processed in ephemeral memory buffers with ZERO model training retention.",
    },
    leadScoreChange: 94,
    sentiment: 'Positive & Reassured',
  },
  {
    label: 'Inquire on Pricing Tiers',
    leadText: "What does the pricing look like if we roll this out to our 25 account executives?",
    agentReply: "For a 25-rep team, our Growth Tier at $99 per seat/month is the sweet spot. It includes our Autonomous Voice Qualification Agent, BANT intelligence engine, automated scheduling, and the 1-click HubSpot migration connector.",
    ragSnippet: {
      query: 'Growth Tier pricing for 25 seats',
      category: 'Pricing Structure',
      source: 'knowledgeBase.json -> pricing.tiers[Growth]',
      relevance: 96,
      snippet: "Growth Tier: $99/seat/month. Includes Autonomous Voice & Chat Qualification, real-time BANT & sentiment engine, automated calendar hold injection, and HubSpot bi-directional connector with 4-hour SLA.",
    },
    leadScoreChange: 96,
    sentiment: 'High Purchase Intent',
  },
];
