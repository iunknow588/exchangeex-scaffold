import { ethers } from "hardhat";

// 预定义的 RPC 端点列表（基于官方文档）
const RPC_ENDPOINTS = [
  {
    name: "Official Primary",
    url: "https://k8s.testnet.json-rpc.injective.network/",
    timeout: 30000,
    description: "官方主要 RPC 端点",
  },
  {
    name: "Official WS",
    url: "https://k8s.testnet.ws.injective.network/",
    timeout: 30000,
    description: "官方 WebSocket 端点",
  },
  {
    name: "Blockscout Mirror",
    url: "https://testnet-injective.cloud.blockscout.com/",
    timeout: 30000,
    description: "Blockscout 镜像端点",
  },
];

interface RpcTestResult {
  url: string;
  name: string;
  available: boolean;
  error: string | null;
  blockNumber: number | null;
  gasPrice: string | null;
  responseTime: number | null;
}

/**
 * 测试单个 RPC 端点的连接
 * @param url - RPC URL
 * @param timeout - 超时时间（毫秒）
 * @returns 连接测试结果
 */
async function testRpcEndpoint(url: string, timeout: number = 30000): Promise<RpcTestResult> {
  const result: RpcTestResult = {
    url: url,
    name: "",
    available: false,
    error: null,
    blockNumber: null,
    gasPrice: null,
    responseTime: null,
  };

  try {
    console.log(`🔍 测试 RPC 端点: ${url}`);

    const startTime = Date.now();

    // 创建提供者
    const provider = new ethers.JsonRpcProvider(url, undefined, {
      timeout: timeout,
    });

    // 测试基本连接
    const blockNumber = await provider.getBlockNumber();
    result.blockNumber = blockNumber;

    // 测试网络信息
    const network = await provider.getNetwork();

    // 测试 Gas 价格（如果支持）
    try {
      const gasPrice = await provider.getGasPrice();
      result.gasPrice = ethers.formatUnits(gasPrice, "gwei");
    } catch (gasError) {
      // Gas 价格查询失败不影响整体可用性
      console.log(`   ⚠️  Gas 价格查询失败: ${(gasError as Error).message}`);
    }

    const endTime = Date.now();
    result.responseTime = endTime - startTime;
    result.available = true;

    console.log(
      `✅ 连接成功！区块: ${blockNumber}, 网络: ${network.name} (${network.chainId}), 响应时间: ${result.responseTime}ms`,
    );
  } catch (error) {
    result.error = (error as Error).message;
    console.log(`❌ 连接失败: ${(error as Error).message}`);
  }

  return result;
}

/**
 * 测试所有 RPC 端点并返回可用的端点
 * @returns 可用的 RPC 端点列表
 */
async function findAvailableRpcEndpoints(): Promise<RpcTestResult[]> {
  console.log("🌐 开始测试 Injective 测试网 RPC 端点...\n");

  const results: RpcTestResult[] = [];

  for (const endpoint of RPC_ENDPOINTS) {
    const result = await testRpcEndpoint(endpoint.url, endpoint.timeout);
    result.name = endpoint.name;
    results.push(result);

    // 如果找到可用的端点，可以提前返回（可选）
    if (result.available) {
      console.log(`🎉 找到可用端点: ${endpoint.name} (${endpoint.url})`);
    }

    // 添加短暂延迟避免过于频繁的请求
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // 过滤出可用的端点
  const availableEndpoints = results.filter(result => result.available);

  console.log(`\n📊 测试结果总结:`);
  console.log(`  总端点数量: ${results.length}`);
  console.log(`  可用端点数量: ${availableEndpoints.length}`);

  if (availableEndpoints.length > 0) {
    console.log(`\n✅ 可用的 RPC 端点:`);
    availableEndpoints.forEach((endpoint, index) => {
      console.log(`  ${index + 1}. ${endpoint.name}: ${endpoint.url}`);
      console.log(`     区块: ${endpoint.blockNumber}, 响应时间: ${endpoint.responseTime}ms`);
      if (endpoint.gasPrice) {
        console.log(`     Gas 价格: ${endpoint.gasPrice} Gwei`);
      }
    });
  } else {
    console.log(`\n❌ 没有找到可用的 RPC 端点`);
    console.log(`💡 建议:`);
    console.log(`  1. 检查网络连接`);
    console.log(`  2. 稍后重试（Injective 测试网可能暂时不可用）`);
    console.log(`  3. 使用本地网络测试: npm run chain`);
  }

  return availableEndpoints;
}

/**
 * 获取最佳 RPC 端点（响应时间最短的可用端点）
 * @returns 最佳 RPC URL 或 null
 */
async function getBestRpcEndpoint(): Promise<string | null> {
  const availableEndpoints = await findAvailableRpcEndpoints();

  if (availableEndpoints.length === 0) {
    return null;
  }

  // 按响应时间排序，选择最快的
  availableEndpoints.sort((a, b) => (a.responseTime || 0) - (b.responseTime || 0));
  const bestEndpoint = availableEndpoints[0];

  console.log(`\n🏆 推荐使用: ${bestEndpoint.name} (${bestEndpoint.url})`);
  console.log(`   响应时间: ${bestEndpoint.responseTime}ms`);

  return bestEndpoint.url;
}

/**
 * 创建使用指定 RPC 端点的提供者
 * @param rpcUrl - RPC URL
 * @returns 配置好的提供者
 */
function createProvider(rpcUrl: string) {
  return new ethers.JsonRpcProvider(rpcUrl, undefined, {
    timeout: 60000,
  });
}

export {
  testRpcEndpoint,
  findAvailableRpcEndpoints,
  getBestRpcEndpoint,
  createProvider,
  RPC_ENDPOINTS,
  type RpcTestResult,
};
