// script/setup-permissions.js
const { ethers } = require("hardhat");

async function main() {
    const contractAddress = process.env.CONTRACT_ADDRESS;
    const traderAddress = process.env.TRADER_ADDRESS;
    
    if (!contractAddress) {
        console.error("❌ 请设置环境变量 CONTRACT_ADDRESS");
        console.log("💡 示例: export CONTRACT_ADDRESS=\"0x...\"");
        process.exit(1);
    }
    
    if (!traderAddress) {
        console.error("❌ 请设置环境变量 TRADER_ADDRESS");
        console.log("💡 示例: export TRADER_ADDRESS=\"0x...\"");
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
        console.log("💡 请使用合约所有者账户进行操作");
        process.exit(1);
    }
    
    // 检查当前权限状态
    console.log("\n🔍 检查当前权限状态...");
    try {
        const isAuthorized = await exchangeEx.authorizedTraders(traderAddress);
        console.log("👤 交易者当前权限:", isAuthorized ? "已授权" : "未授权");
        
        if (isAuthorized) {
            console.log("⚠️  交易者已经授权，是否要撤销权限？");
            console.log("💡 如需撤销权限，请使用交互式控制台调用 revokeTrader 函数");
            return;
        }
    } catch (error) {
        console.error("❌ 权限检查失败:", error.message);
        process.exit(1);
    }
    
    // 授权交易者
    console.log("\n🔐 授权交易者...");
    try {
        const tx = await exchangeEx.authorizeTrader(traderAddress, {
            gasLimit: 200000,
            gasPrice: ethers.parseUnits("30", "gwei")
        });
        console.log("⏳ 等待交易确认...");
        await tx.wait();
        console.log("✅ 交易者授权成功！");
        console.log("📝 交易哈希:", tx.hash);
        console.log("🔗 交易详情:", `https://testnet.blockscout.injective.network/tx/${tx.hash}`);
    } catch (error) {
        console.error("❌ 授权失败:", error.message);
        process.exit(1);
    }
    
    // 验证权限
    console.log("\n🔍 验证权限...");
    try {
        const isAuthorized = await exchangeEx.authorizedTraders(traderAddress);
        console.log("✅ 权限验证结果:", isAuthorized ? "已授权" : "未授权");
        
        if (isAuthorized) {
            console.log("🎉 权限设置完成！交易者现在可以执行交易操作。");
        } else {
            console.log("❌ 权限设置失败，请检查交易详情。");
        }
    } catch (error) {
        console.error("❌ 权限验证失败:", error.message);
    }
    
    // 显示下一步操作
    console.log("\n🎯 下一步操作:");
    console.log("  1. 测试交易功能: npx hardhat console --network inj_testnet");
    console.log("  2. 监听权限事件: npx hardhat run script/monitor-events.js --network inj_testnet");
    console.log("  3. 调试合约状态: npx hardhat run script/debug.js --network inj_testnet");
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