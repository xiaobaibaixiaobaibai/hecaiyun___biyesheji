import React, { useState, useRef } from 'react';
import { Book, BookStatus } from '../types';
import { Edit2, Trash2, Search, Plus, BookOpen, UserCheck, BookmarkPlus, Download, Upload, Calendar, AlertTriangle } from 'lucide-react';

interface BookListProps {
  books: Book[];
  onDelete: (id: string) => void;
  onEdit: (book: Book) => void;
  onBorrow: (book: Book) => void;
  onReturn: (book: Book) => void;
  onCreate: () => void;
  onReserve: (book: Book) => void;
  onCancelReservation: (book: Book) => void;
  onExport: () => void;
  onImport: (data: string) => void;
}

const BookList: React.FC<BookListProps> = ({ books, onDelete, onEdit, onBorrow, onReturn, onCreate, onReserve, onCancelReservation, onExport, onImport }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('全部');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = event.target?.result as string;
        onImport(data);
      };
      reader.readAsText(file);
    }
  };

  const isOverdue = (book: Book) => {
    if (book.status !== BookStatus.BORROWED || !book.dueDate) return false;
    const today = new Date().toISOString().split('T')[0];
    return book.dueDate < today;
  };

  const categories = ['全部', ...Array.from(new Set(books.map(b => b.category)))];

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === '全部' || book.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-1 gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="搜索书名或作者..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleImportClick}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            title="导入数据"
          >
            <Upload size={18} />
            <span className="hidden md:inline">导入</span>
          </button>
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            title="导出数据"
          >
            <Download size={18} />
            <span className="hidden md:inline">导出</span>
          </button>
          <button
            onClick={onCreate}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm justify-center"
          >
            <Plus size={18} />
            <span>录入新书</span>
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold">书名</th>
                <th className="p-4 font-semibold">作者</th>
                <th className="p-4 font-semibold">分类</th>
                <th className="p-4 font-semibold">状态</th>
                <th className="p-4 font-semibold text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBooks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400">
                    没有找到相关书籍
                  </td>
                </tr>
              ) : (
                filteredBooks.map((book) => (
                  <tr key={book.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-14 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                          <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{book.title}</div>
                          <div className="text-xs text-gray-400">{book.isbn}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">{book.author}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        {book.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${book.status === BookStatus.AVAILABLE
                            ? 'bg-green-100 text-green-700'
                            : isOverdue(book)
                              ? 'bg-red-100 text-red-700'
                              : 'bg-orange-100 text-orange-700'
                          }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${book.status === BookStatus.AVAILABLE
                              ? 'bg-green-500'
                              : isOverdue(book)
                                ? 'bg-red-500'
                                : 'bg-orange-500'
                            }`}></span>
                          {book.status === BookStatus.AVAILABLE
                            ? '可借阅'
                            : isOverdue(book)
                              ? `逾期: ${book.borrowerName}`
                              : `已借出: ${book.borrowerName}`
                          }
                        </span>
                        {book.dueDate && book.status === BookStatus.BORROWED && (
                          <div className={`text-xs flex items-center gap-1 ${isOverdue(book) ? 'text-red-600' : 'text-gray-500'
                            }`}>
                            <Calendar size={12} />
                            应还: {book.dueDate}
                          </div>
                        )}
                        {book.reservedBy && (
                          <div className="text-xs text-purple-600 flex items-center gap-1">
                            <BookmarkPlus size={12} />
                            预约: {book.reservedBy}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end items-center gap-2">
                        {book.status === BookStatus.AVAILABLE ? (
                          <button
                            onClick={() => onBorrow(book)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors tooltip"
                            title="借阅"
                          >
                            <BookOpen size={18} />
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => onReturn(book)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors tooltip"
                              title="归还"
                            >
                              <UserCheck size={18} />
                            </button>
                            {book.reservedBy ? (
                              <button
                                onClick={() => onCancelReservation(book)}
                                className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors tooltip"
                                title="取消预约"
                              >
                                <BookmarkPlus size={18} className="fill-purple-600" />
                              </button>
                            ) : (
                              <button
                                onClick={() => onReserve(book)}
                                className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors tooltip"
                                title="预约"
                              >
                                <BookmarkPlus size={18} />
                              </button>
                            )}
                          </>
                        )}

                        <button
                          onClick={() => onEdit(book)}
                          className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                          title="编辑"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => onDelete(book.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="删除"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
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

export default BookList;