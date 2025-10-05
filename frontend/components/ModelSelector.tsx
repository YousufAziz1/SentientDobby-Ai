"use client";
import React, { useEffect, useState } from 'react';
import { apiClient } from '../lib/api';

export default function ModelSelector({ token, value, onChange }:{ token?: string|null; value?: string; onChange: (v: string)=>void }) {
  const [models, setModels] = useState<Array<{ id: string; label: string }>>([]);
  useEffect(() => {
    apiClient(token || undefined).get('/models').then(res => setModels(res.data)).catch(()=>setModels([]));
  }, [token]);
  return (
    <select
      className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/40"
      value={value || ''}
      onChange={e=>onChange(e.target.value)}
    >
      {models.map(m => (
        <option key={m.id} value={m.id}>{m.label}</option>
      ))}
    </select>
  );
}
