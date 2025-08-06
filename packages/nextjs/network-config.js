// 网络配置脚本
// 用于设置默认网络为 Injective 测试网

const networkConfig = {
  defaultNetwork: 'injTestnet',
  defaultChainId: 1439,
  rpcUrl: 'https://testnet.sentry.tm.injective.network:443',
  contractAddress: '0x178Fc07106BAda5d423003d62e8aABb0850e1713',
  blockExplorer: 'https://testnet.blockscout.injective.network'
};

// 设置环境变量
if (typeof window !== 'undefined') {
  window.NETWORK_CONFIG = networkConfig;
}

export default networkConfig; 