# ExchangeEx 测试平台

基于 [Scaffold-ETH 2](https://scaffoldeth.io/) 框架构建的 ExchangeEx 智能合约测试平台。

## 项目概述

本项目为 `ExchangeEx_Standalone.sol` 合约提供了一个完整的测试环境，包括：

- 🏗️ **Scaffold-ETH 2** - 现代化的 dApp 开发框架
- 🔗 **Web3 连接** - 使用 RainbowKit 和 Wagmi 进行钱包连接
- 📱 **响应式 UI** - 基于 DaisyUI 和 Tailwind CSS 的现代化界面
- 🧪 **合约测试** - 完整的合约功能测试界面
- 🔍 **调试工具** - 内置的合约调试和区块浏览器

## 功能特性

### ExchangeEx 合约功能
- **权限管理**: 授权和撤销交易员权限
- **子账户管理**: 生成和管理子账户ID
- **存款/提款**: 管理账户余额
- **现货交易**: 创建买入/卖出订单
- **衍生品交易**: 创建衍生品订单
- **批量操作**: 支持批量订单操作

### 技术栈
- **前端**: Next.js 15, React 19, TypeScript
- **Web3**: Wagmi, RainbowKit, Viem
- **样式**: Tailwind CSS, DaisyUI
- **智能合约**: Solidity, Hardhat
- **开发工具**: ESLint, Prettier, Husky

## 快速开始

### 1. 安装依赖

```bash
cd exchangeex-scaffold
npm install
```

### 2. 启动本地开发环境

```bash
# 启动 Hardhat 节点
npm run chain

# 在另一个终端中部署合约
npm run deploy

# 启动前端应用
npm run start
```

### 3. 访问应用

打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 项目结构

```
exchangeex-scaffold/
├── packages/
│   ├── hardhat/                 # 智能合约开发环境
│   │   ├── contracts/           # Solidity 合约
│   │   │   └── ExchangeEx_Standalone.sol
│   │   ├── deploy/              # 部署脚本
│   │   ├── test/                # 测试文件
│   │   └── hardhat.config.ts    # Hardhat 配置
│   └── nextjs/                  # 前端应用
│       ├── app/                 # Next.js 应用
│       │   ├── page.tsx         # 主页面
│       │   └── exchange-test/   # ExchangeEx 测试页面
│       ├── components/          # React 组件
│       ├── contracts/           # 合约类型定义
│       │   └── ExchangeEx.ts
│       ├── hooks/               # 自定义 Hooks
│       └── utils/               # 工具函数
└── README_EXCHANGEEX.md         # 项目说明
```

## 使用指南

### 1. 连接钱包

1. 点击右上角的 "Connect Wallet" 按钮
2. 选择您的钱包（MetaMask、WalletConnect 等）
3. 确认连接

### 2. 部署合约

1. 确保本地 Hardhat 节点正在运行
2. 运行部署命令：
   ```bash
   npm run deploy
   ```
3. 复制部署的合约地址

### 3. 测试合约功能

1. 访问 `/exchange-test` 页面
2. 输入已部署的合约地址
3. 开始测试各种功能：

#### 权限管理
- 输入交易员地址
- 点击 "授权交易员" 按钮

#### 子账户管理
- 设置 Nonce 值
- 查看生成的子账户ID

#### 存款功能
- 输入子账户ID
- 选择代币类型（如 "inj"）
- 输入存款数量
- 点击 "存款" 按钮

#### 现货订单
- 输入市场ID（如 "INJ/USDT"）
- 设置价格和数量
- 输入订单CID
- 创建买入或卖出订单

### 4. 查看交易状态

在页面底部可以查看所有交易的哈希值，点击可以跳转到区块浏览器查看详细信息。

## 开发指南

### 添加新的合约功能

1. 在 `packages/hardhat/contracts/` 中添加新的 Solidity 合约
2. 在 `packages/nextjs/contracts/` 中添加对应的 TypeScript 类型定义
3. 在测试页面中添加相应的 UI 组件

### 自定义样式

项目使用 DaisyUI 主题系统，可以通过修改 `packages/nextjs/app/globals.css` 来自定义样式。

### 环境配置

创建 `.env.local` 文件来配置环境变量：

```env
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_walletconnect_project_id
```

## 故障排除

### 常见问题

1. **依赖安装失败**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **合约部署失败**
   - 确保 Hardhat 节点正在运行
   - 检查网络配置

3. **钱包连接问题**
   - 确保钱包已安装并解锁
   - 检查网络连接

### 调试工具

- **Debug Contracts**: 访问 `/debug` 页面进行合约调试
- **Block Explorer**: 访问 `/blockexplorer` 查看交易记录
- **Hardhat Console**: 使用 `npx hardhat console` 进行交互式调试

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT License

## 相关链接

- [Scaffold-ETH 2 文档](https://docs.scaffoldeth.io/)
- [ExchangeEx 合约文档](./contracts/ExchangeEx_Standalone.md)
- [Hardhat 文档](https://hardhat.org/docs)
- [Next.js 文档](https://nextjs.org/docs) 