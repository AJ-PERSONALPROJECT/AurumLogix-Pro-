
import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../App';
import { 
  Send, 
  MessageSquareText, 
  Sparkles, 
  TrendingUp, 
  Package, 
  User as UserIcon,
  ChevronRight,
  Bot
} from 'lucide-react';
import { queryAssistant } from '../services/geminiService';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const AssistantView: React.FC = () => {
  const { user, inventory, sales, rates, settings } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isOwner = user?.role === 'OWNER';

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: `Greetings, ${user?.name}. I am ${settings.assistantName}, your specialized Jewelry Intelligence Consultant. How can I analyze ${user?.brandName}'s performance today?`
      }]);
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    const context = { inventory, sales, rates };
    const response = await queryAssistant(userMsg, settings.assistantName, user?.brandName || 'this shop', context);
    
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setIsLoading(false);
  };

  const suggestedQueries = [
    "Analyze this week's sales trends",
    "Which items are running low in stock?",
    "Show me the most valuable inventory pieces",
    "Predict growth for next month based on data"
  ];

  if (!isOwner) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-10 text-center">
        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-[32px] flex items-center justify-center text-slate-400 mb-6">
          <Bot size={40} />
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tight mb-2">Exclusive Owner Access</h2>
        <p className="text-slate-400 max-w-sm text-sm">The Intelligence Lab is reserved for shop owners to manage strategic infrastructure.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-6 max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="bg-white dark:bg-slate-800 rounded-[48px] border-2 border-slate-100 dark:border-slate-700 shadow-sm flex-1 flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="px-10 py-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-yellow-500/20">
              <Sparkles size={24} />
            </div>
            <div>
              <h3 className="font-black text-lg tracking-tight uppercase">{settings.assistantName}</h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Intelligence Pulse Active</span>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4 text-xs font-black uppercase tracking-widest text-slate-400">
            <div className="flex items-center gap-1"><Package size={14}/> {inventory.length} Stock</div>
            <div className="flex items-center gap-1"><TrendingUp size={14}/> ₹{sales.length} Sales</div>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
              <div className={`max-w-[80%] rounded-[32px] p-6 text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' 
                ? 'bg-slate-900 text-white rounded-tr-none' 
                : 'bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-tl-none'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start animate-pulse">
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-[32px] rounded-tl-none p-6 text-slate-400 text-xs font-black uppercase tracking-widest">
                Analyzing Shop Infrastructure...
              </div>
            </div>
          )}
        </div>

        {/* Suggested Queries */}
        <div className="px-10 py-4 flex flex-wrap gap-2">
          {suggestedQueries.map((q, i) => (
            <button 
              key={i} 
              onClick={() => { setInput(q); }}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-900 hover:bg-yellow-500 hover:text-white transition-all rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat Input */}
        <form onSubmit={handleSend} className="p-10 pt-0">
          <div className="relative group">
            <input 
              type="text" 
              placeholder="Query shop performance or stock alerts..." 
              className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-[32px] pl-8 pr-20 py-6 outline-none focus:border-yellow-500 transition-all font-bold"
              value={input}
              onChange={e => setInput(e.target.value)}
            />
            <button 
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-yellow-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-500/20 active:scale-90 transition-all disabled:opacity-50 disabled:grayscale"
            >
              <Send size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssistantView;
