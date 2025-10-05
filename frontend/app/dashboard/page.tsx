"use client";
import React, { useState } from 'react';
import Header from '../../components/Header';
import ChatSidebar, { Chat } from '../../components/ChatSidebar';
import ChatWindow from '../../components/ChatWindow';

export default function DashboardPage() {
  // Make dashboard publicly accessible (no auth gating)
  const token = null;
  const [model, setModel] = useState<string>('openai/gpt-4o-mini');
  const [activeChat, setActiveChat] = useState<Chat | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-hero-gradient dark:bg-hero-gradient-dark">
      <Header />
      <main className="flex-1">
        <div className="max-w-6xl mx-auto my-4 md:my-6 rounded-2xl overflow-hidden shadow-card border border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-950/50 backdrop-blur">
          <div className="flex min-h-[70vh]">
            <ChatSidebar
              token={token}
              selectedModel={model}
              onModelChange={setModel}
              onSelectChat={setActiveChat}
              activeChatId={activeChat?._id || null}
              onNewChat={setActiveChat}
            />
            <ChatWindow token={token} chatId={activeChat?._id || null} model={model} />
          </div>
        </div>
      </main>
    </div>
  );
}
