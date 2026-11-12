import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Sparkles, User, Bot, RefreshCw, ExternalLink,
  ShieldAlert, CreditCard, ArrowRight, Compass, CheckCircle2
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { aiApi } from '@/services/api';
import { formatDate } from '@/lib/utils';
import { getCountryVisual } from '@/data/countryVisuals';
import type { ChatMessage } from '@/types';

const PROMPT_SUGGESTIONS = [
  'What apps should I install before arriving in South Korea?',
  'Which grocery applications are useful in Japan?',
  'Show me transportation options in Germany.',
  'How much of my budget is remaining?',
  'What should I prepare before arriving?',
  'Which services support PayPal checkout through VAYURA?',
];

export function AIAssistantPage() {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    user, travelProfile, countryData, budget, payments, selectedDestinationCode,
    conversations, currentConversationId,
    startConversation, addMessage
  } = useAppStore();

  const currentCountryCode = selectedDestinationCode || travelProfile?.destinationCountryCode || countryData?.code || 'KR';
  const visual = getCountryVisual(currentCountryCode);

  const conversationId = currentConversationId ?? (() => {
    return startConversation();
  })();

  const conversation = conversations.find((c) => c.id === conversationId);
  const messages = conversation?.messages ?? [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    setInput('');

    // Add user message to conversation
    addMessage(conversationId, { role: 'user', content: text });
    setIsTyping(true);

    try {
      // Call backend AI endpoint
      const response = await aiApi.chat({
        message: text,
        conversationId,
        travelProfileId: travelProfile?.id,
        context: {
          destinationCountry: visual.countryName,
          purpose: travelProfile?.purpose ?? 'HIGHER_EDUCATION',
          budgetAmount: budget ? budget.remainingAmount : 3500,
          budgetCurrency: budget ? budget.currency : 'USD',
          arrivalDate: travelProfile?.arrivalDate,
          paymentsCount: payments.length,
          confirmedPaymentsTotal: payments.filter((p) => p.status === 'CAPTURED').reduce((s, p) => s + p.amount, 0),
        },
      });

      const replyContent = response.data.message;
      addMessage(conversationId, {
        role: 'assistant',
        content: replyContent,
        disclaimer: response.data.disclaimer,
      });
    } catch {
      // Fallback response
      const fallbackReply = `I understand you're asking about **${visual.countryName}** (${travelProfile?.purpose.replace(/_/g, ' ') ?? 'journey'}).\n\nYou can pre-book verified arrival passes like **KT 5G eSIM** ($28) or **T-Money Smart Transit** ($18) with **PayPal** right now in your dashboard.\n\n⚠️ General guidance only. Always verify official immigration policies with official authorities.`;

      addMessage(conversationId, {
        role: 'assistant',
        content: fallbackReply,
        disclaimer: 'VAYURA AI Companion · Offline Guidance',
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6 bg-slate-950 text-slate-100 min-h-screen flex flex-col justify-between">
      {/* ── Top Header ── */}
      <div className="pb-4 border-b border-slate-800 flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              VAYURA AI Global Companion
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300">
              Active Context: {visual.flag} {visual.countryName}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Intelligent Cross-Border Advisor
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Trained on official government portals, local daily lifestyle apps, and connected to your VAYURA Smart Budget & PayPal transactions.
          </p>
        </div>

        <button
          onClick={() => startConversation()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 hover:text-white transition"
        >
          <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
          <span>New Chat</span>
        </button>
      </div>

      {/* ── Suggested Questions Carousel / Quick Chips ── */}
      <div className="space-y-2">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Suggested Questions
        </span>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {PROMPT_SUGGESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              className="flex-shrink-0 px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 hover:text-white transition text-left"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* ── Messages Feed ── */}
      <div className="flex-1 min-h-[380px] max-h-[520px] overflow-y-auto space-y-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
        {messages.length === 0 ? (
          <div className="py-16 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">How can I assist your journey to {visual.countryName}?</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 leading-relaxed">
                Ask about mandatory arrival checklists, local everyday food and subway apps, remaining budget calculation, or services supporting PayPal checkout.
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.role === 'user';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white flex-shrink-0 text-sm shadow">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-blue-600 text-white font-medium'
                      : 'bg-slate-950 border border-slate-800 text-slate-200'
                  }`}
                >
                  {/* Message Content rendered with line breaks */}
                  <div className="whitespace-pre-wrap space-y-1 font-sans">
                    {msg.content}
                  </div>

                  {msg.disclaimer && (
                    <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-500 flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3 text-amber-500 flex-shrink-0" />
                      <span>{msg.disclaimer}</span>
                    </div>
                  )}

                  <div className="mt-1 text-[9px] opacity-40 text-right">
                    {formatDate(msg.timestamp)}
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-white flex-shrink-0 text-xs font-bold">
                    {user ? user.fullName[0] : 'U'}
                  </div>
                )}
              </div>
            );
          })
        )}

        {isTyping && (
          <div className="flex gap-3 items-center">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white flex-shrink-0">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
              <span>VAYURA AI is analyzing {visual.countryName} registry and your profile…</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Input Bar ── */}
      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Ask anything about arriving in ${visual.countryName}, everyday apps, budget, or PayPal...`}
          className="w-full pl-4 pr-12 py-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition shadow-inner"
        />

        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || isTyping}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white transition"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
