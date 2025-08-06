// script/monitor-events.js
const { ethers } = require("hardhat");

async function main() {
    const contractAddress = process.env.CONTRACT_ADDRESS;
    
    if (!contractAddress) {
        console.error("❌ 请设置环境变量 CONTRACT_ADDRESS");
        console.log("💡 示例: export CONTRACT_ADDRESS=\"0x...\"");
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
    
    // 设置查询范围（最近1000个区块）
    const fromBlock = Math.max(0, currentBlock - 1000);
    const toBlock = currentBlock;
    console.log("🔍 查询范围: 区块", fromBlock, "到", toBlock);
    
    // 监听现货订单创建事件
    console.log("\n📊 现货订单创建事件:");
    try {
        const spotOrderEvents = await exchangeEx.queryFilter("SpotOrderCreated", fromBlock, toBlock);
        if (spotOrderEvents.length > 0) {
            spotOrderEvents.forEach((event, index) => {
                console.log(`  事件 ${index + 1}:`);
                console.log(`    市场ID: ${event.args.marketID}`);
                console.log(`    订单哈希: ${event.args.orderHash}`);
                console.log(`    订单CID: ${event.args.cid}`);
                console.log(`    订单类型: ${event.args.orderType}`);
                console.log(`    区块: ${event.blockNumber}`);
                console.log(`    交易哈希: ${event.transactionHash}`);
                console.log(`    交易链接: https://testnet.blockscout.injective.network/tx/${event.transactionHash}`);
                console.log("");
            });
        } else {
            console.log("  暂无现货订单创建事件");
        }
    } catch (error) {
        console.log("  现货订单事件查询失败:", error.message);
    }
    
    // 监听权限变更事件
    console.log("🔐 权限变更事件:");
    try {
        const authEvents = await exchangeEx.queryFilter("TraderAuthorized", fromBlock, toBlock);
        if (authEvents.length > 0) {
            authEvents.forEach((event, index) => {
                console.log(`  授权事件 ${index + 1}:`);
                console.log(`    交易者地址: ${event.args.trader}`);
                console.log(`    区块: ${event.blockNumber}`);
                console.log(`    交易哈希: ${event.transactionHash}`);
                console.log(`    交易链接: https://testnet.blockscout.injective.network/tx/${event.transactionHash}`);
                console.log("");
            });
        } else {
            console.log("  暂无授权事件");
        }
        
        const revokeEvents = await exchangeEx.queryFilter("TraderRevoked", fromBlock, toBlock);
        if (revokeEvents.length > 0) {
            revokeEvents.forEach((event, index) => {
                console.log(`  撤销事件 ${index + 1}:`);
                console.log(`    交易者地址: ${event.args.trader}`);
                console.log(`    区块: ${event.blockNumber}`);
                console.log(`    交易哈希: ${event.transactionHash}`);
                console.log(`    交易链接: https://testnet.blockscout.injective.network/tx/${event.transactionHash}`);
                console.log("");
            });
        } else {
            console.log("  暂无撤销事件");
        }
    } catch (error) {
        console.log("  权限事件查询失败:", error.message);
    }
    
    // 监听衍生品订单事件
    console.log("📈 衍生品订单事件:");
    try {
        const derivativeEvents = await exchangeEx.queryFilter("DerivativeOrderCreated", fromBlock, toBlock);
        if (derivativeEvents.length > 0) {
            derivativeEvents.forEach((event, index) => {
                console.log(`  事件 ${index + 1}:`);
                console.log(`    市场ID: ${event.args.marketID}`);
                console.log(`    订单哈希: ${event.args.orderHash}`);
                console.log(`    订单CID: ${event.args.cid}`);
                console.log(`    区块: ${event.blockNumber}`);
                console.log(`    交易哈希: ${event.transactionHash}`);
                console.log(`    交易链接: https://testnet.blockscout.injective.network/tx/${event.transactionHash}`);
                console.log("");
            });
        } else {
            console.log("  暂无衍生品订单事件");
        }
    } catch (error) {
        console.log("  衍生品订单事件查询失败:", error.message);
    }
    
    // 监听订单取消事件
    console.log("❌ 订单取消事件:");
    try {
        const cancelEvents = await exchangeEx.queryFilter("SpotOrderCancelled", fromBlock, toBlock);
        if (cancelEvents.length > 0) {
            cancelEvents.forEach((event, index) => {
                console.log(`  事件 ${index + 1}:`);
                console.log(`    市场ID: ${event.args.marketID}`);
                console.log(`    订单哈希: ${event.args.orderHash}`);
                console.log(`    取消结果: ${event.args.success ? "成功" : "失败"}`);
                console.log(`    区块: ${event.blockNumber}`);
                console.log(`    交易哈希: ${event.transactionHash}`);
                console.log(`    交易链接: https://testnet.blockscout.injective.network/tx/${event.transactionHash}`);
                console.log("");
            });
        } else {
            console.log("  暂无订单取消事件");
        }
    } catch (error) {
        console.log("  订单取消事件查询失败:", error.message);
    }
    
    // 统计信息
    console.log("📊 事件统计:");
    console.log("  查询区块范围:", fromBlock, "-", toBlock);
    console.log("  总区块数:", toBlock - fromBlock + 1);
    
    // 显示相关链接
    console.log("\n🔗 相关链接:");
    console.log("📋 合约地址:", contractAddress);
    console.log("🔍 合约详情:", `https://testnet.blockscout.injective.network/address/${contractAddress}`);
    console.log("📊 交易历史:", `https://testnet.blockscout.injective.network/address/${contractAddress}/transactions`);
    console.log("📈 事件日志:", `https://testnet.blockscout.injective.network/address/${contractAddress}/logs`);
    
    // 显示下一步操作
    console.log("\n🎯 下一步操作:");
    console.log("  1. 实时监听: 使用交互式控制台持续监听事件");
    console.log("  2. 调试合约: npx hardhat run script/debug.js --network inj_testnet");
    console.log("  3. 设置权限: npx hardhat run script/setup-permissions.js --network inj_testnet");
    console.log("  4. 交互式操作: npx hardhat console --network inj_testnet");
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