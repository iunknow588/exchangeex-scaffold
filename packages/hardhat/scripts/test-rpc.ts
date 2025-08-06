import { findAvailableRpcEndpoints, getBestRpcEndpoint } from "../utils/network-utils";

async function main() {
  console.log("🌐 Injective 测试网 RPC 端点测试工具");
  console.log("=".repeat(50));

  try {
    // 测试所有 RPC 端点
    const availableEndpoints = await findAvailableRpcEndpoints();

    if (availableEndpoints.length === 0) {
      console.log("\n❌ 没有找到可用的 RPC 端点");
      console.log("💡 建议:");
      console.log("  1. 检查网络连接");
      console.log("  2. 稍后重试（Injective 测试网可能暂时不可用）");
      console.log("  3. 使用本地网络测试: npm run chain");
      process.exit(1);
    }

    // 获取最佳端点
    const bestRpcUrl = await getBestRpcEndpoint();

    if (bestRpcUrl) {
      console.log("\n✅ RPC 测试完成！");
      console.log("🏆 推荐使用的 RPC 端点:", bestRpcUrl);
      console.log("\n💡 使用建议:");
      console.log("  1. 将此 RPC 端点添加到 hardhat.config.ts");
      console.log('  2. 设置环境变量: export RPC_URL="' + bestRpcUrl + '"');
      console.log("  3. 运行部署: npm run deploy");
    }
  } catch (error) {
    console.error("❌ RPC 测试失败:", error);
    process.exit(1);
  }
}

main()
  .then(() => {
    console.log("\n🎉 RPC 测试完成！");
    process.exit(0);
  })
  .catch(error => {
    console.error("❌ 测试失败:", error);
    process.exitCode = 1;
  });
