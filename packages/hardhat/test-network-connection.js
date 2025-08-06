const { ethers } = require("hardhat");

async function main() {
  console.log("🌐 测试网络连接...");
  
  try {
    // 获取当前网络信息
    const network = await ethers.provider.getNetwork();
    console.log(`📡 当前网络: ${network.name} (Chain ID: ${network.chainId})`);
    
    // 获取最新区块
    const latestBlock = await ethers.provider.getBlockNumber();
    console.log(`📦 最新区块: ${latestBlock}`);
    
    // 获取 Gas 价格
    const gasPrice = await ethers.provider.getFeeData();
    console.log(`⛽ Gas 价格: ${ethers.formatUnits(gasPrice.gasPrice, 'gwei')} gwei`);
    
    // 获取部署者账户
    const [deployer] = await ethers.getSigners();
    console.log(`👤 部署者地址: ${deployer.address}`);
    
    // 获取账户余额
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log(`💰 账户余额: ${ethers.formatEther(balance)} ETH`);
    
    // 测试合约连接
    const contractAddress = "0x178Fc07106BAda5d423003d62e8aABb0850e1713";
    const ExchangeEx = await ethers.getContractFactory("ExchangeEx");
    const exchangeEx = ExchangeEx.attach(contractAddress);
    
    console.log(`📋 合约地址: ${contractAddress}`);
    
    // 测试合约调用
    try {
      const owner = await exchangeEx.owner();
      console.log(`👑 合约所有者: ${owner}`);
      
      const defaultSubaccountID = await exchangeEx.getDefaultSubaccountID();
      console.log(`📝 默认子账户ID: ${defaultSubaccountID}`);
      
      console.log("✅ 网络连接和合约调用正常");
      
    } catch (error) {
      console.log(`❌ 合约调用失败: ${error.message}`);
    }
    
  } catch (error) {
    console.error(`❌ 网络连接失败: ${error.message}`);
  }
  
  console.log("\n💡 网络连接检查完成");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 