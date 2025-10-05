import { format } from 'date-fns';

export default function MessageItem({ role, content, timestamp }:{ role: 'user'|'assistant'|'system'; content: string; timestamp?: string|number|Date }) {
  const isUser = role === 'user';
  const time = timestamp ? format(new Date(timestamp), 'p') : '';
  return (
    <div className={`w-full flex ${isUser ? 'justify-end' : 'justify-start'} my-2 fade-in`}>
      <div
        className={`relative max-w-[80%] rounded-xl p-3 text-[14px] leading-6 whitespace-pre-wrap shadow-soft transition
          ${isUser
            ? 'bg-[#f1f3f5] text-gray-900 dark:bg-gray-800 dark:text-gray-100'
            : 'bg-[#eef2ff] text-gray-900 dark:bg-indigo-900/30 dark:text-gray-100'
          }
        `}
      >
        <button
          onClick={() => navigator.clipboard.writeText(content)}
          title="Copy"
          className={`absolute -top-2 ${isUser ? '-left-2' : '-right-2'} text-[11px] px-2 py-0.5 rounded-full border opacity-80 hover:opacity-100 bg-white/80 dark:bg-gray-900/70 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700`}
        >
          Copy
        </button>
        <div>{content}</div>
        {time && <div className="text-[11px] opacity-70 mt-1 text-right">{time}</div>}
      </div>
    </div>
  );
}
