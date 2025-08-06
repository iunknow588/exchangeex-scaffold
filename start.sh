#!/bin/bash

# ExchangeEx 测试平台启动脚本
echo "🚀 启动 ExchangeEx 测试平台..."

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误: 请在项目根目录运行此脚本"
    exit 1
fi

# 安装依赖（如果需要）
echo "📦 检查依赖..."
if [ ! -d "node_modules" ]; then
    echo "安装根目录依赖..."
    npm install --legacy-peer-deps
fi

if [ ! -d "packages/nextjs/node_modules" ]; then
    echo "安装前端依赖..."
    cd packages/nextjs && npm install && cd ../..
fi

if [ ! -d "packages/hardhat/node_modules" ]; then
    echo "安装合约依赖..."
    cd packages/hardhat && npm install && cd ../..
fi

# 编译合约
echo "🔨 编译智能合约..."
cd packages/hardhat
npm run compile
cd ../..

# 检查是否要测试 RPC 连接
if [ "$1" = "--test-rpc" ]; then
    echo "🌐 测试 RPC 连接..."
    cd packages/hardhat
    npx ts-node scripts/test-rpc.ts
    cd ../..
    echo "✅ RPC 测试完成"
    exit 0
fi

# 启动 Hardhat 节点（后台运行）
echo "⛓️ 启动本地区块链节点..."
cd packages/hardhat
nohup npm run chain > chain.log 2>&1 &
CHAIN_PID=$!
cd ../..

# 等待节点启动
echo "⏳ 等待区块链节点启动..."
sleep 5

# 部署合约
echo "📋 部署 ExchangeEx 合约..."
cd packages/hardhat
npm run deploy
cd ../..

# 启动前端应用
echo "🌐 启动前端应用..."
cd packages/nextjs
echo "✅ 前端应用将在 http://localhost:3000 启动"
echo "✅ ExchangeEx 测试页面: http://localhost:3000/exchange-test"
echo ""
echo "按 Ctrl+C 停止所有服务"
npm run dev 