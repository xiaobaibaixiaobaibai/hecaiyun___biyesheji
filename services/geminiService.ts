import { GoogleGenAI, Type } from "@google/genai";
import { Book } from '../types';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key is missing. AI features will not work.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

// Feature 1: AI Auto-fill book details based on title
export const generateBookInfo = async (title: string): Promise<Partial<Book> | null> => {
  const ai = getAiClient();
  if (!ai) return null;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Please provide detailed information for the book titled "${title}". Return JSON format.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            author: { type: Type.STRING },
            category: { type: Type.STRING, description: "One of: 技术, 科幻, 文学, 历史, 艺术, 管理, 其他" },
            summary: { type: Type.STRING, description: "A brief summary in Chinese, about 50-100 words." },
            isbn: { type: Type.STRING, description: "A hypothetical or real ISBN." },
            publishDate: { type: Type.STRING, description: "YYYY-MM-DD format" }
          },
          required: ["author", "category", "summary", "isbn", "publishDate"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return null;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};

// Feature 2: AI Librarian Chat
export const chatWithLibrarian = async (
  query: string, 
  contextBooks: Book[],
  history: {role: string, parts: {text: string}[]}[]
): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "AI Configuration Error: API Key missing.";

  const booksContext = contextBooks.map(b => `${b.title} (${b.author}) - ${b.category}`).join('\n');
  const systemInstruction = `
    你是一个智能图书馆管理员助手。
    图书馆目前的藏书有（书名 - 作者 - 分类）:
    ${booksContext}

    你的任务是：
    1. 根据用户的兴趣推荐馆藏图书。
    2. 如果用户问的问题不在馆藏中，可以推荐外部书籍，但要说明馆内暂无。
    3. 回答要亲切、专业。
    4. 必须使用中文回答。
  `;

  try {
    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemInstruction,
      },
      history: history
    });

    const result = await chat.sendMessage({ message: query });
    return result.text || "抱歉，我暂时无法回答这个问题。";
  } catch (error) {
    console.error("Chat Error:", error);
    return "网络连接异常，请稍后再试。";
  }
};