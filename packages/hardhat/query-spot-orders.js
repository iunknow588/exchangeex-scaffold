const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 查询现货交易订单...");
  
  // 获取合约实例
  const contractAddress = "0x178Fc07106BAda5d423003d62e8aABb0850e1713";
  const ExchangeEx = await ethers.getContractFactory("ExchangeEx");
  const exchangeEx = ExchangeEx.attach(contractAddress);
  
  // 获取部署者账户
  const [deployer] = await ethers.getSigners();
  console.log("👤 查询账户:", deployer.address);
  
  try {
    // 获取默认子账户ID
    const defaultSubaccountID = await exchangeEx.getDefaultSubaccountID();
    console.log("📝 默认子账户ID:", defaultSubaccountID);
    
    // 查询子账户存款信息
    console.log("\n💰 子账户存款信息:");
    try {
      const deposits = await exchangeEx.getAllSubaccountDeposits([0]);
      console.log("   存款数据:", deposits);
    } catch (error) {
      console.log("   ⚠️  无法获取存款信息:", error.message);
    }
    
    // 查询合约事件历史
    console.log("\n📊 查询合约事件历史:");
    
    // 获取最近的区块
    const latestBlock = await ethers.provider.getBlockNumber();
    console.log("   最新区块:", latestBlock);
    
    // 查询现货订单创建事件
    console.log("\n🛒 现货订单创建事件:");
    try {
      const spotOrderEvents = await exchangeEx.queryFilter(
        exchangeEx.filters.SpotOrderCreated(),
        latestBlock - 1000, // 查询最近1000个区块
        latestBlock
      );
      
      if (spotOrderEvents.length === 0) {
        console.log("   📭 没有找到现货订单创建事件");
      } else {
        console.log(`   📋 找到 ${spotOrderEvents.length} 个现货订单创建事件:`);
        spotOrderEvents.forEach((event, index) => {
          console.log(`   ${index + 1}. 区块 ${event.blockNumber}:`);
          console.log(`      市场ID: ${event.args.marketID}`);
          console.log(`      订单哈希: ${event.args.orderHash}`);
          console.log(`      CID: ${event.args.cid}`);
          console.log(`      订单类型: ${event.args.orderType}`);
          console.log(`      交易哈希: ${event.transactionHash}`);
        });
      }
    } catch (error) {
      console.log("   ⚠️  无法查询现货订单事件:", error.message);
    }
    
    // 查询现货订单取消事件
    console.log("\n❌ 现货订单取消事件:");
    try {
      const spotCancelEvents = await exchangeEx.queryFilter(
        exchangeEx.filters.SpotOrderCancelled(),
        latestBlock - 1000,
        latestBlock
      );
      
      if (spotCancelEvents.length === 0) {
        console.log("   📭 没有找到现货订单取消事件");
      } else {
        console.log(`   📋 找到 ${spotCancelEvents.length} 个现货订单取消事件:`);
        spotCancelEvents.forEach((event, index) => {
          console.log(`   ${index + 1}. 区块 ${event.blockNumber}:`);
          console.log(`      市场ID: ${event.args.marketID}`);
          console.log(`      订单哈希: ${event.args.orderHash}`);
          console.log(`      成功: ${event.args.success}`);
          console.log(`      交易哈希: ${event.transactionHash}`);
        });
      }
    } catch (error) {
      console.log("   ⚠️  无法查询现货订单取消事件:", error.message);
    }
    
    // 查询衍生品订单事件
    console.log("\n📈 衍生品订单事件:");
    try {
      const derivativeEvents = await exchangeEx.queryFilter(
        exchangeEx.filters.DerivativeOrderCreated(),
        latestBlock - 1000,
        latestBlock
      );
      
      if (derivativeEvents.length === 0) {
        console.log("   📭 没有找到衍生品订单事件");
      } else {
        console.log(`   📋 找到 ${derivativeEvents.length} 个衍生品订单事件:`);
        derivativeEvents.forEach((event, index) => {
          console.log(`   ${index + 1}. 区块 ${event.blockNumber}:`);
          console.log(`      市场ID: ${event.args.marketID}`);
          console.log(`      订单哈希: ${event.args.orderHash}`);
          console.log(`      CID: ${event.args.cid}`);
          console.log(`      交易哈希: ${event.transactionHash}`);
        });
      }
    } catch (error) {
      console.log("   ⚠️  无法查询衍生品订单事件:", error.message);
    }
    
    console.log("\n✅ 查询完成！");
    console.log("\n💡 提示:");
    console.log("   - 如果没有找到订单，可能是因为还没有创建任何订单");
    console.log("   - 可以通过前端界面创建新的现货订单");
    console.log("   - 访问 http://localhost:3000/exchange-test 进行测试");
    
  } catch (error) {
    console.error("❌ 查询失败:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 