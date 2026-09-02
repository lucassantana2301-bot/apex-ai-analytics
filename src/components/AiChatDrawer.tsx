import React, { useState } from 'react';
import { X, Send, Bot, Sparkles, Zap } from 'lucide-react';
import type { ChatMessage, Dataset } from '../types/dataset';
import { answerAiQuery } from '../services/aiEngine';

interface AiChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  dataset: Dataset;
  onSelectChartSuggestion?: (suggestion: ChatMessage['chartSuggestion']) => void;
}

export const AiChatDrawer: React.FC<AiChatDrawerProps> = ({
  isOpen,
  onClose,
  dataset,
  onSelectChartSuggestion,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hello! I'm your Imperial AI Assistant. Ask me any question about **${dataset.name}**! For example: "Which category generated peak revenue?" or "Identify telemetry risks."`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const aiResponse = answerAiQuery(dataset, query);

    setMessages((prev) => [...prev, userMsg, aiResponse]);
    if (!textToSend) setInputQuery('');
  };

  const samplePrompts = [
    'What generated the highest metric value?',
    'Show me the average calculated across fields',
    'Are there any anomalies or risks?',
    'Summarize top drivers and category distribution',
  ];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: '450px',
        maxWidth: '100vw',
        background: '#120b08',
        color: '#ffffff',
        borderLeft: '2px solid var(--gold-light)',
        boxShadow: '-15px 0 50px rgba(0,0,0,0.9)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Drawer Header */}
      <div style={{ padding: '20px 24px', borderBottom: '1.5px solid var(--border-gold)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#1c120d' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: 38, height: 38, borderRadius: 12, background: 'var(--gold-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-glow)' }}>
            <Bot size={22} color="#120b08" />
          </div>
          <div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--gold-light)', fontFamily: 'Syne' }}>Ask Imperial AI</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-gold-muted)' }}>Active Telemetry: {dataset.name}</div>
          </div>
        </div>
        <button className="btn btn-dark btn-sm" onClick={onClose} style={{ padding: 6 }}>
          <X size={18} />
        </button>
      </div>

      {/* Suggested Prompt Chips */}
      <div style={{ padding: '14px 20px', background: '#170e0a', borderBottom: '1px solid var(--border-gold)', display: 'flex', gap: '8px', overflowX: 'auto' }}>
        {samplePrompts.map((prompt, idx) => (
          <button
            key={idx}
            className="btn btn-dark btn-sm"
            onClick={() => handleSend(prompt)}
            style={{ fontSize: '0.72rem', whiteSpace: 'nowrap', borderRadius: 20, borderColor: 'var(--gold-primary)' }}
          >
            <Sparkles size={12} color="var(--gold-light)" /> {prompt}
          </button>
        ))}
      </div>

      {/* Messages Stream */}
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              gap: '12px',
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '88%',
            }}
          >
            {msg.sender === 'ai' && (
              <div style={{ width: 30, height: 30, borderRadius: 10, background: 'var(--gold-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Bot size={18} color="#120b08" />
              </div>
            )}
            <div
              style={{
                background: msg.sender === 'user' ? 'var(--gold-gradient)' : '#23150e',
                color: msg.sender === 'user' ? '#120b08' : '#fffdfa',
                fontWeight: msg.sender === 'user' ? 'bold' : 'normal',
                padding: '14px 16px',
                borderRadius: msg.sender === 'user' ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                border: msg.sender === 'user' ? 'none' : '1px solid var(--border-gold)',
                fontSize: '0.88rem',
                lineHeight: '1.6',
              }}
            >
              <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
              <div style={{ fontSize: '0.68rem', color: msg.sender === 'user' ? '#3b281c' : 'var(--text-muted)', marginTop: 8, textAlign: 'right' }}>
                {msg.timestamp}
              </div>

              {msg.chartSuggestion && (
                <button
                  className="btn btn-ocean btn-sm"
                  onClick={() => {
                    onSelectChartSuggestion?.(msg.chartSuggestion);
                    onClose();
                  }}
                  style={{ marginTop: 10, width: '100%', fontSize: '0.78rem' }}
                >
                  <Zap size={14} /> Plot Telemetry: {msg.chartSuggestion.title}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input Box */}
      <div style={{ padding: '20px', borderTop: '1.5px solid var(--border-gold)', display: 'flex', gap: '10px', background: '#1c120d' }}>
        <input
          type="text"
          className="form-control"
          placeholder="Ask AI a question..."
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button className="btn btn-ocean" onClick={() => handleSend()}>
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};
