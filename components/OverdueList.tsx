import React from 'react';
import { Book, BookStatus } from '../types';
import { AlertTriangle, Clock, User, BookOpen, Phone } from 'lucide-react';

interface OverdueListProps {
  books: Book[];
  onReturn: (book: Book) => void;
}

const OverdueList: React.FC<OverdueListProps> = ({ books, onReturn }) => {
  const overdueBooks = books.filter(book => {
    if (book.status !== BookStatus.BORROWED || !book.dueDate) return false;
    const today = new Date().toISOString().split('T')[0];
    return book.dueDate < today;
  });

  const calculateOverdueDays = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      {overdueBooks.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-red-600" size={20} />
            <p className="text-red-800 font-semibold">
              当前有 {overdueBooks.length} 本图书逾期未归还
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold">图书</th>
                <th className="p-4 font-semibold">借阅人</th>
                <th className="p-4 font-semibold">借阅日期</th>
                <th className="p-4 font-semibold">应还日期</th>
                <th className="p-4 font-semibold">逾期天数</th>
                <th className="p-4 font-semibold text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {overdueBooks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <BookOpen className="text-green-600" size={32} />
                      </div>
                      <p className="text-gray-500 font-medium">太棒了！目前没有逾期图书</p>
                    </div>
                  </td>
                </tr>
              ) : (
                overdueBooks.map((book) => {
                  const overdueDays = calculateOverdueDays(book.dueDate!);
                  const severityColor =
                    overdueDays > 30 ? 'bg-red-100 text-red-700 border-red-300' :
                      overdueDays > 7 ? 'bg-orange-100 text-orange-700 border-orange-300' :
                        'bg-yellow-100 text-yellow-700 border-yellow-300';

                  return (
                    <tr key={book.id} className="hover:bg-red-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-14 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                            <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{book.title}</div>
                            <div className="text-xs text-gray-500">{book.author}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <User size={16} />
                          {book.borrowerName}
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">{book.borrowDate}</td>
                      <td className="p-4">
                        <span className="text-red-600 font-medium">{book.dueDate}</span>
                      </td>
                      <td className="p-4">
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border-2 font-bold ${severityColor}`}>
                          <Clock size={16} />
                          逾期 {overdueDays} 天
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              alert(`已向 ${book.borrowerName} 发送催还提醒！\n书名：${book.title}\n逾期：${overdueDays}天`);
                            }}
                            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2 text-sm"
                          >
                            <Phone size={16} />
                            催还
                          </button>
                          <button
                            onClick={() => onReturn(book)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm"
                          >
                            <BookOpen size={16} />
                            归还
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Statistics */}
      {overdueBooks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-red-50 to-rose-50 p-6 rounded-xl border border-red-100">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="text-red-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">严重逾期 ({'>'}30天)</p>
                <p className="text-2xl font-bold text-red-600">
                  {overdueBooks.filter(b => calculateOverdueDays(b.dueDate!) > 30).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-xl border border-orange-100">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-full">
                <Clock className="text-orange-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">中度逾期 (7-30天)</p>
                <p className="text-2xl font-bold text-orange-600">
                  {overdueBooks.filter(b => {
                    const days = calculateOverdueDays(b.dueDate!);
                    return days > 7 && days <= 30;
                  }).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-6 rounded-xl border border-yellow-100">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 rounded-full">
                <BookOpen className="text-yellow-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">轻微逾期 (≤7天)</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {overdueBooks.filter(b => calculateOverdueDays(b.dueDate!) <= 7).length}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OverdueList;
