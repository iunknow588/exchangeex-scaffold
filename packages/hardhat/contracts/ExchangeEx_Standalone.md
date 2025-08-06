# ExchangeEx_Standalone.sol 使用说明

## 📋 概述

`ExchangeEx_Standalone.sol` 是一个完全独立的 Injective 交易合约，包含了所有必要的依赖，可以直接复制到任何项目中使用。该合约提供了完整的现货市场交易、衍生品交易和子账户管理功能。

## 🔧 工具链说明

**本文档已更新为使用 Hardhat 开发工具链**，与项目的主要配置保持一致：

- ✅ **Hardhat 框架** - 使用 JavaScript/TypeScript 生态
- ✅ **Ethers.js** - 以太坊库
- ✅ **Injective 测试网** - 完整的网络配置
- ✅ **自动化脚本** - 部署、权限管理、调试脚本
- ✅ **交互式控制台** - 便于测试和调试

**注意**: 如果您需要使用 Foundry 工具链，请参考原始的 Forge 命令。

## 特性

### 🎯 **核心功能**
- ✅ **现货市场交易** - 限价单、市价单、批量订单
- ✅ **衍生品交易** - 衍生品限价单创建
- ✅ **子账户管理** - 自动创建、存款、取款、转账
- ✅ **权限控制** - 所有者和管理员权限系统
- ✅ **批量操作** - 批量创建和取消订单
- ✅ **事件记录** - 完整的操作日志

### 🔐 **安全特性**
- 权限控制系统
- 完整的错误处理
- 紧急取款功能
- 事件记录和监控

### 📊 **便捷功能**
- 简化的交易接口
- 子账户ID自动生成
- 批量操作支持
- 完整的查询功能

## 快速开始

### 1. 复制合约文件

```bash
# 直接复制到您的项目中
cp ExchangeEx_Standalone.sol your-project/contracts/
```

### 2. 编译合约

```bash
# 编译合约
npx hardhat compile
```

### 3. 部署合约

#### 创建部署脚本

创建 `script/deploy-exchange.js` 文件（仅负责部署）：

```javascript
// script/deploy-exchange.js
const { ethers } = require("hardhat");

async function main() {
    console.log("开始部署 ExchangeEx_Standalone 合约...");
    
    // 获取合约工厂
    const ExchangeEx = await ethers.getContractFactory("ExchangeEx");
    
    // 部署合约
    const exchangeEx = await ExchangeEx.deploy({
        gasPrice: 30e9,  // 30 Gwei
        gasLimit: 5e6,   // 5M gas limit (合约较大，需要更多 gas)
    });
    
    // 等待部署完成
    await exchangeEx.waitForDeployment();
    const address = await exchangeEx.getAddress();
    
    console.log("✅ ExchangeEx_Standalone 合约部署成功！");
    console.log("📋 合约地址:", address);
    console.log("👤 合约所有者:", await exchangeEx.owner());
    console.log("🔗 区块浏览器:", `https://testnet.blockscout.injective.network/address/${address}`);
    
    // 验证合约
    console.log("\n🔍 开始验证合约...");
    try {
        await hre.run("verify:verify", {
            address: address,
            constructorArguments: [],
        });
        console.log("✅ 合约验证成功！");
    } catch (error) {
        console.log("⚠️  合约验证失败，可能需要手动验证:", error.message);
    }
}

main()
    .then(() => {
        console.log("🎉 部署脚本执行完成！");
        process.exit(0);
    })
    .catch((error) => {
        console.error("❌ 部署失败:", error);
        process.exitCode = 1;
    });
```

#### 部署命令

```bash
# 方式1: 智能部署（自动选择最佳RPC端点，推荐）
npx hardhat run script/deploy-exchange.js

# 方式2: 带重试机制的智能部署
npx hardhat run script/deploy-with-retry.js

# 方式3: 传统部署（使用配置文件中的网络）
npx hardhat run script/deploy-exchange.js --network inj_testnet

# 方式4: WebSocket 端点部署
npx hardhat run script/deploy-exchange.js --network inj_testnet_ws

# 方式5: Blockscout 镜像端点部署
npx hardhat run script/deploy-exchange.js --network inj_testnet_blockscout
```

#### 网络连接问题解决

如果遇到 503 错误或网络连接问题：

```bash
# 1. 测试网络连接（推荐）
npx hardhat run script/test-network-connection.js

# 2. 本地测试合约功能
npx hardhat run script/test-local.js

# 3. 使用智能部署（自动选择最佳RPC端点）
npx hardhat run script/deploy-exchange.js

# 4. 或使用重试机制
npx hardhat run script/deploy-with-retry.js
```

**网络信息**（基于[官方文档](https://docs.injective.network/developers-evm/network-information)）：
- **Chain ID**: `1439`
- **主要 RPC 端点**: `https://k8s.testnet.json-rpc.injective.network/`
- **WebSocket 端点**: `https://k8s.testnet.ws.injective.network/`
- **区块浏览器**: `https://testnet.blockscout.injective.network/`
- **水龙头**: `https://testnet.faucet.injective.network/`

