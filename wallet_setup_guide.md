# Injective 钱包设置指南

## 🏦 钱包选择

### MetaMask (推荐用于 EVM 开发)
- ✅ 直接支持 EVM 私钥导出
- ✅ 标准 EVM 兼容性
- ✅ 易于集成到 dApp

### Keplr (推荐用于 Cosmos 原生开发)
- ✅ 原生支持 Injective 网络
- ✅ 支持 IBC 跨链
- ✅ 更好的 Cosmos 生态集成

## 🔧 MetaMask 设置步骤

### 1. 安装 MetaMask
访问 [MetaMask 官网](https://metamask.io/) 安装浏览器扩展

### 2. 添加 Injective 测试网
```javascript
// 网络配置
{
  "chainId": "0x59F",
  "chainName": "Injective Testnet",
  "rpcUrls": ["https://k8s.testnet.json-rpc.injective.network/"],
  "nativeCurrency": {
    "name": "INJ",
    "symbol": "INJ",
    "decimals": 18
  },
  "blockExplorerUrls": ["https://testnet.blockscout.injective.network/"]
}
```

### 3. 导出私钥
1. 打开 MetaMask
2. 点击账户图标 → 账户详情
3. 点击"导出私钥"
4. 输入密码确认
5. 复制私钥（64个十六进制字符）

### 4. 配置到项目
```bash
# 编辑 .env 文件
echo "PRIVATE_KEY=your_exported_private_key" > .env
chmod 600 .env
```

## 🔧 Keplr 设置步骤

### 1. 安装 Keplr
访问 [Keplr 官网](https://www.keplr.app/) 安装浏览器扩展

### 2. 创建/导入钱包
1. 创建新钱包或导入现有钱包
2. 选择 Injective 网络
3. 记录助记词

### 3. 导出助记词
1. 打开 Keplr 扩展
2. 设置 → 安全 → 查看助记词
3. 输入密码确认
4. 复制助记词

### 4. 转换为 EVM 私钥
```bash
# 安装转换工具
npm install -g @cosmjs/crypto ethers

# 创建转换脚本
cat > convert_mnemonic.js << 'EOF'
const { DirectSecp256k1HdWallet } = require('@cosmjs/crypto');
const { ethers } = require('ethers');

async function convertMnemonic() {
  const mnemonic = 'your mnemonic here'; // 替换为你的助记词
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic);
  const accounts = await wallet.getAccounts();
  const privateKey = accounts[0].privkey;
  console.log('EVM Private Key:', Buffer.from(privateKey).toString('hex'));
}

convertMnemonic().catch(console.error);
EOF

# 运行转换
node convert_mnemonic.js
```

### 5. 配置到项目
```bash
# 编辑 .env 文件
echo "PRIVATE_KEY=converted_private_key" > .env
chmod 600 .env
```

## 🔒 安全注意事项

### 私钥安全
- ⚠️ 永远不要分享你的私钥
- ⚠️ 不要在代码中硬编码私钥
- ⚠️ 使用环境变量管理私钥
- ⚠️ 定期更换测试网私钥

### 助记词安全
- ⚠️ 永远不要分享你的助记词
- ⚠️ 离线存储助记词
- ⚠️ 使用硬件钱包（推荐）

## 🧪 测试配置

### 验证私钥配置
```bash
# 运行安全检查
./security_check.sh

# 测试编译
npx hardhat compile

# 测试部署（需要测试网 INJ）
npx hardhat run script/deploy.js --network inj_testnet
```

## 📚 相关资源

- [MetaMask 官网](https://metamask.io/)
- [Keplr 官网](https://www.keplr.app/)
- [Injective 测试网水龙头](https://testnet.injective.network/)
- [Injective 文档](https://docs.injective.network/) 