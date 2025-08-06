const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 检查钱包地址和授权状态...");
  
  // 获取合约实例
  const contractAddress = "0x178Fc07106BAda5d423003d62e8aABb0850e1713";
  const ExchangeEx = await ethers.getContractFactory("ExchangeEx");
  const exchangeEx = ExchangeEx.attach(contractAddress);
  
  // 获取部署者账户
  const [deployer] = await ethers.getSigners();
  console.log("👤 部署者地址:", deployer.address);
  
  // 检查一些可能的钱包地址
  const testAddresses = [
    deployer.address,
    "0xd95C2810cfb43BdE49FDa151b17E732089DB75D7", // 部署者地址
    "0x1234567890123456789012345678901234567890", // 测试地址
    "0x0000000000000000000000000000000000000000", // 零地址
  ];
  
  console.log("\n🔐 检查各地址的授权状态:");
  for (const addr of testAddresses) {
    try {
      const authorized = await exchangeEx.authorizedTraders(addr);
      console.log(`   ${addr}: ${authorized ? "✅ 已授权" : "❌ 未授权"}`);
    } catch (error) {
      console.log(`   ${addr}: ❌ 查询失败 - ${error.message}`);
    }
  }
  
  // 检查合约所有者
  console.log("\n👑 合约所有者信息:");
  try {
    const owner = await exchangeEx.owner();
    console.log(`   所有者地址: ${owner}`);
    console.log(`   是否匹配部署者: ${owner === deployer.address}`);
  } catch (error) {
    console.log(`   ❌ 查询所有者失败: ${error.message}`);
  }
  
  // 检查默认子账户ID
  console.log("\n📝 默认子账户ID:");
  try {
    const defaultSubaccountID = await exchangeEx.getDefaultSubaccountID();
    console.log(`   ${defaultSubaccountID}`);
  } catch (error) {
    console.log(`   ❌ 查询失败: ${error.message}`);
  }
  
  console.log("\n💡 问题分析:");
  console.log("   1. 如果前端显示的钱包地址与部署者地址不匹配，授权状态会显示为'未授权'");
  console.log("   2. 请确保前端连接的钱包是部署合约时使用的钱包");
  console.log("   3. 或者使用部署者钱包重新连接前端");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 