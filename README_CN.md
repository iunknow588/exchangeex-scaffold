# Injective EVM 智能合约开发使用文档

## 📋 目录
1. [项目概述](#项目概述)
2. [环境准备](#环境准备)
3. [开发工具链](#开发工具链)
4. [智能合约开发](#智能合约开发)
5. [测试与部署](#测试与部署)
6. [合约交互](#合约交互)
7. [最佳实践](#最佳实践)
8. [故障排除](#故障排除)

## 🚨 快速故障排除

### 常见错误及解决方案

| 错误类型 | 错误信息 | 解决方案 |
|---------|---------|---------|
| 私钥格式错误 | `private key too long, expected 32 bytes` | 使用 `injectived keys unsafe-export-eth-key` 导出私钥 |
| RPC 连接失败 | `503 Service Temporarily Unavailable` | 等待重试或检查网络连接 |
| 账户余额不足 | `insufficient funds for gas` | 从测试网水龙头获取 INJ 代币 |
| 编译失败 | `Invalid account` | 检查 `.env` 文件中的私钥配置 |
| 网络连接超时 | `getaddrinfo ENOTFOUND` | 验证 RPC URL 是否正确 |

**详细解决方案请查看 [故障排除](#故障排除) 部分**

## 🎯 项目概述

这是一个基于 **Injective Testnet** 的 EVM 智能合约开发演示项目，展示了完整的智能合约开发生命周期：

- **编译** → **测试** → **部署** → **验证** → **交互**

项目使用 **Hardhat** 作为主要开发框架，支持标准的 EVM 开发工具链。

### 项目特点
- ✅ 完整的开发工具链配置
- ✅ 详细的测试用例
- ✅ 自动化部署脚本
- ✅ 合约验证支持
- ✅ 交互式控制台

## 🔧 环境准备

### 系统要求
- **Node.js**: 建议使用 LTS 版本 (v18.x 或 v20.x)
- **npm**: 最新版本
- **Git**: 用于版本控制

### 项目设置
```bash
# 克隆项目
git clone https://github.com/injective-dev/hardhat-inj
cd hardhat-inj

# 安装依赖
npm install

# 配置环境变量
cp .example.env .env
# 编辑 .env 文件，添加你的私钥和 RPC URL
```

### 环境变量配置
```env
PRIVATE_KEY=your private key without 0x prefix
INJ_TESTNET_RPC_URL=https://k8s.testnet.json-rpc.injective.network/
```

### 🔑 私钥配置指南

**重要**: 你需要将 `your private key without 0x prefix` 替换为你的真实私钥。

#### 从 Injective CLI 获取私钥

1. **查看现有账户**:
```bash
injectived keys list
```

2. **导出以太坊私钥** (推荐方式):
```bash
injectived keys unsafe-export-eth-key YOUR_ACCOUNT_NAME
```

3. **复制私钥到 .env 文件**:
```env
PRIVATE_KEY=your_private_key_here_without_0x_prefix
```

#### 从 MetaMask 获取私钥

1. **导出 MetaMask 私钥**:
   - 打开 MetaMask → 账户详情 → 导出私钥
   - 输入密码后复制私钥

2. **格式转换**:
   ```bash
   # MetaMask 格式 (包含 0x 前缀)
   0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
   
   # Hardhat 格式 (去掉 0x 前缀)
     1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
   ```

3. **更新 .env 文件**:
   ```env
   PRIVATE_KEY=1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
   ```

#### 私钥格式要求
- ✅ **正确格式**: 64 个十六进制字符（32 字节）
- ✅ **无前缀**: 不要包含 `0x` 前缀
- ❌ **错误格式**: 不要使用 Tendermint 私钥格式
- ❌ **避免**: 不要使用 `injectived keys export` 命令

#### 示例对比
```bash
# ✅ 正确的以太坊私钥格式
PRIVATE_KEY=1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef

# ❌ 错误的 Tendermint 私钥格式
PRIVATE_KEY=-----BEGIN TENDERMINT PRIVATE KEY-----
kdf: argon2
salt: 266CB71F9D5A56617CD76E75A20E8A0C
type: eth_secp256k1
9D03OUGpMMD0qFRCfIaxIcLVr9TiEkOybB/j7FljhAzB0ckzJbUvPDgaCa/92mZWFBl3xzE=
=mkPG
-----END TENDERMINT PRIVATE KEY-----
```

### 🔒 私钥安全警告
**即使是在测试网络上，私钥也必须严格保护！**

- ⚠️ **测试网代币有价值** - 可能被用于开发和测试
- ⚠️ **安全习惯** - 良好的安全习惯应该从测试网开始培养
- ⚠️ **潜在风险** - 可能被用于恶意活动或钓鱼攻击

**安全措施**:
1. 设置严格的文件权限：`chmod 600 .env`
2. 确保 `.env` 在 `.gitignore` 中
3. 定期更换测试网私钥
4. 使用硬件钱包管理私钥（推荐）
5. 监控账户活动

## 🛠️ 开发工具链

### 主要工具
- **Hardhat**:  智能合约开发框架
- **Solidity**: 智能合约编程语言 (v0.8.28)
- **Ethers.js**: 以太坊库
- **Chai**: 测试框架

### 网络配置
```javascript
// hardhat.config.js
networks: {
  inj_testnet: {
    url: process.env.INJ_TESTNET_RPC_URL,
    accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    chainId: 1439,
  },
}
```

## 📝 智能合约开发

### 合约结构
当前项目包含一个简单的 **Counter 合约**：

```solidity
// contracts/Counter.sol
pragma solidity 0.8.28;

contract Counter {
    uint256 public value = 0;

    function increment(uint256 num) external {
        value += num;
    }
}
```

### 合约功能
- **状态变量**: `value` - 公共计数器变量
- **函数**: `increment(uint256 num)` - 增加计数器值

### 项目文件结构
```
hardhat-inj/
├── contracts/          # 智能合约目录
│   └── Counter.sol     # 计数器合约
├── script/             # 部署脚本
│   └── deploy.js       # 部署脚本
├── test/               # 测试文件
│   └── Counter.test.js # 合约测试
├── hardhat.config.js   # Hardhat 配置
├── package.json        # 项目依赖
└── README.md          # 项目说明
```

## 🧪 测试与部署

### 编译合约
```bash
npx hardhat compile
```

### 运行测试
```bash
# 本地测试
npx hardhat test

# 测试网测试 (不推荐)
npx hardhat test --network inj_testnet
```

### 测试内容
- ✅ 初始值验证 (value = 0)
- ✅ 从零开始递增功能
- ✅ 从非零值开始递增功能

### 部署合约
```bash
npx hardhat run script/deploy.js --network inj_testnet
```

部署脚本配置：
```javascript
const counter = await Counter.deploy({
    gasPrice: 30e9,  // 30 Gwei
    gasLimit: 2e6,   // 2M gas limit
});
```

## 🔗 合约交互

### 交互方式概述

合约交互有两种主要方式：
1. **交互式控制台**: 实时交互，适合测试和调试
2. **脚本执行**: 批量操作，适合自动化任务

### 1. 交互式控制台

启动控制台：
```bash
npx hardhat console --network inj_testnet
```

#### 常用交互命令
```javascript
// 获取合约实例
const contractAddress = "0x0Ac692039A5BB0684389Da0286e8d86B5279E12f";
const Counter = await ethers.getContractFactory('Counter');
const counter = Counter.attach(contractAddress);

// 查看账户信息
const [signer] = await ethers.getSigners();
console.log("签名者地址:", await signer.getAddress());

// 读取合约状态
const value = await counter.value();
console.log('当前值:', value.toString());

// 调用合约函数
const tx = await counter.increment(1, {
    gasLimit: 200000,
    gasPrice: ethers.parseUnits("30", "gwei")
});
await tx.wait();
console.log('交易已确认');
```

### 2. 脚本执行方式

#### 查询合约状态（只读操作）
```bash
npx hardhat run script/query.js --network inj_testnet
```

**脚本内容示例**:
```javascript
// script/query.js
async function main() {
    const contractAddress = "0x0Ac692039A5BB0684389Da0286e8d86B5279E12f";
    const Counter = await ethers.getContractFactory("Counter");
    const counter = Counter.attach(contractAddress);
    
    const value = await counter.value();
    console.log("当前值:", value.toString());
}
```

#### 执行合约操作（写入操作）
```bash
npx hardhat run script/increment.js --network inj_testnet
```

**脚本内容示例**:
```javascript
// script/increment.js
async function main() {
    const contractAddress = "0x0Ac692039A5BB0684389Da0286e8d86B5279E12f";
    const Counter = await ethers.getContractFactory("Counter");
    const counter = Counter.attach(contractAddress);
    
    // 查看当前状态
    const currentValue = await counter.value();
    console.log("当前值:", currentValue.toString());
    
    // 执行操作
    const tx = await counter.increment(1, {
        gasLimit: 200000,
        gasPrice: ethers.parseUnits("30", "gwei")
    });
    await tx.wait();
    
    // 查看更新后状态
    const newValue = await counter.value();
    console.log("新值:", newValue.toString());
}
```

#### 完整交互脚本
```bash
npx hardhat run script/interact.js --network inj_testnet
```

### 3. Gas 费用配置

#### 重要配置参数
```javascript
{
    gasLimit: 200000,                    // Gas 限制
    gasPrice: ethers.parseUnits("30", "gwei")  // Gas 价格
}
```

#### 常见 Gas 错误
```bash
insufficient fee; got: 1405600000000.000000000000000000 
required: 7028000000000.000000000000000000: insufficient fee
```

**解决方案**: 增加 gas 限制和价格设置

### 4. 脚本执行命令格式

```bash
npx hardhat run <脚本文件> --network <网络名称>
```

**示例**:
```bash
# 查询状态
npx hardhat run script/query.js --network inj_testnet

# 执行操作
npx hardhat run script/increment.js --network inj_testnet

# 部署合约
npx hardhat run script/deploy.js --network inj_testnet
```

## ✅ 合约验证

### 在 Blockscout 上验证
```bash
npx hardhat verify --network inj_testnet CONTRACT_ADDRESS
```

### 验证配置
```javascript
etherscan: {
  apiKey: {
    inj_testnet: 'nil',
  },
  customChains: [
    {
      network: 'inj_testnet',
      chainId: 1439,
      urls: {
        apiURL: 'https://testnet.blockscout-api.injective.network/api',
        browserURL: 'https://testnet.blockscout.injective.network/',
      },
    },
  ],
}
```

## 🚀 完整工作流程

### 1. 开发阶段
```bash
# 编写合约
vim contracts/Counter.sol

# 编译
npx hardhat compile

# 测试
npx hardhat test
```

### 2. 部署阶段
```bash
# 部署到测试网
npx hardhat run script/deploy.js --network inj_testnet

# 记录合约地址
# Counter smart contract deployed to: 0x...
```

### 3. 验证阶段
```bash
# 验证合约
npx hardhat verify --network inj_testnet 0x...
```

### 4. 交互阶段
```bash
# 方式1: 交互式控制台
npx hardhat console --network inj_testnet

# 方式2: 脚本执行
npx hardhat run script/query.js --network inj_testnet      # 查询状态
npx hardhat run script/increment.js --network inj_testnet  # 执行操作
npx hardhat run script/interact.js --network inj_testnet   # 完整交互

# 控制台中的交互命令
const Counter = await ethers.getContractFactory('Counter');
const counter = Counter.attach('0x0Ac692039A5BB0684389Da0286e8d86B5279E12f');
const value = await counter.value();
await counter.increment(1, { gasLimit: 200000, gasPrice: ethers.parseUnits("30", "gwei") });
```

## 💡 最佳实践

### 开发建议
1. **版本管理**: 使用语义化版本控制
2. **测试覆盖**: 确保所有功能都有测试用例
3. **Gas 优化**: 合理设置 gas 限制和价格
4. **错误处理**: 实现适当的错误处理机制

### 安全考虑
1. **私钥管理**: 使用环境变量存储私钥
2. **合约审计**: 部署前进行安全审计
3. **权限控制**: 实现适当的访问控制
4. **升级机制**: 考虑合约升级策略

### 网络信息
- **测试网**: Injective Testnet
- **Chain ID**: 1439
- **RPC URL**: `https://k8s.testnet.json-rpc.injective.network/`
- **区块浏览器**: `https://testnet.blockscout.injective.network/`

## 🔧 故障排除

### 常见问题

#### 1. 依赖安装失败
```bash
# 清理并重新安装
rm -rf node_modules package-lock.json
npm install
```

#### 2. 版本冲突
如果遇到版本冲突，更新 package.json 中的版本：
```json
{
  "devDependencies": {
    "hardhat": "2.26.0",
    "@nomicfoundation/hardhat-toolbox": "6.0.0"
  }
}
```

#### 3. Node.js 版本警告
建议使用 Node.js LTS 版本 (v18.x 或 v20.x)：
```bash
# 使用 nvm 切换版本
nvm use 18
```

#### 4. 编译错误
检查 Solidity 版本兼容性：
```solidity
pragma solidity 0.8.28;  // 确保版本正确
```

#### 5. 私钥配置错误
```bash
Error HH8: Invalid account: #0 for network: inj_testnet - private key too short, expected 32 bytes
```

**解决方案**:
1. 确保 `.env` 文件存在：`cp .example.env .env`
2. 编辑 `.env` 文件，替换 `PRIVATE_KEY` 为真实私钥
3. 私钥格式要求：
   - 64 个十六进制字符（32 字节）
   - 不包含 `0x` 前缀
   - 示例：`1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef`

#### 6. 网络连接问题
- 检查 RPC URL 是否正确
- 确认网络连接稳定
- 验证私钥格式

#### 7. 私钥格式错误 - 常见问题分析

**错误现象**:
```bash
Error HH8: Invalid account: #0 for network: inj_testnet - private key too long, expected 32 bytes
```

**错误原因分析**:
1. **Tendermint 私钥格式混淆**: 使用 `injectived keys export` 导出的是完整的 Tendermint 私钥格式，包含加密信息和元数据
2. **Hardhat 需要原始私钥**: Hardhat 只接受 32 字节的原始以太坊私钥
3. **格式不匹配**: Tendermint 私钥格式与 EVM 私钥格式不同

**解决方案**:
```bash
# ❌ 错误方式 - 导出 Tendermint 私钥
injectived keys export wisely

# ✅ 正确方式 - 导出以太坊私钥
injectived keys unsafe-export-eth-key wisely
```

**私钥格式对比**:
```bash
# Tendermint 私钥格式 (错误)
-----BEGIN TENDERMINT PRIVATE KEY-----
kdf: argon2
salt: 266CB71F9D5A56617CD76E75A20E8A0C
type: eth_secp256k1
9D03OUGpMMD0qFRCfIaxIcLVr9TiEkOybB/j7FljhAzB0ckzJbUvPDgaCa/92mZWFBl3xzE=
=mkPG
-----END TENDERMINT PRIVATE KEY-----

# 以太坊私钥格式 (正确)
1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
```

#### 8. RPC 端点连接问题

**错误现象**:
```bash
HardhatError: HH110: Invalid JSON-RPC response received: <html>
<head><title>503 Service Temporarily Unavailable</title></head>
<body>
<center><h1>503 Service Temporarily Unavailable</h1></center>
<hr><center>nginx</center>
</body>
</html>
```

**错误原因分析**:
1. **RPC 端点临时不可用**: Injective 测试网 RPC 端点可能暂时维护或过载
2. **网络连接问题**: 本地网络连接不稳定
3. **DNS 解析失败**: 域名解析问题

**解决方案**:
1. **等待重试**: 503 错误通常是临时的，等待几分钟后重试
2. **验证 RPC URL**: 确保使用正确的官方 RPC 端点
3. **检查网络连接**: 确认本地网络连接正常
4. **使用备用端点**: 如果问题持续，可以尝试其他 RPC 端点

**官方 RPC 端点配置**:
```env
# Injective EVM Testnet 官方配置
INJ_TESTNET_RPC_URL=https://k8s.testnet.json-rpc.injective.network/
CHAIN_ID=1439
EXPLORER_URL=https://testnet.blockscout.injective.network/
```

#### 9. 账户余额不足

**错误现象**:
```bash
Error: insufficient funds for gas * price + value
```

**解决方案**:
1. **检查账户余额**:
```bash
injectived query bank balances YOUR_ADDRESS --node https://k8s.testnet.tm.injective.network:443
```

2. **获取测试网代币**:
   - 访问: https://testnet.faucet.injective.network/
   - 输入你的 Injective 地址
   - 获取测试网 INJ 代币

3. **确认最小余额**: 建议至少保持 0.1 INJ 用于 gas 费用

#### 10. Gas 费用不足

**错误现象**:
```bash
insufficient fee; got: 1405600000000.000000000000000000 
required: 7028000000000.000000000000000000: insufficient fee
```

**解决方案**:
1. **增加 Gas 限制和价格**:
```javascript
const tx = await contract.function({
    gasLimit: 200000,
    gasPrice: ethers.parseUnits("30", "gwei")
});
```

2. **检查网络 Gas 价格**:
```bash
npx hardhat console --network inj_testnet
> await ethers.provider.getGasPrice()
```

3. **使用动态 Gas 价格**:
```javascript
const gasPrice = await ethers.provider.getGasPrice();
const tx = await contract.function({
    gasLimit: 200000,
    gasPrice: gasPrice
});
```

#### 11. 脚本执行错误

**错误现象**:
```bash
TypeError: signer.getBalance is not a function
TypeError: counter.count is not a function
```

**解决方案**:
1. **正确的余额查询**:
```javascript
// ❌ 错误方式
const balance = await signer.getBalance();

// ✅ 正确方式
const balance = await ethers.provider.getBalance(signerAddress);
```

2. **正确的合约函数调用**:
```javascript
// ❌ 错误方式 (如果合约中没有 count 函数)
const count = await counter.count();

// ✅ 正确方式 (使用实际的函数名)
const value = await counter.value();
```

3. **检查合约 ABI**: 确保调用的函数名与合约定义一致

### 调试技巧
1. **启用详细日志**:
```bash
npx hardhat test --verbose
```

2. **检查网络状态**:
```bash
npx hardhat console --network inj_testnet
```

3. **验证合约字节码**:
```bash
npx hardhat verify --network inj_testnet CONTRACT_ADDRESS
```

## 📚 相关资源

### 官方文档
- [Injective EVM 文档](https://docs.injective.network/developers-evm/smart-contracts)
- [Hardhat 官方文档](https://hardhat.org/docs)
- [Solidity 文档](https://docs.soliditylang.org/)
- [Ethers.js 文档](https://docs.ethers.org/)

### 教程链接
- [设置 Hardhat 和编译智能合约](https://docs.injective.network/developers-evm/smart-contracts/compile-hardhat)
- [使用 Hardhat 测试智能合约](https://docs.injective.network/developers-evm/smart-contracts/test-hardhat)
- [使用 Hardhat 部署智能合约](https://docs.injective.network/developers-evm/smart-contracts/deploy-hardhat)
- [使用 Hardhat 验证智能合约](https://docs.injective.network/developers-evm/smart-contracts/verify-hardhat)
- [使用 Hardhat 与智能合约交互](https://docs.injective.network/developers-evm/smart-contracts/interact-hardhat)

## 🎯 下一步

完成智能合约开发后，可以：
1. 构建去中心化应用 (dApp)
2. 集成 MetaMask 或 WalletConnect
3. 开发前端用户界面
4. 实现更复杂的 DeFi 功能

## 📄 许可证

MIT License

## 👨‍💻 作者

[Brendan Graetz](https://blog.bguiz.com/)

## 📝 经验总结

### 常见陷阱和解决方案

#### 1. 私钥格式混淆
**问题**: 在 Injective 生态系统中，存在两种不同的私钥格式：
- **Tendermint 私钥**: 用于 Cosmos SDK 功能
- **以太坊私钥**: 用于 EVM 功能

**解决方案**: 始终使用 `injectived keys unsafe-export-eth-key` 获取 EVM 私钥

#### 2. RPC 端点稳定性
**问题**: Injective 测试网 RPC 端点可能偶尔不稳定
**解决方案**: 
- 使用官方推荐的 RPC 端点
- 遇到 503 错误时等待重试
- 保持网络连接稳定

#### 3. 网络配置验证
**问题**: 网络配置错误导致部署失败
**解决方案**: 严格按照官方文档配置网络参数

#### 4. 测试网代币管理
**问题**: 测试网代币不足导致交易失败
**解决方案**: 
- 定期从水龙头获取测试网代币
- 监控账户余额
- 合理设置 gas 限制

### 最佳实践清单

- ✅ 使用正确的私钥格式（以太坊私钥）
- ✅ 配置官方 RPC 端点
- ✅ 定期备份重要配置
- ✅ 监控账户余额
- ✅ 使用版本控制管理代码
- ✅ 在部署前充分测试
- ✅ 记录部署的合约地址
- ✅ 创建可重用的交互脚本
- ✅ 合理设置 Gas 费用参数
- ✅ 验证合约函数调用正确性
- ✅ 使用脚本自动化重复操作

---

**注意**: 这是一个演示项目，用于学习和测试目的。在生产环境中使用前，请确保进行充分的安全审计和测试。 