# Injective 网络连接故障排除指南

## 🚨 常见问题及解决方案

### 问题 1: MethodNotFoundRpcError ✅ 已解决

**错误信息**:
```
MethodNotFoundRpcError: The method "eth_getCode" does not exist / is not available.
```

**原因**: Injective 测试网的 RPC 端点不完全支持标准的 Ethereum RPC 方法。

**解决方案**:

#### ✅ 推荐方案: 使用官方 JSON-RPC 端点
```bash
# 使用官方推荐的 RPC 端点
export INJ_TESTNET_RPC_URL="https://k8s.testnet.json-rpc.injective.network/"

# 运行测试
npx hardhat run test-network-connection.js --network injTestnet
```

**测试结果**: ✅ 成功
- 支持 eth_getCode 方法
- 支持合约调用
- 响应时间: 3142ms

#### 方案 B: 使用本地区块链进行测试
```bash
# 启动本地区块链
yarn chain

# 新开终端，启动前端应用
yarn start
```

#### 方案 C: 使用 Injective 官方 SDK
```bash
# 安装 Injective SDK
npm install @injectivelabs/sdk-ts

# 使用 SDK 进行交互
```

### 问题 2: 网络连接超时

**解决方案**:
1. 使用官方推荐的 RPC 端点
2. 增加超时时间设置
3. 检查网络连接

### 问题 3: 合约调用失败

**解决方案**:
1. 确认合约地址正确
2. 检查账户余额
3. 验证 Gas 费用设置

## 🔧 推荐的测试流程

### 1. 使用官方 RPC 端点（推荐）
```bash
# 设置环境变量
export INJ_TESTNET_RPC_URL="https://k8s.testnet.json-rpc.injective.network/"

# 运行 Injective 特定测试
npx hardhat run test-injective.js --network injTestnet
```

### 2. 本地区块链测试
```bash
# 启动本地区块链
yarn chain

# 部署合约到本地网络
yarn deploy

# 运行测试
npx hardhat run test-contract.js --network localhost

# 启动前端应用
yarn start
```

## 📋 网络配置检查清单

### Injective 测试网配置 ✅ 已验证
- [x] Chain ID: 1439
- [x] RPC URL: https://k8s.testnet.json-rpc.injective.network/
- [x] 区块浏览器: https://testnet.blockscout.injective.network
- [x] 原生代币: INJ
- [x] Gas 费用: 0.16 gwei (当前)

### MetaMask 配置
- [ ] 网络名称: Injective Testnet
- [ ] Chain ID: 1439
- [ ] RPC URL: https://k8s.testnet.json-rpc.injective.network/
- [ ] 区块浏览器: https://testnet.blockscout.injective.network

## 🛠️ 调试工具

### 1. 网络连接测试
```bash
# 测试 RPC 连接
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}' \
  https://k8s.testnet.json-rpc.injective.network/
```

### 2. 合约状态查询
```bash
# 查询合约代码
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_getCode","params":["0x178Fc07106BAda5d423003d62e8aABb0850e1713","latest"],"id":1}' \
  https://k8s.testnet.json-rpc.injective.network/
```

### 3. 区块浏览器查询
- 合约地址: https://testnet.blockscout.injective.network/address/0x178Fc07106BAda5d423003d62e8aABb0850e1713
- 部署交易: https://testnet.blockscout.injective.network/tx/0x585d23995d1a02b1ba5e429d5c60e53f17c737f6253b839c7930973fbd7be74f

## 📚 相关文档

### Injective 官方文档
- [EVM Network Information](https://docs.injective.network/developers-evm/network-information)
- [Exchange Precompile](https://docs.injective.network/developers-evm/exchange-precompile)
- [Your First EVM Smart Contract](https://docs.injective.network/developers-evm/your-first-evm-smart-contract)

### 测试脚本
- `test-contract.js` - 标准测试脚本
- `test-injective.js` - Injective 特定测试脚本
- `test-network-connection.js` - 网络连接测试脚本

## 🎯 最佳实践

### 1. 开发阶段
- 使用本地区块链进行开发和测试
- 确保所有功能在本地正常工作

### 2. 测试阶段
- 先在本地测试所有功能
- 再部署到 Injective 测试网
- 使用官方推荐的 RPC 端点

### 3. 生产阶段
- 确保所有测试通过
- 使用 Injective 官方推荐的 RPC 端点
- 监控网络状态和 Gas 费用

## ✅ 已验证的配置

### 成功的 RPC 端点
- **URL**: `https://k8s.testnet.json-rpc.injective.network/`
- **状态**: ✅ 完全可用
- **功能**: 
  - ✅ 支持 eth_getCode 方法
  - ✅ 支持合约调用
  - ✅ 响应时间: 3142ms
  - ✅ 网络连接稳定

### 测试结果
- **当前网络**: injTestnet (Chain ID: 1439)
- **最新区块**: 87388839
- **Gas 价格**: 0.16 gwei
- **账户余额**: 0.41632897 ETH
- **合约调用**: ✅ 正常

## 📞 获取帮助

如果遇到问题，请：

1. 检查本故障排除指南
2. 查看 Injective 官方文档
3. 使用官方推荐的 RPC 端点
4. 使用本地区块链进行测试
5. 联系开发团队

---

**最后更新**: 2024年8月6日  
**版本**: 1.1.0  
**状态**: ✅ RPC 连接问题已解决
