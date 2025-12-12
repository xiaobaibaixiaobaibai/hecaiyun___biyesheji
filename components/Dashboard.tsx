import React, { useMemo } from 'react';
import { Book, BookStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BookOpen, Users, CheckCircle, AlertCircle, BookmarkPlus, TrendingUp } from 'lucide-react';

interface DashboardProps {
  books: Book[];
}

const COLORS = [
  '#6366f1', // Indigo
  '#ec4899', // Pink  
  '#f59e0b', // Amber
  '#10b981', // Emerald
  '#8b5cf6', // Violet
  '#06b6d4', // Cyan
  '#f97316', // Orange
  '#14b8a6'  // Teal
];

const StatCard: React.FC<{ title: string; value: number; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
    <div className={`p-4 rounded-full ${color} text-white`}>
      {icon}
    </div>
    <div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ books }) => {
  const stats = useMemo(() => {
    const total = books.length;
    const borrowed = books.filter(b => b.status === BookStatus.BORROWED).length;
    const available = total - borrowed;

    // Calculate overdue books
    const today = new Date().toISOString().split('T')[0];
    const overdue = books.filter(b =>
      b.status === BookStatus.BORROWED && b.dueDate && b.dueDate < today
    ).length;

    // Calculate reserved books
    const reserved = books.filter(b => b.reservedBy).length;

    // Calculate total borrows from history
    const totalBorrows = books.reduce((sum, b) => sum + (b.borrowHistory?.length || 0), 0);

    const categoryCount: Record<string, number> = {};
    books.forEach(b => {
      categoryCount[b.category] = (categoryCount[b.category] || 0) + 1;
    });

    const categoryData = Object.entries(categoryCount).map(([name, value]) => ({ name, value }));

    // Popular books (most borrowed)
    const booksWithBorrowCount = books
      .map(b => ({ ...b, borrowCount: b.borrowHistory?.length || 0 }))
      .sort((a, b) => b.borrowCount - a.borrowCount)
      .slice(0, 5);

    return { total, borrowed, available, overdue, reserved, totalBorrows, categoryData, popularBooks: booksWithBorrowCount };
  }, [books]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="馆藏总数"
          value={stats.total}
          icon={<BookOpen size={24} />}
          color="bg-blue-500"
        />
        <StatCard
          title="当前在借"
          value={stats.borrowed}
          icon={<Users size={24} />}
          color="bg-orange-500"
        />
        <StatCard
          title="在馆书籍"
          value={stats.available}
          icon={<CheckCircle size={24} />}
          color="bg-green-500"
        />
        <StatCard
          title="逾期未还"
          value={stats.overdue}
          icon={<AlertCircle size={24} />}
          color="bg-red-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="图书预约"
          value={stats.reserved}
          icon={<BookmarkPlus size={24} />}
          color="bg-purple-500"
        />
        <StatCard
          title="总借阅次数"
          value={stats.totalBorrows}
          icon={<TrendingUp size={24} />}
          color="bg-indigo-500"
        />
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="text-blue-600" size={20} />
            <h4 className="font-semibold text-gray-800">系统状态</h4>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">借阅率</span>
              <span className="font-bold text-blue-600">
                {stats.total > 0 ? ((stats.borrowed / stats.total) * 100).toFixed(1) : 0}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">逾期率</span>
              <span className="font-bold text-red-600">
                {stats.borrowed > 0 ? ((stats.overdue / stats.borrowed) * 100).toFixed(1) : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">图书分类分布</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <defs>
                  {stats.categoryData.map((entry, index) => (
                    <linearGradient key={`gradient-${index}`} id={`colorGradient${index}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.9} />
                      <stop offset="100%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.7} />
                    </linearGradient>
                  ))}
                </defs>
                <Pie
                  data={stats.categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={{ stroke: '#94a3b8', strokeWidth: 1 }}
                >
                  {stats.categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={`url(#colorGradient${index})`}
                      stroke="#fff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    padding: '12px'
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ paddingTop: '20px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">借阅状态概览</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: '在馆', value: stats.available },
                  { name: '借出', value: stats.borrowed },
                ]}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="colorAvailable" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#34d399" stopOpacity={0.6} />
                  </linearGradient>
                  <linearGradient id="colorBorrowed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#fb923c" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 14, fontWeight: 500 }}
                />
                <YAxis
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    padding: '12px'
                  }}
                  labelStyle={{ color: '#1f2937', fontWeight: 600, marginBottom: '4px' }}
                />
                <Bar
                  dataKey="value"
                  radius={[12, 12, 0, 0]}
                  barSize={80}
                >
                  {
                    [stats.available, stats.borrowed].map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === 0 ? 'url(#colorAvailable)' : 'url(#colorBorrowed)'}
                        stroke={index === 0 ? '#10b981' : '#f97316'}
                        strokeWidth={2}
                      />
                    ))
                  }
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular Books */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="text-blue-600" size={20} />
            热门图书排行
          </h3>
          <div className="space-y-3">
            {stats.popularBooks.length === 0 ? (
              <p className="text-gray-400 text-center py-4">暂无数据</p>
            ) : (
              stats.popularBooks.map((book, index) => (
                <div key={book.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className={`text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full ${index === 0 ? 'bg-yellow-400 text-white' :
                    index === 1 ? 'bg-gray-300 text-white' :
                      index === 2 ? 'bg-orange-400 text-white' :
                        'bg-gray-200 text-gray-600'
                    }`}>
                    {index + 1}
                  </div>
                  <div className="w-8 h-12 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                    <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{book.title}</p>
                    <p className="text-xs text-gray-500">{book.author}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-blue-600">{book.borrowCount}</p>
                    <p className="text-xs text-gray-500">次借阅</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;