import React, { useState, useEffect } from 'react';
import { Book, BookStatus } from '../types';
import { generateBookInfo } from '../services/geminiService';
import { X, Sparkles, Loader2 } from 'lucide-react';
import { CATEGORIES } from '../constants';

interface BookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (book: Book) => void;
  initialData?: Book | null;
}

const BookModal: React.FC<BookModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<Book>>({
    title: '',
    author: '',
    isbn: '',
    category: CATEGORIES[1],
    summary: '',
    status: BookStatus.AVAILABLE,
    coverUrl: 'https://picsum.photos/200/300'
  });
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        title: '',
        author: '',
        isbn: '',
        category: CATEGORIES[1],
        summary: '',
        status: BookStatus.AVAILABLE,
        coverUrl: `https://picsum.photos/seed/${Math.random()}/200/300`
      });
    }
  }, [initialData, isOpen]);

  const handleAiFill = async () => {
    if (!formData.title) return;
    setIsAiLoading(true);
    try {
      const aiData = await generateBookInfo(formData.title);
      if (aiData) {
        setFormData(prev => ({ ...prev, ...aiData }));
      }
    } finally {
      setIsAiLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-800">
            {initialData ? '编辑图书' : '录入新书'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Left Column */}
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">书名</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="输入书名..."
                        />
                         <button
                            type="button"
                            onClick={handleAiFill}
                            disabled={!formData.title || isAiLoading}
                            className="px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors disabled:opacity-50 flex items-center gap-1"
                            title="AI 自动填充"
                        >
                            {isAiLoading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                            <span className="hidden sm:inline text-sm font-medium">AI 填充</span>
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">作者</label>
                    <input
                        type="text"
                        value={formData.author}
                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
                    <input
                        type="text"
                        value={formData.isbn}
                        onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
                    <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                    >
                        {CATEGORIES.filter(c => c !== '全部').map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">出版日期</label>
                    <input
                        type="date"
                        value={formData.publishDate}
                        onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>
                
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">封面图片 URL (可选)</label>
                    <input
                        type="text"
                        value={formData.coverUrl}
                        onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-500 text-sm"
                    />
                </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">图书简介</label>
            <textarea
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                placeholder="书籍内容简介..."
            />
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            onClick={() => {
                if (formData.title && formData.author) {
                    onSave(formData as Book);
                }
            }}
            disabled={!formData.title || !formData.author}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookModal;