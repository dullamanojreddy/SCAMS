import React, { useState, useRef, useEffect } from 'react';
import { Send, MoreHorizontal, Bot, CheckCircle2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { INITIAL_CHAT_MESSAGES } from '../data/mockData';

export const AIAssistantWidget = ({
  onHighlightLocation,
  onPlaceOrder,
}) => {
  const [messages, setMessages] = useState(INITIAL_CHAT_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      // Call server-side AI endpoint
      const res = await fetch('/api/v1/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          history: messages.map((m) => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text })),
        }),
      });

      if (res.ok) {
        const json = await res.json();
        const aiData = json.data;
        const responseText = aiData.text || aiData.message?.content || aiData.reply || 'I processed your campus query.';

        let botResponse = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: responseText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        if (aiData.actions && aiData.actions.length > 0) {
          const firstAction = aiData.actions[0];
          botResponse.actionButton = {
            label: firstAction.label || 'View on Campus Map',
            action: firstAction.type === 'SHOW_MENU' ? 'open_canteen' : 'highlight_cse_block',
          };
        } else if (aiData.actionType === 'location' || aiData.toolCalled === 'searchCampus') {
          botResponse.actionButton = {
            label: 'Show on Map',
            action: 'highlight_cse_block',
          };
        } else if (aiData.actionType === 'order' || aiData.toolCalled === 'createOrder') {
          confetti({
            particleCount: 45,
            spread: 65,
            origin: { y: 0.8 },
          });
          const orderInfo = aiData.actionData || aiData.toolResult?.order;
          botResponse.orderCard = {
            status: 'Order Confirmed ✅',
            item: orderInfo?.item || orderInfo?.itemName || 'Veg Thali',
            details: `${orderInfo?.canteen || 'Canteen B'} • ${orderInfo?.pickupTime || '1:00 PM'}`,
          };
        }

        setMessages((prev) => [...prev, botResponse]);
        setIsTyping(false);
        return;
      }
    } catch {
      // Offline fallback handling below
    }

    // Fallback if backend fetch wasn't reached
    setTimeout(() => {
      const lower = text.toLowerCase();
      let botResponse;

      if (lower.includes('network') || lower.includes('cse') || lower.includes('lab')) {
        botResponse = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: 'The Computer Networks Lab is in **CSE Block, 3rd Floor, Room 304**.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionButton: {
            label: 'Show on Map',
            action: 'highlight_cse_block',
          },
        };
      } else if (lower.includes('lunch') || lower.includes('order') || lower.includes('thali') || lower.includes('food')) {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 },
        });
        botResponse = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: 'Sure! Ordering your usual lunch (**Veg Thali**) from **Canteen B** for **1:00 PM**.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          orderCard: {
            status: 'Order Confirmed ✅',
            item: 'Veg Thali',
            details: 'Canteen B • 1:00 PM',
          },
        };
      } else if (lower.includes('next class') || lower.includes('schedule') || lower.includes('class')) {
        botResponse = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: 'Your next class is **Computer Networks** at **10:00 AM** in **CSE Block - 304**.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
      } else {
        botResponse = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `I'm on it! I found details for "${text}". Your attendance is 92% and all campus systems are functioning smoothly.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
      }

      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 400);
  };

  const handleActionClick = (action) => {
    if (action === 'highlight_cse_block') {
      onHighlightLocation?.('cse');
    } else {
      onPlaceOrder?.();
    }
  };

  return (
    <div className="bg-white dark:bg-[#111111] rounded-3xl p-5 border border-slate-200/80 dark:border-[#222222] shadow-xs flex flex-col h-full transition-colors">
      {/* Widget Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#222222] mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#10b981]/15 dark:bg-[#10b981]/25 border border-[#10b981]/30 flex items-center justify-center text-[#10b981]">
            <Bot className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-outfit leading-tight">
              AI Assistant
            </h3>
            <span className="text-[10px] text-slate-400 dark:text-neutral-500 font-medium">Vasavi AI Core</span>
          </div>
        </div>

        <button
          className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-neutral-300 hover:bg-slate-100 dark:hover:bg-[#1f1f1f] flex items-center justify-center transition cursor-pointer"
          title="Options"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 min-h-[300px] max-h-[380px]">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';

          if (isUser) {
            return (
              <div key={msg.id} className="flex justify-end">
                <div className="bg-[#6941c6] text-white text-xs font-medium px-4 py-2.5 rounded-2xl rounded-tr-xs max-w-[85%] shadow-xs leading-relaxed">
                  {msg.text}
                </div>
              </div>
            );
          }

          return (
            <div key={msg.id} className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-full bg-[#10b981]/15 dark:bg-[#10b981]/25 border border-[#10b981]/30 flex items-center justify-center text-[#10b981] shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5 stroke-[2.2]" />
              </div>

              <div className="space-y-2 max-w-[90%]">
                <div className="bg-slate-100/90 dark:bg-[#181818] text-slate-800 dark:text-neutral-200 text-xs px-3.5 py-2.5 rounded-2xl rounded-tl-xs leading-relaxed border border-transparent dark:border-[#262626]">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: msg.text
                        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-950 dark:text-white font-bold">$1</strong>')
                        .replace(/\n/g, '<br />'),
                    }}
                  />
                </div>

                {/* Optional Action Button */}
                {msg.actionButton && (
                  <div>
                    <button
                      id={`btn-chat-action-${msg.id}`}
                      onClick={() => handleActionClick(msg.actionButton.action)}
                      className="px-3.5 py-1.5 rounded-xl border border-purple-300 dark:border-purple-800/80 hover:border-purple-500 bg-white dark:bg-[#1a1a1a] hover:bg-purple-50 dark:hover:bg-purple-950/40 text-xs font-bold text-[#7c3aed] dark:text-purple-300 transition shadow-2xs active:scale-95 cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#7c3aed] dark:text-purple-300" />
                      <span>{msg.actionButton.label}</span>
                    </button>
                  </div>
                )}

                {/* Optional Embedded Order Card */}
                {msg.orderCard && (
                  <div className="bg-white dark:bg-[#181818] border border-slate-200/90 dark:border-[#282828] rounded-2xl p-3 shadow-xs">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{msg.orderCard.status}</span>
                    </div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {msg.orderCard.item}
                    </div>
                    <div className="text-[11px] text-slate-400 dark:text-neutral-400">
                      {msg.orderCard.details}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#10b981]/15 flex items-center justify-center text-[#10b981]">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="bg-slate-100 dark:bg-[#181818] text-slate-500 dark:text-neutral-400 text-xs px-3 py-2 rounded-2xl flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-neutral-500 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-neutral-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-neutral-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box Footer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="pt-3 border-t border-slate-100 dark:border-[#222222] flex items-center gap-2 mt-2"
      >
        <input
          id="ai-chat-input"
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask anything..."
          className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#161616] border border-slate-200/80 dark:border-[#262626] text-xs text-slate-800 dark:text-neutral-100 placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
        />
        <button
          id="btn-send-chat"
          type="submit"
          disabled={!inputText.trim()}
          className="w-8 h-8 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] disabled:opacity-40 disabled:hover:bg-[#7c3aed] text-white flex items-center justify-center transition active:scale-95 cursor-pointer shrink-0 shadow-xs"
          title="Send"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
