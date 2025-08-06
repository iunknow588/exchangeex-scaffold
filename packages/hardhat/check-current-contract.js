const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 检查当前合约状态...");
  
  // 获取部署信息
  const deploymentInfo = require('./deployment-info.json');
  const contractAddress = deploymentInfo.contractAddress;
  
  console.log("📋 部署信息:");
  console.log(`   合约地址: ${contractAddress}`);
  console.log(`   部署网络: ${deploymentInfo.deploymentNetwork}`);
  console.log(`   部署者地址: ${deploymentInfo.deployerAddress}`);
  
  try {
    // 获取合约实例
    const ExchangeEx = await ethers.getContractFactory("ExchangeEx");
    const exchangeEx = ExchangeEx.attach(contractAddress);
    
    // 测试基本调用
    console.log("\n🔧 测试合约调用:");
    
    const owner = await exchangeEx.owner();
    console.log(`   合约所有者: ${owner}`);
    
    const defaultSubaccountID = await exchangeEx.getDefaultSubaccountID();
    console.log(`   默认子账户ID: ${defaultSubaccountID}`);
    
    // 测试授权状态
    const authorizedStatus = await exchangeEx.authorizedTraders(deploymentInfo.deployerAddress);
    console.log(`   部署者授权状态: ${authorizedStatus}`);
    
    console.log("\n✅ 合约状态正常!");
    
    // 检查前端配置
    console.log("\n📝 前端配置检查:");
    console.log("   请确保前端使用以下配置:");
    console.log(`   合约地址: ${contractAddress}`);
    console.log(`   网络: Injective Testnet (Chain ID: 1439)`);
    console.log(`   RPC URL: https://testnet.sentry.tm.injective.network:443`);
    
  } catch (error) {
    console.error(`❌ 合约检查失败: ${error.message}`);
    
    if (error.message.includes("eth_getCode")) {
      console.log("\n💡 解决方案:");
      console.log("   1. 检查 RPC 端点是否正确");
      console.log("   2. 确保网络连接正常");
      console.log("   3. 尝试使用不同的 RPC 端点");
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 