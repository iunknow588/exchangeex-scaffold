#!/bin/bash

echo "🚀 启动 ExchangeEx 测试网络环境..."

# 设置环境变量
export NEXT_PUBLIC_DEFAULT_NETWORK=injTestnet
export NEXT_PUBLIC_DEFAULT_CHAIN_ID=1439
export NEXT_PUBLIC_INJECTIVE_RPC_URL=https://testnet.sentry.tm.injective.network:443
export NEXT_PUBLIC_CONTRACT_ADDRESS=0x178Fc07106BAda5d423003d62e8aABb0850e1713

echo "📋 环境变量已设置:"
echo "   默认网络: $NEXT_PUBLIC_DEFAULT_NETWORK"
echo "   Chain ID: $NEXT_PUBLIC_DEFAULT_CHAIN_ID"
echo "   RPC URL: $NEXT_PUBLIC_INJECTIVE_RPC_URL"
echo "   合约地址: $NEXT_PUBLIC_CONTRACT_ADDRESS"

# 停止可能运行的前端服务
echo "🛑 停止现有前端服务..."
pkill -f "next dev" 2>/dev/null || true

# 等待进程完全停止
sleep 2

# 启动前端服务
echo "🌐 启动前端服务..."
cd packages/nextjs
npm run dev &

# 等待前端启动
echo "⏳ 等待前端启动..."
sleep 10

# 检查前端是否启动成功
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ 前端启动成功!"
    echo ""
    echo "🔗 访问地址:"
    echo "   主页面: http://localhost:3000"
    echo "   测试页面: http://localhost:3000/exchange-test"
    echo ""
    echo "💡 使用说明:"
    echo "   1. 确保 MetaMask 连接到 Injective Testnet (Chain ID: 1439)"
    echo "   2. 如果 MetaMask 没有该网络，请手动添加:"
    echo "      - 网络名称: Injective Testnet"
    echo "      - RPC URL: https://testnet.sentry.tm.injective.network:443"
    echo "      - Chain ID: 1439"
    echo "      - 货币符号: INJ"
    echo "   3. 连接钱包并开始测试"
else
    echo "❌ 前端启动失败，请检查错误信息"
fi

echo ""
echo "🎯 现在默认连接到 Injective 测试网络!" 