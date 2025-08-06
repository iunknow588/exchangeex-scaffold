"use client";

import { useEffect, useState } from "react";
import { parseEther } from "viem";
import { useAccount } from "wagmi";
// 使用 Scaffold-ETH 2 自动生成的合约配置
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

export default function ExchangeTestPage() {
  const { address, isConnected } = useAccount();
  const [contractAddress, setContractAddress] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [defaultSubaccountID, setDefaultSubaccountID] = useState("");
  const [currentNonce, setCurrentNonce] = useState(0);
  const [currentSubaccountID, setCurrentSubaccountID] = useState("");
  const [mounted, setMounted] = useState(false);

  // 表单状态
  const [depositForm, setDepositForm] = useState({
    subaccountID: "",
    denom: "inj",
    amount: "",
  });
  const [orderForm, setOrderForm] = useState({
    marketID: "",
    subaccountID: "",
    price: "",
    quantity: "",
    cid: "",
  });
  const [authorizeForm, setAuthorizeForm] = useState({
    trader: "",
  });

  // 使用 Scaffold-ETH 2 的合约 hooks
  const { data: defaultSubaccount } = useScaffoldReadContract({
    contractName: "ExchangeEx",
    functionName: "getDefaultSubaccountID",
  });

  const { data: authorizedStatus } = useScaffoldReadContract({
    contractName: "ExchangeEx",
    functionName: "authorizedTraders",
    args: [address as `0x${string}`],
  });

  const { writeAsync: authorizeTrader, data: authorizeData } = useScaffoldWriteContract("ExchangeEx");
  const { writeAsync: deposit, data: depositData } = useScaffoldWriteContract("ExchangeEx");
  const { writeAsync: createSpotBuyOrder, data: buyOrderData } = useScaffoldWriteContract("ExchangeEx");
  const { writeAsync: createSpotSellOrder, data: sellOrderData } = useScaffoldWriteContract("ExchangeEx");

  // 交易状态
  const [isAuthorizing] = useState(false);
  const [isDepositing] = useState(false);
  const [isCreatingBuyOrder] = useState(false);
  const [isCreatingSellOrder] = useState(false);

  // 客户端挂载检查
  useEffect(() => {
    setMounted(true);
  }, []);

  // 更新状态
  useEffect(() => {
    if (defaultSubaccount) {
      setDefaultSubaccountID(defaultSubaccount);
      setDepositForm(prev => ({ ...prev, subaccountID: defaultSubaccount }));
      setOrderForm(prev => ({ ...prev, subaccountID: defaultSubaccount }));
    }
  }, [defaultSubaccount]);

  useEffect(() => {
    setIsAuthorized(!!authorizedStatus);
  }, [authorizedStatus]);

  useEffect(() => {
    if (currentNonce >= 0 && address) {
      // 生成子账户ID
      const nonceHex = currentNonce.toString(16).padStart(24, "0");
      setCurrentSubaccountID(`${address.slice(2)}${nonceHex}`);
    }
  }, [currentNonce, address]);

  // 检查网络是否支持
  const isSupportedNetwork = true; // 暂时支持所有网络

  const handleAuthorizeTrader = async () => {
    if (!authorizeForm.trader) {
      notification.error("请输入交易员地址");
      return;
    }
    try {
      await authorizeTrader({ args: [authorizeForm.trader as `0x${string}`] });
      notification.success("授权交易员成功");
    } catch (error) {
      notification.error("授权交易员失败");
      console.error(error);
    }
  };

  const handleDeposit = async () => {
    if (!depositForm.subaccountID || !depositForm.denom || !depositForm.amount) {
      notification.error("请填写完整的存款信息");
      return;
    }
    try {
      await deposit({
        args: [depositForm.subaccountID, depositForm.denom, parseEther(depositForm.amount)],
      });
      notification.success("存款成功");
    } catch (error) {
      notification.error("存款失败");
      console.error(error);
    }
  };

  const handleCreateBuyOrder = async () => {
    if (!orderForm.marketID || !orderForm.subaccountID || !orderForm.price || !orderForm.quantity || !orderForm.cid) {
      notification.error("请填写完整的订单信息");
      return;
    }
    try {
      await createSpotBuyOrder({
        args: [
          orderForm.marketID,
          orderForm.subaccountID,
          parseEther(orderForm.price),
          parseEther(orderForm.quantity),
          orderForm.cid,
        ],
      });
      notification.success("创建买入订单成功");
    } catch (error) {
      notification.error("创建买入订单失败");
      console.error(error);
    }
  };

  const handleCreateSellOrder = async () => {
    if (!orderForm.marketID || !orderForm.subaccountID || !orderForm.price || !orderForm.quantity || !orderForm.cid) {
      notification.error("请填写完整的订单信息");
      return;
    }
    try {
      await createSpotSellOrder({
        args: [
          orderForm.marketID,
          orderForm.subaccountID,
          parseEther(orderForm.price),
          parseEther(orderForm.quantity),
          orderForm.cid,
        ],
      });
      notification.success("创建卖出订单成功");
    } catch (error) {
      notification.error("创建卖出订单失败");
      console.error(error);
    }
  };

  // 客户端挂载前显示加载状态
  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">加载中...</h2>
            <p>正在初始化应用...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">ExchangeEx 测试页面</h2>
            <p className="mb-4">请先连接 MetaMask 钱包以继续测试</p>
            <div className="alert alert-info">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-current shrink-0 w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>
                <strong>推荐使用 MetaMask 钱包</strong>
                <br />
                请确保您的 MetaMask 已安装并解锁
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isSupportedNetwork) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">网络不支持</h2>
            <p className="mb-4">当前网络不支持，请切换到支持的网络</p>
            <div className="space-y-2">
              <button
                onClick={() => switchNetwork?.(31337)} // Hardhat
                className="btn btn-primary w-full"
              >
                切换到 Hardhat 本地网络
              </button>
              <button
                onClick={() => switchNetwork?.(888)} // Injective 测试网
                className="btn btn-secondary w-full"
              >
                切换到 Injective 测试网
              </button>
            </div>
            <div className="alert alert-warning mt-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <span>当前网络: Injective Testnet (ID: 1439)</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h1 className="card-title text-3xl">ExchangeEx 合约测试页面</h1>
            <p className="text-base-content/70">测试 ExchangeEx_Standalone.sol 合约的各种功能</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="card bg-primary/10">
                <div className="card-body">
                  <h3 className="card-title text-primary">连接状态</h3>
                  <p className="text-sm">地址: {address}</p>
                  <p className="text-sm">网络: Injective Testnet (ID: 1439)</p>
                  <p className="text-sm">授权状态: {isAuthorized ? "已授权" : "未授权"}</p>
                </div>
              </div>

              <div className="card bg-secondary/10">
                <div className="card-body">
                  <h3 className="card-title text-secondary">合约信息</h3>
                  <input
                    type="text"
                    placeholder="合约地址"
                    value={contractAddress}
                    onChange={e => setContractAddress(e.target.value)}
                    className="input input-bordered w-full"
                  />
                  <p className="text-sm mt-2">默认子账户: {defaultSubaccountID}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 权限管理 */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">权限管理</h2>
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">授权交易员地址</span>
                  </label>
                  <input
                    type="text"
                    placeholder="0x..."
                    value={authorizeForm.trader}
                    onChange={e => setAuthorizeForm({ trader: e.target.value })}
                    className="input input-bordered"
                  />
                </div>
                <button
                  onClick={handleAuthorizeTrader}
                  disabled={isAuthorizing || !authorizeForm.trader}
                  className="btn btn-primary w-full"
                >
                  {isAuthorizing ? "授权中..." : "授权交易员"}
                </button>
              </div>
            </div>
          </div>

          {/* 子账户管理 */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">子账户管理</h2>
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">子账户 Nonce</span>
                  </label>
                  <input
                    type="number"
                    value={currentNonce}
                    onChange={e => setCurrentNonce(parseInt(e.target.value) || 0)}
                    className="input input-bordered"
                  />
                </div>
                <div className="card bg-base-200">
                  <div className="card-body">
                    <p className="text-sm">当前子账户ID:</p>
                    <p className="text-sm font-mono break-all">{currentSubaccountID}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 存款功能 */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">存款功能</h2>
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">子账户ID</span>
                  </label>
                  <input
                    type="text"
                    value={depositForm.subaccountID}
                    onChange={e => setDepositForm({ ...depositForm, subaccountID: e.target.value })}
                    className="input input-bordered"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">代币类型</span>
                  </label>
                  <input
                    type="text"
                    value={depositForm.denom}
                    onChange={e => setDepositForm({ ...depositForm, denom: e.target.value })}
                    className="input input-bordered"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">数量</span>
                  </label>
                  <input
                    type="text"
                    placeholder="0.0"
                    value={depositForm.amount}
                    onChange={e => setDepositForm({ ...depositForm, amount: e.target.value })}
                    className="input input-bordered"
                  />
                </div>
                <button
                  onClick={handleDeposit}
                  disabled={isDepositing || !isAuthorized}
                  className="btn btn-success w-full"
                >
                  {isDepositing ? "存款中..." : "存款"}
                </button>
              </div>
            </div>
          </div>

          {/* 现货订单 */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">现货订单</h2>
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">市场ID</span>
                  </label>
                  <input
                    type="text"
                    placeholder="INJ/USDT"
                    value={orderForm.marketID}
                    onChange={e => setOrderForm({ ...orderForm, marketID: e.target.value })}
                    className="input input-bordered"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">子账户ID</span>
                  </label>
                  <input
                    type="text"
                    value={orderForm.subaccountID}
                    onChange={e => setOrderForm({ ...orderForm, subaccountID: e.target.value })}
                    className="input input-bordered"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">价格</span>
                    </label>
                    <input
                      type="text"
                      placeholder="0.0"
                      value={orderForm.price}
                      onChange={e => setOrderForm({ ...orderForm, price: e.target.value })}
                      className="input input-bordered"
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">数量</span>
                    </label>
                    <input
                      type="text"
                      placeholder="0.0"
                      value={orderForm.quantity}
                      onChange={e => setOrderForm({ ...orderForm, quantity: e.target.value })}
                      className="input input-bordered"
                    />
                  </div>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">CID</span>
                  </label>
                  <input
                    type="text"
                    placeholder="订单CID"
                    value={orderForm.cid}
                    onChange={e => setOrderForm({ ...orderForm, cid: e.target.value })}
                    className="input input-bordered"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleCreateBuyOrder}
                    disabled={isCreatingBuyOrder || !isAuthorized}
                    className="btn btn-success"
                  >
                    {isCreatingBuyOrder ? "创建中..." : "买入订单"}
                  </button>
                  <button
                    onClick={handleCreateSellOrder}
                    disabled={isCreatingSellOrder || !isAuthorized}
                    className="btn btn-error"
                  >
                    {isCreatingSellOrder ? "创建中..." : "卖出订单"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 交易状态 */}
        <div className="card bg-base-100 shadow-xl mt-6">
          <div className="card-body">
            <h2 className="card-title">交易状态</h2>
            <div className="space-y-2 text-sm">
              {authorizeData?.hash && (
                <p className="text-primary">
                  授权交易: <span className="font-mono">{authorizeData.hash}</span>
                </p>
              )}
              {depositData?.hash && (
                <p className="text-success">
                  存款交易: <span className="font-mono">{depositData.hash}</span>
                </p>
              )}
              {buyOrderData?.hash && (
                <p className="text-success">
                  买入订单交易: <span className="font-mono">{buyOrderData.hash}</span>
                </p>
              )}
              {sellOrderData?.hash && (
                <p className="text-error">
                  卖出订单交易: <span className="font-mono">{sellOrderData.hash}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
