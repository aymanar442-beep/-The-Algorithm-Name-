import React, { useState, useEffect } from 'react';
import { Newspaper, Loader2 } from 'lucide-react';

export const MarketNews: React.FC = () => {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/news')
      .then(r => r.json())
      .then(data => {
        setNews(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="bg-[#121214] border border-white/10 p-6 rounded-[2rem] space-y-4">
      <h3 className="text-lg font-black text-white flex items-center gap-2">
        <Newspaper size={20} className="text-amber-500" />
        Market News
      </h3>
      {loading ? (
        <div className="flex justify-center p-4">
          <Loader2 className="animate-spin text-amber-500" />
        </div>
      ) : (
        <div className="space-y-3">
          {news.map((n, i) => (
            <div key={i} className="p-3 bg-white/5 rounded-xl text-xs">
              <p className="font-bold text-gray-200">{n.title}</p>
              <p className="text-[10px] text-gray-500 mt-1">{n.source?.title || 'Unknown'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
