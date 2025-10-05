"use client";
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { apiClient } from '../lib/api';
import MessageItem from './MessageItem';
import FileUploader from './FileUploader';
import { PaperClipIcon, FaceSmileIcon, MicrophoneIcon, PaperAirplaneIcon, XMarkIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/outline';

export type Message = { _id?: string; role: 'user'|'assistant'|'system'; content: string; timestamp?: string; model_used?: string };

export default function ChatWindow({ token, chatId, model }:{ token?: string|null; chatId?: string|null; model?: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string|null>(null);
  const [editingId, setEditingId] = useState<string|null>(null);
  const [editText, setEditText] = useState('');
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [previews, setPreviews] = useState<Array<{ url: string; name: string; type: string }>>([]);
  const [dragOver, setDragOver] = useState<boolean>(false);
  const [moreOpen, setMoreOpen] = useState<boolean>(false);
  const api = useMemo(() => apiClient(token || undefined), [token]);

  useEffect(() => {
    async function load() {
      if (!chatId) { setMessages([]); return; }
      try {
        const res = await api.get(`/chats/${chatId}/messages`);
        setMessages(res.data);
      } catch {}
    }
    load();
  }, [chatId, api]);

  // Simple scroll-to-bottom when new messages arrive
  useEffect(() => {
    listRef.current?.scrollTo(0, listRef.current.scrollHeight);
  }, [messages, sending]);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 200) + 'px';
  }, [input]);

  async function send() {
    if (!chatId || !input.trim()) return;
    setError(null);
    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userText, timestamp: new Date().toISOString() }]);
    setSending(true);
    try {
      const res = await api.post(`/chats/${chatId}/messages`, { content: userText, model });
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.assistant.content, timestamp: res.data.assistant.timestamp, model_used: res.data.assistant.model_used }]);
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Failed to send');
    } finally { setSending(false); }
  }

  async function clearChat() {
    if (!chatId) return;
    await api.delete(`/chats/${chatId}/messages`);
    setMessages([]);
  }

  function startEdit(msg: Message) {
    if (!msg._id) return;
    setEditingId(msg._id);
    setEditText(msg.content);
  }

  async function saveEdit() {
    if (!chatId || !editingId) return;
    try {
      const res = await api.put(`/chats/${chatId}/messages/${editingId}`, { content: editText });
      setMessages(prev => prev.map(m => (m._id === editingId ? { ...m, content: res.data.content } : m)));
      setEditingId(null);
      setEditText('');
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Failed to edit message');
    }
  }

  function cancelEdit() {
    setEditingId(null);
    setEditText('');
  }

  async function uploadFiles(files: FileList | null) {
    if (!files || !files.length) return;
    const file = files[0];
    const form = new FormData();
    form.append('file', file);
    setUploadProgress(0);
    try {
      const res = await api.post('/uploads', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (evt) => {
          if (!evt.total) return;
          setUploadProgress(Math.round((evt.loaded / evt.total) * 100));
        }
      });
      const { text, preview_url } = res.data as { text: string; preview_url?: string };
      if (preview_url) {
        setPreviews(prev => [...prev, { url: preview_url, name: file.name, type: file.type }]);
      }
      let addition = text || '';
      if (preview_url) addition = addition ? `${addition}\n${preview_url}` : preview_url;
      setInput(prev => (prev ? prev + "\n" + addition : addition));
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Upload failed');
    } finally {
      setUploadProgress(0);
    }
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    uploadFiles(e.dataTransfer.files);
  }

  return (
    <section className="flex-1 flex flex-col">
      <div ref={listRef} className="flex-1 overflow-auto p-4">
        {messages.map((m, i) => (
          <div key={m._id || i} className="group">
            {editingId === m._id && m.role === 'user' ? (
              <div className={`w-full flex ${'justify-end'} my-2`}>
                <div className="max-w-[80%] w-full rounded-lg p-3 bg-white dark:bg-gray-900 border border-brand-300">
                  <textarea
                    className="w-full p-2 rounded-md border bg-transparent"
                    rows={3}
                    value={editText}
                    onChange={e=>setEditText(e.target.value)}
                  />
                  <div className="mt-2 flex gap-2 justify-end">
                    <button onClick={saveEdit} className="px-3 py-1.5 rounded-md bg-brand-600 hover:bg-brand-700 text-white text-sm">Save</button>
                    <button onClick={cancelEdit} className="px-3 py-1.5 rounded-md border text-sm">Cancel</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative">
                <MessageItem role={m.role} content={m.content} timestamp={m.timestamp || ''} />
                {m.role === 'user' && m._id && (
                  <button
                    onClick={()=>startEdit(m)}
                    className="absolute -top-2 right-2 opacity-0 group-hover:opacity-100 transition text-[11px] px-2 py-0.5 rounded-full border bg-white dark:bg-gray-800"
                    title="Edit message"
                  >Edit</button>
                )}
              </div>
            )}
          </div>
        ))}
        {sending && (
          <div className="mt-2 text-sm text-gray-500 flex items-center gap-2">
            <span>Assistant is typing</span>
            <span className="inline-flex gap-1">
              <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
          </div>
        )}
      </div>
      {error && <div className="px-4 text-sm text-red-600">{error}</div>}

      <div
        className={`sticky bottom-0 border-t border-gray-200 dark:border-gray-800 p-3 bg-white/90 dark:bg-gray-950/80 backdrop-blur shadow-[0_-2px_8px_rgba(0,0,0,0.04)]`}
        onDragOver={(e)=>{e.preventDefault(); setDragOver(true);}}
        onDragLeave={()=>setDragOver(false)}
        onDrop={onDrop}
        aria-label="Message composer"
      >
        {previews.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-2">
            {previews.map((p, idx) => (
              <a key={idx} href={p.url} target="_blank" rel="noreferrer" className="text-xs px-2 py-1 rounded-md border bg-gray-50 dark:bg-gray-900/40">
                {p.type.startsWith('image/') ? 'Image' : 'File'}: {p.name}
              </a>
            ))}
          </div>
        )}
        {uploadProgress > 0 && (
          <div className="w-full h-1 bg-gray-200 dark:bg-gray-800 rounded mb-2">
            <div className="h-1 bg-brand-600 rounded" style={{ width: `${uploadProgress}%` }} />
          </div>
        )}
        <div className={`flex items-end gap-2 ${dragOver ? 'ring-2 ring-brand-500 rounded-xl p-2' : ''}`}>
          {/* Left icon buttons */}
          <div className="hidden sm:flex items-center gap-2">
            <button aria-label="Attach file" className="w-10 h-10 flex items-center justify-center rounded-full bg-brand-50 text-brand-700 hover:bg-brand-100 transition transform hover:scale-105" onClick={()=>fileInputRef.current?.click()}>
              <PaperClipIcon className="w-5 h-5" />
            </button>
            <button aria-label="Insert emoji" className="w-10 h-10 flex items-center justify-center rounded-full bg-brand-50 text-brand-700 hover:bg-brand-100 transition transform hover:scale-105" onClick={()=>setInput(prev=> (prev ? prev + ' 😊' : '😊'))}>
              <FaceSmileIcon className="w-5 h-5" />
            </button>
            <button aria-label="Voice" className="w-10 h-10 flex items-center justify-center rounded-full bg-brand-50 text-brand-700 hover:bg-brand-100 transition transform hover:scale-105" onClick={()=>{ /* placeholder for mic */ }}>
              <MicrophoneIcon className="w-5 h-5" />
            </button>
          </div>
          {/* Mobile More */}
          <div className="sm:hidden">
            <button aria-label="More" className="w-10 h-10 flex items-center justify-center rounded-full bg-brand-50 text-brand-700 hover:bg-brand-100 transition" onClick={()=>setMoreOpen(v=>!v)}>
              <EllipsisHorizontalIcon className="w-5 h-5" />
            </button>
            {moreOpen && (
              <div className="absolute mb-2 p-2 rounded-xl border bg-white dark:bg-gray-900 shadow-soft flex gap-2">
                <button aria-label="Attach file" className="w-10 h-10 flex items-center justify-center rounded-full bg-brand-50 text-brand-700 hover:bg-brand-100 transition" onClick={()=>fileInputRef.current?.click()}>
                  <PaperClipIcon className="w-5 h-5" />
                </button>
                <button aria-label="Insert emoji" className="w-10 h-10 flex items-center justify-center rounded-full bg-brand-50 text-brand-700 hover:bg-brand-100 transition" onClick={()=>setInput(prev=> (prev ? prev + ' 😊' : '😊'))}>
                  <FaceSmileIcon className="w-5 h-5" />
                </button>
                <button aria-label="Voice" className="w-10 h-10 flex items-center justify-center rounded-full bg-brand-50 text-brand-700 hover:bg-brand-100 transition" onClick={()=>{}}>
                  <MicrophoneIcon className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Center textarea */}
          <textarea
            ref={inputRef}
            className="flex-1 p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] resize-none min-h-[56px] max-h-[200px] focus:outline-none focus:ring-2 focus:ring-brand-500 italic placeholder:italic"
            placeholder="Type your message..."
            value={input}
            onChange={e=>setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
          />

          {/* Right buttons */}
          <div className="flex flex-col gap-2">
            <button aria-label="Send" onClick={send} disabled={sending || !chatId || !input.trim()} className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-soft disabled:opacity-60 flex items-center gap-2">
              <PaperAirplaneIcon className={`w-5 h-5 ${sending ? 'animate-pulse' : ''}`} />
              <span className="hidden md:inline">Send</span>
            </button>
            <button aria-label="Clear chat" onClick={clearChat} disabled={!chatId} className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-brand-500 text-gray-700 dark:text-gray-200 flex items-center gap-2">
              <XMarkIcon className="w-5 h-5" />
              <span className="hidden md:inline">Clear</span>
            </button>
          </div>

          {/* Hidden file input */}
          <input ref={fileInputRef} type="file" accept="image/*,.pdf,.doc,.docx" className="hidden" onChange={(e)=>uploadFiles(e.target.files)} />
        </div>
        <div className="mt-1 text-xs text-gray-500">Drag & drop files (images/PDF/DOC) here or use the paperclip. Enter to send, Shift+Enter for newline.</div>
      </div>
    </section>
  );
}
