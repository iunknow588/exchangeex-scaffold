#!/bin/bash

echo "正在设置SSH连接..."

# 启动SSH代理
echo "启动SSH代理..."
eval "$(ssh-agent -s)"

# 添加SSH密钥
echo "添加SSH密钥..."
ssh-add ~/.ssh/dell

# 检查密钥是否添加成功
echo "检查已添加的密钥..."
ssh-add -l

# 测试GitHub连接
echo "测试GitHub SSH连接..."
ssh -o ConnectTimeout=10 -T git@github.com

# 如果连接成功，设置Git远程仓库为SSH
if [ $? -eq 1 ]; then
    echo "SSH连接成功！正在设置Git远程仓库..."
    git remote set-url origin git@github.com:iunknow588/exchangeex-scaffold.git
    echo "远程仓库已设置为SSH模式"
else
    echo "SSH连接失败，请检查密钥是否正确添加到GitHub"
fi

echo "SSH设置完成！"
