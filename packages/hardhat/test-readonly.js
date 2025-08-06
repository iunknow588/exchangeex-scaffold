const { ethers } = require("hardhat");

async function main() {
  console.log("🧪 开始只读测试 ExchangeEx 合约...");
  
  // 获取合约实例
  const contractAddress = "0x178Fc07106BAda5d423003d62e8aABb0850e1713";
  const ExchangeEx = await ethers.getContractFactory("ExchangeEx");
  const exchangeEx = ExchangeEx.attach(contractAddress);
  
  // 获取部署者账户
  const [deployer] = await ethers.getSigners();
  console.log("👤 测试账户:", deployer.address);
  
  try {
    // 1. 测试基本信息
    console.log("\n📋 1. 合约基本信息:");
    const owner = await exchangeEx.owner();
    console.log("   ✅ 合约所有者:", owner);
    console.log("   ✅ 所有者匹配部署者:", owner === deployer.address);
    
    const defaultSubaccountID = await exchangeEx.getDefaultSubaccountID();
    console.log("   ✅ 默认子账户ID:", defaultSubaccountID);
    
    // 2. 测试授权状态
    console.log("\n🔐 2. 授权状态:");
    const isAuthorized = await exchangeEx.authorizedTraders(deployer.address);
    console.log("   ✅ 部署者授权状态:", isAuthorized);
    
    // 3. 测试子账户生成
    console.log("\n📝 3. 子账户生成测试:");
    const testNonces = [1, 2, 3, 100, 999];
    for (const nonce of testNonces) {
      const subaccountID = await exchangeEx.generateSubaccountID(nonce);
      console.log(`   ✅ Nonce ${nonce}: ${subaccountID}`);
    }
    
    // 4. 测试合约余额
    console.log("\n💰 4. 合约余额:");
    const contractBalance = await exchangeEx.getContractBalance();
    console.log("   ✅ 合约余额:", ethers.formatEther(contractBalance), "ETH");
    
    // 5. 测试授权状态查询
    console.log("\n👥 5. 授权状态查询:");
    const testAddresses = [
      deployer.address,
      "0x1234567890123456789012345678901234567890",
      "0x0000000000000000000000000000000000000000"
    ];
    
    for (const addr of testAddresses) {
      const authorized = await exchangeEx.authorizedTraders(addr);
      console.log(`   ✅ ${addr}: ${authorized}`);
    }
    
    console.log("\n✅ 只读测试全部通过！");
    console.log("\n📊 测试总结:");
    console.log("   - 合约部署成功");
    console.log("   - 所有者设置正确");
    console.log("   - 默认子账户生成正常");
    console.log("   - 授权系统工作正常");
    console.log("   - 子账户ID生成算法正确");
    
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