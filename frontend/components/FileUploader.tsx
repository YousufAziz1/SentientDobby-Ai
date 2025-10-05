"use client";
import React, { useState } from 'react';
import { apiClient } from '../lib/api';

type UploadResult = { text: string; preview_url?: string };

export default function FileUploader({ token, onResult }:{ token?: string|null; onResult: (r: UploadResult)=>void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    const form = new FormData();
    form.append('file', file);
    setLoading(true);
    try {
      const res = await apiClient(token || undefined).post('/uploads', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onResult({ text: res.data.text || '', preview_url: res.data.preview_url });
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Upload failed');
    } finally { setLoading(false); e.currentTarget.value=''; }
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Upload (Image/PDF/DOCX/DOC)</label>
      <input type="file" accept="image/*,.pdf,.doc,.docx" onChange={onChange} className="w-full text-sm" />
      {loading && <div className="text-xs text-gray-500">Extracting...</div>}
      {error && <div className="text-xs text-red-600">{error}</div>}
    </div>
  );
}
