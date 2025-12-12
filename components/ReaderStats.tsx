import React from 'react';
import { ReaderStats } from '../types';
import { Trophy, BookOpen, User, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ReaderStatsProps {
  stats: ReaderStats[];
}

const ReaderStatsComponent: React.FC<ReaderStatsProps> = ({ stats }) => {
  // Prepare chart data
  const chartData = stats.slice(0, 10).map(s => ({
    name: s.name.length > 6 ? s.name.substring(0, 6) + '...' : s.name,
    fullName: s.name,
    借阅次数: s.borrowCount,
    当前在借: s.currentBorrowed
  }));

  return (
    <div className="space-y-6">
      {/* Top Readers Leaderboard */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100">
        <h3 className="font-bold text-xl text-gray-800 mb-4 flex items-center gap-2">
          <Trophy className="text-yellow-500" size={24} />
          读者排行榜
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.slice(0, 3).map((reader, index) => (
            <div
              key={reader.name}
              className={`bg-white p-6 rounded-xl border-2 ${index === 0 ? 'border-yellow-400 shadow-lg' :
                  index === 1 ? 'border-gray-300' :
                    'border-orange-400'
                }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`text-4xl font-bold ${index === 0 ? 'text-yellow-500' :
                    index === 1 ? 'text-gray-400' :
                      'text-orange-500'
                  }`}>
                  #{index + 1}
                </div>
                {index === 0 && <Trophy className="text-yellow-500" size={32} />}
              </div>
              <h4 className="font-semibold text-lg text-gray-800 mb-2 flex items-center gap-2">
                <User size={18} />
                {reader.name}
              </h4>
              <div className="space-y-1 text-sm">
                <p className="text-gray-600">
                  <span className="font-medium">借阅次数:</span> <span className="text-blue-600 font-bold">{reader.borrowCount}</span>
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">当前在借:</span> <span className="text-orange-600 font-bold">{reader.currentBorrowed}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp size={20} className="text-blue-600" />
          借阅统计图表 (前10名)
        </h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <defs>
                <linearGradient id="colorBorrowCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#818cf8" stopOpacity={0.6} />
                </linearGradient>
                <linearGradient id="colorCurrentBorrowed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#fbbf24" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={80}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 500 }}
              />
              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6b7280', fontSize: 12 }}
              />
              <Tooltip
                cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-4 rounded-xl shadow-xl border-none" style={{ boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                        <p className="font-bold text-gray-800 mb-2 text-base">{payload[0].payload.fullName}</p>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)' }}></div>
                            <p className="text-sm text-gray-700">借阅次数: <span className="font-semibold text-indigo-600">{payload[0].value}</span></p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)' }}></div>
                            <p className="text-sm text-gray-700">当前在借: <span className="font-semibold text-amber-600">{payload[1].value}</span></p>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                iconType="circle"
                wrapperStyle={{ paddingTop: '10px' }}
              />
              <Bar
                dataKey="借阅次数"
                fill="url(#colorBorrowCount)"
                radius={[8, 8, 0, 0]}
                stroke="#6366f1"
                strokeWidth={1.5}
              />
              <Bar
                dataKey="当前在借"
                fill="url(#colorCurrentBorrowed)"
                radius={[8, 8, 0, 0]}
                stroke="#f59e0b"
                strokeWidth={1.5}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Full Stats Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
            <BookOpen size={20} className="text-blue-600" />
            完整读者列表
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold">排名</th>
                <th className="p-4 font-semibold">读者姓名</th>
                <th className="p-4 font-semibold">总借阅次数</th>
                <th className="p-4 font-semibold">当前在借</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stats.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-400">
                    暂无读者数据
                  </td>
                </tr>
              ) : (
                stats.map((reader, index) => (
                  <tr key={reader.name} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <span className={`font-bold ${index < 3 ? 'text-blue-600 text-lg' : 'text-gray-500'
                        }`}>
                        #{index + 1}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 font-medium text-gray-800">
                        <User size={16} className="text-gray-400" />
                        {reader.name}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-blue-600 font-semibold">{reader.borrowCount}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-orange-600 font-semibold">{reader.currentBorrowed}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReaderStatsComponent;
