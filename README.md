# CJ2API

基于 [ChatJimmy](https://chatjimmy.ai) 实现的 OpenAI 兼容 API，部署于腾讯云 EdgeOne Pages。

[![使用 EdgeOne Pages 部署](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://console.cloud.tencent.com/edgeone/pages/new?repository-url=https%3A%2F%2Fgithub.com%2Fshisheng820%2Fcj2api%2Ftree%2Fcodex%2Fedgeone-adapt)

本项目可以将 ChatJimmy 的后端 API 转换为标准的 OpenAI `/v1/chat/completions` 接口，支持流式输出 (SSE)，让您可以直接在 cURL / Python / Node.js 等 OpenAI SDK 中调用。

## 特性

- **OpenAI 兼容**：支持 Chat Completions API 接口，包括流式 (SSE) 响应。
- **边缘部署**：部署于腾讯云 EdgeOne Pages，国内访问速度极快且稳定。
- **即开即用**：提供一键部署按钮，无需复杂配置。
- **Token 计算**：返回 `usage` 信息，方便统计使用量。
- **全类型支持**：使用 TypeScript 编写，提供完善的类型定义。

## 快速开始

### 一键部署

点击下方按钮，将本项目部署到您的腾讯云 EdgeOne Pages：

[![使用 EdgeOne Pages 部署](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://console.cloud.tencent.com/edgeone/pages/new?repository-url=https%3A%2F%2Fgithub.com%2Fshisheng820%2Fcj2api%2Ftree%2Fcodex%2Fedgeone-adapt)

### 手动部署

1. **克隆仓库**
   ```bash
   git clone -b codex/edgeone-adapt https://github.com/shisheng820/cj2api.git
   cd cj2api
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **部署**
   使用腾讯云 EdgeOne CLI 或在腾讯云控制台关联仓库部署。

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
├── functions/          # EdgeOne Pages Functions (API 逻辑)
│   ├── v1/
│   │   ├── chat/
│   │   └── models.ts
│   └── index.ts        # 根路径渲染测试页面
├── src/                # 核心业务逻辑 (跨平台通用)
├── edgeone.json        # EdgeOne 配置文件
├── tsconfig.json       # TypeScript 配置
└── package.json
```

## License

[MIT](LICENSE) © shisheng820
