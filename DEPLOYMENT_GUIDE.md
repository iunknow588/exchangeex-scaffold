# ExchangeEx_Standalone 部署指南

## 🚀 快速部署

### 1. 环境准备

确保已安装依赖并配置环境变量：

```bash
# 安装依赖
npm install

# 配置环境变量
cp .example.env .env
# 编辑 .env 文件，添加你的私钥
```

### 2. 编译合约

```bash
npx hardhat compile
```

### 3. 本地测试（推荐）

在部署到测试网之前，先在本地测试：

```bash
npx hardhat run script/test-local.js
```

### 4. 部署到测试网

#### 方式1: 智能部署（自动选择最佳RPC端点，推荐）
```bash
npx hardhat run script/deploy-exchange.js
```

#### 方式2: 带重试机制的智能部署
```bash
npx hardhat run script/deploy-with-retry.js
```

#### 方式3: 传统部署（使用配置文件中的网络）
```bash
npx hardhat run script/deploy-exchange.js --network inj_testnet
```

#### 方式4: WebSocket 端点部署
```bash
npx hardhat run script/deploy-exchange.js --network inj_testnet_ws
```

#### 方式5: Blockscout 镜像端点部署
```bash
npx hardhat run script/deploy-exchange.js --network inj_testnet_blockscout
```

### 5. 验证合约

部署成功后，验证合约：

```bash
# 设置合约地址
export CONTRACT_ADDRESS="0x..."  # 替换为实际合约地址

# 验证合约
npx hardhat run script/verify-contract.js --network inj_testnet

# 或者直接使用 hardhat verify 命令
npx hardhat verify --network inj_testnet 0x...  # 替换为实际合约地址
```

## 🔧 网络问题解决

### 常见错误及解决方案

| 错误类型 | 错误信息 | 解决方案 |
|---------|---------|---------|
| 503 错误 | `503 Service Temporarily Unavailable` | 等待重试或使用备用 RPC 端点 |
| 方法不支持 | `Method not found` | 尝试备用网络配置 |
| 连接超时 | `timeout` | 增加超时时间或稍后重试 |
| 余额不足 | `insufficient funds` | 从水龙头获取测试网代币 |

### 网络测试

```bash
# 测试网络连接（推荐）
npx hardhat run script/test-network-connection.js

# 传统网络测试
npx hardhat run script/test-network.js --network inj_testnet
```

### 网络信息

根据 [Injective 官方文档](https://docs.injective.network/developers-evm/network-information)：

- **Chain ID**: `1439`
- **主要 RPC 端点**: `https://k8s.testnet.json-rpc.injective.network/`
- **WebSocket 端点**: `https://k8s.testnet.ws.injective.network/`
- **区块浏览器**: `https://testnet.blockscout.injective.network/`
- **水龙头**: `https://testnet.faucet.injective.network/`

### 获取测试网代币

访问 [Injective 测试网水龙头](https://testnet.faucet.injective.network/) 获取测试网 INJ 代币。

## 📋 部署后操作

### 1. 设置环境变量

部署成功后，设置合约地址：

```bash
export CONTRACT_ADDRESS="0x..."  # 替换为实际合约地址
```

### 2. 验证合约

```bash
npx hardhat run script/verify-contract.js --network inj_testnet
```

### 3. 授权交易者

```bash
export TRADER_ADDRESS="0x..."   # 替换为交易者地址
npx hardhat run script/setup-permissions.js --network inj_testnet
```

### 4. 调试合约

```bash
npx hardhat run script/debug.js --network inj_testnet
```

### 5. 监听事件

```bash
npx hardhat run script/monitor-events.js --network inj_testnet
```

## 🎯 完整工作流程

```bash
# 1. 环境准备
npm install
cp .example.env .env
# 编辑 .env 文件

# 2. 编译合约
npx hardhat compile

# 3. 本地测试
npx hardhat run script/test-local.js

# 4. 部署到测试网
npx hardhat run script/deploy-exchange.js

# 5. 验证合约
export CONTRACT_ADDRESS="0x..."
npx hardhat run script/verify-contract.js --network inj_testnet

# 6. 设置权限
export TRADER_ADDRESS="0x..."
npx hardhat run script/setup-permissions.js --network inj_testnet

# 7. 测试功能
npx hardhat run script/debug.js --network inj_testnet
```

## 🔗 相关链接

- **区块浏览器**: https://testnet.blockscout.injective.network/
- **测试网水龙头**: https://testnet.faucet.injective.network/
- **官方文档**: https://docs.injective.network/
- **GitHub**: https://github.com/injective-dev/hardhat-inj

## 📞 技术支持

如果遇到问题：

1. 检查网络连接状态
2. 确认环境变量配置正确
3. 验证账户有足够余额
4. 查看错误日志和解决方案
5. 在 GitHub 上提交 Issue

---

**注意**: 这是一个演示项目，用于学习和测试目的。在生产环境中使用前，请确保进行充分的安全审计和测试。 