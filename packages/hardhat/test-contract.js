const { ethers } = require("hardhat");

async function main() {
  console.log("🧪 开始测试 ExchangeEx 合约...");
  
  // 获取合约实例
  const contractAddress = "0x178Fc07106BAda5d423003d62e8aABb0850e1713";
  const ExchangeEx = await ethers.getContractFactory("ExchangeEx");
  const exchangeEx = ExchangeEx.attach(contractAddress);
  
  // 获取部署者账户
  const [deployer] = await ethers.getSigners();
  console.log("👤 测试账户:", deployer.address);
  
  try {
    // 1. 测试基本信息
    console.log("\n📋 1. 测试基本信息:");
    const owner = await exchangeEx.owner();
    console.log("   合约所有者:", owner);
    
    const defaultSubaccountID = await exchangeEx.getDefaultSubaccountID();
    console.log("   默认子账户ID:", defaultSubaccountID);
    
    // 2. 测试授权状态
    console.log("\n🔐 2. 测试授权状态:");
    const isAuthorized = await exchangeEx.authorizedTraders(deployer.address);
    console.log("   部署者是否已授权:", isAuthorized);
    
    // 3. 测试子账户生成
    console.log("\n📝 3. 测试子账户生成:");
    const testNonce = 123;
    const generatedSubaccountID = await exchangeEx.generateSubaccountID(testNonce);
    console.log("   生成的子账户ID:", generatedSubaccountID);
    
    // 4. 测试合约余额
    console.log("\n💰 4. 测试合约余额:");
    const contractBalance = await exchangeEx.getContractBalance();
    console.log("   合约余额:", ethers.formatEther(contractBalance), "ETH");
    
    // 5. 测试授权新交易员
    console.log("\n👥 5. 测试授权新交易员:");
    const testTraderAddress = "0x1234567890123456789012345678901234567890";
    const authTx = await exchangeEx.authorizeTrader(testTraderAddress);
    console.log("   授权交易哈希:", authTx.hash);
    await authTx.wait();
    console.log("   授权交易已确认");
    
    const newTraderAuthorized = await exchangeEx.authorizedTraders(testTraderAddress);
    console.log("   新交易员授权状态:", newTraderAuthorized);
    
    // 6. 测试撤销授权
    console.log("\n❌ 6. 测试撤销授权:");
    const revokeTx = await exchangeEx.revokeTrader(testTraderAddress);
    console.log("   撤销交易哈希:", revokeTx.hash);
    await revokeTx.wait();
    console.log("   撤销交易已确认");
    
    const revokedStatus = await exchangeEx.authorizedTraders(testTraderAddress);
    console.log("   撤销后授权状态:", revokedStatus);
    
    console.log("\n✅ 所有测试完成！");
    
  } catch (error) {
    console.error("❌ 测试失败:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 