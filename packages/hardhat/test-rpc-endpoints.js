const { ethers } = require("hardhat");

// RPC 端点列表
const RPC_ENDPOINTS = [
    {
        name: "Official Primary",
        url: 'https://k8s.testnet.json-rpc.injective.network/',
        timeout: 30000,
        description: "官方主要 RPC 端点"
    },
    {
        name: "Official WS",
        url: 'https://k8s.testnet.ws.injective.network/',
        timeout: 30000,
        description: "官方 WebSocket 端点"
    },
    {
        name: "Blockscout Mirror",
        url: 'https://testnet-injective.cloud.blockscout.com/',
        timeout: 30000,
        description: "Blockscout 镜像端点"
    },
    {
        name: "Sentry TM",
        url: 'https://testnet.sentry.tm.injective.network:443',
        timeout: 30000,
        description: "Sentry TM 端点"
    }
];

/**
 * 测试单个 RPC 端点的连接和 eth_getCode 支持
 */
async function testRpcEndpoint(endpoint) {
    console.log(`🔍 测试 RPC 端点: ${endpoint.name} (${endpoint.url})`);
    
    const result = {
        name: endpoint.name,
        url: endpoint.url,
        available: false,
        supportsEthGetCode: false,
        error: null,
        blockNumber: null,
        responseTime: null
    };

    try {
        const startTime = Date.now();
        
        // 创建提供者
        const provider = new ethers.JsonRpcProvider(endpoint.url, undefined, {
            timeout: endpoint.timeout
        });
        
        // 测试基本连接
        const blockNumber = await provider.getBlockNumber();
        result.blockNumber = blockNumber;
        
        // 测试 eth_getCode 方法
        try {
            const testAddress = "0x0000000000000000000000000000000000000000";
            await provider.getCode(testAddress);
            result.supportsEthGetCode = true;
            console.log(`   ✅ 支持 eth_getCode 方法`);
        } catch (codeError) {
            console.log(`   ❌ 不支持 eth_getCode 方法: ${codeError.message}`);
        }
        
        const endTime = Date.now();
        result.responseTime = endTime - startTime;
        result.available = true;
        
        console.log(`   ✅ 连接成功！区块: ${blockNumber}, 响应时间: ${result.responseTime}ms`);
        
    } catch (error) {
        result.error = error.message;
        console.log(`   ❌ 连接失败: ${error.message}`);
    }
    
    return result;
}

/**
 * 测试所有 RPC 端点
 */
async function testAllRpcEndpoints() {
    console.log("🌐 开始测试 Injective 测试网 RPC 端点...\n");
    
    const results = [];
    
    for (const endpoint of RPC_ENDPOINTS) {
        const result = await testRpcEndpoint(endpoint);
        results.push(result);
        
        // 添加延迟避免过于频繁的请求
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // 分析结果
    console.log("\n📊 测试结果总结:");
    console.log(`  总端点数量: ${results.length}`);
    
    const availableEndpoints = results.filter(r => r.available);
    console.log(`  可用端点数量: ${availableEndpoints.length}`);
    
    const ethGetCodeEndpoints = results.filter(r => r.available && r.supportsEthGetCode);
    console.log(`  支持 eth_getCode 的端点数量: ${ethGetCodeEndpoints.length}`);
    
    if (ethGetCodeEndpoints.length > 0) {
        console.log("\n✅ 推荐使用的 RPC 端点 (支持 eth_getCode):");
        ethGetCodeEndpoints.forEach((endpoint, index) => {
            console.log(`  ${index + 1}. ${endpoint.name}: ${endpoint.url}`);
            console.log(`     响应时间: ${endpoint.responseTime}ms`);
        });
        
        // 选择响应时间最短的端点
        ethGetCodeEndpoints.sort((a, b) => (a.responseTime || 0) - (b.responseTime || 0));
        const bestEndpoint = ethGetCodeEndpoints[0];
        
        console.log(`\n🏆 最佳端点: ${bestEndpoint.name} (${bestEndpoint.url})`);
        console.log(`   响应时间: ${bestEndpoint.responseTime}ms`);
        
        return bestEndpoint.url;
    } else {
        console.log("\n❌ 没有找到支持 eth_getCode 的端点");
        console.log("💡 建议:");
        console.log("  1. 使用本地网络进行开发测试");
        console.log("  2. 检查 Injective 测试网状态");
        console.log("  3. 稍后重试");
        
        return null;
    }
}

async function main() {
    try {
        const bestRpcUrl = await testAllRpcEndpoints();
        
        if (bestRpcUrl) {
            console.log(`\n🎯 建议更新前端配置使用: ${bestRpcUrl}`);
        }
        
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