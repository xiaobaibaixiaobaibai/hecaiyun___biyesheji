import React, { useState, useEffect } from 'react';
import { Book, View, BookStatus } from './types';
import * as storageService from './services/storageService';
import Dashboard from './components/Dashboard';
import BookList from './components/BookList';
import BookModal from './components/BookModal';
import AILibrarian from './components/AILibrarian';
import BorrowHistory from './components/BorrowHistory';
import ReaderStats from './components/ReaderStats';
import OverdueList from './components/OverdueList';
import { LayoutDashboard, Book as BookIcon, MessagesSquare, Menu, Library, History, TrendingUp, AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Initialize data on mount
  useEffect(() => {
    storageService.initStorage();
    loadBooks();
  }, []);

  const loadBooks = () => {
    setBooks(storageService.getBooks());
  };

  const handleCreate = () => {
    setEditingBook(null);
    setIsModalOpen(true);
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除这本书吗？')) {
      storageService.deleteBook(id);
      loadBooks();
    }
  };

  const handleSave = (bookData: Book) => {
    const newBook = {
      ...bookData,
      id: editingBook ? editingBook.id : Date.now().toString(),
    };
    storageService.saveBook(newBook);
    loadBooks();
    setIsModalOpen(false);
  };

  const handleBorrow = (book: Book) => {
    const borrower = prompt('请输入借阅人姓名:');
    if (borrower) {
      storageService.borrowBook(book.id, borrower);
      loadBooks();
    }
  };

  const handleReturn = (book: Book) => {
    if (window.confirm(`确认归还 "${book.title}"?`)) {
      storageService.returnBook(book.id);
      loadBooks();
    }
  };

  const handleReserve = (book: Book) => {
    const readerName = prompt('请输入预约人姓名:');
    if (readerName) {
      storageService.reserveBook(book.id, readerName);
      loadBooks();
      alert(`预约成功！当《${book.title}》归还后，系统会通知您。`);
    }
  };

  const handleCancelReservation = (book: Book) => {
    if (window.confirm(`确定要取消《${book.title}》的预约吗？`)) {
      storageService.cancelReservation(book.id);
      loadBooks();
    }
  };

  const handleExport = () => {
    const data = storageService.exportBooks();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `libgenius_books_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert('数据导出成功！');
  };

  const handleImport = (data: string) => {
    if (window.confirm('导入数据将覆盖现有数据，确定要继续吗？')) {
      const success = storageService.importBooks(data);
      if (success) {
        loadBooks();
        alert('数据导入成功！');
      } else {
        alert('数据导入失败！请检查文件格式。');
      }
    }
  };

  // Sidebar Menu Items
  const menuItems = [
    { id: 'dashboard', label: '数据概览', icon: <LayoutDashboard size={20} /> },
    { id: 'books', label: '图书管理', icon: <BookIcon size={20} /> },
    { id: 'history', label: '借阅历史', icon: <History size={20} /> },
    { id: 'stats', label: '读者统计', icon: <TrendingUp size={20} /> },
    { id: 'overdue', label: '逾期管理', icon: <AlertTriangle size={20} /> },
    { id: 'ai-librarian', label: 'AI 咨询', icon: <MessagesSquare size={20} /> },
  ];

  const readerStats = storageService.getReaderStats();

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-800 font-sans">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:relative lg:translate-x-0`}
      >
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <Library className="text-blue-600 mr-2" size={28} />
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            LibGenius AI
          </h1>
        </div>
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as View)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${currentView === item.id
                  ? 'bg-blue-50 text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-100">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-4 text-white shadow-lg">
            <p className="text-xs font-medium opacity-80 mb-1">系统状态</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-sm font-semibold">运行正常</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 lg:px-8">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-4 ml-auto">
            <div className="text-sm text-right hidden sm:block">
              <p className="font-medium text-gray-900">管理员</p>
              <p className="text-xs text-gray-500">LibGenius AI 图书管理系统</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm">
              <img src="https://picsum.photos/id/64/100/100" alt="Avatar" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        {/* View Content */}
        <div className="flex-1 overflow-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {menuItems.find(i => i.id === currentView)?.label}
              </h2>
            </div>

            {currentView === 'dashboard' && <Dashboard books={books} />}

            {currentView === 'books' && (
              <BookList
                books={books}
                onCreate={handleCreate}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onBorrow={handleBorrow}
                onReturn={handleReturn}
                onReserve={handleReserve}
                onCancelReservation={handleCancelReservation}
                onExport={handleExport}
                onImport={handleImport}
              />
            )}

            {currentView === 'history' && <BorrowHistory books={books} />}

            {currentView === 'stats' && <ReaderStats stats={readerStats} />}

            {currentView === 'overdue' && <OverdueList books={books} onReturn={handleReturn} />}

            {currentView === 'ai-librarian' && <AILibrarian books={books} />}
          </div>
        </div>
      </main>

      {/* Modal */}
      <BookModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingBook}
      />
    </div>
  );
};

export default App;