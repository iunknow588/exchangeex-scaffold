const { ethers } = require("hardhat");

// RPC 端点列表 - 根据官方文档更新
const RPC_ENDPOINTS = [
    {
        name: "Official JSON-RPC",
        url: 'https://k8s.testnet.json-rpc.injective.network/',
        timeout: 30000,
        description: "官方 JSON-RPC 端点"
    },
    {
        name: "Official WebSocket",
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
        name: "Sentry TM (Legacy)",
        url: 'https://testnet.sentry.tm.injective.network:443',
        timeout: 30000,
        description: "Sentry TM 端点 (旧版)"
    }
];

/**
 * 测试单个 RPC 端点的连接和功能支持
 */
async function testRpcEndpoint(endpoint) {
    console.log(`🔍 测试 RPC 端点: ${endpoint.name} (${endpoint.url})`);
    
    const result = {
        name: endpoint.name,
        url: endpoint.url,
        available: false,
        supportsEthGetCode: false,
        supportsContractCalls: false,
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
        
        // 测试合约调用
        try {
            const contractAddress = "0x178Fc07106BAda5d423003d62e8aABb0850e1713";
            const ExchangeEx = await ethers.getContractFactory("ExchangeEx");
            const exchangeEx = ExchangeEx.attach(contractAddress);
            
            // 测试只读调用
            await exchangeEx.owner();
            result.supportsContractCalls = true;
            console.log(`   ✅ 支持合约调用`);
        } catch (contractError) {
            console.log(`   ❌ 合约调用失败: ${contractError.message}`);
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
 * 测试当前网络连接
 */
async function testCurrentNetwork() {
    console.log("🌐 测试当前网络连接...");
    
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
            return true;
            
        } catch (error) {
            console.log(`❌ 合约调用失败: ${error.message}`);
            return false;
        }
        
    } catch (error) {
        console.error(`❌ 网络连接失败: ${error.message}`);
        return false;
    }
}

/**
 * 测试所有 RPC 端点
 */
async function testAllRpcEndpoints() {
    console.log("🌐 开始测试 Injective 测试网 RPC 端点...\n");
    console.log("📚 参考官方文档: https://docs.injective.network/developers-evm/network-information\n");
    
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
    
    const contractCallEndpoints = results.filter(r => r.available && r.supportsContractCalls);
    console.log(`  支持合约调用的端点数量: ${contractCallEndpoints.length}`);
    
    if (contractCallEndpoints.length > 0) {
        console.log("\n✅ 推荐使用的 RPC 端点 (支持合约调用):");
        contractCallEndpoints.forEach((endpoint, index) => {
            console.log(`  ${index + 1}. ${endpoint.name}: ${endpoint.url}`);
            console.log(`     响应时间: ${endpoint.responseTime}ms`);
        });
        
        // 选择响应时间最短的端点
        contractCallEndpoints.sort((a, b) => (a.responseTime || 0) - (b.responseTime || 0));
        const bestEndpoint = contractCallEndpoints[0];
        
        console.log(`\n🏆 最佳端点: ${bestEndpoint.name} (${bestEndpoint.url})`);
        console.log(`   响应时间: ${bestEndpoint.responseTime}ms`);
        
        return bestEndpoint.url;
    } else if (ethGetCodeEndpoints.length > 0) {
        console.log("\n⚠️  找到支持 eth_getCode 但不支持合约调用的端点:");
        ethGetCodeEndpoints.forEach((endpoint, index) => {
            console.log(`  ${index + 1}. ${endpoint.name}: ${endpoint.url}`);
        });
        
        return ethGetCodeEndpoints[0].url;
    } else {
        console.log("\n❌ 没有找到合适的端点");
        console.log("💡 建议:");
        console.log("  1. 使用本地网络进行开发测试");
        console.log("  2. 检查 Injective 测试网状态");
        console.log("  3. 稍后重试");
        
        return null;
    }
}

async function main() {
    console.log("🧪 开始网络连接测试...\n");
    console.log("📋 根据 Injective 官方文档进行测试");
    console.log("🔗 官方文档: https://docs.injective.network/developers-evm/network-information\n");
    
    // 1. 测试当前网络
    console.log("=== 当前网络测试 ===");
    const currentNetworkOk = await testCurrentNetwork();
    
    console.log("\n" + "=".repeat(50) + "\n");
    
    // 2. 测试所有 RPC 端点
    console.log("=== RPC 端点测试 ===");
    const bestRpcUrl = await testAllRpcEndpoints();
    
    // 3. 总结和建议
    console.log("\n" + "=".repeat(50));
    console.log("📋 测试总结:");
    
    if (currentNetworkOk) {
        console.log("✅ 当前网络连接正常");
    } else {
        console.log("❌ 当前网络连接有问题");
    }
    
    if (bestRpcUrl) {
        console.log(`🎯 建议的 RPC 端点: ${bestRpcUrl}`);
        console.log("💡 可以更新配置文件使用此端点");
    } else {
        console.log("❌ 没有找到合适的 RPC 端点");
        console.log("💡 建议使用本地区块链进行测试");
    }
    
    console.log("\n🔧 故障排除建议:");
    console.log("1. 如果当前网络有问题，尝试切换到其他网络");
    console.log("2. 如果 RPC 端点都不可用，使用本地区块链");
    console.log("3. 检查网络连接和防火墙设置");
    console.log("4. 参考 TROUBLESHOOTING.md 获取更多帮助");
    console.log("5. 查看官方文档: https://docs.injective.network/developers-evm/network-information");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ 测试失败:", error.message);
        process.exit(1);
    }); 