**常见问题**：
- **503 Service Temporarily Unavailable**: Injective 测试网暂时不可用，等待重试
- **Method not found**: RPC 端点不支持某些方法，尝试备用端点
- **连接超时**: 网络不稳定，增加超时时间或稍后重试

#### 环境变量配置

确保 `.env` 文件配置正确：

```env
# 私钥配置（64个十六进制字符，不包含0x前缀）
PRIVATE_KEY=your_private_key_here_without_0x_prefix

# Injective 测试网 RPC URL（基于官方文档）
INJ_TESTNET_RPC_URL=https://k8s.testnet.json-rpc.injective.network/

# 可选：其他 RPC 端点
# INJ_TESTNET_RPC_URL=https://k8s.testnet.ws.injective.network/
# INJ_TESTNET_RPC_URL=https://testnet-injective.cloud.blockscout.com/
```

### 4. 验证合约

#### 创建验证脚本

创建 `script/verify-contract.js` 文件：

```javascript
// script/verify-contract.js
const { ethers } = require("hardhat");

async function main() {
    const contractAddress = process.env.CONTRACT_ADDRESS;
    
    if (!contractAddress) {
        console.error("❌ 请设置环境变量 CONTRACT_ADDRESS");
        console.log("💡 示例: export CONTRACT_ADDRESS=\"0x...\"");
        process.exit(1);
    }
    
    console.log("🔍 开始验证合约...");
    console.log("📋 合约地址:", contractAddress);
    
    try {
        await hre.run("verify:verify", {
            address: contractAddress,
            constructorArguments: [],
        });
        console.log("✅ 合约验证成功！");
    } catch (error) {
        console.error("❌ 合约验证失败:", error.message);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });
```

#### 验证命令

```bash
# 方式1: 使用验证脚本
export CONTRACT_ADDRESS="0x..."  # 替换为实际合约地址
npx hardhat run script/verify-contract.js --network inj_testnet

# 方式2: 直接使用 hardhat verify 命令
npx hardhat verify --network inj_testnet 0x...  # 替换为实际合约地址

# 方式3: 手动验证
# 访问: https://testnet.blockscout.injective.network/address/0x...
```

### 5. 设置权限

#### 创建权限管理脚本

创建 `script/setup-permissions.js` 文件：

```javascript
// script/setup-permissions.js
const { ethers } = require("hardhat");

async function main() {
    const contractAddress = process.env.CONTRACT_ADDRESS;
    const traderAddress = process.env.TRADER_ADDRESS;
    
    if (!contractAddress || !traderAddress) {
        console.error("❌ 请设置环境变量 CONTRACT_ADDRESS 和 TRADER_ADDRESS");
        process.exit(1);
    }
    
    console.log("🔧 开始设置合约权限...");
    console.log("📋 合约地址:", contractAddress);
    console.log("👤 交易者地址:", traderAddress);
    
    // 获取合约实例
    const ExchangeEx = await ethers.getContractFactory("ExchangeEx");
    const exchangeEx = ExchangeEx.attach(contractAddress);
    
    // 获取签名者
    const [signer] = await ethers.getSigners();
    console.log("🔑 当前签名者:", await signer.getAddress());
    
    // 检查合约所有者
    const owner = await exchangeEx.owner();
    console.log("👑 合约所有者:", owner);
    
    if (owner.toLowerCase() !== (await signer.getAddress()).toLowerCase()) {
        console.error("❌ 当前账户不是合约所有者，无法设置权限");
        process.exit(1);
    }
    
    // 授权交易者
    console.log("\n🔐 授权交易者...");
    try {
        const tx = await exchangeEx.authorizeTrader(traderAddress, {
            gasLimit: 200000,
            gasPrice: ethers.parseUnits("30", "gwei")
        });
        await tx.wait();
        console.log("✅ 交易者授权成功！");
        console.log("📝 交易哈希:", tx.hash);
    } catch (error) {
        console.error("❌ 授权失败:", error.message);
        process.exit(1);
    }
    
    // 验证权限
    console.log("\n🔍 验证权限...");
    try {
        const isAuthorized = await exchangeEx.authorizedTraders(traderAddress);
        console.log("✅ 权限验证结果:", isAuthorized ? "已授权" : "未授权");
    } catch (error) {
        console.error("❌ 权限验证失败:", error.message);
    }
}

main()
    .then(() => {
        console.log("🎉 权限设置完成！");
        process.exit(0);
    })
    .catch((error) => {
        console.error("❌ 权限设置失败:", error);
        process.exitCode = 1;
    });
```

#### 权限管理命令

