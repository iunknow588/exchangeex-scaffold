const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 测试前端合约连接...");
  
  // 模拟前端的合约调用
  const contractAddress = "0x178Fc07106BAda5d423003d62e8aABb0850e1713";
  const ExchangeEx = await ethers.getContractFactory("ExchangeEx");
  const exchangeEx = ExchangeEx.attach(contractAddress);
  
  // 测试地址
  const testAddress = "0xd95C2810cfb43BdE49FDa151b17E732089DB75D7";
  
  console.log("📋 模拟前端调用:");
  console.log(`   合约地址: ${contractAddress}`);
  console.log(`   查询地址: ${testAddress}`);
  
  try {
    // 模拟前端的 authorizedTraders 调用
    console.log("\n🔐 模拟前端授权状态查询:");
    
    const result = await exchangeEx.authorizedTraders(testAddress);
    console.log(`   查询结果: ${result}`);
    console.log(`   结果类型: ${typeof result}`);
    console.log(`   布尔转换: ${Boolean(result)}`);
    
    // 模拟前端的 getDefaultSubaccountID 调用
    console.log("\n📝 模拟前端子账户ID查询:");
    
    const subaccountID = await exchangeEx.getDefaultSubaccountID();
    console.log(`   子账户ID: ${subaccountID}`);
    
    // 模拟前端的 owner 调用
    console.log("\n👑 模拟前端所有者查询:");
    
    const owner = await exchangeEx.owner();
    console.log(`   合约所有者: ${owner}`);
    
    console.log("\n✅ 前端合约调用测试完成!");
    
    // 提供解决方案
    console.log("\n💡 如果前端显示'未授权'，请尝试:");
    console.log("   1. 点击页面上的'刷新授权状态'按钮");
    console.log("   2. 刷新浏览器页面");
    console.log("   3. 检查浏览器控制台是否有错误");
    console.log("   4. 确保 MetaMask 连接到正确的网络");
    
  } catch (error) {
    console.error(`❌ 测试失败: ${error.message}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 