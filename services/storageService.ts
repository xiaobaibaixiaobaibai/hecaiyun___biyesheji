import { Book, BookStatus, ReaderStats } from '../types';
import { MOCK_BOOKS } from '../constants';

const STORAGE_KEY = 'libgenius_books';

// Initialize storage with mock data if empty
export const initStorage = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_BOOKS));
  }
};

export const getBooks = (): Book[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveBook = (book: Book): void => {
  const books = getBooks();
  const index = books.findIndex(b => b.id === book.id);
  if (index >= 0) {
    books[index] = book;
  } else {
    // Ensure new books have borrowHistory
    if (!book.borrowHistory) {
      book.borrowHistory = [];
    }
    books.push(book);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
};

export const deleteBook = (id: string): void => {
  const books = getBooks().filter(b => b.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
};

export const borrowBook = (id: string, borrowerName: string): void => {
  const books = getBooks();
  const index = books.findIndex(b => b.id === id);
  if (index >= 0) {
    const borrowDate = new Date().toISOString().split('T')[0];
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30); // 30-day borrowing period

    books[index].status = BookStatus.BORROWED;
    books[index].borrowerName = borrowerName;
    books[index].borrowDate = borrowDate;
    books[index].dueDate = dueDate.toISOString().split('T')[0];

    // Add to borrow history
    if (!books[index].borrowHistory) {
      books[index].borrowHistory = [];
    }
    books[index].borrowHistory.push({
      borrowerName,
      borrowDate
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  }
};

export const returnBook = (id: string): void => {
  const books = getBooks();
  const index = books.findIndex(b => b.id === id);
  if (index >= 0) {
    const returnDate = new Date().toISOString().split('T')[0];

    // Update the latest borrow record with return date
    if (books[index].borrowHistory && books[index].borrowHistory.length > 0) {
      const lastRecord = books[index].borrowHistory[books[index].borrowHistory.length - 1];
      if (!lastRecord.returnDate) {
        lastRecord.returnDate = returnDate;
      }
    }

    books[index].status = BookStatus.AVAILABLE;
    books[index].borrowerName = undefined;
    books[index].borrowDate = undefined;
    books[index].dueDate = undefined;

    // Handle reservation queue
    if (books[index].reservedBy) {
      const reservedBy = books[index].reservedBy;
      books[index].reservedBy = undefined;
      // Auto-borrow for reserved user
      setTimeout(() => {
        alert(`图书《${books[index].title}》已归还，预约用户"${reservedBy}"可以借阅了！`);
      }, 100);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  }
};

export const reserveBook = (id: string, readerName: string): void => {
  const books = getBooks();
  const index = books.findIndex(b => b.id === id);
  if (index >= 0 && books[index].status === BookStatus.BORROWED) {
    books[index].reservedBy = readerName;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  }
};

export const cancelReservation = (id: string): void => {
  const books = getBooks();
  const index = books.findIndex(b => b.id === id);
  if (index >= 0) {
    books[index].reservedBy = undefined;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  }
};

export const getOverdueBooks = (): Book[] => {
  const books = getBooks();
  const today = new Date().toISOString().split('T')[0];
  return books.filter(b => b.status === BookStatus.BORROWED && b.dueDate && b.dueDate < today);
};

export const getReaderStats = (): ReaderStats[] => {
  const books = getBooks();
  const statsMap: Record<string, ReaderStats> = {};

  books.forEach(book => {
    if (book.borrowHistory) {
      book.borrowHistory.forEach(record => {
        if (!statsMap[record.borrowerName]) {
          statsMap[record.borrowerName] = {
            name: record.borrowerName,
            borrowCount: 0,
            currentBorrowed: 0
          };
        }
        statsMap[record.borrowerName].borrowCount++;
      });
    }

    if (book.status === BookStatus.BORROWED && book.borrowerName) {
      if (!statsMap[book.borrowerName]) {
        statsMap[book.borrowerName] = {
          name: book.borrowerName,
          borrowCount: 0,
          currentBorrowed: 0
        };
      }
      statsMap[book.borrowerName].currentBorrowed++;
    }
  });

  return Object.values(statsMap).sort((a, b) => b.borrowCount - a.borrowCount);
};

export const exportBooks = (): string => {
  return JSON.stringify(getBooks(), null, 2);
};

export const importBooks = (data: string): boolean => {
  try {
    const books = JSON.parse(data) as Book[];
    // Validate data structure
    if (!Array.isArray(books)) {
      return false;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    return true;
  } catch (error) {
    console.error('Import failed:', error);
    return false;
  }
};