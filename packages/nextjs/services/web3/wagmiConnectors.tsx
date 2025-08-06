import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  coinbaseWallet,
  ledgerWallet,
  metaMaskWallet,
  rainbowWallet,
  safeWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { rainbowkitBurnerWallet } from "burner-connector";
import * as chains from "viem/chains";
import scaffoldConfig from "~~/scaffold.config";

const { onlyLocalBurnerWallet, targetNetworks } = scaffoldConfig;

// 优先使用 MetaMask，然后是其他钱包
const wallets = [
  metaMaskWallet, // MetaMask 放在第一位
  walletConnectWallet,
  ledgerWallet,
  coinbaseWallet,
  rainbowWallet,
  safeWallet,
  // 只在本地网络且启用 burner 钱包时添加
  ...(targetNetworks.some(network => network.id === (chains.hardhat as chains.Chain).id) && onlyLocalBurnerWallet
    ? [rainbowkitBurnerWallet]
    : []),
];

/**
 * wagmi connectors for the wagmi context
 */
export const wagmiConnectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [metaMaskWallet], // 推荐组只包含 MetaMask
    },
    {
      groupName: "Other Wallets",
      wallets: wallets.filter(wallet => wallet !== metaMaskWallet), // 其他钱包
    },
  ],

  {
    appName: "ExchangeEx Test Platform",
    projectId: scaffoldConfig.walletConnectProjectId,
  },
);