```bash
# 设置环境变量
export CONTRACT_ADDRESS="0x..."  # 替换为实际合约地址
export TRADER_ADDRESS="0x..."   # 替换为交易者地址

# 授权交易者
npx hardhat run script/setup-permissions.js --network inj_testnet

# 交互式验证权限
npx hardhat console --network inj_testnet
> const ExchangeEx = await ethers.getContractFactory('ExchangeEx')
> const exchangeEx = ExchangeEx.attach('CONTRACT_ADDRESS')
> await exchangeEx.authorizedTraders('TRADER_ADDRESS')
```

## 功能详解

### 权限管理

#### 授权交易者
```solidity
function authorizeTrader(address trader) external onlyOwner
```
- **功能**：授权指定地址进行交易操作
- **权限**：仅合约所有者
- **事件**：`TraderAuthorized(address trader)`

#### 撤销交易者权限
```solidity
function revokeTrader(address trader) external onlyOwner
```
- **功能**：撤销指定地址的交易权限
- **权限**：仅合约所有者
- **事件**：`TraderRevoked(address trader)`

### 子账户管理

#### 生成子账户ID
```solidity
function generateSubaccountID(uint32 nonce) public view returns (string memory)
function getDefaultSubaccountID() public view returns (string memory)
function getSubaccountID(uint32 nonce) public view returns (string memory)
```

**使用示例**：
```solidity
// 获取默认子账户ID（nonce = 0）
string memory defaultSubaccount = exchangeEx.getDefaultSubaccountID();

// 获取指定nonce的子账户ID
string memory subaccount1 = exchangeEx.getSubaccountID(1);
string memory subaccount2 = exchangeEx.getSubaccountID(2);
```

**子账户ID格式**：
```
子账户ID = 合约地址 + 12字节的nonce（零填充）
例如：0x1234567890123456789012345678901234567890000000000000000000000001
```

#### 存款和取款
```solidity
function deposit(string calldata subaccountID, string calldata denom, uint256 amount) external onlyAuthorized returns (bool)
function withdraw(string calldata subaccountID, string calldata denom, uint256 amount) external onlyAuthorized returns (bool)
```

**使用示例**：
```solidity
// 存款到默认子账户
string memory subaccountID = exchangeEx.getDefaultSubaccountID();
bool success = exchangeEx.deposit(subaccountID, "USDT", 1000000000); // 1000 USDT

// 从子账户取款
bool success = exchangeEx.withdraw(subaccountID, "USDT", 500000000); // 500 USDT
```

#### 子账户查询
```solidity
function getSubaccountDeposit(string calldata subaccountID, string calldata denom) external view returns (uint256 availableBalance, uint256 totalBalance)
function getSubaccountDeposits(string calldata subaccountID) external view returns (SubaccountDepositData[] memory deposits)
```

**使用示例**：
```solidity
// 查询特定代币余额
(uint256 available, uint256 total) = exchangeEx.getSubaccountDeposit(subaccountID, "USDT");
console.log("可用余额:", available);
console.log("总余额:", total);

// 查询所有存款
SubaccountDepositData[] memory deposits = exchangeEx.getSubaccountDeposits(subaccountID);
for (uint i = 0; i < deposits.length; i++) {
    console.log("代币:", deposits[i].denom);
    console.log("可用余额:", deposits[i].availableBalance);
    console.log("总余额:", deposits[i].totalBalance);
}
```

#### 子账户转账
```solidity
function transferBetweenSubaccounts(string calldata sourceSubaccountID, string calldata destinationSubaccountID, string calldata denom, uint256 amount) external onlyAuthorized returns (bool success)
function transferToExternalSubaccount(string calldata sourceSubaccountID, string calldata destinationSubaccountID, string calldata denom, uint256 amount) external onlyAuthorized returns (bool success)
```

**使用示例**：
```solidity
// 内部子账户转账
string memory sourceSubaccount = exchangeEx.getSubaccountID(1);
string memory destSubaccount = exchangeEx.getSubaccountID(2);
bool success = exchangeEx.transferBetweenSubaccounts(sourceSubaccount, destSubaccount, "USDT", 100000000);

// 向外部子账户转账
string memory externalSubaccount = "0xexternal...";
bool success = exchangeEx.transferToExternalSubaccount(sourceSubaccount, externalSubaccount, "USDT", 100000000);
```

### 现货市场交易

#### 创建现货限价单
```solidity
function createSpotLimitOrder(SpotOrder calldata order) external onlyAuthorized returns (CreateSpotLimitOrderResponse memory response)
function createSpotBuyOrder(string calldata marketID, string calldata subaccountID, uint256 price, uint256 quantity, string calldata cid) external onlyAuthorized returns (CreateSpotLimitOrderResponse memory response)
function createSpotSellOrder(string calldata marketID, string calldata subaccountID, uint256 price, uint256 quantity, string calldata cid) external onlyAuthorized returns (CreateSpotLimitOrderResponse memory response)
```

