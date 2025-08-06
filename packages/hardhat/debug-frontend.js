const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 调试前端合约调用问题...");
  
  // 获取合约实例
  const contractAddress = "0x178Fc07106BAda5d423003d62e8aABb0850e1713";
  const ExchangeEx = await ethers.getContractFactory("ExchangeEx");
  const exchangeEx = ExchangeEx.attach(contractAddress);
  
  // 测试地址
  const testAddress = "0xd95C2810cfb43BdE49FDa151b17E732089DB75D7";
  
  console.log("📋 测试信息:");
  console.log(`   合约地址: ${contractAddress}`);
  console.log(`   测试地址: ${testAddress}`);
  
  try {
    // 1. 测试基本合约调用
    console.log("\n🔧 1. 测试基本合约调用:");
    
    const owner = await exchangeEx.owner();
    console.log(`   合约所有者: ${owner}`);
    
    const defaultSubaccountID = await exchangeEx.getDefaultSubaccountID();
    console.log(`   默认子账户ID: ${defaultSubaccountID}`);
    
    // 2. 测试授权状态查询
    console.log("\n🔐 2. 测试授权状态查询:");
    
    const authorizedStatus = await exchangeEx.authorizedTraders(testAddress);
    console.log(`   授权状态: ${authorizedStatus}`);
    console.log(`   授权状态类型: ${typeof authorizedStatus}`);
    
    // 3. 测试不同的地址格式
    console.log("\n📝 3. 测试不同地址格式:");
    
    const addresses = [
      testAddress,
      testAddress.toLowerCase(),
      testAddress.toUpperCase(),
      `0x${testAddress.slice(2)}`,
    ];
    
    for (const addr of addresses) {
      try {
        const status = await exchangeEx.authorizedTraders(addr);
        console.log(`   ${addr}: ${status}`);
      } catch (error) {
        console.log(`   ${addr}: ❌ ${error.message}`);
      }
    }
    
    // 4. 测试合约 ABI 中的 authorizedTraders 函数
    console.log("\n📋 4. 检查合约 ABI:");
    
    const abi = ExchangeEx.interface.fragments;
    const authFunction = abi.find(f => f.name === 'authorizedTraders');
    if (authFunction) {
      console.log(`   找到 authorizedTraders 函数: ${authFunction.format()}`);
    } else {
      console.log("   ❌ 未找到 authorizedTraders 函数");
    }
    
    // 5. 测试直接调用
    console.log("\n🎯 5. 测试直接调用:");
    
    const result = await exchangeEx.authorizedTraders(testAddress);
    console.log(`   直接调用结果: ${result}`);
    console.log(`   结果类型: ${typeof result}`);
    console.log(`   转换为布尔值: ${Boolean(result)}`);
    
    console.log("\n✅ 调试完成!");
    
  } catch (error) {
    console.error(`❌ 调试失败: ${error.message}`);
    console.error(`   错误堆栈: ${error.stack}`);
  }
  
  console.log("\n💡 可能的问题:");
  console.log("   1. 前端合约地址不匹配");
  console.log("   2. 前端网络配置错误");
  console.log("   3. 合约 ABI 不匹配");
  console.log("   4. 前端 hooks 配置问题");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 