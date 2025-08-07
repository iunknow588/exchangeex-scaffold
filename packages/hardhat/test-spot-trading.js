const { ethers } = require("hardhat");

async function main() {
  console.log("🧪 开始测试现货市场下单和取消功能...");
  
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
    
    if (!isAuthorized) {
      console.log("❌ 部署者未授权，无法进行现货交易测试");
      return;
    }
    
    // 3. 测试现货买入订单创建
    console.log("\n📈 3. 测试现货买入订单创建:");
    const marketID = "INJ/USDT";
    const subaccountID = defaultSubaccountID;
    const price = ethers.parseEther("10"); // 10 USDT
    const quantity = ethers.parseEther("1"); // 1 INJ
    const cid = "test-buy-order-" + Date.now();
    
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
      }
      
    } catch (error) {
      console.log("   ❌ 买入订单创建失败:", error.message);
    }
    
    // 4. 测试现货卖出订单创建
    console.log("\n📉 4. 测试现货卖出订单创建:");
    const sellPrice = ethers.parseEther("12"); // 12 USDT
    const sellQuantity = ethers.parseEther("0.5"); // 0.5 INJ
    const sellCid = "test-sell-order-" + Date.now();
    
    console.log("   市场ID:", marketID);
    console.log("   子账户ID:", subaccountID);
    console.log("   价格:", ethers.formatEther(sellPrice), "USDT");
    console.log("   数量:", ethers.formatEther(sellQuantity), "INJ");
    console.log("   订单CID:", sellCid);
    
    try {
      const sellOrderTx = await exchangeEx.createSpotSellOrder(
        marketID,
        subaccountID,
        sellPrice,
        sellQuantity,
        sellCid
      );
      console.log("   卖出订单交易哈希:", sellOrderTx.hash);
      
      const sellOrderReceipt = await sellOrderTx.wait();
      console.log("   卖出订单交易已确认");
      
      // 解析事件日志
      const sellOrderEvent = sellOrderReceipt.logs.find(log => {
        try {
          const parsed = exchangeEx.interface.parseLog(log);
          return parsed.name === "SpotOrderCreated";
        } catch {
          return false;
        }
      });
      
      if (sellOrderEvent) {
        const parsed = exchangeEx.interface.parseLog(sellOrderEvent);
        console.log("   卖出订单创建事件:");
        console.log("     - 市场ID:", parsed.args.marketID);
        console.log("     - 订单哈希:", parsed.args.orderHash);
        console.log("     - CID:", parsed.args.cid);
        console.log("     - 订单类型:", parsed.args.orderType);
      }
      
    } catch (error) {
      console.log("   ❌ 卖出订单创建失败:", error.message);
    }
    
    // 5. 测试现货市价买入订单
    console.log("\n🚀 5. 测试现货市价买入订单:");
    const marketBuyQuantity = ethers.parseEther("0.1"); // 0.1 INJ
    const marketBuyCid = "test-market-buy-order-" + Date.now();
    
    console.log("   市场ID:", marketID);
    console.log("   子账户ID:", subaccountID);
    console.log("   数量:", ethers.formatEther(marketBuyQuantity), "INJ");
    console.log("   订单CID:", marketBuyCid);
    
    try {
      const marketBuyTx = await exchangeEx.createSpotMarketBuyOrder(
        marketID,
        subaccountID,
        marketBuyQuantity,
        marketBuyCid
      );
      console.log("   市价买入订单交易哈希:", marketBuyTx.hash);
      
      const marketBuyReceipt = await marketBuyTx.wait();
      console.log("   市价买入订单交易已确认");
      
    } catch (error) {
      console.log("   ❌ 市价买入订单创建失败:", error.message);
    }
    
    // 6. 测试现货市价卖出订单
    console.log("\n💸 6. 测试现货市价卖出订单:");
    const marketSellQuantity = ethers.parseEther("0.05"); // 0.05 INJ
    const marketSellCid = "test-market-sell-order-" + Date.now();
    
    console.log("   市场ID:", marketID);
    console.log("   子账户ID:", subaccountID);
    console.log("   数量:", ethers.formatEther(marketSellQuantity), "INJ");
    console.log("   订单CID:", marketSellCid);
    
    try {
      const marketSellTx = await exchangeEx.createSpotMarketSellOrder(
        marketID,
        subaccountID,
        marketSellQuantity,
        marketSellCid
      );
      console.log("   市价卖出订单交易哈希:", marketSellTx.hash);
      
      const marketSellReceipt = await marketSellTx.wait();
      console.log("   市价卖出订单交易已确认");
      
    } catch (error) {
      console.log("   ❌ 市价卖出订单创建失败:", error.message);
    }
    
    // 7. 测试现货订单取消（需要有效的订单哈希）
    console.log("\n❌ 7. 测试现货订单取消:");
    console.log("   注意: 订单取消需要有效的订单哈希，这里仅演示函数调用");
    
    const testMarketID = "INJ/USDT";
    const testOrderHash = "0x" + "0".repeat(64); // 示例订单哈希
    const testCancelCid = "test-cancel-order-" + Date.now();
    
    console.log("   市场ID:", testMarketID);
    console.log("   子账户ID:", subaccountID);
    console.log("   订单哈希:", testOrderHash);
    console.log("   取消CID:", testCancelCid);
    
    try {
      const cancelTx = await exchangeEx.cancelSpotOrder(
        testMarketID,
        subaccountID,
        testOrderHash,
        testCancelCid
      );
      console.log("   取消订单交易哈希:", cancelTx.hash);
      
      const cancelReceipt = await cancelTx.wait();
      console.log("   取消订单交易已确认");
      
    } catch (error) {
      console.log("   ❌ 订单取消失败 (预期行为，因为使用了示例订单哈希):", error.message);
    }
    
    console.log("\n✅ 现货市场下单和取消功能测试完成！");
    
  } catch (error) {
    console.error("❌ 测试失败:", error.message);
    console.error("详细错误:", error);
    
    // 提供故障排除建议
    console.log("\n🔧 故障排除建议:");
    console.log("1. 检查网络连接是否正常");
    console.log("2. 确认合约地址是否正确");
    console.log("3. 检查账户是否有足够的余额");
    console.log("4. 确认账户已授权进行交易");
    console.log("5. 检查子账户是否有足够的资金");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