**使用示例**：
```solidity
// 创建现货买单
string memory subaccountID = exchangeEx.getDefaultSubaccountID();
CreateSpotLimitOrderResponse memory response = exchangeEx.createSpotBuyOrder(
    "INJ/USDT",           // 市场ID
    subaccountID,         // 子账户ID
    10000000000,          // 价格：10 USDT
    100000000,            // 数量：1 INJ
    "buy_order_001"       // 订单CID
);

console.log("订单哈希:", response.orderHash);
console.log("订单CID:", response.cid);

// 创建现货卖单
response = exchangeEx.createSpotSellOrder(
    "INJ/USDT",           // 市场ID
    subaccountID,         // 子账户ID
    11000000000,          // 价格：11 USDT
    50000000,             // 数量：0.5 INJ
    "sell_order_001"      // 订单CID
);
```

#### 创建现货市价单
```solidity
function createSpotMarketOrder(SpotOrder calldata order) external onlyAuthorized returns (CreateSpotMarketOrderResponse memory response)
function createSpotMarketBuyOrder(string calldata marketID, string calldata subaccountID, uint256 quantity, string calldata cid) external onlyAuthorized returns (CreateSpotMarketOrderResponse memory response)
function createSpotMarketSellOrder(string calldata marketID, string calldata subaccountID, uint256 quantity, string calldata cid) external onlyAuthorized returns (CreateSpotMarketOrderResponse memory response)
```

**使用示例**：
```solidity
// 创建市价买单
CreateSpotMarketOrderResponse memory response = exchangeEx.createSpotMarketBuyOrder(
    "INJ/USDT",           // 市场ID
    subaccountID,         // 子账户ID
    10000000,             // 数量：0.1 INJ
    "market_buy_001"      // 订单CID
);

console.log("订单哈希:", response.orderHash);
console.log("实际成交数量:", response.quantity);
console.log("实际成交价格:", response.price);
console.log("手续费:", response.fee);
```

#### 取消现货订单
```solidity
function cancelSpotOrder(string calldata marketID, string calldata subaccountID, string calldata orderHash, string calldata cid) external onlyAuthorized returns (bool success)
```

**使用示例**：
```solidity
// 取消现货订单
bool success = exchangeEx.cancelSpotOrder(
    "INJ/USDT",           // 市场ID
    subaccountID,         // 子账户ID
    "0xabcd1234",         // 订单哈希
    "buy_order_001"       // 订单CID
);

console.log("取消结果:", success ? "成功" : "失败");
```

#### 查询现货订单
```solidity
function getSpotOrders(string calldata marketID, string calldata subaccountID, string[] calldata orderHashes) external view returns (TrimmedSpotLimitOrder[] memory orders)
```

**使用示例**：
```solidity
// 查询现货订单
string[] memory orderHashes = new string[](2);
orderHashes[0] = "0xabcd1234";
orderHashes[1] = "0xefgh5678";

TrimmedSpotLimitOrder[] memory orders = exchangeEx.getSpotOrders(
    "INJ/USDT",
    subaccountID,
    orderHashes
);

for (uint i = 0; i < orders.length; i++) {
    console.log("订单", i + 1, ":");
    console.log("  价格:", orders[i].price);
    console.log("  数量:", orders[i].quantity);
    console.log("  可成交数量:", orders[i].fillable);
    console.log("  是否买单:", orders[i].isBuy);
    console.log("  订单哈希:", orders[i].orderHash);
    console.log("  订单CID:", orders[i].cid);
}
```

### 批量操作

#### 批量创建现货限价单
```solidity
function batchCreateSpotLimitOrders(SpotOrder[] calldata orders) external onlyAuthorized returns (BatchCreateSpotLimitOrdersResponse memory response)
```

**使用示例**：
```solidity
// 批量创建现货订单
SpotOrder[] memory orders = new SpotOrder[](3);

orders[0] = SpotOrder({
    marketID: "INJ/USDT",
    subaccountID: subaccountID,
    feeRecipient: address(this),
    price: 9500000000,    // 9.5 USDT
    quantity: 200000000,  // 2 INJ
    cid: "batch_buy_001",
    orderType: "buy",
    triggerPrice: 0
});

orders[1] = SpotOrder({
    marketID: "INJ/USDT",
    subaccountID: subaccountID,
    feeRecipient: address(this),
    price: 10500000000,   // 10.5 USDT
    quantity: 150000000,  // 1.5 INJ
    cid: "batch_sell_001",
    orderType: "sell",
    triggerPrice: 0
});

orders[2] = SpotOrder({
    marketID: "INJ/USDT",
    subaccountID: subaccountID,
    feeRecipient: address(this),
    price: 9000000000,    // 9 USDT
    quantity: 100000000,  // 1 INJ
    cid: "batch_postonly_001",
    orderType: "buyPostOnly",
    triggerPrice: 0
});

BatchCreateSpotLimitOrdersResponse memory response = exchangeEx.batchCreateSpotLimitOrders(orders);

console.log("成功创建的订单数量:", response.orderHashes.length);
console.log("成功创建的订单CID:", response.createdOrdersCids);
console.log("失败的订单CID:", response.failedOrdersCids);
```

