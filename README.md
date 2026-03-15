# CJ2API

基于 [ChatJimmy](https://chatjimmy.ai) 实现的 OpenAI 兼容 API，支持 **Cloudflare Workers** 和 **腾讯云 EdgeOne Pages** 双平台部署。

## 平台支持

| 平台 | 部署方式 | 特点 |
|------|----------|------|
| **Cloudflare Workers** | `npm run deploy` | 全球加速，适合海外用户 |
| **EdgeOne Pages** | [![](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://console.cloud.tencent.com/edgeone/pages/new?repository-url=https%3A%2F%2Fgithub.com%2Fshisheng820%2Fcj2api) | 国内边缘节点，极低延迟 |

## 特性

- **OpenAI 兼容**：支持 Chat Completions API 接口，包括流式 (SSE) 响应。
- **双平台支持**：一份代码，可根据需求选择部署到 Cloudflare 或 EdgeOne。
- **流式输出**：完美支持标准 OpenAI 流式协议。
- **Token 计算**：返回 `usage` 信息，方便统计使用量。
- **TypeScript**：全量类型支持，开发体验友好。

## 部署指南

### 方式 A：部署到腾讯云 EdgeOne Pages (推荐国内用户)

点击下方按钮一键部署：

[![使用 EdgeOne Pages 部署](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://console.cloud.tencent.com/edgeone/pages/new?repository-url=https%3A%2F%2Fgithub.com%2Fshisheng820%2Fcj2api)

或者手动部署：
```bash
npm install
npm run deploy:edgeone
```

### 方式 B：部署到 Cloudflare Workers

1. **安装依赖**
   ```bash
   npm install
   ```

2. **登录并部署**
   ```bash
   npx wrangler login
   npm run deploy
   ```

## API 接口

### POST `/v1/chat/completions`

完全兼容 OpenAI Chat Completions 接口格式。

**请求示例**

```json
{
  "model": "llama3.1-8B",
  "messages": [
    { "role": "system", "content": "You are a helpful assistant." },
    { "role": "user", "content": "Hello!" }
  ],
  "stream": false
}
```

## 项目结构

```text
├── src/                # 核心业务逻辑 (跨平台共享)
├── functions/          # EdgeOne Pages Functions 入口
├── index.ts            # Cloudflare Workers 入口
├── wrangler.toml       # Cloudflare 配置文件
├── edgeone.json        # EdgeOne 配置文件
├── package.json
└── tsconfig.json
```

## License

[MIT](LICENSE) © shisheng820
