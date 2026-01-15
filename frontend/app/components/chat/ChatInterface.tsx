'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Mic, Paperclip, Bot, Sparkles, StopCircle, User, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import 'react-loading-skeleton/dist/skeleton.css';

// ElevenLabs Integration Config
const ELEVENLABS_API_KEY = process.env.NEXT_PUBLIC_ELEVENLABS_KEY;
const ELEVENLABS_VOICE_ID = "21m00Tcm4TlvDq8ikWAM";

type Message = {
    role: 'user' | 'ai';
    content: string;
    sources?: string[];
};

interface ChatInterfaceProps {
    onChatCreated?: () => void;
}

export default function ChatInterface({ onChatCreated }: ChatInterfaceProps) {
    const { t, language } = useLanguage();
    const { data: session } = useSession();
    const searchParams = useSearchParams();

    // State
    const [messages, setMessages] = useState<Message[]>([
        { role: 'ai', content: "Welcome. I am the Strategic AI for Vision 2030. I am ready to provide world-class executive insights." }
    ]);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [credits, setCredits] = useState<number | null>(null);

    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [thinkingText, setThinkingText] = useState<string>('Processing...');


    // Refs
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 1. Fetch Credits Logic
    useEffect(() => {
        if (session?.user) {
            fetch('/api/v1/auth/me', {
                headers: { 'X-User-Email': session.user.email || '' }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.credits !== undefined) setCredits(data.credits);
                })
                .catch(err => console.error("Failed to fetch credits", err));
        }
    }, [session, messages]); // Refresh when messages change (deduction happened)



    // 3. Handle URL Query Params & Language
    useEffect(() => {
        const queryParam = searchParams?.get('q');
        const idParam = searchParams?.get('id');

        if (idParam) {
            setConversationId(idParam);
            // Fetch messages for this ID
            fetch(`/api/v1/chat/${idParam}`)
                .then(res => {
                    if (!res.ok) throw new Error("Failed to load chat");
                    return res.json();
                })
                .then(data => {
                    if (Array.isArray(data)) {
                        const restoredMessages = data.reverse().map((m: any) => ({
                            role: m.role || m.sender,
                            content: m.content
                        }));
                        setMessages(restoredMessages);
                    } else {
                        console.warn("Chat API returned non-array:", data);
                    }
                })
                .catch(err => console.error("Failed to fetch chat", err));
        }
        else if (queryParam && messages.length === 1 && messages[0]?.role === 'ai') {
            setInput(queryParam);
            handleSubmit(undefined, queryParam);
            return;
        }

        const firstMsg = messages[0];
        if (messages.length === 1 && firstMsg?.role === 'ai') {
            setMessages([{ role: 'ai', content: t('WelcomeMessage') }]);
        }
    }, [language, t, searchParams]);

    // 4. Auto-Scroll & Resize
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [input]);

    // Handlers
    const startListening = () => {
        if ('webkitSpeechRecognition' in window) {
            // @ts-ignore
            const recognition = new window.webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.lang = language === 'ar' ? 'ar-SA' : 'en-US';

            toast.loading(language === 'ar' ? 'جاري الاستماع...' : 'Listening...', { duration: 1000 });

            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setInput(prev => prev + (prev ? ' ' : '') + transcript);
            };

            recognition.onerror = (event: any) => {
                console.error("Speech recognition error", event.error);
                toast.error("Voice input failed. Please try again.");
            };

            recognition.start();
        } else {
            toast.error("Voice search not supported in this browser.");
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file type
        const allowedTypes = ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(file.type)) {
            toast.error('Please upload a PDF, TXT, or DOC file.');
            return;
        }

        // Check file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            toast.error('File size must be under 10MB.');
            return;
        }

        const toastId = toast.loading(`Uploading ${file.name} to cloud...`);

        try {
            // Create FormData for file upload
            const formData = new FormData();
            formData.append('file', file);

            // Upload to S3 via backend
            const response = await fetch('/api/v1/documents/upload', {
                method: 'POST',
                headers: {
                    'X-User-Email': session?.user?.email || ''
                },
                body: formData
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Upload failed');
            }

            const result = await response.json();

            toast.success(`"${file.name}" uploaded to S3 and indexed for RAG!`, { id: toastId, duration: 4000 });

            setMessages(prev => [...prev, { role: 'user', content: `📎 [Uploaded: ${file.name}] Document uploaded and indexed.` }]);
            setMessages(prev => [...prev, {
                role: 'ai',
                content: `✅ Your document "${file.name}" has been:\n\n1. **Stored in AWS S3** (secure cloud storage)\n2. **Indexed in your private RAG** (only you can query it)\n\nYou can now ask me questions about this document! For example:\n- "Summarize the key points"\n- "What are the main findings?"\n- "Extract the data tables"`
            }]);

        } catch (error: any) {
            console.error('Upload failed:', error);
            toast.error(error.message || 'Upload failed. Please try again.', { id: toastId });
        } finally {
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e?: React.FormEvent, manualMessage?: string) => {
        if (e) e.preventDefault();
        const messageToSend = manualMessage || input.trim();

        if (!messageToSend && !manualMessage) return;
        if (isLoading && !manualMessage) return;

        if (!manualMessage) {
            setInput('');
            setMessages(prev => [...prev, { role: 'user', content: messageToSend }]);
        }

        setIsLoading(true);

        if (manualMessage) {
            setTimeout(() => {
                setMessages(prev => [...prev, { role: 'ai', content: manualMessage }]);
                setIsLoading(false);
            }, 1000);
            return;
        }

        try {
            const response = await fetch('/api/v1/chat/stream', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-User-Email': session?.user?.email || ''
                },
                body: JSON.stringify({
                    message: messageToSend,
                    language: language,
                    conversation_id: conversationId // Pass ID to append
                }),
            });

            // --- MONETIZATION LOGIC ---
            if (response.status === 401) {
                toast.error("Please Sign In to use the AI.");
                setIsLoading(false);
                return;
            }

            if (response.status === 402) {
                toast.error("Out of credits! 💸 Please upgrade to continue.", { duration: 5000 });
                setIsLoading(false);
                return;
            }
            // --------------------------

            if (!response.ok) throw new Error('Network error');

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let aiResponseContent = "";

            setMessages(prev => [...prev, { role: 'ai', content: "" }]);

            if (reader) {
                let buffer = '';
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    buffer += chunk;

                    const lines = buffer.split('\n');
                    buffer = lines.pop() || '';

                    for (const line of lines) {
                        if (line.trim().startsWith('data: ')) {
                            const dataStr = line.replace('data: ', '').trim();
                            if (dataStr === '[DONE]') break;
                            try {
                                const data = JSON.parse(dataStr);
                                if (data.event === 'conversation_created') {
                                    setConversationId(data.data.id);
                                    if (onChatCreated) onChatCreated(); // Refresh Sidebar
                                } else if (data.event === 'status') {
                                    setThinkingText(data.data);
                                } else if (data.event === 'token') {
                                    aiResponseContent += data.data;
                                    setMessages(prev => {
                                        const newMsgs = [...prev];
                                        newMsgs[newMsgs.length - 1] = {
                                            role: 'ai',
                                            content: aiResponseContent,
                                            sources: newMsgs[newMsgs.length - 1]?.sources || []
                                        } as Message;
                                        return newMsgs;
                                    });
                                } else if (data.event === 'sources') {
                                    setMessages(prev => {
                                        const newMsgs = [...prev];
                                        const lastMsg = newMsgs[newMsgs.length - 1];
                                        newMsgs[newMsgs.length - 1] = {
                                            ...lastMsg,
                                            sources: data.data || []
                                        } as Message;
                                        return newMsgs;
                                    });
                                } else if (data.event === 'billing') {
                                    // Update credits in real-time
                                    setCredits(data.data.remaining);

                                    // Explicit usage notification
                                    const cost = data.data.cost;
                                    if (cost > 0.01) {
                                        toast.custom((t) => (
                                            <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
                                                <div className="flex-1 w-0 p-4">
                                                    <div className="flex items-start">
                                                        <div className="flex-shrink-0 pt-0.5">
                                                            <div className="h-10 w-10 rounded-full bg-emerald-saudi/10 flex items-center justify-center">
                                                                <span className="text-xl">💰</span>
                                                            </div>
                                                        </div>
                                                        <div className="ml-3 flex-1">
                                                            <p className="text-sm font-medium text-gray-900">
                                                                Credits Used
                                                            </p>
                                                            <p className="mt-1 text-sm text-gray-500">
                                                                -{cost.toFixed(3)} Credits (Remaining: {data.data.remaining.toFixed(2)})
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ), { duration: 3000, position: 'bottom-right' });
                                    }
                                }
                            } catch (e) { }
                        }
                    }
                }
            }
        } catch (error) {
            setMessages(prev => [...prev, { role: 'ai', content: t('ConnectionError') }]);
        } finally {
            setIsLoading(false);
            if (textareaRef.current) textareaRef.current.style.height = 'auto';
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const speakText = (text: string) => {
        if (ELEVENLABS_API_KEY) {
            const audio = new Audio(`https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}/stream?api_key=${ELEVENLABS_API_KEY}`);
            audio.play();
            return;
        }

        if ('speechSynthesis' in window) {
            const synth = window.speechSynthesis;
            synth.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            const voices = synth.getVoices();

            if (language === 'ar') {
                const arabicVoice = voices.find(v => v.lang.includes('ar'));
                if (arabicVoice) utterance.voice = arabicVoice;
                utterance.lang = 'ar-SA';
            } else {
                const englishVoice = voices.find(v => v.lang.includes('en-GB') || v.name.includes('UK'));
                if (englishVoice) utterance.voice = englishVoice;
                utterance.lang = 'en-GB';
            }

            utterance.pitch = 1;
            utterance.rate = 1;
            synth.speak(utterance);
        } else {
            toast.error("TTS not supported.");
        }
    };

    return (
        <div className="flex-1 flex flex-col h-screen bg-slate-50 relative overflow-hidden">

            {/* Credit Badge Overlay */}
            {session?.user && credits !== null && (
                <div className="absolute top-20 right-8 z-50 bg-white/90 backdrop-blur-md border border-gold-saudi/30 px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-in fade-in zoom-in duration-300">
                    <span className="text-[16px]">⚡</span>
                    <span className={`text-sm font-bold ${credits < 10 ? 'text-red-500 font-extrabold' : 'text-slate-700'}`}>
                        {credits.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Credits</span>
                    <button
                        onClick={() => window.location.href = '/pricing'}
                        className="ml-2 bg-gradient-to-r from-gold-saudi to-amber-500 text-white text-[10px] py-1 px-3 rounded-full hover:shadow-md transition-all font-bold"
                    >
                        ADD +
                    </button>
                </div>
            )}

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4 scroll-smooth">
                {messages.map((msg, idx) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={idx}
                        className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`flex max-w-[90%] md:max-w-[600px] gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>

                            {/* Avatar */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                                ${msg.role === 'user' ? 'bg-slate-200' : 'bg-sidebar-dark border border-gold-saudi/30'}`}>
                                {msg.role === 'user' ? <User className="w-5 h-5 text-slate-500" /> : <span className="font-serif font-bold text-gold-saudi text-[10px]">V</span>}
                            </div>

                            {/* Bubble */}
                            <div className={`px-4 py-3 rounded-2xl text-[15px] leading-relaxed shadow-sm transition-all duration-200
                                ${msg.role === 'user'
                                    ? 'bg-primary text-white rounded-tr-sm hover:shadow-md'
                                    : 'bg-white border border-slate-100 text-slate-800 rounded-tl-sm hover:shadow-md hover:border-slate-200'}`}>
                                {msg.role === 'ai' ? (
                                    <ReactMarkdown
                                        className="
                                            prose prose-sm max-w-none 
                                            prose-p:text-slate-700 prose-p:leading-relaxed prose-p:my-2
                                            prose-headings:text-emerald-saudi prose-headings:font-serif prose-headings:my-3 prose-headings:font-bold
                                            prose-strong:text-slate-900 prose-strong:font-bold
                                            prose-ul:my-2 prose-li:my-1 prose-li:text-slate-700
                                            prose-li:marker:text-gold-saudi prose-li:marker:font-bold
                                            prose-a:text-emerald-saudi prose-a:underline prose-a:font-medium hover:prose-a:text-emerald-600
                                            prose-ol:my-2 prose-ol:list-decimal prose-ol:pl-4
                                            marker:text-gold-saudi
                                        "
                                    >
                                        {msg.content}
                                    </ReactMarkdown>
                                ) : (
                                    <span className="font-medium">{msg.content}</span>
                                )}
                            </div>

                            {/* TTS Button for AI messages */}
                            {msg.role === 'ai' && (
                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={() => speakText(msg.content)}
                                        className="self-start p-1.5 rounded-full text-slate-400 hover:text-emerald-saudi hover:bg-emerald-50 transition-colors opacity-0 group-hover:opacity-100"
                                        title="Read Aloud"
                                    >
                                        <Volume2 className="w-4 h-4" />
                                    </button>


                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}

                {isLoading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start w-full">
                        <div className="flex gap-3 max-w-[600px]">
                            <div className="w-8 h-8 rounded-full bg-sidebar-dark border border-gold-saudi/30 flex items-center justify-center flex-shrink-0">
                                <Sparkles className="w-4 h-4 text-gold-saudi animate-pulse" />
                            </div>
                            <div className="bg-white border border-slate-100 px-5 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-3 transition-all duration-200">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-emerald-saudi rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                                    <div className="w-2 h-2 bg-emerald-saudi rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                    <div className="w-2 h-2 bg-emerald-saudi rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                                </div>
                                <span className="text-sm text-slate-500 font-medium animate-pulse">{thinkingText}</span>
                            </div>
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-200 z-40">
                <div className="max-w-4xl mx-auto relative group">
                    <div className="absolute bottom-0 left-0 right-0 top-0 bg-white rounded-xl shadow-md border border-slate-200 group-focus-within:shadow-lg group-focus-within:ring-2 group-focus-within:ring-emerald-saudi/20 group-focus-within:border-emerald-saudi transition-all duration-200" />

                    <div className="relative flex items-end p-2 z-10">
                        {/* Hidden File Input */}
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx,.txt"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleFileUpload}
                        />

                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-emerald-saudi transition-all duration-200 mb-0.5"
                            title="Attach file"
                        >
                            <Paperclip className="w-5 h-5" />
                        </button>

                        <button
                            onClick={startListening}
                            className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-emerald-saudi transition-all duration-200 mb-0.5"
                            title="Voice Input"
                        >
                            <Mic className="w-5 h-5" />
                        </button>

                        <textarea
                            ref={textareaRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={t('MessagePlaceholder')}
                            className="flex-1 max-h-[200px] min-h-[44px] py-3 px-3 bg-transparent border-none focus:ring-0 resize-none text-slate-800 placeholder:text-slate-400 leading-relaxed scrollbar-hide"
                            rows={1}
                            disabled={isLoading}
                        />

                        {isLoading ? (
                            <button className="p-2 mb-0.5 rounded-lg bg-slate-100 text-slate-400 cursor-not-allowed">
                                <StopCircle className="w-5 h-5" />
                            </button>
                        ) : (
                            <button
                                onClick={() => handleSubmit()}
                                disabled={!input.trim()}
                                className="p-2 mb-0.5 rounded-lg bg-emerald-saudi text-white shadow-md hover:bg-emerald-700 hover:scale-105 disabled:opacity-50 disabled:bg-slate-200 disabled:text-slate-400 disabled:hover:scale-100 transition-all duration-200"
                            >
                                <Send className="w-5 h-5 rtl:rotate-180" />
                            </button>
                        )}
                    </div>
                </div>
                <p className="text-center text-[10px] text-slate-400 mt-2">
                    {t('AIWarning')}
                </p>
            </div>
        </div>
    );
}
