import * as chains from "viem/chains";

// 定义 Injective 测试网 - 根据官方文档更新
const injTestnet = {
  id: 1439,
  name: "Injective Testnet",
  network: "injective-testnet",
  nativeCurrency: {
    decimals: 18,
    name: "INJ",
    symbol: "INJ",
  },
  rpcUrls: {
    public: { http: ["https://k8s.testnet.json-rpc.injective.network/"] },
    default: { http: ["https://k8s.testnet.json-rpc.injective.network/"] },
  },
  blockExplorers: {
    default: { name: "Blockscout", url: "https://testnet.blockscout.injective.network" },
  },
  contracts: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 1,
    },
  },
} as const;

export type BaseConfig = {
  targetNetworks: readonly chains.Chain[];
  pollingInterval: number;
  alchemyApiKey: string;
  rpcOverrides?: Record<number, string>;
  walletConnectProjectId: string;
  onlyLocalBurnerWallet: boolean;
};

export type ScaffoldConfig = BaseConfig;

export const DEFAULT_ALCHEMY_API_KEY = "oKxs-03sij-U_N0iOlrSsZFr29-IqbuF";

const scaffoldConfig = {
  // The networks on which your DApp is live
  targetNetworks: [
    injTestnet, // Injective 测试网作为默认网络
  ],
  // The interval at which your front-end polls the RPC servers for new data (it has no effect if you only target the local network (default is 4000))
  pollingInterval: 30000,
  // This is ours Alchemy's default API key.
  // You can get your own at https://dashboard.alchemyapi.io
  // It's recommended to store it in an env variable:
  // .env.local for local testing, and in the Vercel/system env config for live apps.
  alchemyApiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || DEFAULT_ALCHEMY_API_KEY,
  // If you want to use a different RPC for a specific network, you can add it here.
  // The key is the chain ID, and the value is the HTTP RPC URL
  rpcOverrides: {
    // Injective 测试网 RPC 端点 - 根据官方文档更新
    [injTestnet.id]: process.env.NEXT_PUBLIC_INJECTIVE_RPC_URL || "https://k8s.testnet.json-rpc.injective.network/",
  },
  // This is ours WalletConnect's default project ID.
  // You can get your own at https://cloud.walletconnect.com
  // It's recommended to store it in an env variable:
  // .env.local for local testing, and in the Vercel/system env config for live apps.
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "3a8170812b534d0ff9d794f19a901d64",
  onlyLocalBurnerWallet: false, // 禁用本地 burner 钱包，优先使用 MetaMask
} as const satisfies ScaffoldConfig;

export default scaffoldConfig;
