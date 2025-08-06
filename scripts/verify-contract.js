// script/verify-contract.js
const { ethers } = require("hardhat");

async function main() {
    const contractAddress = process.env.CONTRACT_ADDRESS;
    
    if (!contractAddress) {
        console.error("❌ 请设置环境变量 CONTRACT_ADDRESS");
        console.log("💡 示例: export CONTRACT_ADDRESS=\"0x...\"");
        console.log("💡 或者: npx hardhat verify --network inj_testnet 0x...");
        process.exit(1);
    }
    
    console.log("🔍 开始验证合约...");
    console.log("📋 合约地址:", contractAddress);
    
    try {
        // 验证合约
        await hre.run("verify:verify", {
            address: contractAddress,
            constructorArguments: [],
        });
        
        console.log("✅ 合约验证成功！");
        console.log("🔗 合约链接:", `https://testnet.blockscout.injective.network/address/${contractAddress}`);
        
    } catch (error) {
        console.error("❌ 合约验证失败:", error.message);
        console.log("\n💡 可能的解决方案:");
        console.log("  1. 确认合约地址正确");
        console.log("  2. 确认合约已部署到指定网络");
        console.log("  3. 检查网络连接");
        console.log("  4. 尝试手动验证:", `https://testnet.blockscout.injective.network/address/${contractAddress}`);
        
        // 如果是已知的验证错误，提供更具体的帮助
        if (error.message.includes("Already Verified")) {
            console.log("✅ 合约已经验证过了");
        } else if (error.message.includes("Invalid address")) {
            console.log("❌ 合约地址格式错误，请检查地址");
        } else if (error.message.includes("Contract not found")) {
            console.log("❌ 合约未找到，请确认已正确部署");
        }
    }
}

main()
    .then(() => {
        console.log("🎉 验证脚本执行完成！");
        process.exit(0);
    })
    .catch((error) => {
        console.error("❌ 验证失败:", error);
        process.exitCode = 1;
    }); 