#### 批量取消现货订单
```solidity
function batchCancelSpotOrders(OrderData[] calldata orderData) external onlyAuthorized returns (bool[] memory success)
```

**使用示例**：
```solidity
// 批量取消现货订单
OrderData[] memory orderData = new OrderData[](2);

orderData[0] = OrderData({
    marketID: "INJ/USDT",
    subaccountID: subaccountID,
    orderHash: "0xabcd1234",
    orderMask: 0,
    cid: "batch_buy_001"
});

orderData[1] = OrderData({
    marketID: "INJ/USDT",
    subaccountID: subaccountID,
    orderHash: "0xefgh5678",
    orderMask: 0,
    cid: "batch_sell_001"
});

bool[] memory results = exchangeEx.batchCancelSpotOrders(orderData);

for (uint i = 0; i < results.length; i++) {
    console.log("订单", i + 1, "取消结果:", results[i] ? "成功" : "失败");
}
```

### 衍生品交易

#### 创建衍生品限价单
```solidity
function createDerivativeLimitOrder(DerivativeOrder calldata order) external onlyAuthorized returns (CreateDerivativeLimitOrderResponse memory response)
```

**使用示例**：
```solidity
// 创建衍生品限价单
DerivativeOrder memory order = DerivativeOrder({
    marketID: "INJ/USDT-PERP",
    subaccountID: subaccountID,
    feeRecipient: address(this),
    price: 10000000000,   // 10 USDT
    quantity: 100000000,  // 1 INJ
    cid: "derivative_order_001",
    orderType: "buy",
    margin: 5000000000,   // 5 USDT 保证金
    triggerPrice: 0
});

CreateDerivativeLimitOrderResponse memory response = exchangeEx.createDerivativeLimitOrder(order);

console.log("衍生品订单哈希:", response.orderHash);
console.log("衍生品订单CID:", response.cid);
```

### 查询功能

#### 查询衍生品头寸
```solidity
function subaccountPositions(string calldata subaccountID) external view returns (DerivativePosition[] memory positions)
```

**使用示例**：
```solidity
// 查询衍生品头寸
DerivativePosition[] memory positions = exchangeEx.subaccountPositions(subaccountID);

for (uint i = 0; i < positions.length; i++) {
    console.log("头寸", i + 1, ":");
    console.log("  市场ID:", positions[i].marketID);
    console.log("  是否多头:", positions[i].isLong);
    console.log("  数量:", positions[i].quantity);
    console.log("  入场价格:", positions[i].entryPrice);
    console.log("  保证金:", positions[i].margin);
}
```

#### 批量子账户操作
```solidity
function batchDepositToSubaccounts(uint32[] calldata nonces, string calldata denom, uint256[] calldata amounts) external onlyAuthorized returns (bool[] memory results)
function batchWithdrawFromSubaccounts(uint32[] calldata nonces, string calldata denom, uint256[] calldata amounts) external onlyAuthorized returns (bool[] memory results)
function getAllSubaccountDeposits(uint32[] calldata nonces) external view returns (SubaccountDepositData[][] memory allDeposits)
```

**使用示例**：
```solidity
// 批量存款到多个子账户
uint32[] memory nonces = new uint32[](3);
nonces[0] = 1;
nonces[1] = 2;
nonces[2] = 3;

uint256[] memory amounts = new uint256[](3);
amounts[0] = 100000000; // 100 USDT
amounts[1] = 200000000; // 200 USDT
amounts[2] = 300000000; // 300 USDT

bool[] memory results = exchangeEx.batchDepositToSubaccounts(nonces, "USDT", amounts);

for (uint i = 0; i < results.length; i++) {
    console.log("子账户", nonces[i], "存款:", results[i] ? "成功" : "失败");
}

// 查询多个子账户的存款信息
SubaccountDepositData[][] memory allDeposits = exchangeEx.getAllSubaccountDeposits(nonces);

for (uint i = 0; i < allDeposits.length; i++) {
    console.log("子账户", nonces[i], "存款信息:");
    for (uint j = 0; j < allDeposits[i].length; j++) {
        console.log("  代币:", allDeposits[i][j].denom);
        console.log("  可用余额:", allDeposits[i][j].availableBalance);
        console.log("  总余额:", allDeposits[i][j].totalBalance);
    }
}
```

### 管理功能

#### 查询合约余额
```solidity
function getContractBalance() external view returns (uint256)
```

