import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { retrieveContext } from './rag.js';
import { 
  processTurn, 
  generateSummary, 
  getCrmBookings, 
  getSession,
  sessions,
  getGeminiStatus
} from './agent.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Load knowledgeBase for metadata reference
let knowledgeBase = {};
try {
  const kbPath = path.join(__dirname, 'knowledgeBase.json');
  const rawKb = fs.readFileSync(kbPath, 'utf-8');
  knowledgeBase = JSON.parse(rawKb);
  console.log('📚 [Knowledge Base] Loaded successfully for:', knowledgeBase?.product?.name || 'HelpingHand AI');
} catch (err) {
  console.error('❌ Failed to load knowledgeBase.json:', err.message);
}

/**
 * Health Check Route
 */
app.get('/api/health', (req, res) => {
  const status = getGeminiStatus();
  res.status(200).json({
    status: 'ok',
    service: 'HelpingHand AI Sales Voice Agent API',
    product: knowledgeBase?.product?.name || 'HelpingHand AI',
    model: status.model,
    geminiSdkConfigured: status.configured,
    keySnippet: status.keySnippet,
    activeSessions: sessions.size,
    totalCrmBookings: getCrmBookings().length,
    serverTime: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
  });
});

/**
 * Get Full Knowledge Base
 */
app.get('/api/knowledge-base', (req, res) => {
  res.status(200).json({
    success: true,
    data: knowledgeBase,
  });
});

/**
 * Fast Keyword + Semantic RAG Retrieval Endpoint
 */
app.get('/api/rag/retrieve', (req, res) => {
  const query = req.query.q || '';
  const topK = parseInt(req.query.limit, 10) || 2;
  const snippets = retrieveContext(query, { topK });

  res.status(200).json({
    success: true,
    query,
    count: snippets.length,
    snippets,
  });
});

/**
 * POST /api/chat
 * Primary voice agent turn handler.
 */
app.post('/api/chat', async (req, res) => {
  try {
    const { sessionId = 'session_default', message = '', language = 'en' } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: message',
      });
    }

    console.log(`\n🎙️ [Voice Turn] [Session: ${sessionId}] [Lang: ${language}] User: "${message}"`);

    const turnResult = await processTurn({
      sessionId,
      userMessage: message,
      language,
    });

    console.log(`💬 [Agent Response]: "${turnResult.reply}" (Score: ${turnResult.leadScore}/100, Sentiment: ${turnResult.sentiment})\n`);

    return res.status(200).json({
      success: true,
      ...turnResult,
    });
  } catch (error) {
    console.error('❌ Error processing /api/chat turn:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal Server Error during conversational turn',
    });
  }
});

/**
 * POST /api/end-call
 * Ends call session, generates executive post-call summary using Gemini,
 * and returns CRM booking logs.
 */
app.post('/api/end-call', async (req, res) => {
  try {
    const { sessionId = 'session_default' } = req.body;

    console.log(`\n📞 [Call Ended] Generating executive summary for session: "${sessionId}"...`);

    const summaryReport = await generateSummary(sessionId);

    console.log(`📋 [Executive Summary Ready] Likelihood: ${summaryReport.summary.dealLikelihood}, Bookings: ${summaryReport.crmBookings?.length || 0}\n`);

    return res.status(200).json({
      success: true,
      ...summaryReport,
    });
  } catch (error) {
    console.error('❌ Error generating /api/end-call summary:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal Server Error generating summary',
    });
  }
});

/**
 * GET /api/crm
 * Returns all booked appointments stored across calls
 */
app.get('/api/crm', (req, res) => {
  const bookings = getCrmBookings();
  res.status(200).json({
    success: true,
    count: bookings.length,
    bookings,
  });
});

// Start Server
app.listen(PORT, () => {
  const status = getGeminiStatus();
  console.log(`\n========================================================`);
  console.log(`🚀 HelpingHand AI Backend listening on http://localhost:${PORT}`);
  console.log(`🧠 AI Engine: ${status.model} (@google/genai)`);
  console.log(`🔑 Gemini Key Status: ${status.configured ? `Configured (${status.keySnippet})` : 'NOT_SET (check backend/.env)'}`);
  console.log(`📚 Knowledge Base: HelpingHand AI (Enterprise RAG active)`);
  console.log(`--------------------------------------------------------`);
  console.log(`📡 GET  /api/health        - Service health & Gemini status`);
  console.log(`💬 POST /api/chat          - Live voice conversation turn`);
  console.log(`📞 POST /api/end-call      - Post-call report & CRM sync`);
  console.log(`📅 GET  /api/crm           - Booked appointments registry`);
  console.log(`🔍 GET  /api/rag/retrieve  - Fast RAG context retrieval`);
  console.log(`========================================================\n`);
});
