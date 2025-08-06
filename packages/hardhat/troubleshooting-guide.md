# ExchangeEx 授权问题排查指南

## 🔍 问题分析

### 当前状态
- ✅ 合约部署成功
- ✅ 网络连接正常
- ✅ 脚本授权功能正常
- ❌ 前端授权失败

### 可能的原因

1. **前端网络配置问题**
   - 前端可能仍连接到本地网络 (localhost:8545)
   - 需要重启前端以应用新的网络配置

2. **钱包网络不匹配**
   - MetaMask 可能连接到错误的网络
   - 需要手动切换到 Injective 测试网络

3. **合约地址不匹配**
   - 前端可能使用错误的合约地址
   - 需要确保使用正确的部署地址

## 🛠️ 解决方案

### 步骤 1: 重启前端
```bash
# 停止前端服务
pkill -f "next dev"

# 重新启动前端
cd packages/nextjs
npm run dev
```

### 步骤 2: 检查 MetaMask 网络配置
1. 打开 MetaMask
2. 点击网络选择器
3. 选择 "Injective Testnet" 或手动添加网络：
   - 网络名称: Injective Testnet
   - RPC URL: https://testnet.sentry.tm.injective.network:443
   - Chain ID: 1439
   - 货币符号: INJ

### 步骤 3: 验证网络连接
1. 访问 http://localhost:3000/exchange-test
2. 连接 MetaMask 钱包
3. 检查页面显示的：
   - 网络: Injective Testnet (ID: 1439)
   - 地址: 0xd95C2810cfb43BdE49FDa151b17E732089DB75D7

### 步骤 4: 测试授权功能
1. 在授权交易员输入框中输入测试地址：
   ```
   0x1234567890123456789012345678901234567890
   ```
2. 点击"授权交易员"按钮
3. 在 MetaMask 中确认交易

## 🔧 手动网络配置

如果 MetaMask 没有 Injective 测试网络，请手动添加：

### 网络参数
- **网络名称**: Injective Testnet
- **RPC URL**: https://testnet.sentry.tm.injective.network:443
- **Chain ID**: 1439
- **货币符号**: INJ
- **区块浏览器**: https://testnet.blockscout.injective.network

## 📋 验证清单

- [ ] 前端已重启
- [ ] MetaMask 连接到 Injective Testnet
- [ ] 页面显示正确的网络信息
- [ ] 钱包地址匹配部署者地址
- [ ] 授权交易员功能正常

## 🆘 如果问题仍然存在

1. **检查浏览器控制台错误**
   - 按 F12 打开开发者工具
   - 查看 Console 标签页的错误信息

2. **检查网络请求**
   - 在 Network 标签页查看失败的请求

3. **清除浏览器缓存**
   - 清除浏览器缓存和本地存储
   - 重新加载页面

4. **使用不同的浏览器**
   - 尝试使用 Chrome 或 Firefox

## 📞 技术支持

如果以上步骤都无法解决问题，请提供：
1. 浏览器控制台错误信息
2. MetaMask 网络配置截图
3. 页面显示的网络信息截图 