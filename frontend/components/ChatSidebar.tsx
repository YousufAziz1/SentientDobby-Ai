"use client";
import React, { useEffect, useState } from 'react';
import { apiClient } from '../lib/api';
import ModelSelector from './ModelSelector';
import { PlusIcon, MagnifyingGlassIcon, ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/outline';

export type Chat = { _id: string; title: string; created_at: string; updated_at: string };

export default function ChatSidebar({ token, selectedModel, onModelChange, onSelectChat, activeChatId, onNewChat }:{
  token?: string|null;
  selectedModel?: string;
  onModelChange: (m: string)=>void;
  onSelectChat: (chat: Chat)=>void;
  activeChatId?: string|null;
  onNewChat: (chat: Chat)=>void;
}) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [query, setQuery] = useState('');
  const api = apiClient(token || undefined);

  async function loadChats() {
    try {
      const res = await api.get('/chats');
      setChats(res.data);
    } catch {}
  }

  useEffect(() => { loadChats(); }, [token]);

  async function createChat() {
    const res = await api.post('/chats', { title: 'New Chat' });
    setChats([res.data, ...chats]);
    onNewChat(res.data);
  }

  async function deleteChat(id: string) {
    await api.delete(`/chats/${id}`);
    setChats(chats.filter(c => c._id !== id));
  }

  const filtered = chats.filter(c => c.title.toLowerCase().includes(query.toLowerCase()));

  function initials(title: string): string {
    const parts = title.split(' ').filter(Boolean);
    const first = parts[0]?.[0] || 'C';
    const second = parts[1]?.[0] || '';
    return (first + second).toUpperCase();
  }

  return (
    <aside className="w-72 p-4 border-r border-gray-100 dark:border-gray-800 bg-white/70 dark:bg-gray-950/50 backdrop-blur">
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="font-semibold flex items-center gap-2">
              <ChatBubbleLeftEllipsisIcon className="w-5 h-5 text-brand-600" />
              <span>Chats</span>
            </div>
            <button onClick={createChat} className="p-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white shadow-soft" title="New Chat">
              <PlusIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="relative">
            <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={e=>setQuery(e.target.value)}
              placeholder="Search chats"
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/40 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        <div>
          <div className="text-[11px] uppercase tracking-wide text-gray-500 mb-2">Model</div>
          <ModelSelector token={token} value={selectedModel} onChange={onModelChange} />
        </div>

        <div>
          <div className="text-[11px] uppercase tracking-wide text-gray-500 mb-2">All Chats</div>
          <div className="max-h-[70vh] overflow-auto space-y-2 pr-1">
            {filtered.map(c => (
              <div
                key={c._id}
                className={`p-2.5 rounded-xl border cursor-pointer flex items-center gap-3 transition ${activeChatId===c._id ? 'border-brand-300 bg-brand-50 dark:bg-brand-900/20' : 'border-gray-200 dark:border-gray-800 hover:border-brand-300'}`}
                onClick={()=>onSelectChat(c)}
              >
                <div className="w-8 h-8 rounded-full bg-brand-500/10 text-brand-700 dark:text-brand-200 flex items-center justify-center text-xs font-semibold">
                  {initials(c.title)}
                </div>
                <div className="truncate flex-1">{c.title}</div>
                <button
                  onClick={(e)=>{e.stopPropagation(); deleteChat(c._id);}}
                  className="text-[11px] px-2 py-1 rounded-md border border-gray-200 dark:border-gray-800 hover:border-accent-500 text-accent-600"
                >Del</button>
              </div>
            ))}
            {filtered.length===0 && (
              <div className="text-xs text-gray-500">No chats found.</div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
