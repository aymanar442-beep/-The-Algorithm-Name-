import React, { useState, useEffect } from 'react';
import { Flame, Loader2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export const SentimentCard: React.FC = () => {
  const [value, setValue] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/sentiment')
      .then(r => r.json())
      .then(data => {
        setValue(Number(data.value));
      })
      .catch(() => setValue(50));
  }, []);

  const data = [
    { name: 'Value', value: value || 0 },
    { name: 'Remaining', value: 100 - (value || 0) }
  ];

  return (
    <div className="bg-[#121214] border border-white/10 p-6 rounded-[2rem] space-y-4">
      <h3 className="text-lg font-black text-white flex items-center gap-2">
        <Flame size={20} className="text-amber-500" />
        Market Sentiment
      </h3>
      {value === null ? (
        <div className="flex justify-center p-4">
          <Loader2 className="animate-spin text-amber-500" />
        </div>
      ) : (
        <div className="h-40 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="100%"
                startAngle={180}
                endAngle={0}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={0}
                dataKey="value"
              >
                <Cell fill="#f59e0b" />
                <Cell fill="#374151" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <p className="text-2xl font-black text-white">{value}</p>
            <p className="text-[10px] text-gray-500">Greed</p>
          </div>
        </div>
      )}
    </div>
  );
};
