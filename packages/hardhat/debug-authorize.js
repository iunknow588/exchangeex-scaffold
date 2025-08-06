const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 调试授权交易员功能...");
  
  // 获取合约实例
  const contractAddress = "0x178Fc07106BAda5d423003d62e8aABb0850e1713";
  const ExchangeEx = await ethers.getContractFactory("ExchangeEx");
  const exchangeEx = ExchangeEx.attach(contractAddress);
  
  // 获取部署者账户
  const [deployer] = await ethers.getSigners();
  console.log("👤 部署者地址:", deployer.address);
  
  // 测试授权地址
  const testTraderAddress = "0x1234567890123456789012345678901234567890";
  
  console.log("\n📋 当前状态:");
  
  // 检查合约所有者
  try {
    const owner = await exchangeEx.owner();
    console.log(`   合约所有者: ${owner}`);
    console.log(`   调用者是否为所有者: ${owner === deployer.address}`);
  } catch (error) {
    console.log(`   ❌ 查询所有者失败: ${error.message}`);
  }
  
  // 检查当前授权状态
  try {
    const currentAuth = await exchangeEx.authorizedTraders(testTraderAddress);
    console.log(`   测试地址当前授权状态: ${currentAuth}`);
  } catch (error) {
    console.log(`   ❌ 查询授权状态失败: ${error.message}`);
  }
  
  // 检查部署者授权状态
  try {
    const deployerAuth = await exchangeEx.authorizedTraders(deployer.address);
    console.log(`   部署者授权状态: ${deployerAuth}`);
  } catch (error) {
    console.log(`   ❌ 查询部署者授权状态失败: ${error.message}`);
  }
  
  console.log("\n🔧 尝试授权交易员...");
  
  try {
    // 尝试授权
    console.log(`   正在授权地址: ${testTraderAddress}`);
    const tx = await exchangeEx.authorizeTrader(testTraderAddress);
    console.log(`   交易哈希: ${tx.hash}`);
    console.log("   等待交易确认...");
    
    const receipt = await tx.wait();
    console.log(`   ✅ 交易成功! 区块: ${receipt.blockNumber}`);
    
    // 验证授权结果
    const newAuth = await exchangeEx.authorizedTraders(testTraderAddress);
    console.log(`   授权后状态: ${newAuth}`);
    
  } catch (error) {
    console.log(`   ❌ 授权失败: ${error.message}`);
    
    // 分析错误原因
    if (error.message.includes("Ownable")) {
      console.log("   💡 错误原因: 调用者不是合约所有者");
    } else if (error.message.includes("already authorized")) {
      console.log("   💡 错误原因: 地址已经被授权");
    } else if (error.message.includes("gas")) {
      console.log("   💡 错误原因: Gas 不足或 Gas 限制过低");
    } else if (error.message.includes("mempool")) {
      console.log("   💡 错误原因: 网络拥堵，mempool 已满");
    } else {
      console.log("   💡 其他错误，请检查网络连接和合约状态");
    }
  }
  
  console.log("\n💡 解决方案:");
  console.log("   1. 确保使用部署者钱包进行操作");
  console.log("   2. 检查钱包余额是否足够支付 Gas 费用");
  console.log("   3. 如果网络拥堵，可以稍后重试");
  console.log("   4. 确保前端连接的是正确的网络 (Injective Testnet)");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 