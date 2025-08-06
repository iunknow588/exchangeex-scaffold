// script/deploy-exchange.js
const { ethers } = require("hardhat");
const { getBestRpcEndpoint, createProvider } = require("./network-utils");

async function main() {
    console.log("🚀 开始部署 ExchangeEx_Standalone 合约...");
    
    // 获取最佳 RPC 端点
    console.log("🌐 正在寻找可用的 RPC 端点...");
    const bestRpcUrl = await getBestRpcEndpoint();
    
    if (!bestRpcUrl) {
        console.error("❌ 没有找到可用的 RPC 端点，无法部署合约");
        console.log("💡 建议稍后重试或使用本地网络测试");
        process.exit(1);
    }
    
    console.log(`\n🔗 使用 RPC 端点: ${bestRpcUrl}`);
    
    // 创建自定义提供者
    const customProvider = createProvider(bestRpcUrl);
    
    // 获取签名者
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
        console.error("❌ 请设置环境变量 PRIVATE_KEY");
        process.exit(1);
    }
    
    const wallet = new ethers.Wallet(privateKey, customProvider);
    console.log("🔑 签名者地址:", await wallet.getAddress());
    
    // 检查账户余额
    const balance = await customProvider.getBalance(wallet.getAddress());
    console.log("💰 账户余额:", ethers.formatEther(balance), "ETH");
    
    if (balance === 0n) {
        console.error("❌ 账户余额为0，无法支付部署费用");
        console.log("💡 请从水龙头获取测试网代币: https://testnet.faucet.injective.network/");
        process.exit(1);
    }
    
    // 获取合约工厂
    console.log("📦 获取合约工厂...");
    const ExchangeEx = await ethers.getContractFactory("ExchangeEx", wallet);
    
    // 部署合约
    console.log("🚀 正在部署合约...");
    const exchangeEx = await ExchangeEx.deploy({
        gasPrice: 30e9,  // 30 Gwei
        gasLimit: 5e6,   // 5M gas limit (合约较大，需要更多 gas)
    });
    
    // 等待部署完成
    console.log("⏳ 等待部署确认...");
    await exchangeEx.waitForDeployment();
    const address = await exchangeEx.getAddress();
    
    console.log("✅ ExchangeEx_Standalone 合约部署成功！");
    console.log("📋 合约地址:", address);
    console.log("👤 合约所有者:", await exchangeEx.owner());
    console.log("🔗 区块浏览器:", `https://testnet.blockscout.injective.network/address/${address}`);
    
    // 显示验证信息
    console.log("\n🔍 合约验证信息:");
    console.log("📝 验证命令: npx hardhat verify --network inj_testnet " + address);
    console.log("🔗 手动验证链接:", `https://testnet.blockscout.injective.network/address/${address}`);
    
    // 保存部署信息
    console.log("\n📝 部署信息:");
    console.log("  合约地址:", address);
    console.log("  部署者:", await exchangeEx.owner());
    console.log("  网络:", "Injective Testnet");
    console.log("  RPC 端点:", bestRpcUrl);
    console.log("  区块浏览器:", `https://testnet.blockscout.injective.network/address/${address}`);
    
    // 建议下一步操作
    console.log("\n🎯 下一步操作:");
    console.log("  1. 设置环境变量: export CONTRACT_ADDRESS=\"" + address + "\"");
    console.log("  2. 验证合约: npx hardhat run script/verify-contract.js --network inj_testnet");
    console.log("  3. 授权交易者: npx hardhat run script/setup-permissions.js --network inj_testnet");
    console.log("  4. 调试合约: npx hardhat run script/debug.js --network inj_testnet");
    console.log("  5. 监听事件: npx hardhat run script/monitor-events.js --network inj_testnet");
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