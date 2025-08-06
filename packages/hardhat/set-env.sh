#!/bin/bash

# 设置部署的环境变量
export CONTRACT_ADDRESS="0x178Fc07106BAda5d423003d62e8aABb0850e1713"
export DEPLOYMENT_TX_HASH="0x585d23995d1a02b1ba5e429d5c60e53f17c737f6253b839c7930973fbd7be74f"
export DEPLOYMENT_NETWORK="injTestnet"
export DEPLOYER_ADDRESS="0xd95C2810cfb43BdE49FDa151b17E732089DB75D7"

echo "✅ 环境变量已设置:"
echo "   CONTRACT_ADDRESS: $CONTRACT_ADDRESS"
echo "   DEPLOYMENT_TX_HASH: $DEPLOYMENT_TX_HASH"
echo "   DEPLOYMENT_NETWORK: $DEPLOYMENT_NETWORK"
echo "   DEPLOYER_ADDRESS: $DEPLOYER_ADDRESS"
echo ""
echo "🔗 区块浏览器链接:"
echo "   https://testnet.blockscout.injective.network/address/$CONTRACT_ADDRESS"
echo "   https://testnet.blockscout.injective.network/tx/$DEPLOYMENT_TX_HASH" 