**使用示例**：
```solidity
// 查询合约ETH余额
uint256 balance = exchangeEx.getContractBalance();
console.log("合约ETH余额:", balance);
```

#### 紧急取款
```solidity
function emergencyWithdraw() external onlyOwner
```

**使用示例**：
```solidity
// 紧急取款（仅所有者）
exchangeEx.emergencyWithdraw();
```

## 实际使用示例

### 完整的交易流程

```solidity
// 1. 获取子账户ID
string memory subaccountID = exchangeEx.getDefaultSubaccountID();

// 2. 存款到子账户
bool depositSuccess = exchangeEx.deposit(subaccountID, "USDT", 1000000000); // 1000 USDT
require(depositSuccess, "Deposit failed");

// 3. 创建现货买单
CreateSpotLimitOrderResponse memory buyResponse = exchangeEx.createSpotBuyOrder(
    "INJ/USDT",
    subaccountID,
    10000000000, // 10 USDT
    100000000,   // 1 INJ
    "buy_order_001"
);

console.log("买单创建成功，订单哈希:", buyResponse.orderHash);

// 4. 查询订单状态
string[] memory orderHashes = new string[](1);
orderHashes[0] = buyResponse.orderHash;

TrimmedSpotLimitOrder[] memory orders = exchangeEx.getSpotOrders(
    "INJ/USDT",
    subaccountID,
    orderHashes
);

if (orders.length > 0) {
    console.log("订单状态:");
    console.log("  价格:", orders[0].price);
    console.log("  数量:", orders[0].quantity);
    console.log("  可成交数量:", orders[0].fillable);
    console.log("  是否买单:", orders[0].isBuy);
}

// 5. 取消订单（如果需要）
bool cancelSuccess = exchangeEx.cancelSpotOrder(
    "INJ/USDT",
    subaccountID,
    buyResponse.orderHash,
    "buy_order_001"
);

console.log("订单取消:", cancelSuccess ? "成功" : "失败");

// 6. 取款
bool withdrawSuccess = exchangeEx.withdraw(subaccountID, "USDT", 500000000); // 500 USDT
require(withdrawSuccess, "Withdraw failed");
```

### 投资组合管理

```solidity
// 创建多个子账户用于不同策略
string memory conservativeSubaccount = exchangeEx.getSubaccountID(10); // 保守策略
string memory aggressiveSubaccount = exchangeEx.getSubaccountID(11);   // 激进策略
string memory balancedSubaccount = exchangeEx.getSubaccountID(12);     // 平衡策略

// 为不同策略分配资金
exchangeEx.deposit(conservativeSubaccount, "USDT", 800000000); // 800 USDT
exchangeEx.deposit(aggressiveSubaccount, "USDT", 200000000);   // 200 USDT
exchangeEx.deposit(balancedSubaccount, "USDT", 500000000);     // 500 USDT

// 保守策略：主要持有稳定币
// 激进策略：创建多个买单
SpotOrder[] memory aggressiveOrders = new SpotOrder[](3);
aggressiveOrders[0] = SpotOrder({
    marketID: "INJ/USDT",
    subaccountID: aggressiveSubaccount,
    feeRecipient: address(this),
    price: 9000000000,    // 9 USDT
    quantity: 50000000,   // 0.5 INJ
    cid: "aggressive_buy_1",
    orderType: "buy",
    triggerPrice: 0
});

aggressiveOrders[1] = SpotOrder({
    marketID: "INJ/USDT",
    subaccountID: aggressiveSubaccount,
    feeRecipient: address(this),
    price: 8500000000,    // 8.5 USDT
    quantity: 50000000,   // 0.5 INJ
    cid: "aggressive_buy_2",
    orderType: "buy",
    triggerPrice: 0
});

aggressiveOrders[2] = SpotOrder({
    marketID: "INJ/USDT",
    subaccountID: aggressiveSubaccount,
    feeRecipient: address(this),
    price: 8000000000,    // 8 USDT
    quantity: 50000000,   // 0.5 INJ
    cid: "aggressive_buy_3",
    orderType: "buy",
    triggerPrice: 0
});

BatchCreateSpotLimitOrdersResponse memory response = exchangeEx.batchCreateSpotLimitOrders(aggressiveOrders);

console.log("激进策略订单创建完成，成功创建:", response.orderHashes.length, "个订单");
```

## 事件监听

合约会发出以下事件，可以用于监控交易状态：

```solidity
// 现货订单事件
event SpotOrderCreated(string marketID, string orderHash, string cid, string orderType);
event SpotOrderCancelled(string marketID, string orderHash, bool success);

// 衍生品订单事件
event DerivativeOrderCreated(string marketID, string orderHash, string cid);

// 权限管理事件
event TraderAuthorized(address trader);
event TraderRevoked(address trader);
```

### 监听事件示例

#### 创建事件监听脚本

创建 `script/monitor-events.js` 文件：

