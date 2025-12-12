export enum BookStatus {
  AVAILABLE = 'AVAILABLE',
  BORROWED = 'BORROWED',
  LOST = 'LOST'
}

export interface BorrowRecord {
  borrowerName: string;
  borrowDate: string;
  returnDate?: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  publishDate: string;
  status: BookStatus;
  summary: string;
  coverUrl: string;
  borrowerName?: string;
  borrowDate?: string;
  dueDate?: string;
  reservedBy?: string;
  borrowHistory: BorrowRecord[];
}

export interface Stats {
  totalBooks: number;
  borrowedBooks: number;
  availableBooks: number;
  categories: { name: string; value: number }[];
}

export interface ReaderStats {
  name: string;
  borrowCount: number;
  currentBorrowed: number;
}

export interface AIRecommendation {
  title: string;
  reason: string;
}

export type View = 'dashboard' | 'books' | 'borrow' | 'ai-librarian' | 'history' | 'stats' | 'overdue';