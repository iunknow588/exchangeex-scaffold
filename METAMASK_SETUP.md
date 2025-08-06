# MetaMask 连接设置指南

## 🦊 MetaMask 钱包配置

### 1. 安装 MetaMask

如果还没有安装 MetaMask，请从以下地址下载：
- **Chrome 扩展**: https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn
- **Firefox 扩展**: https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/
- **移动端**: https://metamask.io/download/

### 2. 创建或导入钱包

1. 打开 MetaMask 扩展
2. 点击"创建钱包"或"导入钱包"
3. 按照提示设置密码和助记词
4. **重要**: 请妥善保管助记词，不要泄露给任何人

### 3. 添加 Injective 测试网

#### 方法一：手动添加网络

1. 打开 MetaMask
2. 点击网络选择器（显示当前网络名称）
3. 点击"添加网络" → "手动添加网络"
4. 填写以下信息：

```
网络名称: Injective Testnet
新的 RPC URL: https://k8s.testnet.json-rpc.injective.network/
链 ID: 888
货币符号: INJ
区块浏览器 URL: https://testnet.blockscout.injective.network
```

#### 方法二：通过 Chainlist 添加

1. 访问 https://chainlist.org/
2. 搜索 "Injective Testnet"
3. 点击"添加到 MetaMask"

### 4. 获取测试代币

1. 访问 Injective 测试网水龙头：
   https://testnet.faucet.injective.network/

2. 输入您的钱包地址
3. 选择要获取的代币类型（INJ、USDT 等）
4. 点击"获取代币"

## 🔗 连接测试平台

### 1. 启动应用

```bash
cd exchangeex-scaffold
./start.sh
```

### 2. 连接 MetaMask

1. 打开浏览器访问：http://localhost:3000/exchange-test
2. 点击右上角的"连接钱包"按钮
3. 选择"MetaMask"
4. 在 MetaMask 弹窗中确认连接

### 3. 切换网络

如果当前网络不支持，页面会提示切换网络：

- **Hardhat 本地网络** (ID: 31337) - 用于本地测试
- **Injective 测试网** (ID: 888) - 用于真实测试

## 🔧 故障排除

### 常见问题

#### 1. MetaMask 未检测到

**解决方案**:
- 确保 MetaMask 扩展已安装并启用
- 刷新页面
- 检查浏览器是否阻止了弹窗

#### 2. 网络连接失败

**解决方案**:
- 检查网络配置是否正确
- 尝试使用不同的 RPC 端点
- 确保网络 ID 为 888

#### 3. 交易失败

**解决方案**:
- 检查账户余额是否充足
- 确认 Gas 费用设置
- 检查合约地址是否正确

#### 4. 权限错误

**解决方案**:
- 确保已授权为交易员
- 检查合约所有者设置
- 确认交易签名

### 调试步骤

1. **检查 MetaMask 状态**:
   - 确保 MetaMask 已解锁
   - 检查当前网络是否正确
   - 确认账户已连接

2. **检查网络连接**:
   ```bash
   # 测试 RPC 连接
   ./start.sh --test-rpc
   ```

3. **检查合约部署**:
   ```bash
   # 查看部署日志
   tail -f packages/hardhat/chain.log
   ```

4. **浏览器控制台**:
   - 打开开发者工具 (F12)
   - 查看 Console 标签页的错误信息

## 📱 移动端使用

### MetaMask 移动端

1. 安装 MetaMask 移动端应用
2. 导入或创建钱包
3. 添加 Injective 测试网
4. 使用 WalletConnect 连接

### WalletConnect 连接

1. 在桌面端点击"连接钱包"
2. 选择 WalletConnect
3. 扫描二维码连接移动端 MetaMask

## 🔒 安全建议

1. **私钥安全**:
   - 永远不要分享私钥或助记词
   - 使用硬件钱包存储大额资产
   - 定期备份钱包

2. **网络安全**:
   - 只连接可信的网络
   - 验证 RPC 端点的真实性
   - 使用官方推荐的网络配置

3. **交易安全**:
   - 仔细检查交易详情
   - 确认合约地址正确
   - 设置合理的 Gas 限制

## 📞 技术支持

如果遇到问题，请：

1. 检查本指南的故障排除部分
2. 查看浏览器控制台错误信息
3. 参考 MetaMask 官方文档：https://docs.metamask.io/
4. 查看项目文档：./README_EXCHANGEEX.md

## 🎯 最佳实践

1. **测试环境**: 先在本地 Hardhat 网络测试
2. **小额测试**: 在测试网使用小额代币测试
3. **备份重要**: 备份所有重要的交易信息
4. **定期更新**: 保持 MetaMask 和项目依赖更新 