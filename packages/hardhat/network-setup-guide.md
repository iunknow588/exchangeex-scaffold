# 设置默认连接到测试网络

## 🎯 目标
将 ExchangeEx 应用默认连接到 Injective 测试网络，而不是本地网络。

## ✅ 已完成的配置修改

### 1. 前端配置 (scaffold.config.ts)
```typescript
// 只保留 Injective 测试网，移除本地网络
targetNetworks: [
  injTestnet, // Injective 测试网作为默认网络
],
```

### 2. Hardhat 配置 (hardhat.config.ts)
```typescript
// 设置默认网络为 Injective 测试网
defaultNetwork: 'injTestnet',
```

### 3. 网络参数
- **网络名称**: Injective Testnet
- **Chain ID**: 1439
- **RPC URL**: https://testnet.sentry.tm.injective.network:443
- **合约地址**: 0x178Fc07106BAda5d423003d62e8aABb0850e1713

## 🚀 启动方法

### 方法 1: 使用启动脚本
```bash
# 在项目根目录运行
./start-testnet.sh
```

### 方法 2: 手动启动
```bash
# 1. 停止现有前端服务
pkill -f "next dev"

# 2. 设置环境变量
export NEXT_PUBLIC_DEFAULT_NETWORK=injTestnet
export NEXT_PUBLIC_DEFAULT_CHAIN_ID=1439
export NEXT_PUBLIC_INJECTIVE_RPC_URL=https://testnet.sentry.tm.injective.network:443

# 3. 启动前端
cd packages/nextjs
npm run dev
```

## 🔧 MetaMask 配置

### 手动添加网络
如果 MetaMask 没有 Injective 测试网络，请手动添加：

1. 打开 MetaMask
2. 点击网络选择器
3. 选择"添加网络"
4. 填写以下信息：
   - **网络名称**: Injective Testnet
   - **RPC URL**: https://testnet.sentry.tm.injective.network:443
   - **Chain ID**: 1439
   - **货币符号**: INJ
   - **区块浏览器**: https://testnet.blockscout.injective.network

## 📋 验证步骤

1. **启动前端**
   ```bash
   ./start-testnet.sh
   ```

2. **访问测试页面**
   - 打开浏览器访问: http://localhost:3000/exchange-test

3. **检查网络连接**
   - 页面应显示: "网络: Injective Testnet (ID: 1439)"
   - 钱包地址应显示: 0xd95C2810cfb43BdE49FDa151b17E732089DB75D7

4. **测试功能**
   - 连接 MetaMask 钱包
   - 尝试授权交易员功能
   - 验证授权状态显示为"已授权"

## 🎯 预期结果

- ✅ 前端默认连接到 Injective 测试网络
- ✅ 不再显示本地网络选项
- ✅ 授权功能正常工作
- ✅ 所有合约交互都在测试网络上进行

## 🔄 切换回本地网络

如果需要切换回本地网络进行开发：

1. **修改 scaffold.config.ts**
   ```typescript
   targetNetworks: [
     chains.hardhat, // 本地网络
     injTestnet,
   ],
   ```

2. **修改 hardhat.config.ts**
   ```typescript
   defaultNetwork: 'localhost',
   ```

3. **启动本地区块链**
   ```bash
   cd packages/hardhat
   npm run chain
   ```

4. **重启前端**
   ```bash
   cd packages/nextjs
   npm run dev
   ```

## 📝 注意事项

- 确保 MetaMask 连接到正确的网络
- 测试网络可能有网络拥堵，交易可能需要更长时间确认
- 如果遇到问题，检查浏览器控制台错误信息
- 建议在测试网络上使用小额资金进行测试 