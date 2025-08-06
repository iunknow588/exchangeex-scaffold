import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys the ExchangeEx_Standalone contract
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployExchangeEx: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  console.log("🚀 开始部署 ExchangeEx_Standalone 合约...");
  console.log("👤 部署者地址:", deployer);

  // 检查账户余额
  const balance = await hre.ethers.provider.getBalance(deployer);
  console.log("💰 账户余额:", hre.ethers.formatEther(balance), "ETH");

  if (balance === 0n) {
    console.error("❌ 账户余额为0，无法支付部署费用");
    process.exit(1);
  }

  // 部署 ExchangeEx 合约
  const exchangeEx = await deploy("ExchangeEx", {
    from: deployer,
    // ExchangeEx 合约没有构造函数参数
    args: [],
    log: true,
    // 设置较高的 gas limit，因为合约较大
    gasLimit: 5000000,
    autoMine: true,
  });

  console.log("✅ ExchangeEx_Standalone 合约部署成功！");
  console.log("📋 合约地址:", exchangeEx.address);

  // 获取部署的合约实例
  const exchangeExContract = await hre.ethers.getContract<Contract>("ExchangeEx", deployer);

  // 验证合约所有者
  const owner = await exchangeExContract.owner();
  console.log("👤 合约所有者:", owner);
  console.log("🔗 所有者是否匹配部署者:", owner === deployer);

  // 测试基本功能
  console.log("\n🧪 测试基本功能:");

  // 获取默认子账户ID
  const defaultSubaccountID = await exchangeExContract.getDefaultSubaccountID();
  console.log("📝 默认子账户ID:", defaultSubaccountID);

  // 检查部署者是否已被授权
  const isAuthorized = await exchangeExContract.authorizedTraders(deployer);
  console.log("🔐 部署者是否已授权:", isAuthorized);

  console.log("\n🎯 部署完成！");
  console.log("📝 合约地址:", exchangeEx.address);
  console.log("👤 合约所有者:", owner);
  console.log("🔐 部署者授权状态:", isAuthorized);
};

export default deployExchangeEx;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags ExchangeEx
deployExchangeEx.tags = ["ExchangeEx"];
