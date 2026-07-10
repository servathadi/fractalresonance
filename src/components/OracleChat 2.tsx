'use client';

import { useState, useRef, useEffect } from 'react';

interface Source {
  index: number;
  title: string;
  type: string;
  url: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
}

const DICT: Record<string, {
  placeholder: string;
  ask: string;
  thinking: string;
  error: string;
  sources: string;
  welcome: string;
  examples: string[];
}> = {
  en: {
    placeholder: 'Ask about FRC concepts, papers, or theories...',
    ask: 'Ask',
    thinking: 'Consulting the canon...',
    error: 'Failed to get a response. Please try again.',
    sources: 'Sources',
    welcome: 'Ask me about Fractal Resonance Coherence. I can help you understand concepts, find relevant papers, and explore the theoretical framework.',
    examples: [
      'What is the Lambda field?',
      'How does FRC explain wavefunction collapse?',
      'What is the reciprocity law?',
      'How does coherence relate to entropy?',
    ],
  },
  es: {
    placeholder: 'Pregunta sobre conceptos FRC, artículos o teorías...',
    ask: 'Preguntar',
    thinking: 'Consultando el canon...',
    error: 'Error al obtener respuesta. Intenta de nuevo.',
    sources: 'Fuentes',
    welcome: 'Pregúntame sobre Coherencia por Resonancia Fractal. Puedo ayudarte a entender conceptos, encontrar artículos relevantes y explorar el marco teórico.',
    examples: [
      '¿Qué es el campo Lambda?',
      '¿Cómo explica FRC el colapso de la función de onda?',
      '¿Qué es la ley de reciprocidad?',
      '¿Cómo se relaciona la coherencia con la entropía?',
    ],
  },
  fr: {
    placeholder: 'Posez une question sur les concepts FRC, articles ou théories...',
    ask: 'Demander',
    thinking: 'Consultation du canon...',
    error: 'Échec de la réponse. Veuillez réessayer.',
    sources: 'Sources',
    welcome: 'Posez-moi des questions sur la Cohérence par Résonance Fractale. Je peux vous aider à comprendre les concepts, trouver des articles pertinents et explorer le cadre théorique.',
    examples: [
      'Qu\'est-ce que le champ Lambda ?',
      'Comment FRC explique-t-il l\'effondrement de la fonction d\'onde ?',
      'Quelle est la loi de réciprocité ?',
      'Comment la cohérence est-elle liée à l\'entropie ?',
    ],
  },
  fa: {
    placeholder: 'در مورد مفاهیم FRC، مقالات یا نظریه‌ها بپرسید...',
    ask: 'پرسش',
    thinking: 'در حال بررسی کانن...',
    error: 'خطا در دریافت پاسخ. لطفا دوباره تلاش کنید.',
    sources: 'منابع',
    welcome: 'از من در مورد همدوسی تشدید فراکتالی بپرسید. می‌توانم به شما در درک مفاهیم، یافتن مقالات مرتبط و کاوش در چارچوب نظری کمک کنم.',
    examples: [
      'میدان لامبدا چیست؟',
      'FRC چگونه فروپاشی تابع موج را توضیح می‌دهد؟',
      'قانون متقابل چیست؟',
      'همدوسی چگونه با آنتروپی مرتبط است؟',
    ],
  },
};

interface OracleChatProps {
  lang: string;
}

export function OracleChat({ lang }: OracleChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const t = DICT[lang] || DICT.en;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (query: string) => {
    if (!query.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: query };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, lang }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.answer,
        sources: data.sources,
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setError(t.error);
      console.error('Oracle chat error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(input);
    }
  };

  return (
    <div className="border border-frc-blue/50 rounded-lg overflow-hidden bg-frc-void/50">
      {/* Messages area */}
      <div className="h-[400px] overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-frc-text-dim text-sm mb-6">{t.welcome}</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {t.examples.map((example, i) => (
                <button
                  key={i}
                  onClick={() => handleSubmit(example)}
                  className="px-3 py-1.5 text-xs border border-frc-blue/50 text-frc-text-dim hover:text-frc-gold hover:border-frc-gold/50 rounded-full transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              className={`${
                msg.role === 'user'
                  ? 'ml-8 bg-frc-blue/20 border-frc-blue/30'
                  : 'mr-8 bg-frc-void border-frc-gold/20'
              } border rounded-lg p-3`}
            >
              <div className="text-[10px] uppercase tracking-wider text-frc-steel mb-1">
                {msg.role === 'user' ? 'You' : 'Oracle'}
              </div>
              <div className="text-sm text-frc-text whitespace-pre-wrap">
                {msg.content}
              </div>
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 pt-2 border-t border-frc-blue/20">
                  <div className="text-[10px] uppercase tracking-wider text-frc-steel mb-1">
                    {t.sources}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {msg.sources.map((src) => (
                      <a
                        key={src.index}
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-frc-gold hover:underline"
                      >
                        [{src.index}] {src.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}

        {isLoading && (
          <div className="mr-8 bg-frc-void border border-frc-gold/20 rounded-lg p-3">
            <div className="text-[10px] uppercase tracking-wider text-frc-steel mb-1">
              Oracle
            </div>
            <div className="flex items-center gap-2 text-sm text-frc-text-dim">
              <span className="animate-pulse">{t.thinking}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="text-center text-red-400 text-sm py-2">{error}</div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-frc-blue/30 p-3 bg-frc-void/80">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t.placeholder}
            disabled={isLoading}
            className="flex-1 bg-transparent border border-frc-blue/30 rounded px-3 py-2 text-sm text-frc-text placeholder-frc-text-dim focus:outline-none focus:border-frc-gold/50"
          />
          <button
            onClick={() => handleSubmit(input)}
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-frc-gold/20 border border-frc-gold/50 text-frc-gold text-sm hover:bg-frc-gold/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {t.ask}
          </button>
        </div>
      </div>
    </div>
  );
}
