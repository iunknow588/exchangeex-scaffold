#!/bin/bash

echo "🔒 Injective 测试网私钥安全检查"
echo "=================================="

# 检查 .env 文件是否存在
if [ -f ".env" ]; then
    echo "✅ .env 文件存在"
    
    # 检查 .env 文件权限
    PERMISSIONS=$(stat -c %a .env)
    if [ "$PERMISSIONS" = "600" ]; then
        echo "✅ .env 文件权限正确 (600)"
    else
        echo "⚠️  .env 文件权限不正确: $PERMISSIONS"
        echo "   建议运行: chmod 600 .env"
    fi
    
    # 检查是否包含示例私钥
    if grep -q "your private key without 0x prefix" .env; then
        echo "⚠️  检测到示例私钥，请替换为真实私钥"
    else
        echo "✅ 私钥已配置"
    fi
else
    echo "❌ .env 文件不存在"
    echo "   运行: cp .example.env .env"
fi

# 检查 .gitignore
if grep -q "\.env" .gitignore; then
    echo "✅ .env 在 .gitignore 中"
else
    echo "❌ .env 不在 .gitignore 中"
    echo "   建议添加 .env 到 .gitignore"
fi

# 检查 Git 状态
if [ -d ".git" ]; then
    if git ls-files --error-unmatch .env >/dev/null 2>&1; then
        echo "❌ .env 文件已被 Git 跟踪"
        echo "   建议运行: git rm --cached .env"
    else
        echo "✅ .env 文件未被 Git 跟踪"
    fi
fi

echo ""
echo "🔐 安全建议:"
echo "1. 使用硬件钱包管理私钥"
echo "2. 定期更换测试网私钥"
echo "3. 不要在代码中硬编码私钥"
echo "4. 使用环境变量管理私钥"
echo "5. 定期备份私钥（加密存储）"
echo "6. 监控账户活动" 