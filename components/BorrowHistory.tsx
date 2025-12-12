import React, { useState } from 'react';
import { Book } from '../types';
import { History, Search, User, Clock } from 'lucide-react';

interface BorrowHistoryProps {
  books: Book[];
}

const BorrowHistory: React.FC<BorrowHistoryProps> = ({ books }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'book' | 'reader'>('all');

  // Flatten all borrow records with book info
  const allRecords = books.flatMap(book =>
    (book.borrowHistory || []).map(record => ({
      ...record,
      bookId: book.id,
      bookTitle: book.title,
      bookCover: book.coverUrl
    }))
  );

  const filteredRecords = allRecords.filter(record => {
    const matchesSearch =
      record.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.borrowerName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const calculateDuration = (borrowDate: string, returnDate?: string) => {
    const start = new Date(borrowDate);
    const end = returnDate ? new Date(returnDate) : new Date();
    const days = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="搜索书名或读者..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold">图书</th>
                <th className="p-4 font-semibold">借阅人</th>
                <th className="p-4 font-semibold">借阅日期</th>
                <th className="p-4 font-semibold">归还日期</th>
                <th className="p-4 font-semibold">借阅时长</th>
                <th className="p-4 font-semibold">状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">
                    <History className="mx-auto mb-2 text-gray-300" size={48} />
                    <p>暂无借阅记录</p>
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record, index) => {
                  const duration = calculateDuration(record.borrowDate, record.returnDate);
                  return (
                    <tr key={`${record.bookId}-${index}`} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-14 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                            <img src={record.bookCover} alt={record.bookTitle} className="w-full h-full object-cover" />
                          </div>
                          <div className="font-medium text-gray-900">{record.bookTitle}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <User size={16} />
                          {record.borrowerName}
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">{record.borrowDate}</td>
                      <td className="p-4 text-gray-600">
                        {record.returnDate || <span className="text-orange-500">未归还</span>}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Clock size={16} />
                          {duration} 天
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${record.returnDate
                            ? 'bg-green-100 text-green-700'
                            : 'bg-orange-100 text-orange-700'
                          }`}>
                          {record.returnDate ? '已归还' : '借阅中'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
        <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <History size={20} className="text-blue-600" />
          借阅统计
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="bg-white p-4 rounded-lg">
            <p className="text-sm text-gray-500">总借阅次数</p>
            <p className="text-2xl font-bold text-gray-800">{allRecords.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="text-sm text-gray-500">已归还</p>
            <p className="text-2xl font-bold text-green-600">
              {allRecords.filter(r => r.returnDate).length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="text-sm text-gray-500">借阅中</p>
            <p className="text-2xl font-bold text-orange-600">
              {allRecords.filter(r => !r.returnDate).length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="text-sm text-gray-500">平均借阅时长</p>
            <p className="text-2xl font-bold text-blue-600">
              {allRecords.filter(r => r.returnDate).length > 0
                ? Math.round(
                  allRecords
                    .filter(r => r.returnDate)
                    .reduce((sum, r) => sum + calculateDuration(r.borrowDate, r.returnDate), 0) /
                  allRecords.filter(r => r.returnDate).length
                )
                : 0}{' '}天
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BorrowHistory;
