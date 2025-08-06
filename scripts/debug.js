// script/debug.js
const { ethers } = require("hardhat");

async function main() {
    const contractAddress = process.env.CONTRACT_ADDRESS;
    
    if (!contractAddress) {
        console.error("❌ 请设置环境变量 CONTRACT_ADDRESS");
        console.log("💡 示例: export CONTRACT_ADDRESS=\"0x...\"");
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
        console.log("🔐 当前账户是否为所有者:", isOwner ? "是" : "否");
        
        // 获取默认子账户ID
        const defaultSubaccountID = await exchangeEx.getDefaultSubaccountID();
        console.log("📝 默认子账户ID:", defaultSubaccountID);
        
        // 检查合约余额
        const balance = await ethers.provider.getBalance(contractAddress);
        console.log("💰 合约ETH余额:", ethers.formatEther(balance), "ETH");
        
        // 检查签名者权限
        const isAuthorized = await exchangeEx.authorizedTraders(await signer.getAddress());
        console.log("👤 当前账户是否已授权:", isAuthorized ? "是" : "否");
        
    } catch (error) {
        console.error("❌ 状态查询失败:", error.message);
    }
    
    // 检查网络信息
    console.log("\n🌐 网络信息:");
    try {
        const network = await ethers.provider.getNetwork();
        console.log("🔗 网络名称:", network.name);
        console.log("🆔 链ID:", network.chainId);
        
        const blockNumber = await ethers.provider.getBlockNumber();
        console.log("📦 当前区块:", blockNumber);
        
        const gasPrice = await ethers.provider.getGasPrice();
        console.log("⛽ 当前Gas价格:", ethers.formatUnits(gasPrice, "gwei"), "Gwei");
        
    } catch (error) {
        console.error("❌ 网络信息查询失败:", error.message);
    }
    
    // 检查账户余额
    console.log("\n💳 账户信息:");
    try {
        const signerAddress = await signer.getAddress();
        const accountBalance = await ethers.provider.getBalance(signerAddress);
        console.log("👤 账户地址:", signerAddress);
        console.log("💰 账户余额:", ethers.formatEther(accountBalance), "ETH");
        
        // 检查交易次数
        const txCount = await ethers.provider.getTransactionCount(signerAddress);
        console.log("📊 交易次数:", txCount);
        
    } catch (error) {
        console.error("❌ 账户信息查询失败:", error.message);
    }
    
    // 测试基本功能
    console.log("\n🧪 功能测试:");
    try {
        // 测试子账户ID生成
        const subaccount1 = await exchangeEx.getSubaccountID(1);
        const subaccount2 = await exchangeEx.getSubaccountID(2);
        console.log("📝 子账户1 ID:", subaccount1);
        console.log("📝 子账户2 ID:", subaccount2);
        
        // 测试合约余额查询
        const contractBalance = await exchangeEx.getContractBalance();
        console.log("💰 合约内部余额查询:", ethers.formatEther(contractBalance), "ETH");
        
    } catch (error) {
        console.error("❌ 功能测试失败:", error.message);
    }
    
    // 显示合约链接
    console.log("\n🔗 相关链接:");
    console.log("📋 合约地址:", contractAddress);
    console.log("🔍 区块浏览器:", `https://testnet.blockscout.injective.network/address/${contractAddress}`);
    console.log("📊 交易历史:", `https://testnet.blockscout.injective.network/address/${contractAddress}/transactions`);
    
    // 显示下一步操作
    console.log("\n🎯 下一步操作:");
    console.log("  1. 交互式调试: npx hardhat console --network inj_testnet");
    console.log("  2. 监听事件: npx hardhat run script/monitor-events.js --network inj_testnet");
    console.log("  3. 设置权限: npx hardhat run script/setup-permissions.js --network inj_testnet");
    console.log("  4. 查看合约源码: https://testnet.blockscout.injective.network/address/" + contractAddress);
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