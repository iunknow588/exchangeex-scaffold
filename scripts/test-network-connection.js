// script/test-network-connection.js
const { findAvailableRpcEndpoints, getBestRpcEndpoint } = require("./network-utils");

async function main() {
    console.log("🌐 Injective 测试网连接测试工具\n");
    
    // 测试所有 RPC 端点
    const availableEndpoints = await findAvailableRpcEndpoints();
    
    if (availableEndpoints.length === 0) {
        console.log("\n❌ 没有找到可用的 RPC 端点");
        console.log("💡 建议:");
        console.log("  1. 检查网络连接");
        console.log("  2. 稍后重试");
        console.log("  3. 使用本地网络测试: npx hardhat run script/test-local.js");
        process.exit(1);
    }
    
    // 获取最佳端点
    const bestEndpoint = await getBestRpcEndpoint();
    
    console.log("\n🎯 部署建议:");
    console.log(`  推荐 RPC 端点: ${bestEndpoint}`);
    console.log("  部署命令: npx hardhat run script/deploy-exchange.js");
    console.log("  或使用重试机制: npx hardhat run script/deploy-with-retry.js");
    
    console.log("\n📊 所有可用端点:");
    availableEndpoints.forEach((endpoint, index) => {
        console.log(`  ${index + 1}. ${endpoint.name}: ${endpoint.url}`);
        console.log(`     响应时间: ${endpoint.responseTime}ms`);
        if (endpoint.gasPrice) {
            console.log(`     Gas 价格: ${endpoint.gasPrice} Gwei`);
        }
        console.log("");
    });
}

main()
    .then(() => {
        console.log("🎉 网络测试完成！");
        process.exit(0);
    })
    .catch((error) => {
        console.error("❌ 网络测试失败:", error);
        process.exitCode = 1;
    }); 