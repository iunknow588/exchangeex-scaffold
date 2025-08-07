#!/bin/bash

# ExchangeEx 合约测试环境启动脚本
# 使用方法: ./start-testing.sh

echo "🚀 启动 ExchangeEx 合约测试环境..."

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误: 请在项目根目录运行此脚本"
    exit 1
fi

# 检查依赖是否安装
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    yarn install
fi

# 启动本地区块链网络
echo "⛓️  启动本地区块链网络..."
yarn chain &
CHAIN_PID=$!

# 等待区块链网络启动
echo "⏳ 等待区块链网络启动..."
sleep 10

# 启动前端应用
echo "🌐 启动前端应用..."
yarn start &
FRONTEND_PID=$!

# 等待前端应用启动
echo "⏳ 等待前端应用启动..."
sleep 15

# 显示服务状态
echo ""
echo "✅ 测试环境启动完成！"
echo ""
echo "📋 服务状态:"
echo "   - 本地区块链: 运行中 (PID: $CHAIN_PID)"
echo "   - 前端应用: 运行中 (PID: $FRONTEND_PID)"
echo ""
echo "🌐 访问地址:"
echo "   - 主页: http://localhost:3000"
echo "   - 测试页面: http://localhost:3000/exchange-test"
echo "   - Debug 页面: http://localhost:3000/debug"
echo ""
echo "📚 测试文档:"
echo "   - 测试指南: packages/hardhat/TEST_GUIDE.md"
echo "   - 测试报告: packages/hardhat/TEST_REPORT.md"
echo "   - 测试总结: packages/hardhat/test-summary.md"
echo ""
echo "🔗 合约信息:"
echo "   - 合约地址: 0x178Fc07106BAda5d423003d62e8aABb0850e1713"
echo "   - 网络: Injective Testnet (Chain ID: 1439)"
echo "   - 区块浏览器: https://testnet.blockscout.injective.network"
echo ""
echo "💡 使用提示:"
echo "   1. 打开浏览器访问测试页面"
echo "   2. 连接 MetaMask 钱包"
echo "   3. 切换到 Injective 测试网"
echo "   4. 开始测试合约功能"
echo ""
echo "🛑 停止服务: 按 Ctrl+C"
echo ""

# 等待用户中断
trap "echo '🛑 正在停止服务...'; kill $CHAIN_PID $FRONTEND_PID 2>/dev/null; exit 0" INT

# 保持脚本运行
wait
