'use client';

import { useState } from 'react';

export default function AIInput() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setLoading(true);

    const res = await fetch('/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: input }),
    });

    const data = await res.json();
    console.log('Parsed Event:', data);
    setLoading(false);
    setInput('');
  };

  return (
    <div className="flex items-center gap-2 mb-4">
      <input
        className="border p-2 rounded w-full"
        placeholder="e.g. Call with Alex tomorrow at 5pm"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        className="bg-black text-white px-4 py-2 rounded"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? 'Thinking...' : 'Add'}
      </button>
    </div>
  );
}
