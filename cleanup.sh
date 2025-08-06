#!/bin/bash

# 项目清理脚本
echo "🧹 开始清理项目..."

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误: 请在项目根目录运行此脚本"
    exit 1
fi

# 清理 Hardhat 相关文件
echo "🗑️ 清理 Hardhat 缓存和构建文件..."
rm -rf cache/
rm -rf artifacts/
rm -rf typechain-types/
rm -rf typechain/

# 清理 Node.js 相关文件
echo "🗑️ 清理 Node.js 依赖..."
rm -rf node_modules/
rm -f package-lock.json
rm -f yarn.lock

# 清理前端相关文件（如果存在）
echo "🗑️ 清理前端相关文件..."
rm -rf frontend/
rm -rf dist/
rm -rf build/
rm -rf .next/

# 清理 IDE 和编辑器文件
echo "🗑️ 清理 IDE 文件..."
rm -rf .vscode/
rm -rf .idea/
rm -rf *.swp
rm -rf *.swo
rm -rf *~

# 清理日志文件
echo "🗑️ 清理日志文件..."
rm -f *.log
rm -f chain.log
rm -f hardhat.log

# 清理环境文件（保留示例文件）
echo "🗑️ 清理环境文件..."
find . -name ".env" -not -name ".env.example" -delete
find . -name ".env.local" -delete

# 清理临时文件
echo "🗑️ 清理临时文件..."
find . -name "*.tmp" -delete
find . -name "*.temp" -delete

# 清理 macOS 系统文件
echo "🗑️ 清理系统文件..."
find . -name ".DS_Store" -delete
find . -name "Thumbs.db" -delete

echo "✅ 清理完成！"
echo ""
echo "📋 清理内容："
echo "  - Hardhat 缓存和构建文件"
echo "  - Node.js 依赖"
echo "  - 前端构建文件"
echo "  - IDE 配置文件"
echo "  - 日志文件"
echo "  - 临时文件"
echo "  - 系统文件"
echo ""
echo "💡 提示：如果需要重新安装依赖，请运行："
echo "  npm install --legacy-peer-deps" 