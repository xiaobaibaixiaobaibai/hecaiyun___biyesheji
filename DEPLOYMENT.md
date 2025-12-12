# LibGenius AI 部署说明

## 🔒 安全部署指南

此项目已配置 Vercel Serverless Functions 来保护 Gemini API 密钥。

### Vercel 部署步骤

1. **推送代码到 GitHub**
   ```bash
   git add .
   git commit -m "Add serverless API proxy"
   git push
   ```

2. **在 Vercel 配置环境变量**
   - 进入项目设置: Settings → Environment Variables
   - 添加以下变量（注意：不需要 `VITE_` 前缀）：
     - 变量名: `GEMINI_API_KEY`
     - 值: 你的 Gemini API 密钥
   
3. **重新部署**
   - Deployments → 点击最新的部署 → Redeploy

### 环境变量说明

- **本地开发**: 无需配置（AI 功能本地不可用，除非配置后端代理）
- **生产环境**: 在 Vercel 设置 `GEMINI_API_KEY`

### API 端点

- `/api/chat` - Gemini AI 代理端点（POST 请求）

### 安全性

✅ API 密钥只存在于 Vercel 服务器端  
✅ 前端代码中不包含任何密钥  
✅ 所有 AI 请求通过服务器代理  

### 测试

部署后测试 AI 功能：
1. 访问网站
2. 进入 "AI 咨询" 页面
3. 发送消息测试

如果 AI 不工作，检查：
- Vercel 环境变量是否正确配置
- 浏览器控制台是否有错误
- 网络请求是否成功（开发者工具 → Network）
