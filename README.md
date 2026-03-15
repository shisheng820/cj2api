# CJ2API

将 [ChatJimmy](https://chatjimmy.ai) 转换为 OpenAI 兼容 API 的工具，支持 Cloudflare Workers 和腾讯云 EdgeOne Pages。

一键部署到 Cloudflare 或 EdgeOne，即可获得标准的 `/v1/chat/completions` 接口，兼容所有支持 OpenAI API 的客户端和框架。无需 API Key。

## 特性

- **OpenAI 兼容** — 标准 Chat Completions API 格式，支持流式 (SSE) 和非流式响应
- **多平台部署** — 同时支持 Cloudflare Workers 和腾讯云 EdgeOne Pages
- **自带测试页** — 访问根路径即可在线测试，附带 cURL / Python / Node.js 示例
- **Token 统计** — 响应中包含 `usage` 字段，测试页实时显示输出速度
- **极简代码** — 纯 TypeScript，无任何第三方运行时依赖

## 快速开始

### 前置条件

- [Node.js](https://nodejs.org/) 18+
- [Cloudflare 账号](https://dash.cloudflare.com/sign-up) 或 [腾讯云账号](https://console.cloud.tencent.com/)

### 方式一：部署到 Cloudflare Workers (从 GitHub 克隆)

```bash
git clone https://github.com/shisheng820/cj2api.git
cd cj2api
npm install
npx wrangler login    # 首次使用需登录 Cloudflare
npm run deploy
```

部署完成后，Wrangler 会输出你的 Worker URL，形如 `https://cj2api.<你的子域>.workers.dev`。

### 方式二：从 npm 安装 (Cloudflare)

```bash
npm install @qingchencloud/cj2api
cd node_modules/@qingchencloud/cj2api
npx wrangler login    # 首次使用需登录 Cloudflare
npm run deploy
```

### 方式三：部署到腾讯云 EdgeOne Pages (推荐国内直连)

EdgeOne Pages 提供了更佳的国内访问体验，支持一键部署：

[![使用 EdgeOne Pages 部署](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://console.cloud.tencent.com/edgeone/pages/new?repository-url=https%3A%2F%2Fgithub.com%2Fshisheng820%2Fcj2api)

或者手动部署：
```bash
npm install
npm run deploy:edgeone
```

> **国内访问提示：**
> - **Cloudflare**: `*.workers.dev` 域名在国内访问可能不稳定，建议绑定自定义域名走 CDN，或通过 Dashboard → Workers → cj2api → Settings → Domains & Routes 绑定域名。
> - **EdgeOne**: 默认提供国内边缘节点加速，延迟极低，无需额外配置即可直连。

> **提示：** 如客户端要求填写 API Key，随意输入任意字符串即可。

## API 接口

### POST `/v1/chat/completions`

标准 OpenAI Chat Completions 接口，支持流式和非流式响应。

**请求体：**

```json
{
  "model": "llama3.1-8B",
  "messages": [
    { "role": "system", "content": "你是一个有帮助的助手" },
    { "role": "user", "content": "你好" }
  ],
  "stream": false,
  "top_k": 8
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `model` | string | 否 | 模型名称，默认 `llama3.1-8B` |
| `messages` | array | 是 | 消息列表，支持 `system` / `user` / `assistant` 角色 |
| `stream` | boolean | 否 | 是否启用流式输出，默认 `false` |
| `top_k` | number | 否 | Top-K 采样参数，默认 `8` |

**非流式响应：**

```json
{
  "id": "chatcmpl-xxxx",
  "object": "chat.completion",
  "created": 1740000000,
  "model": "llama3.1-8B",
  "choices": [
    {
      "index": 0,
      "message": { "role": "assistant", "content": "你好！有什么可以帮助你的吗？" },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 12,
    "completion_tokens": 85,
    "total_tokens": 97
  }
}
```

**流式响应 (SSE)：**

当 `stream: true` 时，返回 `text/event-stream` 格式：

```
data: {"id":"chatcmpl-xxxx","object":"chat.completion.chunk","created":1740000000,"model":"llama3.1-8B","choices":[{"index":0,"delta":{"role":"assistant","content":"你好"},"finish_reason":null}]}

data: {"id":"chatcmpl-xxxx","object":"chat.completion.chunk","created":1740000000,"model":"llama3.1-8B","choices":[{"index":0,"delta":{"content":"！"},"finish_reason":null}]}

data: {"id":"chatcmpl-xxxx","object":"chat.completion.chunk","created":1740000000,"model":"llama3.1-8B","choices":[{"index":0,"delta":{},"finish_reason":"stop"}],"usage":{"prompt_tokens":12,"completion_tokens":85,"total_tokens":97}}

data: [DONE]
```

### GET `/v1/models`

返回可用模型列表。

```json
{
  "object": "list",
  "data": [
    { "id": "llama3.1-8B", "object": "model", "owned_by": "system" }
  ]
}
```

## 使用示例

### cURL

```bash
curl -X POST https://your-domain/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
  "model": "llama3.1-8B",
  "messages": [{"role": "user", "content": "你好"}],
  "stream": false
}'
```

### Python

```python
import requests

resp = requests.post(
    "https://your-domain/v1/chat/completions",
    json={
        "model": "llama3.1-8B",
        "messages": [{"role": "user", "content": "你好"}],
        "stream": False
    }
)
print(resp.json()["choices"][0]["message"]["content"])
```

### Node.js

```javascript
const resp = await fetch("https://your-domain/v1/chat/completions", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "llama3.1-8B",
    messages: [{ role: "user", content: "你好" }],
    stream: false
  })
});
const data = await resp.json();
console.log(data.choices[0].message.content);
```

### OpenAI SDK（Python）

完全兼容 OpenAI API 格式，可以直接使用官方 SDK：

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://your-domain/v1",
    api_key="any-string"  # 无需真实 API Key
)

response = client.chat.completions.create(
    model="llama3.1-8B",
    messages=[{"role": "user", "content": "你好"}]
)
print(response.choices[0].message.content)
```

## 本地开发

```bash
git clone https://github.com/shisheng820/cj2api.git
cd cj2api
npm install
npm run dev
# 默认监听 http://localhost:8787
```

## 工作原理

```
客户端 (OpenAI SDK / curl / 任意 HTTP)
  │
  │  POST /v1/chat/completions
  │  标准 OpenAI 请求格式
  ▼
┌─────────────────────────┐
│   Worker / Edge Function │
│                         │
│  1. 解析请求体           │
│  2. 提取 system 消息     │
│  3. 转换为上游格式       │
│  4. 转发到 ChatJimmy     │
│  5. 解析响应 + stats     │
│  6. 封装为 OpenAI 格式   │
└─────────────────────────┘
  │
  │  ChatJimmy 私有协议
  ▼
┌─────────────────────────┐
│   chatjimmy.ai/api/chat │
│   返回纯文本 + stats 块  │
└─────────────────────────┘
```

## 项目结构

```
cj2api/
├── src/                # 核心业务逻辑 (跨平台共享)
├── functions/          # EdgeOne Pages Functions 入口
├── index.ts            # Cloudflare Workers 入口
├── wrangler.toml       # Cloudflare Workers 配置
├── edgeone.json        # EdgeOne Pages 配置
├── tsconfig.json       # TypeScript 配置
├── package.json
└── README.md
```

## Claude Code Skills

本项目内置了 [Claude Code](https://docs.anthropic.com/en/docs/claude-code) 维护 Skills：

| Skill | 说明 |
|-------|------|
| `/release` | 版本发布 |
| `/deploy` | 部署到 Cloudflare Workers |
| `/update-page` | 维护内置测试页面 |

## 免责声明

本项目仅供**学习研究和技术测试**使用，请勿用于任何商业用途。作者不对因使用本项目产生的任何损失承担责任。

## License

[MIT](LICENSE) © QingChen Cloud
