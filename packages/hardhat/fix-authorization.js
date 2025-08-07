const { ethers } = require("hardhat");

async function main() {
  console.log("🔧 修复授权问题...");
  
  // 获取合约实例
  const contractAddress = "0x178Fc07106BAda5d423003d62e8aABb0850e1713";
  const ExchangeEx = await ethers.getContractFactory("ExchangeEx");
  const exchangeEx = ExchangeEx.attach(contractAddress);
  
  // 获取部署者账户
  const [deployer] = await ethers.getSigners();
  console.log("👤 部署者地址:", deployer.address);
  
  try {
    // 1. 检查合约所有者
    console.log("\n📋 1. 检查合约所有者:");
    const owner = await exchangeEx.owner();
    console.log("   合约所有者:", owner);
    
    // 2. 检查部署者授权状态
    console.log("\n🔐 2. 检查部署者授权状态:");
    const deployerAuthorized = await exchangeEx.authorizedTraders(deployer.address);
    console.log("   部署者是否已授权:", deployerAuthorized);
    
    // 3. 如果部署者不是所有者，需要授权
    if (owner !== deployer.address) {
      console.log("\n⚠️  部署者不是合约所有者，无法进行授权操作");
      console.log("   需要合约所有者进行授权");
      return;
    }
    
    // 4. 如果部署者未授权，进行授权
    if (!deployerAuthorized) {
      console.log("\n🔧 3. 授权部署者:");
      console.log("   注意: 部署者应该已经在构造函数中被授权");
      console.log("   如果未授权，可能是合约部署有问题");
    } else {
      console.log("\n✅ 部署者已授权");
    }
    
    // 5. 测试现货交易功能
    console.log("\n🧪 4. 测试现货交易功能:");
    
    const marketID = "INJ/USDT";
    const subaccountID = await exchangeEx.getDefaultSubaccountID();
    const price = ethers.parseEther("10");
    const quantity = ethers.parseEther("0.1");
    const cid = "test-order-" + Date.now();
    
    console.log("   市场ID:", marketID);
    console.log("   子账户ID:", subaccountID);
    console.log("   价格:", ethers.formatEther(price), "USDT");
    console.log("   数量:", ethers.formatEther(quantity), "INJ");
    console.log("   订单CID:", cid);
    
    try {
      const buyOrderTx = await exchangeEx.createSpotBuyOrder(
        marketID,
        subaccountID,
        price,
        quantity,
        cid
      );
      console.log("   买入订单交易哈希:", buyOrderTx.hash);
      
      const buyOrderReceipt = await buyOrderTx.wait();
      console.log("   买入订单交易已确认");
      
      // 解析事件日志
      const buyOrderEvent = buyOrderReceipt.logs.find(log => {
        try {
          const parsed = exchangeEx.interface.parseLog(log);
          return parsed.name === "SpotOrderCreated";
        } catch {
          return false;
        }
      });
      
      if (buyOrderEvent) {
        const parsed = exchangeEx.interface.parseLog(buyOrderEvent);
        console.log("   买入订单创建事件:");
        console.log("     - 市场ID:", parsed.args.marketID);
        console.log("     - 订单哈希:", parsed.args.orderHash);
        console.log("     - CID:", parsed.args.cid);
        console.log("     - 订单类型:", parsed.args.orderType);
        
        // 6. 测试订单取消
        console.log("\n❌ 5. 测试订单取消:");
        const orderHash = parsed.args.orderHash;
        const cancelCid = "test-cancel-" + Date.now();
        
        console.log("   订单哈希:", orderHash);
        console.log("   取消CID:", cancelCid);
        
        try {
          const cancelTx = await exchangeEx.cancelSpotOrder(
            marketID,
            subaccountID,
            orderHash,
            cancelCid
          );
          console.log("   取消订单交易哈希:", cancelTx.hash);
          
          const cancelReceipt = await cancelTx.wait();
          console.log("   取消订单交易已确认");
          
          // 解析取消事件
          const cancelEvent = cancelReceipt.logs.find(log => {
            try {
              const parsed = exchangeEx.interface.parseLog(log);
              return parsed.name === "SpotOrderCancelled";
            } catch {
              return false;
            }
          });
          
          if (cancelEvent) {
            const parsed = exchangeEx.interface.parseLog(cancelEvent);
            console.log("   订单取消事件:");
            console.log("     - 市场ID:", parsed.args.marketID);
            console.log("     - 订单哈希:", parsed.args.orderHash);
            console.log("     - 成功状态:", parsed.args.success);
          }
          
        } catch (error) {
          console.log("   ❌ 订单取消失败:", error.message);
        }
      }
      
    } catch (error) {
      console.log("   ❌ 买入订单创建失败:", error.message);
      
      // 提供详细的错误分析
      console.log("\n🔍 错误分析:");
      console.log("   1. 检查授权状态");
      console.log("   2. 检查子账户余额");
      console.log("   3. 检查市场配置");
      console.log("   4. 检查网络连接");
    }
    
    console.log("\n✅ 授权修复和现货交易测试完成！");
    
  } catch (error) {
    console.error("❌ 修复失败:", error.message);
    console.error("详细错误:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
