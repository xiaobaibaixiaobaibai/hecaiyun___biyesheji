import { Book } from '../types';

// Feature 1: AI Auto-fill book details based on title
export const generateBookInfo = async (title: string): Promise<Partial<Book> | null> => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: `请为书名"${title}"提供详细信息。以JSON格式返回，包含：author(作者)、category(分类：技术/科幻/文学/历史/艺术/管理/其他之一)、summary(50-100字中文简介)、isbn(ISBN号)、publishDate(出版日期，YYYY-MM-DD格式)。`
      }),
    });

    if (!response.ok) {
      console.error('API request failed:', response.statusText);
      return null;
    }

    const data = await response.json();

    if (data.text) {
      // 尝试从返回文本中提取 JSON
      const jsonMatch = data.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }

    return null;
  } catch (error) {
    console.error('Failed to generate book info:', error);
    return null;
  }
};

// Feature 2: AI Librarian Chat
export const chatWithLibrarian = async (
  query: string,
  contextBooks: Book[],
  history: { role: string; parts: { text: string }[] }[]
): Promise<string> => {
  const booksContext = contextBooks
    .map(b => `${b.title} (${b.author}) - ${b.category}`)
    .join('\n');

  const systemContext = `
你是一个智能图书馆管理员助手。
图书馆目前的藏书有（书名 - 作者 - 分类）:
${booksContext}

你的任务是：
1. 根据用户的兴趣推荐馆藏图书。
2. 如果用户问的问题不在馆藏中，可以推荐外部书籍，但要说明馆内暂无。
3. 回答要亲切、专业。
4. 必须使用中文回答。
`;

  // 构建完整的对话历史
  const conversationHistory = history
    .map(h => `${h.role === 'user' ? '用户' : 'AI'}: ${h.parts[0].text}`)
    .join('\n');

  const fullPrompt = `${systemContext}\n\n对话历史:\n${conversationHistory}\n\n用户: ${query}\n\nAI:`;

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: fullPrompt
      }),
    });

    if (!response.ok) {
      console.error('API request failed:', response.statusText);
      return '抱歉，AI服务暂时不可用，请稍后再试。';
    }

    const data = await response.json();
    return data.text || '抱歉，我暂时无法回答这个问题。';
  } catch (error) {
    console.error('Chat Error:', error);
    return '网络连接异常，请稍后再试。';
  }
};