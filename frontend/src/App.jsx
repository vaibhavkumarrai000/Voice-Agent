import React, { useState, useEffect, useRef, useCallback } from 'react';

import {
  INITIAL_TRANSCRIPT_EN,
  INITIAL_TRANSCRIPT_HI,
  INITIAL_BANT,
  INITIAL_RAG_SNIPPET,
  INITIAL_APPOINTMENTS,
  INITIAL_SUMMARY,
} from './data/mockCallData.js';

export default function App() {
  // Session & Voice Call State
  const [sessionId, setSessionId] = useState(() => 'sess_' + Date.now());
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [language, setLanguage] = useState('en'); // 'en' | 'hi'
  const [agentStatus, setAgentStatus] = useState('idle'); // 'idle' | 'listening' | 'thinking' | 'speaking' | 'ended'

  // Modals & Drawer State
  const [isCrmDrawerOpen, setIsCrmDrawerOpen] = useState(false);
  const [isTranscriptModalOpen, setIsTranscriptModalOpen] = useState(false);
  const [dockInputText, setDockInputText] = useState('');

  // AI & Conversation State
  const [transcript, setTranscript] = useState([]);

  const [leadScore, setLeadScore] = useState(92);
  const [sentiment, setSentiment] = useState('Positive');
  const [bant, setBant] = useState(INITIAL_BANT);
  const [ragSnippet, setRagSnippet] = useState(INITIAL_RAG_SNIPPET);
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);
  const [summary, setSummary] = useState(INITIAL_SUMMARY);
  const [interimUserSpeech, setInterimUserSpeech] = useState('');

  // Audio / Speech Recognition Refs
  const recognitionRef = useRef(null);
  const isListeningRef = useRef(false);
  const isCallActiveRef = useRef(false);
  const isMicMutedRef = useRef(false);
  const languageRef = useRef(language);
  const isSpeakingRef = useRef(false);
  const utteranceRef = useRef(null);
  const agentStatusRef = useRef(agentStatus);
  const echoTimerRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const accumulatedSpeechRef = useRef('');
  const handleSendMessageRef = useRef(null);

  // Synchronize state with refs
  useEffect(() => {
    isCallActiveRef.current = isCallActive;
    isMicMutedRef.current = isMicMuted;
    languageRef.current = language;
    agentStatusRef.current = agentStatus;
  }, [isCallActive, isMicMuted, language, agentStatus]);

  // Call duration counter
  useEffect(() => {
    let interval = null;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  // Format MM:SS
  const formatTime = (totalSeconds) => {
    const mins = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const secs = String(totalSeconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  };

  // Fetch CRM Bookings from Backend
  const fetchCrmBookings = useCallback(async () => {
    try {
      const res = await fetch('/api/crm');
      if (res.ok) {
        const data = await res.json();
        if (data.bookings && data.bookings.length > 0) {
          setAppointments(data.bookings);
        }
      }
    } catch (err) {
      console.warn('Could not fetch CRM bookings:', err);
    }
  }, []);

  useEffect(() => {
    fetchCrmBookings();
  }, [fetchCrmBookings]);

  /**
   * Stop Speech Recognition safely
   */
  const stopSpeechRecognition = useCallback(() => {
    if (echoTimerRef.current) {
      clearTimeout(echoTimerRef.current);
      echoTimerRef.current = null;
    }
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    accumulatedSpeechRef.current = '';
    setInterimUserSpeech('');
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.abort();
      } catch (e) {}
      recognitionRef.current = null;
    }
    isListeningRef.current = false;
  }, []);

  /**
   * Speech-to-Text (STT) Speech Recognition with Continuous Capture & Silence Debounce
   */
  const startSpeechRecognition = useCallback(() => {
    // Never start listening while the agent is actively speaking (prevents speaker acoustic feedback)
    if (isSpeakingRef.current || !isCallActiveRef.current || isMicMutedRef.current) {
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setAgentStatus('listening');
      return;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {}
    }

    try {
      const recognition = new SpeechRecognition();
      const userLocale = typeof navigator !== 'undefined' ? (navigator.language || '') : '';
      const englishLocale = userLocale.startsWith('en') ? userLocale : 'en-IN';
      recognition.lang = languageRef.current === 'hi' ? 'hi-IN' : englishLocale;
      // Enable continuous streaming and interim results so full sentences are never prematurely cut off
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        isListeningRef.current = true;
        setAgentStatus('listening');
      };

      recognition.onresult = (event) => {
        // If agent started speaking in the meantime, ignore acoustic echo
        if (isSpeakingRef.current) return;

        // Build accumulated sentence transcript across all result segments
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          const res = event.results[i];
          if (res && res[0]) {
            transcript += res[0].transcript;
          }
        }

        const cleanTranscript = transcript.trim();
        if (!cleanTranscript) return;

        // Save accumulated text and update live caption display so user sees words appearing in real-time
        accumulatedSpeechRef.current = cleanTranscript;
        setInterimUserSpeech(cleanTranscript);

        // Check if latest speech segment was finalized by speech engine
        const lastResult = event.results[event.results.length - 1];
        const isSegmentFinal = Boolean(lastResult && lastResult.isFinal);

        // Reset silence detection timer: user is actively speaking their sentence
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
        }

        // Fast conversational silence detection: 550ms for completed phrases, 750ms for interim
        const silenceDelay = isSegmentFinal ? 550 : 750;
        silenceTimerRef.current = setTimeout(() => {
          const finalSpokenText = accumulatedSpeechRef.current.trim();
          if (finalSpokenText && !isSpeakingRef.current && isCallActiveRef.current) {
            stopSpeechRecognition();
            setInterimUserSpeech('');
            accumulatedSpeechRef.current = '';
            if (handleSendMessageRef.current) {
              handleSendMessageRef.current(finalSpokenText);
            }
          }
        }, silenceDelay);
      };

      recognition.onerror = (event) => {
        // Ignore expected non-fatal errors
        if (event.error !== 'aborted' && event.error !== 'no-speech') {
          console.warn('Speech recognition error:', event.error);
        }
      };

      recognition.onend = () => {
        isListeningRef.current = false;

        // If recognition closed but there is pending accumulated speech that hasn't fired yet
        if (accumulatedSpeechRef.current.trim() && !isSpeakingRef.current && isCallActiveRef.current) {
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = null;
          }
          const finalSpokenText = accumulatedSpeechRef.current.trim();
          stopSpeechRecognition();
          setInterimUserSpeech('');
          accumulatedSpeechRef.current = '';
          if (handleSendMessageRef.current) {
            handleSendMessageRef.current(finalSpokenText);
          }
          return;
        }

        // Only restart if call is still active, agent is not speaking, not thinking, and mic unmuted
        if (
          isCallActiveRef.current &&
          !isMicMutedRef.current &&
          !isSpeakingRef.current &&
          agentStatusRef.current === 'listening'
        ) {
          try {
            recognition.start();
          } catch (e) {}
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn('Speech recognition start failed:', err);
    }
  }, [stopSpeechRecognition]);

  /**
   * Text-to-Speech (TTS) Voice Output with hands-free chaining
   */
  const speakText = useCallback((text, onSpeechEnd) => {
    // 1. Immediately kill microphone to prevent hearing own computer speakers
    stopSpeechRecognition();

    if (typeof window === 'undefined' || !window.speechSynthesis) {
      if (onSpeechEnd) onSpeechEnd();
      return;
    }

    try {
      window.speechSynthesis.cancel();
    } catch (e) {}

    const cleanText = (text || '')
      .replace(/[*#_`]/g, '')
      .replace(/\(http\S+\)/g, '')
      .trim();

    if (!cleanText) {
      if (onSpeechEnd) onSpeechEnd();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utteranceRef.current = utterance;
    window.__activeUtterance = utterance; // Prevent Chrome garbage-collection bug

    const isHindi = languageRef.current === 'hi';
    utterance.lang = isHindi ? 'hi-IN' : 'en-US';
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      let matchedVoice = null;
      if (isHindi) {
        matchedVoice = voices.find((v) => v.lang.startsWith('hi')) || voices[0];
      } else {
        matchedVoice = voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Zira') || v.name.includes('Samantha') || v.name.includes('David'))) 
          || voices.find((v) => v.lang.startsWith('en'))
          || voices[0];
      }
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }
    }

    utterance.onstart = () => {
      isSpeakingRef.current = true;
      setAgentStatus('speaking');
    };

    const finishSpeaking = () => {
      isSpeakingRef.current = false;
      utteranceRef.current = null;

      if (isCallActiveRef.current) {
        setAgentStatus('listening');
        if (!isMicMutedRef.current) {
          // 400ms buffer gives room speaker echo time to decay before opening microphone
          echoTimerRef.current = setTimeout(() => {
            if (isCallActiveRef.current && !isSpeakingRef.current && !isMicMutedRef.current) {
              startSpeechRecognition();
            }
          }, 400);
        }
      } else {
        setAgentStatus('idle');
      }
      if (onSpeechEnd) onSpeechEnd();
    };

    utterance.onend = finishSpeaking;
    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      finishSpeaking();
    };

    isSpeakingRef.current = true;
    setAgentStatus('speaking');
    window.speechSynthesis.speak(utterance);
  }, [stopSpeechRecognition, startSpeechRecognition]);

  /**
   * Barge-in Support (Manual User Interrupt)
   */
  const handleBargeIn = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }
    isSpeakingRef.current = false;
    utteranceRef.current = null;
    setAgentStatus('listening');
    if (isCallActiveRef.current && !isMicMutedRef.current) {
      setTimeout(() => {
        startSpeechRecognition();
      }, 150);
    }
  }, [startSpeechRecognition]);

  /**
   * Start / End Call Toggle
   */
  const toggleVoiceCall = () => {
    if (!isCallActive) {
      // START CALL
      const newSessId = 'sess_' + Date.now();
      setSessionId(newSessId);
      setIsCallActive(true);
      setCallDuration(0);
      setIsMicMuted(false);

      const isHindi = language === 'hi';
      const greetingText = isHindi
        ? 'HelpingHand AI में आपका स्वागत है! आज मैं आपकी क्या सहायता कर सकता हूँ?'
        : 'Welcome to HelpingHand AI! How can I help you today?';

      const greetingMsg = {
        id: Date.now(),
        speaker: 'agent',
        name: 'HelpingHand AI',
        text: greetingText,
      };

      setTranscript((prev) => [...prev, greetingMsg]);
      speakText(greetingText);
    } else {
      // END CALL
      setIsCallActive(false);
      setAgentStatus('idle');

      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      stopSpeechRecognition();

      fetch('/api/end-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.summary) {
            setSummary(data.summary);
          }
          if (data.crmBookings) {
            setAppointments(data.crmBookings);
          }
        })
        .catch((e) => console.warn('End call summary error:', e));

      fetchCrmBookings();
    }
  };

  /**
   * Switch Language (EN / HI)
   */
  const handleSetLanguage = (lang) => {
    setLanguage(lang);
    languageRef.current = lang;
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    stopSpeechRecognition();

    if (isCallActive && !isMicMuted) {
      setTimeout(() => startSpeechRecognition(), 300);
    }
  };

  /**
   * Send Message (Handles Quick Prompts, Voice Input, and Text Box)
   */
  const handleSendMessage = async (text) => {
    if (!text || !text.trim()) return;

    // Immediately stop mic and clear speech buffers so user's audio or room noise doesn't trigger another request
    stopSpeechRecognition();
    setInterimUserSpeech('');
    accumulatedSpeechRef.current = '';

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }
    isSpeakingRef.current = false;
    setAgentStatus('thinking');

    const userMsg = {
      id: Date.now(),
      speaker: 'lead',
      name: 'User',
      text: text.trim(),
    };

    setTranscript((prev) => [...prev, userMsg]);
    setDockInputText('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          message: text.trim(),
          language,
        }),
      });

      if (res.ok) {
        const data = await res.json();

        const agentMsg = {
          id: Date.now() + 1,
          speaker: 'agent',
          name: 'HelpingHand AI',
          text: data.reply,
        };

        setTranscript((prev) => [...prev, agentMsg]);

        if (data.leadScore) setLeadScore(data.leadScore);
        if (data.sentiment) setSentiment(data.sentiment);
        if (data.ragSnippets && data.ragSnippets.length > 0) {
          setRagSnippet({
            query: text,
            category: data.ragSnippets[0].category,
            source: data.ragSnippets[0].source,
            relevance: data.ragSnippets[0].relevanceScore || 98,
            snippet: data.ragSnippets[0].content,
          });
        }
        if (data.bant) {
          setBant((prev) => ({
            budget: { ...prev.budget, status: prev.budget.status || Boolean(data.bant.budget) },
            authority: { ...prev.authority, status: prev.authority.status || Boolean(data.bant.authority) },
            need: { ...prev.need, status: prev.need.status || Boolean(data.bant.need) },
            timeline: { ...prev.timeline, status: prev.timeline.status || Boolean(data.bant.timeline) },
          }));
        }
        if (data.bookingAction?.booked) {
          fetchCrmBookings();
        }

        speakText(data.reply);
        return;
      }
    } catch (err) {
      console.warn('API chat error:', err);
    }

    // Real-time network reconnect notice (never recite canned manual replies)
    const fallbackReply = language === 'hi'
      ? 'माफ़ कीजियेगा, नेटवर्क में क्षणिक रुकावट आई थी। क्या आप अपना सवाल दोबारा दोहरा सकते हैं?'
      : 'I had a momentary connection hiccup with the AI engine. Could you please repeat that?';

    const agentMsg = {
      id: Date.now() + 1,
      speaker: 'agent',
      name: 'HelpingHand AI',
      text: fallbackReply,
    };
    setTranscript((prev) => [...prev, agentMsg]);
    speakText(fallbackReply);
  };

  handleSendMessageRef.current = handleSendMessage;

  // Latest 2 lines for Live Caption Box
  const latestUserMsg = [...transcript].reverse().find((m) => m.speaker === 'lead');
  const latestAgentMsg = [...transcript].reverse().find((m) => m.speaker === 'agent');

  // Compute Voice Orb CSS classes
  const isOrbActive = isCallActive;
  let orbStateClass = '';
  if (agentStatus === 'listening') {
    orbStateClass = 'orb-listening';
  } else if (agentStatus === 'speaking') {
    orbStateClass = 'orb-speaking';
  } else if (isCallActive) {
    orbStateClass = 'orb-active';
  }

  return (
    <div className="min-h-screen bg-dark-surface text-dark-on-surface font-body antialiased selection:bg-orb-indigo/30 flex flex-col justify-between relative overflow-x-hidden">
      
      {/* ======================================================== */}
      {/* 1. MINIMAL TOP NAVIGATION BAR */}
      {/* ======================================================== */}
      <header className="w-full z-20">
        <div className="max-w-7xl mx-auto px-gutter-md md:px-page-margin h-16 flex items-center justify-between gap-gutter-md">
          {/* Left: Wordmark with glowing dot icon */}
          <a
            href="#top"
            className="inline-flex items-center gap-gutter-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-orb-indigo rounded-sm"
          >
            <span className="relative flex items-center justify-center w-3 h-3">
              <span className="w-2.5 h-2.5 rounded-full bg-orb-cyan shadow-[0_0_12px_rgba(34,211,238,0.9)]" />
            </span>
            <span className="font-headline text-lg md:text-xl text-dark-on-surface tracking-tight font-semibold">
              HelpingHand AI
            </span>
          </a>

          {/* Right: Segmented Language Toggle + Ghost CRM & Insights Button */}
          <div className="flex items-center gap-gutter-sm md:gap-gutter-md">
            {/* Language Segmented Control */}
            <div
              role="group"
              aria-label="Agent language"
              className="inline-flex items-center bg-dark-surface-container-low border border-dark-outline-variant rounded-full p-1"
            >
              <button
                type="button"
                onClick={() => handleSetLanguage('en')}
                aria-pressed={language === 'en'}
                className={`px-3 py-1 rounded-full font-label text-xs sm:text-sm transition-colors duration-state-change ease-state-change ${
                  language === 'en'
                    ? 'bg-dark-surface-container-high text-dark-on-surface font-medium'
                    : 'text-dark-on-surface-variant hover:text-dark-on-surface'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => handleSetLanguage('hi')}
                aria-pressed={language === 'hi'}
                className={`px-3 py-1 rounded-full font-label text-xs sm:text-sm transition-colors duration-state-change ease-state-change ${
                  language === 'hi'
                    ? 'bg-dark-surface-container-high text-dark-on-surface font-medium'
                    : 'text-dark-on-surface-variant hover:text-dark-on-surface'
                }`}
              >
                हिंदी
              </button>
            </div>

            {/* CRM & Insights Button */}
            <button
              type="button"
              onClick={() => setIsCrmDrawerOpen(true)}
              className="inline-flex items-center justify-center gap-gutter-sm bg-dark-surface-container-low/70 text-dark-on-surface border border-dark-outline-variant px-gutter-md py-1.5 rounded-full font-label text-xs sm:text-sm hover:bg-dark-surface-container transition-colors duration-state-change ease-state-change"
            >
              <span>CRM &amp; Insights</span>
              <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-orb-indigo/20 text-dark-tertiary font-mono text-xs tabular-nums">
                {appointments.length || 3}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ======================================================== */}
      {/* 2. CENTERED HERO STAGE (~70% viewport focus) */}
      {/* ======================================================== */}
      <main id="top" className="flex-1 flex flex-col items-center justify-center px-gutter-md md:px-page-margin py-gutter-lg">
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center text-center gap-gutter-lg">

          {/* Headline & 1-line Subtitle */}
          <div className="flex flex-col items-center gap-gutter-sm">
            <h1 className="font-display text-3xl sm:text-5xl font-bold text-dark-on-surface text-balance">
              Talk to Your Autonomous AI Sales Agent
            </h1>
            <p className="font-body text-base sm:text-lg text-dark-on-surface-variant text-pretty max-w-xl">
              {language === 'hi' 
                ? 'हिंदी या अंग्रेज़ी में कुछ भी पूछें — तुरंत उत्तर, बिना किसी इंतज़ार के।' 
                : 'Ask anything in English or Hindi — instant answers, zero wait time.'}
            </p>
          </div>

          {/* Centerpiece Visual: 3D-style Glassmorphic Voice Orb + Concentric Audio-Wave Rings */}
          <div
            id="voice-orb-stage"
            className={`relative flex items-center justify-center w-64 h-64 my-gutter-xs ${isOrbActive ? 'orb-active' : ''} ${orbStateClass}`}
            aria-hidden="true"
          >
            {/* Ambient Outer Glow */}
            <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-orb-indigo/25 via-orb-violet/20 to-orb-cyan/25 blur-2xl" />

            {/* Concentric Audio-Wave Rings */}
            <div className="orb-ring-2 absolute w-60 h-60 rounded-full border border-orb-violet/25" />
            <div className="orb-ring-1 absolute w-48 h-48 rounded-full border border-orb-cyan/35" />
            <div className="absolute w-40 h-40 rounded-full border border-orb-indigo/45" />

            {/* 3D Glassmorphic Core Orb */}
            <div className="orb-core relative w-32 h-32 rounded-full bg-gradient-to-br from-orb-cyan/80 via-orb-indigo/85 to-orb-violet/90 p-px shadow-[0_0_48px_rgba(99,102,241,0.45)] flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-gradient-to-b from-dark-on-surface/20 via-orb-indigo/30 to-dark-surface/70 backdrop-blur-md flex items-center justify-center relative overflow-hidden">
                {/* Specular highlight */}
                <div className="absolute top-2 left-4 w-14 h-7 rounded-full bg-dark-on-surface/25 blur-sm -rotate-12" />
                
                {/* Center Icon */}
                <span className="material-symbols-outlined text-4xl text-dark-on-surface/90">
                  {agentStatus === 'speaking' 
                    ? 'volume_up' 
                    : agentStatus === 'listening' 
                    ? 'mic' 
                    : agentStatus === 'thinking' 
                    ? 'progress_activity' 
                    : 'graphic_eq'}
                </span>
              </div>
            </div>
          </div>

          {/* Status Pill + Primary CTA Button */}
          <div className="flex flex-col items-center gap-gutter-md">
            {/* Status Pill */}
            <div className="inline-flex items-center gap-gutter-sm px-3.5 py-1 rounded-full bg-dark-surface-container-low border border-dark-outline-variant">
              <span
                className={`w-2 h-2 rounded-full ${
                  agentStatus === 'listening'
                    ? 'bg-emerald-400 animate-ping'
                    : agentStatus === 'thinking'
                    ? 'bg-amber-400 animate-pulse'
                    : agentStatus === 'speaking'
                    ? 'bg-cyan-400 animate-pulse'
                    : 'bg-success'
                }`}
              />
              <span className="font-label text-xs sm:text-sm text-dark-on-surface-variant">
                {isCallActive
                  ? agentStatus === 'listening'
                    ? `Listening • ${formatTime(callDuration)}`
                    : agentStatus === 'thinking'
                    ? 'Thinking...'
                    : agentStatus === 'speaking'
                    ? 'Speaking...'
                    : `In Call • ${formatTime(callDuration)}`
                  : language === 'hi'
                  ? 'तैयार • Bilingual HI/EN'
                  : 'Ready • Bilingual EN/HI'}
              </span>
            </div>

            {/* Primary CTA Button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleVoiceCall}
                className={`inline-flex items-center justify-center gap-gutter-sm px-gutter-xl py-3.5 rounded-full font-label text-base font-semibold shadow-[0_8px_28px_rgba(99,102,241,0.28)] hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orb-indigo active:scale-95 transition-all duration-state-change ease-state-change ${
                  isCallActive
                    ? 'bg-dark-error text-dark-on-error'
                    : 'bg-dark-primary text-dark-on-primary'
                }`}
              >
                <span className="material-symbols-outlined text-xl" aria-hidden="true">
                  {isCallActive ? 'call_end' : 'mic'}
                </span>
                <span>{isCallActive ? 'End Voice Call' : 'Start Voice Call'}</span>
              </button>

              {/* Barge In Button when Agent is Speaking */}
              {agentStatus === 'speaking' && isCallActive && (
                <button
                  type="button"
                  onClick={handleBargeIn}
                  className="inline-flex items-center justify-center gap-1.5 bg-dark-surface-container-low text-dark-tertiary border border-dark-outline-variant px-4 py-3.5 rounded-full font-label text-sm hover:bg-dark-surface-container transition-colors"
                  title="Interrupt AI"
                >
                  <span className="material-symbols-outlined text-base">stop</span>
                  <span>Interrupt</span>
                </button>
              )}
            </div>
          </div>

          {/* 3. Live Caption Card (Latest 2 lines only + Full Transcript link) */}
          <article className="w-full max-w-xl bg-dark-surface-container-low/80 backdrop-blur-md border border-dark-outline-variant rounded-md px-gutter-lg py-gutter-md text-left flex flex-col gap-gutter-sm">
            <header className="flex items-center justify-between gap-gutter-md">
              <div className="flex items-center gap-gutter-sm">
                <span className="font-label text-xs sm:text-sm text-dark-on-surface-variant font-medium">
                  Live Captions
                </span>
                <span className="font-mono text-xs text-dark-tertiary">
                  {language === 'hi' ? 'HI / EN' : 'EN / HI'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsTranscriptModalOpen(true)}
                className="font-label text-xs sm:text-sm text-dark-tertiary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-orb-indigo rounded-sm"
              >
                <span>Full Transcript</span>
              </button>
            </header>

            <div className="flex flex-col gap-gutter-xs">
              <p className="font-body text-sm sm:text-base text-dark-on-surface-variant truncate">
                <span className="font-semibold text-dark-on-surface">User:</span>{' '}
                {interimUserSpeech ? (
                  <span className="text-emerald-400 font-medium animate-pulse">{interimUserSpeech}…</span>
                ) : latestUserMsg ? (
                  latestUserMsg.text
                ) : (
                  'Does HelpingHand AI integrate with HubSpot and support Hindi?'
                )}
              </p>
              <p className="font-body text-sm sm:text-base text-dark-on-surface truncate">
                <span className="font-semibold text-dark-tertiary">HelpingHand AI:</span>{' '}
                {latestAgentMsg ? latestAgentMsg.text : 'Welcome to HelpingHand AI! Native HubSpot sync and natural EN/HI voice switching in 380ms.'}
              </p>
            </div>
          </article>

        </div>
      </main>

      {/* ======================================================== */}
      {/* 4. BOTTOM DOCK BAR */}
      {/* ======================================================== */}
      <footer className="w-full pb-gutter-lg pt-gutter-sm px-gutter-md md:px-page-margin z-20">
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-gutter-md">
          {/* Three Quick-Prompt Chips */}
          <div className="flex flex-wrap items-center justify-center gap-gutter-sm">
            <button
              type="button"
              onClick={() => handleSendMessage('Pricing vs HubSpot?')}
              className="inline-flex items-center gap-gutter-xs bg-dark-surface-container-low/80 text-dark-on-surface-variant border border-dark-outline-variant px-gutter-md py-1.5 rounded-full font-label text-xs sm:text-sm hover:text-dark-on-surface hover:bg-dark-surface-container transition-colors duration-state-change ease-state-change"
            >
              <span>Pricing vs HubSpot?</span>
            </button>

            <button
              type="button"
              onClick={() => handleSendMessage('SOC2 Security?')}
              className="inline-flex items-center gap-gutter-xs bg-dark-surface-container-low/80 text-dark-on-surface-variant border border-dark-outline-variant px-gutter-md py-1.5 rounded-full font-label text-xs sm:text-sm hover:text-dark-on-surface hover:bg-dark-surface-container transition-colors duration-state-change ease-state-change"
            >
              <span>SOC2 Security?</span>
            </button>

            <button
              type="button"
              onClick={() => handleSendMessage('Book a demo tomorrow')}
              className="inline-flex items-center gap-gutter-xs bg-dark-surface-container-low/80 text-dark-on-surface-variant border border-dark-outline-variant px-gutter-md py-1.5 rounded-full font-label text-xs sm:text-sm hover:text-dark-on-surface hover:bg-dark-surface-container transition-colors duration-state-change ease-state-change"
            >
              <span>Book a demo tomorrow</span>
            </button>
          </div>

          {/* Minimal Rounded Text Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (dockInputText.trim()) handleSendMessage(dockInputText.trim());
            }}
            className="w-full relative flex items-center"
          >
            <label htmlFor="dock-input" className="sr-only">Ask HelpingHand AI</label>
            <input
              id="dock-input"
              type="text"
              value={dockInputText}
              onChange={(e) => setDockInputText(e.target.value)}
              placeholder={language === 'hi' ? 'यहाँ सवाल टाइप करें (उदा. हबस्पॉट से माइग्रेशन कैसे होता है?)...' : 'Type a question in English or हिंदी...'}
              className="w-full bg-dark-surface-container-low/90 backdrop-blur-md border border-dark-outline-variant rounded-full pl-gutter-lg pr-14 py-3 font-body text-sm sm:text-base text-dark-on-surface placeholder:text-dark-outline focus:border-orb-indigo focus:ring-1 focus:ring-orb-indigo outline-none"
            />
            <button
              type="submit"
              disabled={!dockInputText.trim()}
              aria-label="Send message"
              className="absolute right-2 inline-flex items-center justify-center w-9 h-9 rounded-full bg-dark-primary text-dark-on-primary hover:opacity-90 disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orb-indigo transition-opacity duration-state-change ease-state-change"
            >
              <span className="material-symbols-outlined text-lg" aria-hidden="true">arrow_upward</span>
            </button>
          </form>
        </div>
      </footer>

      {/* ======================================================== */}
      {/* 5. SLIDE-OVER CRM & LEAD INSIGHTS DRAWER */}
      {/* ======================================================== */}
      {isCrmDrawerOpen && (
        <div
          id="crm-drawer-backdrop"
          onClick={() => setIsCrmDrawerOpen(false)}
          className="fixed inset-0 bg-dark-surface-dim/70 backdrop-blur-sm z-40 transition-opacity"
        />
      )}
      <aside
        id="crm-drawer"
        aria-label="CRM and Lead Insights"
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-dark-surface-container-low border-l border-dark-outline-variant z-50 p-gutter-lg flex flex-col justify-between overflow-y-auto transition-transform duration-300 ease-out ${
          isCrmDrawerOpen ? 'translate-x-0' : 'translate-x-full hidden'
        }`}
      >
        <div className="flex flex-col gap-gutter-lg">
          <div className="flex items-center justify-between pb-gutter-md border-b border-dark-outline-variant">
            <div className="flex flex-col gap-gutter-xs text-left">
              <h2 className="font-headline text-xl text-dark-on-surface font-semibold">CRM &amp; Lead Insights</h2>
              <p className="font-body text-xs text-dark-on-surface-variant">Auto-captured from live voice &amp; chat</p>
            </div>
            <button
              type="button"
              onClick={() => setIsCrmDrawerOpen(false)}
              aria-label="Close CRM drawer"
              className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-dark-outline-variant text-dark-on-surface-variant hover:text-dark-on-surface transition"
            >
              <span className="material-symbols-outlined text-base" aria-hidden="true">close</span>
            </button>
          </div>

          {/* Lead Qualification Summary */}
          <div className="bg-dark-surface-container border border-dark-outline-variant rounded-md p-gutter-md flex flex-col gap-gutter-md text-left">
            <div className="flex items-center justify-between">
              <span className="font-label text-xs text-dark-on-surface-variant font-medium">Intent Score</span>
              <span className="font-mono text-sm text-success tabular-nums font-semibold">{leadScore} / 100 · High</span>
            </div>
            <dl className="grid grid-cols-2 gap-gutter-md pt-gutter-sm border-t border-dark-outline-variant">
              <div className="flex flex-col gap-gutter-xs">
                <dt className="font-label text-xs text-dark-on-surface-variant">CRM Target</dt>
                <dd className="font-body text-sm text-dark-on-surface font-medium">HubSpot Enterprise</dd>
              </div>
              <div className="flex flex-col gap-gutter-xs">
                <dt className="font-label text-xs text-dark-on-surface-variant">Language</dt>
                <dd className="font-mono text-sm text-dark-on-surface">{language === 'hi' ? 'HI + EN' : 'EN + HI'}</dd>
              </div>
              <div className="flex flex-col gap-gutter-xs">
                <dt className="font-label text-xs text-dark-on-surface-variant">Next Action</dt>
                <dd className="font-body text-sm text-dark-on-surface font-medium">Demo tomorrow</dd>
              </div>
              <div className="flex flex-col gap-gutter-xs">
                <dt className="font-label text-xs text-dark-on-surface-variant">Security Check</dt>
                <dd className="font-body text-sm text-dark-on-surface font-medium">SOC 2 Type II</dd>
              </div>
            </dl>
          </div>

          {/* BANT Qualification Breakdown */}
          <div className="flex flex-col gap-gutter-xs text-left">
            <h3 className="font-title text-sm text-dark-on-surface font-semibold">BANT Criteria Status</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${bant.budget.status ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-dark-surface-container border-dark-outline-variant text-dark-on-surface-variant'}`}>
                <span>Budget</span>
                <span className="font-mono font-bold">{bant.budget.status ? '✓' : '—'}</span>
              </div>
              <div className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${bant.authority.status ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-dark-surface-container border-dark-outline-variant text-dark-on-surface-variant'}`}>
                <span>Authority</span>
                <span className="font-mono font-bold">{bant.authority.status ? '✓' : '—'}</span>
              </div>
              <div className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${bant.need.status ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-dark-surface-container border-dark-outline-variant text-dark-on-surface-variant'}`}>
                <span>Need</span>
                <span className="font-mono font-bold">{bant.need.status ? '✓' : '—'}</span>
              </div>
              <div className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${bant.timeline.status ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-dark-surface-container border-dark-outline-variant text-dark-on-surface-variant'}`}>
                <span>Timeline</span>
                <span className="font-mono font-bold">{bant.timeline.status ? '✓' : '—'}</span>
              </div>
            </div>
          </div>

          {/* Synced Events / Appointments */}
          <div className="flex flex-col gap-gutter-sm text-left">
            <h3 className="font-title text-sm text-dark-on-surface font-semibold">Recent CRM Signals &amp; Bookings</h3>
            {appointments.length > 0 ? (
              appointments.map((apt, idx) => (
                <div
                  key={apt.bookingId || apt.id || idx}
                  className="bg-dark-surface-container border border-dark-outline-variant rounded-md p-gutter-md flex flex-col gap-gutter-xs"
                >
                  <span className="font-body text-sm text-dark-on-surface font-medium">
                    {apt.title || apt.meetingType || 'Technical Demo & Migration Review'}
                  </span>
                  <div className="flex items-center justify-between text-xs text-dark-tertiary font-mono">
                    <span>{apt.dateTime || 'Tomorrow • 3:00 PM EST'}</span>
                    <span className="text-success">{apt.status || 'Confirmed'}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-dark-surface-container border border-dark-outline-variant rounded-md p-gutter-md flex flex-col gap-gutter-xs">
                <span className="font-body text-sm text-dark-on-surface">HubSpot integration &amp; bilingual support verified</span>
                <span className="font-mono text-xs text-dark-on-surface-variant">Synced 12s ago</span>
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsCrmDrawerOpen(false)}
          className="w-full mt-gutter-lg py-3 rounded-full bg-dark-primary text-dark-on-primary font-label text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <span>Back to Voice Stage</span>
        </button>
      </aside>

      {/* ======================================================== */}
      {/* 6. FULL TRANSCRIPT MODAL */}
      {/* ======================================================== */}
      {isTranscriptModalOpen && (
        <div
          id="transcript-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-gutter-md bg-dark-surface-dim/75 backdrop-blur-sm"
        >
          <div className="w-full max-w-lg bg-dark-surface-container-low border border-dark-outline-variant rounded-lg p-gutter-lg flex flex-col gap-gutter-md">
            <div className="flex items-center justify-between pb-gutter-sm border-b border-dark-outline-variant">
              <h2 className="font-headline text-lg text-dark-on-surface font-semibold">Full Conversation Transcript</h2>
              <button
                type="button"
                onClick={() => setIsTranscriptModalOpen(false)}
                aria-label="Close transcript"
                className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-dark-outline-variant text-dark-on-surface-variant hover:text-dark-on-surface"
              >
                <span className="material-symbols-outlined text-base" aria-hidden="true">close</span>
              </button>
            </div>
            <div id="transcript-history" className="flex flex-col gap-gutter-sm max-h-72 overflow-y-auto text-left">
              {transcript.map((msg) => (
                <p key={msg.id} className="font-body text-sm text-dark-on-surface leading-relaxed">
                  <span className={`font-semibold ${msg.speaker === 'agent' ? 'text-dark-tertiary' : 'text-dark-on-surface'}`}>
                    {msg.speaker === 'agent' ? 'HelpingHand AI:' : 'User:'}
                  </span>{' '}
                  {msg.text}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