```javascript
// script/monitor-events.js
const { ethers } = require("hardhat");

async function main() {
    const contractAddress = process.env.CONTRACT_ADDRESS;
    
    if (!contractAddress) {
        console.error("❌ 请设置环境变量 CONTRACT_ADDRESS");
        process.exit(1);
    }
    
    console.log("👂 开始监听合约事件...");
    console.log("📋 合约地址:", contractAddress);
    
    // 获取合约实例
    const ExchangeEx = await ethers.getContractFactory("ExchangeEx");
    const exchangeEx = ExchangeEx.attach(contractAddress);
    
    // 获取当前区块
    const currentBlock = await ethers.provider.getBlockNumber();
    console.log("📦 当前区块:", currentBlock);
    
    // 监听现货订单创建事件
    console.log("\n📊 现货订单创建事件:");
    try {
        const spotOrderEvents = await exchangeEx.queryFilter("SpotOrderCreated", currentBlock - 1000, currentBlock);
        spotOrderEvents.forEach((event, index) => {
            console.log(`  事件 ${index + 1}:`);
            console.log(`    市场ID: ${event.args.marketID}`);
            console.log(`    订单哈希: ${event.args.orderHash}`);
            console.log(`    订单CID: ${event.args.cid}`);
            console.log(`    订单类型: ${event.args.orderType}`);
            console.log(`    区块: ${event.blockNumber}`);
            console.log(`    交易哈希: ${event.transactionHash}`);
            console.log("");
        });
    } catch (error) {
        console.log("  暂无现货订单创建事件");
    }
    
    // 监听权限变更事件
    console.log("🔐 权限变更事件:");
    try {
        const authEvents = await exchangeEx.queryFilter("TraderAuthorized", currentBlock - 1000, currentBlock);
        authEvents.forEach((event, index) => {
            console.log(`  事件 ${index + 1}:`);
            console.log(`    交易者地址: ${event.args.trader}`);
            console.log(`    区块: ${event.blockNumber}`);
            console.log(`    交易哈希: ${event.transactionHash}`);
            console.log("");
        });
        
        const revokeEvents = await exchangeEx.queryFilter("TraderRevoked", currentBlock - 1000, currentBlock);
        revokeEvents.forEach((event, index) => {
            console.log(`  撤销事件 ${index + 1}:`);
            console.log(`    交易者地址: ${event.args.trader}`);
            console.log(`    区块: ${event.blockNumber}`);
            console.log(`    交易哈希: ${event.transactionHash}`);
            console.log("");
        });
    } catch (error) {
        console.log("  暂无权限变更事件");
    }
    
    // 监听衍生品订单事件
    console.log("📈 衍生品订单事件:");
    try {
        const derivativeEvents = await exchangeEx.queryFilter("DerivativeOrderCreated", currentBlock - 1000, currentBlock);
        derivativeEvents.forEach((event, index) => {
            console.log(`  事件 ${index + 1}:`);
            console.log(`    市场ID: ${event.args.marketID}`);
            console.log(`    订单哈希: ${event.args.orderHash}`);
            console.log(`    订单CID: ${event.args.cid}`);
            console.log(`    区块: ${event.blockNumber}`);
            console.log(`    交易哈希: ${event.transactionHash}`);
            console.log("");
        });
    } catch (error) {
        console.log("  暂无衍生品订单事件");
    }
}

main()
    .then(() => {
        console.log("🎉 事件监听完成！");
        process.exit(0);
    })
    .catch((error) => {
        console.error("❌ 事件监听失败:", error);
        process.exitCode = 1;
    });
```

#### 事件监听命令

```bash
# 设置环境变量
export CONTRACT_ADDRESS="0x..."  # 替换为实际合约地址

# 监听事件
npx hardhat run script/monitor-events.js --network inj_testnet

# 交互式监听事件
npx hardhat console --network inj_testnet
> const ExchangeEx = await ethers.getContractFactory('ExchangeEx')
> const exchangeEx = ExchangeEx.attach('CONTRACT_ADDRESS')
> const events = await exchangeEx.queryFilter('SpotOrderCreated', fromBlock, toBlock)
> events.forEach(e => console.log(e.args))
```

## 安全注意事项

### 1. 权限管理
- 部署后立即设置权限控制
- 定期审查授权用户列表
- 使用多签钱包管理所有者权限
- 及时撤销不再需要的权限

### 2. 资金安全
- 在测试网上充分测试
- 设置合理的交易限额
- 监控合约余额和交易活动
- 定期检查子账户余额

### 3. 错误处理
- 所有交易操作都有完整的错误处理
- 使用 try-catch 模式处理异常
- 记录详细的错误信息
- 监控交易失败情况

### 4. Gas 优化
- 使用批量操作减少 gas 消耗
- 合理设置订单数量
- 避免频繁的小额交易
- 优化合约调用频率

## 故障排除

### 常见问题

