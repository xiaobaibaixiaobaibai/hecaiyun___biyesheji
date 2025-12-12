import { Book, BookStatus } from './types';

export const MOCK_BOOKS: Book[] = [
  {
    id: '1',
    title: '深入浅出 React',
    author: 'Morty Smith',
    isbn: '978-7-111-11111-1',
    category: '技术',
    publishDate: '2023-01-15',
    status: BookStatus.AVAILABLE,
    summary: '一本全面介绍 React 核心概念和最佳实践的书籍。',
    coverUrl: 'https://picsum.photos/id/1/200/300',
    borrowHistory: [
      { borrowerName: '李四', borrowDate: '2023-08-01', returnDate: '2023-08-15' },
      { borrowerName: '王五', borrowDate: '2023-09-10', returnDate: '2023-09-25' }
    ]
  },
  {
    id: '2',
    title: '三体',
    author: '刘慈欣',
    isbn: '978-7-229-00512-4',
    category: '科幻',
    publishDate: '2008-01-01',
    status: BookStatus.BORROWED,
    summary: '文化大革命如火如荼进行的同时，军方探寻外星文明的绝秘计划"红岸工程"取得了突破性进展。',
    coverUrl: 'https://picsum.photos/id/2/200/300',
    borrowerName: '张三',
    borrowDate: '2024-11-15',
    dueDate: '2024-12-15',
    borrowHistory: [
      { borrowerName: '赵六', borrowDate: '2023-06-01', returnDate: '2023-06-20' },
      { borrowerName: '张三', borrowDate: '2024-11-15' }
    ]
  },
  {
    id: '3',
    title: '百年孤独',
    author: '加西亚·马尔克斯',
    isbn: '978-7-544-25399-4',
    category: '文学',
    publishDate: '2011-06-01',
    status: BookStatus.AVAILABLE,
    summary: '描写了布恩迪亚家族七代人的传奇故事，以及加勒比海沿岸小镇马孔多的百年兴衰。',
    coverUrl: 'https://picsum.photos/id/3/200/300',
    borrowHistory: [
      { borrowerName: '李四', borrowDate: '2023-07-01', returnDate: '2023-07-14' },
      { borrowerName: '李四', borrowDate: '2023-10-05', returnDate: '2023-10-25' },
      { borrowerName: '王五', borrowDate: '2023-11-01', returnDate: '2023-11-10' }
    ]
  },
  {
    id: '4',
    title: 'JavaScript 高级程序设计',
    author: 'Matt Frisbie',
    isbn: '978-7-115-54538-1',
    category: '技术',
    publishDate: '2020-09-01',
    status: BookStatus.AVAILABLE,
    summary: '红宝书，前端开发者的必备案头书。',
    coverUrl: 'https://picsum.photos/id/4/200/300',
    borrowHistory: []
  },
  {
    id: '5',
    title: '活着',
    author: '余华',
    isbn: '978-7-506-36543-7',
    category: '文学',
    publishDate: '2012-08-01',
    status: BookStatus.AVAILABLE,
    summary: '讲述了农村人福贵悲惨的人生遭遇。',
    coverUrl: 'https://picsum.photos/id/5/200/300',
    borrowHistory: [
      { borrowerName: '张三', borrowDate: '2023-05-10', returnDate: '2023-05-20' }
    ]
  }
];

export const CATEGORIES = ['全部', '技术', '科幻', '文学', '历史', '艺术', '管理'];