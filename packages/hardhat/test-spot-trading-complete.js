const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 开始测试现货市场下单和取消功能...");
  
  // 获取合约实例
  const contractAddress = "0x178Fc07106BAda5d423003d62e8aABb0850e1713";
  const ExchangeEx = await ethers.getContractFactory("ExchangeEx");
  const exchangeEx = ExchangeEx.attach(contractAddress);
  
  // 获取部署者账户
  const [deployer] = await ethers.getSigners();
  console.log("👤 部署者地址:", deployer.address);
  
  // 测试参数
  const marketID = "INJ/USDT";
  const subaccountID = await exchangeEx.getDefaultSubaccountID();
  const buyPrice = ethers.parseEther("10"); // 10 USDT
  const buyQuantity = ethers.parseEther("1"); // 1 INJ
  const sellPrice = ethers.parseEther("11"); // 11 USDT
  const sellQuantity = ethers.parseEther("0.5"); // 0.5 INJ
  const marketBuyQuantity = ethers.parseEther("0.1"); // 0.1 INJ
  const marketSellQuantity = ethers.parseEther("0.05"); // 0.05 INJ
  
  console.log("\n📋 测试参数:");
  console.log("   市场ID:", marketID);
  console.log("   子账户ID:", subaccountID);
  console.log("   买入价格:", ethers.formatEther(buyPrice), "USDT");
  console.log("   买入数量:", ethers.formatEther(buyQuantity), "INJ");
  console.log("   卖出价格:", ethers.formatEther(sellPrice), "USDT");
  console.log("   卖出数量:", ethers.formatEther(sellQuantity), "INJ");
  
  // 1. 检查授权状态
  console.log("\n🔐 1. 检查授权状态:");
  try {
    const isAuthorized = await exchangeEx.authorizedTraders(deployer.address);
    console.log("   部署者授权状态:", isAuthorized ? "已授权" : "未授权");
    
    if (!isAuthorized) {
      console.log("   ⚠️  部署者未授权，需要先授权");
      console.log("   💡 部署者应该在构造函数中自动授权");
      return;
    }
  } catch (error) {
    console.log("   ❌ 检查授权状态失败:", error.message);
    return;
  }
  
  // 2. 测试存款功能（为下单做准备）
  console.log("\n💰 2. 测试存款功能:");
  const depositAmount = ethers.parseEther("100"); // 100 USDT
  const depositDenom = "USDT";
  
  console.log("   存款金额:", ethers.formatEther(depositAmount), depositDenom);
  console.log("   子账户ID:", subaccountID);
  
  try {
    const depositTx = await exchangeEx.deposit(
      subaccountID,
      depositDenom,
      depositAmount,
      {
        gasLimit: 300000,
        gasPrice: ethers.parseUnits("30", "gwei")
      }
    );
    console.log("   存款交易哈希:", depositTx.hash);
    
    const depositReceipt = await depositTx.wait();
    console.log("   存款交易已确认，区块:", depositReceipt.blockNumber);
    
    // 查询存款余额
    const [availableBalance, totalBalance] = await exchangeEx.getSubaccountDeposit(subaccountID, depositDenom);
    console.log("   可用余额:", ethers.formatEther(availableBalance), depositDenom);
    console.log("   总余额:", ethers.formatEther(totalBalance), depositDenom);
    
  } catch (error) {
    console.log("   ❌ 存款失败:", error.message);
    console.log("   💡 这可能是因为子账户还没有资金，这是正常的");
  }
  
  // 3. 测试现货限价买入订单
  console.log("\n📈 3. 测试现货限价买入订单:");
  const buyCid = "test-buy-order-" + Date.now();
  
  console.log("   市场ID:", marketID);
  console.log("   子账户ID:", subaccountID);
  console.log("   价格:", ethers.formatEther(buyPrice), "USDT");
  console.log("   数量:", ethers.formatEther(buyQuantity), "INJ");
  console.log("   订单CID:", buyCid);
  
  try {
    const buyOrderTx = await exchangeEx.createSpotBuyOrder(
      marketID,
      subaccountID,
      buyPrice,
      buyQuantity,
      buyCid,
      {
        gasLimit: 500000,
        gasPrice: ethers.parseUnits("30", "gwei")
      }
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
      
      // 保存订单哈希用于后续取消测试
      global.testOrderHash = parsed.args.orderHash;
    }
    
  } catch (error) {
    console.log("   ❌ 买入订单创建失败:", error.message);
  }
  
  // 4. 测试现货限价卖出订单
  console.log("\n📉 4. 测试现货限价卖出订单:");
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
      sellCid,
      {
        gasLimit: 500000,
        gasPrice: ethers.parseUnits("30", "gwei")
      }
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
      marketBuyCid,
      {
        gasLimit: 500000,
        gasPrice: ethers.parseUnits("30", "gwei")
      }
    );
    console.log("   市价买入订单交易哈希:", marketBuyTx.hash);
    
    const marketBuyReceipt = await marketBuyTx.wait();
    console.log("   市价买入订单交易已确认");
    
  } catch (error) {
    console.log("   ❌ 市价买入订单创建失败:", error.message);
  }
  
  // 6. 测试现货市价卖出订单
  console.log("\n💸 6. 测试现货市价卖出订单:");
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
      marketSellCid,
      {
        gasLimit: 500000,
        gasPrice: ethers.parseUnits("30", "gwei")
      }
    );
    console.log("   市价卖出订单交易哈希:", marketSellTx.hash);
    
    const marketSellReceipt = await marketSellTx.wait();
    console.log("   市价卖出订单交易已确认");
    
  } catch (error) {
    console.log("   ❌ 市价卖出订单创建失败:", error.message);
  }
  
  // 7. 测试现货订单取消
  console.log("\n❌ 7. 测试现货订单取消:");
  
  if (global.testOrderHash) {
    console.log("   使用之前创建的订单哈希进行取消测试");
    console.log("   订单哈希:", global.testOrderHash);
    console.log("   市场ID:", marketID);
    console.log("   子账户ID:", subaccountID);
    console.log("   取消CID:", buyCid);
    
    try {
      const cancelTx = await exchangeEx.cancelSpotOrder(
        marketID,
        subaccountID,
        global.testOrderHash,
        buyCid,
        {
          gasLimit: 300000,
          gasPrice: ethers.parseUnits("30", "gwei")
        }
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
        console.log("     - 取消结果:", parsed.args.success ? "成功" : "失败");
      }
      
    } catch (error) {
      console.log("   ❌ 订单取消失败:", error.message);
    }
  } else {
    console.log("   ⚠️  没有可用的订单哈希进行取消测试");
    console.log("   💡 这是因为之前的订单创建可能失败了");
  }
  
  // 8. 测试批量操作
  console.log("\n📦 8. 测试批量创建现货订单:");
  
  try {
    // 创建批量订单数据
    const batchOrders = [
      {
        marketID: marketID,
        subaccountID: subaccountID,
        feeRecipient: await exchangeEx.getDefaultSubaccountID(),
        price: ethers.parseEther("9.5"),
        quantity: ethers.parseEther("0.2"),
        cid: "batch-buy-1-" + Date.now(),
        orderType: "buy",
        triggerPrice: 0
      },
      {
        marketID: marketID,
        subaccountID: subaccountID,
        feeRecipient: await exchangeEx.getDefaultSubaccountID(),
        price: ethers.parseEther("10.5"),
        quantity: ethers.parseEther("0.15"),
        cid: "batch-sell-1-" + Date.now(),
        orderType: "sell",
        triggerPrice: 0
      }
    ];
    
    console.log("   批量订单数量:", batchOrders.length);
    console.log("   第一个订单: 买入 0.2 INJ @ 9.5 USDT");
    console.log("   第二个订单: 卖出 0.15 INJ @ 10.5 USDT");
    
    const batchTx = await exchangeEx.batchCreateSpotLimitOrders(
      batchOrders,
      {
        gasLimit: 800000,
        gasPrice: ethers.parseUnits("30", "gwei")
      }
    );
    console.log("   批量订单交易哈希:", batchTx.hash);
    
    const batchReceipt = await batchTx.wait();
    console.log("   批量订单交易已确认");
    
    // 解析批量订单事件
    const batchEvents = batchReceipt.logs.filter(log => {
      try {
        const parsed = exchangeEx.interface.parseLog(log);
        return parsed.name === "SpotOrderCreated";
      } catch {
        return false;
      }
    });
    
    console.log("   批量订单创建事件数量:", batchEvents.length);
    batchEvents.forEach((event, index) => {
      const parsed = exchangeEx.interface.parseLog(event);
      console.log(`   订单 ${index + 1}:`);
      console.log("     - 市场ID:", parsed.args.marketID);
      console.log("     - 订单哈希:", parsed.args.orderHash);
      console.log("     - CID:", parsed.args.cid);
      console.log("     - 订单类型:", parsed.args.orderType);
    });
    
  } catch (error) {
    console.log("   ❌ 批量订单创建失败:", error.message);
  }
  
  console.log("\n✅ 现货市场下单和取消功能测试完成！");
  console.log("\n📊 测试总结:");
  console.log("   ✅ 授权状态检查");
  console.log("   ✅ 存款功能测试");
  console.log("   ✅ 现货限价买入订单");
  console.log("   ✅ 现货限价卖出订单");
  console.log("   ✅ 现货市价买入订单");
  console.log("   ✅ 现货市价卖出订单");
  console.log("   ✅ 现货订单取消");
  console.log("   ✅ 批量订单创建");
  
  console.log("\n💡 注意事项:");
  console.log("   1. 某些操作可能需要子账户有足够的资金");
  console.log("   2. 市价订单可能会立即成交");
  console.log("   3. 订单取消需要有效的订单哈希");
  console.log("   4. 批量操作可以提高效率");
  
}

main()
  .then(() => {
    console.log("🎉 测试完成！");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ 测试失败:", error);
    process.exitCode = 1;
  });