1. **"Not authorized trader"**
   - 解决方案：确保交易者已被授权
   - 检查：`cast call <CONTRACT_ADDRESS> "authorizedTraders(address)" <ADDRESS>`

2. **"Only owner can call this function"**
   - 解决方案：只有合约所有者可以执行此操作
   - 检查：`cast call <CONTRACT_ADDRESS> "owner()"`

3. **订单创建失败**
   - 检查市场ID是否正确
   - 确认子账户有足够余额
   - 验证价格和数量格式
   - 检查代币精度设置

4. **子账户操作失败**
   - 验证子账户ID格式
   - 确认子账户存在
   - 检查余额是否充足
   - 验证权限设置

### 调试技巧

```bash
# 启动 Hardhat 控制台
npx hardhat console --network inj_testnet

# 查看合约状态
> const ExchangeEx = await ethers.getContractFactory('ExchangeEx')
> const exchangeEx = ExchangeEx.attach('CONTRACT_ADDRESS')
> await exchangeEx.owner()
> await exchangeEx.authorizedTraders('ADDRESS')

# 查看子账户ID
> await exchangeEx.getDefaultSubaccountID()
> await exchangeEx.getSubaccountID(1)

# 查看交易详情
> const tx = await ethers.provider.getTransaction('TX_HASH')
> console.log(tx)

# 查看事件日志
> const logs = await exchangeEx.queryFilter('TraderAuthorized', fromBlock, toBlock)
> logs.forEach(log => console.log(log.args))
```

#### 创建调试脚本

创建 `script/debug.js` 文件：

```javascript
// script/debug.js
const { ethers } = require("hardhat");

async function main() {
    const contractAddress = process.env.CONTRACT_ADDRESS;
    
    if (!contractAddress) {
        console.error("❌ 请设置环境变量 CONTRACT_ADDRESS");
        process.exit(1);
    }
    
    console.log("🔍 开始调试合约...");
    console.log("📋 合约地址:", contractAddress);
    
    // 获取合约实例
    const ExchangeEx = await ethers.getContractFactory("ExchangeEx");
    const exchangeEx = ExchangeEx.attach(contractAddress);
    
    // 获取签名者
    const [signer] = await ethers.getSigners();
    console.log("🔑 当前签名者:", await signer.getAddress());
    
    // 检查合约状态
    console.log("\n📊 合约状态:");
    try {
        const owner = await exchangeEx.owner();
        console.log("👑 合约所有者:", owner);
        
        const isOwner = owner.toLowerCase() === (await signer.getAddress()).toLowerCase();
        console.log("🔐 当前账户是否为所有者:", isOwner);
        
        // 获取默认子账户ID
        const defaultSubaccountID = await exchangeEx.getDefaultSubaccountID();
        console.log("📝 默认子账户ID:", defaultSubaccountID);
        
        // 检查合约余额
        const balance = await ethers.provider.getBalance(contractAddress);
        console.log("💰 合约ETH余额:", ethers.formatEther(balance), "ETH");
        
    } catch (error) {
        console.error("❌ 状态查询失败:", error.message);
    }
    
    // 检查权限
    console.log("\n🔐 权限检查:");
    try {
        const isAuthorized = await exchangeEx.authorizedTraders(await signer.getAddress());
        console.log("👤 当前账户是否已授权:", isAuthorized);
    } catch (error) {
        console.error("❌ 权限检查失败:", error.message);
    }
}

main()
    .then(() => {
        console.log("🎉 调试完成！");
        process.exit(0);
    })
    .catch((error) => {
        console.error("❌ 调试失败:", error);
        process.exitCode = 1;
    });
```

#### 调试命令

```bash
# 设置环境变量
export CONTRACT_ADDRESS="0x..."  # 替换为实际合约地址

# 运行调试脚本
npx hardhat run script/debug.js --network inj_testnet

# 交互式调试
npx hardhat console --network inj_testnet
```

## 性能优化

### 批量操作
- 使用批量创建订单减少 gas 消耗
- 批量取消订单提高效率
- 合理设置批量大小（建议不超过10个）

### 订单管理
- 定期清理过期订单
- 使用有意义的 CID 便于管理
- 监控订单状态变化
- 避免创建过多未成交订单

### Gas 优化
- 使用批量操作
- 合理设置订单数量
- 避免频繁的小额交易
- 优化合约调用频率

## 总结

`ExchangeEx_Standalone.sol` 是一个功能完整、独立可用的 Injective 交易合约。通过本说明文档，您可以：

1. **快速部署**：直接复制文件即可使用
2. **完整功能**：支持现货和衍生品交易
3. **安全可靠**：包含完整的权限控制和错误处理
4. **易于使用**：提供简化的接口和批量操作
5. **灵活扩展**：可以根据需要添加更多功能

记住要在测试网上充分测试所有功能，确保安全性和稳定性后再部署到主网。 