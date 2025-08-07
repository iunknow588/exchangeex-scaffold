"use client";

import { useEffect, useState } from "react";
import { parseEther } from "viem";
import { useAccount } from "wagmi";
// 使用 Scaffold-ETH 2 自动生成的合约配置
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

export default function ExchangeTestPage() {
  const { address, isConnected } = useAccount();
  const [contractAddress, setContractAddress] = useState("0x178Fc07106BAda5d423003d62e8aABb0850e1713");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [defaultSubaccountID, setDefaultSubaccountID] = useState("");
  const [currentNonce, setCurrentNonce] = useState(0);
  const [currentSubaccountID, setCurrentSubaccountID] = useState("");
  const [mounted, setMounted] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  // 表单状态
  const [depositForm, setDepositForm] = useState({
    subaccountID: "",
    denom: "USDT",
    amount: "",
  });
  const [orderForm, setOrderForm] = useState({
    marketID: "INJ/USDT",
    subaccountID: "",
    price: "",
    quantity: "",
    cid: "",
  });
  const [cancelForm, setCancelForm] = useState({
    marketID: "INJ/USDT",
    subaccountID: "",
    orderHash: "",
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

  const { data: ownerAddress } = useScaffoldReadContract({
    contractName: "ExchangeEx",
    functionName: "owner",
  });

  const { writeAsync: authorizeTrader, data: authorizeData } = useScaffoldWriteContract("ExchangeEx");
  const { writeAsync: revokeTrader, data: revokeData } = useScaffoldWriteContract("ExchangeEx");
  const { writeAsync: deposit, data: depositData } = useScaffoldWriteContract("ExchangeEx");
  const { writeAsync: createSpotBuyOrder, data: buyOrderData } = useScaffoldWriteContract("ExchangeEx");
  const { writeAsync: createSpotSellOrder, data: sellOrderData } = useScaffoldWriteContract("ExchangeEx");
  const { writeAsync: createSpotMarketBuyOrder, data: marketBuyOrderData } = useScaffoldWriteContract("ExchangeEx");
  const { writeAsync: createSpotMarketSellOrder, data: marketSellOrderData } = useScaffoldWriteContract("ExchangeEx");
  const { writeAsync: cancelSpotOrder, data: cancelOrderData } = useScaffoldWriteContract("ExchangeEx");

  // 交易状态
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);
  const [isDepositing, setIsDepositing] = useState(false);
  const [isCreatingBuyOrder, setIsCreatingBuyOrder] = useState(false);
  const [isCreatingSellOrder, setIsCreatingSellOrder] = useState(false);
  const [isCreatingMarketBuyOrder, setIsCreatingMarketBuyOrder] = useState(false);
  const [isCreatingMarketSellOrder, setIsCreatingMarketSellOrder] = useState(false);
  const [isCancellingOrder, setIsCancellingOrder] = useState(false);

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
      setCancelForm(prev => ({ ...prev, subaccountID: defaultSubaccount }));
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

  useEffect(() => {
    if (ownerAddress && address) {
      setIsOwner(ownerAddress.toLowerCase() === address.toLowerCase());
    }
  }, [ownerAddress, address]);

  // 检查网络是否支持
  const isSupportedNetwork = true; // 暂时支持所有网络

  const handleAuthorizeTrader = async () => {
    if (!authorizeForm.trader) {
      notification.error("请输入交易员地址");
      return;
    }
    if (!isOwner) {
      notification.error("只有合约所有者才能授权交易员");
      return;
    }
    
    setIsAuthorizing(true);
    try {
      await authorizeTrader({ 
        args: [authorizeForm.trader as `0x${string}`],
        functionName: "authorizeTrader"
      });
      notification.success("授权交易员成功");
      setAuthorizeForm({ trader: "" });
    } catch (error) {
      notification.error("授权交易员失败: " + (error as Error).message);
      console.error(error);
    } finally {
      setIsAuthorizing(false);
    }
  };

  const handleRevokeTrader = async () => {
    if (!authorizeForm.trader) {
      notification.error("请输入交易员地址");
      return;
    }
    if (!isOwner) {
      notification.error("只有合约所有者才能撤销交易员权限");
      return;
    }
    
    setIsRevoking(true);
    try {
      await revokeTrader({ 
        args: [authorizeForm.trader as `0x${string}`],
        functionName: "revokeTrader"
      });
      notification.success("撤销交易员权限成功");
      setAuthorizeForm({ trader: "" });
    } catch (error) {
      notification.error("撤销交易员权限失败: " + (error as Error).message);
      console.error(error);
    } finally {
      setIsRevoking(false);
    }
  };

  const handleDeposit = async () => {
    if (!depositForm.subaccountID || !depositForm.denom || !depositForm.amount) {
      notification.error("请填写完整的存款信息");
      return;
    }
    if (!isAuthorized) {
      notification.error("您没有授权，无法进行存款操作");
      return;
    }
    
    setIsDepositing(true);
    try {
      await deposit({
        args: [depositForm.subaccountID, depositForm.denom, parseEther(depositForm.amount)],
        functionName: "deposit"
      });
      notification.success("存款成功");
      setDepositForm(prev => ({ ...prev, amount: "" }));
    } catch (error) {
      notification.error("存款失败: " + (error as Error).message);
      console.error(error);
    } finally {
      setIsDepositing(false);
    }
  };

  const handleCreateBuyOrder = async () => {
    if (!orderForm.marketID || !orderForm.subaccountID || !orderForm.price || !orderForm.quantity || !orderForm.cid) {
      notification.error("请填写完整的订单信息");
      return;
    }
    if (!isAuthorized) {
      notification.error("您没有授权，无法创建订单");
      return;
    }
    
    setIsCreatingBuyOrder(true);
    try {
      await createSpotBuyOrder({
        args: [
          orderForm.marketID,
          orderForm.subaccountID,
          parseEther(orderForm.price),
          parseEther(orderForm.quantity),
          orderForm.cid,
        ],
        functionName: "createSpotBuyOrder"
      });
      notification.success("创建买入订单成功");
      setOrderForm(prev => ({ ...prev, price: "", quantity: "", cid: "" }));
    } catch (error) {
      notification.error("创建买入订单失败: " + (error as Error).message);
      console.error(error);
    } finally {
      setIsCreatingBuyOrder(false);
    }
  };

  const handleCreateSellOrder = async () => {
    if (!orderForm.marketID || !orderForm.subaccountID || !orderForm.price || !orderForm.quantity || !orderForm.cid) {
      notification.error("请填写完整的订单信息");
      return;
    }
    if (!isAuthorized) {
      notification.error("您没有授权，无法创建订单");
      return;
    }
    
    setIsCreatingSellOrder(true);
    try {
      await createSpotSellOrder({
        args: [
          orderForm.marketID,
          orderForm.subaccountID,
          parseEther(orderForm.price),
          parseEther(orderForm.quantity),
          orderForm.cid,
        ],
        functionName: "createSpotSellOrder"
      });
      notification.success("创建卖出订单成功");
      setOrderForm(prev => ({ ...prev, price: "", quantity: "", cid: "" }));
    } catch (error) {
      notification.error("创建卖出订单失败: " + (error as Error).message);
      console.error(error);
    } finally {
      setIsCreatingSellOrder(false);
    }
  };

  const handleCreateMarketBuyOrder = async () => {
    if (!orderForm.marketID || !orderForm.subaccountID || !orderForm.quantity || !orderForm.cid) {
      notification.error("请填写完整的市价买入订单信息");
      return;
    }
    if (!isAuthorized) {
      notification.error("您没有授权，无法创建订单");
      return;
    }
    
    setIsCreatingMarketBuyOrder(true);
    try {
      await createSpotMarketBuyOrder({
        args: [
          orderForm.marketID,
          orderForm.subaccountID,
          parseEther(orderForm.quantity),
          orderForm.cid,
        ],
        functionName: "createSpotMarketBuyOrder"
      });
      notification.success("创建市价买入订单成功");
      setOrderForm(prev => ({ ...prev, quantity: "", cid: "" }));
    } catch (error) {
      notification.error("创建市价买入订单失败: " + (error as Error).message);
      console.error(error);
    } finally {
      setIsCreatingMarketBuyOrder(false);
    }
  };

  const handleCreateMarketSellOrder = async () => {
    if (!orderForm.marketID || !orderForm.subaccountID || !orderForm.quantity || !orderForm.cid) {
      notification.error("请填写完整的市价卖出订单信息");
      return;
    }
    if (!isAuthorized) {
      notification.error("您没有授权，无法创建订单");
      return;
    }
    
    setIsCreatingMarketSellOrder(true);
    try {
      await createSpotMarketSellOrder({
        args: [
          orderForm.marketID,
          orderForm.subaccountID,
          parseEther(orderForm.quantity),
          orderForm.cid,
        ],
        functionName: "createSpotMarketSellOrder"
      });
      notification.success("创建市价卖出订单成功");
      setOrderForm(prev => ({ ...prev, quantity: "", cid: "" }));
    } catch (error) {
      notification.error("创建市价卖出订单失败: " + (error as Error).message);
      console.error(error);
    } finally {
      setIsCreatingMarketSellOrder(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!cancelForm.marketID || !cancelForm.subaccountID || !cancelForm.orderHash || !cancelForm.cid) {
      notification.error("请填写完整的取消订单信息");
      return;
    }
    if (!isAuthorized) {
      notification.error("您没有授权，无法取消订单");
      return;
    }
    
    setIsCancellingOrder(true);
    try {
      await cancelSpotOrder({
        args: [
          cancelForm.marketID,
          cancelForm.subaccountID,
          cancelForm.orderHash,
          cancelForm.cid,
        ],
        functionName: "cancelSpotOrder"
      });
      notification.success("取消订单成功");
      setCancelForm(prev => ({ ...prev, orderHash: "", cid: "" }));
    } catch (error) {
      notification.error("取消订单失败: " + (error as Error).message);
      console.error(error);
    } finally {
      setIsCancellingOrder(false);
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
                  <p className="text-sm">授权状态: {isAuthorized ? "✅ 已授权" : "❌ 未授权"}</p>
                  <p className="text-sm">所有者状态: {isOwner ? "👑 合约所有者" : "👤 普通用户"}</p>
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
                    <span className="label-text">交易员地址</span>
                  </label>
                  <input
                    type="text"
                    placeholder="0x..."
                    value={authorizeForm.trader}
                    onChange={e => setAuthorizeForm({ trader: e.target.value })}
                    className="input input-bordered"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleAuthorizeTrader}
                    disabled={isAuthorizing || !authorizeForm.trader || !isOwner}
                    className="btn btn-primary"
                  >
                    {isAuthorizing ? "授权中..." : "授权交易员"}
                  </button>
                  <button
                    onClick={handleRevokeTrader}
                    disabled={isRevoking || !authorizeForm.trader || !isOwner}
                    className="btn btn-error"
                  >
                    {isRevoking ? "撤销中..." : "撤销权限"}
                  </button>
                </div>
                {!isOwner && (
                  <div className="alert alert-warning">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span>只有合约所有者才能管理权限</span>
                  </div>
                )}
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
                {!isAuthorized && (
                  <div className="alert alert-error">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>需要授权才能进行存款操作</span>
                  </div>
                )}
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
                    {isCreatingBuyOrder ? "创建中..." : "限价买入"}
                  </button>
                  <button
                    onClick={handleCreateSellOrder}
                    disabled={isCreatingSellOrder || !isAuthorized}
                    className="btn btn-error"
                  >
                    {isCreatingSellOrder ? "创建中..." : "限价卖出"}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleCreateMarketBuyOrder}
                    disabled={isCreatingMarketBuyOrder || !isAuthorized}
                    className="btn btn-info"
                  >
                    {isCreatingMarketBuyOrder ? "创建中..." : "市价买入"}
                  </button>
                  <button
                    onClick={handleCreateMarketSellOrder}
                    disabled={isCreatingMarketSellOrder || !isAuthorized}
                    className="btn btn-warning"
                  >
                    {isCreatingMarketSellOrder ? "创建中..." : "市价卖出"}
                  </button>
                </div>
                {!isAuthorized && (
                  <div className="alert alert-error">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>需要授权才能创建订单</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 取消订单 */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">取消订单</h2>
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">市场ID</span>
                  </label>
                  <input
                    type="text"
                    placeholder="INJ/USDT"
                    value={cancelForm.marketID}
                    onChange={e => setCancelForm({ ...cancelForm, marketID: e.target.value })}
                    className="input input-bordered"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">子账户ID</span>
                  </label>
                  <input
                    type="text"
                    value={cancelForm.subaccountID}
                    onChange={e => setCancelForm({ ...cancelForm, subaccountID: e.target.value })}
                    className="input input-bordered"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">订单哈希</span>
                  </label>
                  <input
                    type="text"
                    placeholder="0x..."
                    value={cancelForm.orderHash}
                    onChange={e => setCancelForm({ ...cancelForm, orderHash: e.target.value })}
                    className="input input-bordered"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">取消CID</span>
                  </label>
                  <input
                    type="text"
                    placeholder="取消订单CID"
                    value={cancelForm.cid}
                    onChange={e => setCancelForm({ ...cancelForm, cid: e.target.value })}
                    className="input input-bordered"
                  />
                </div>
                <button
                  onClick={handleCancelOrder}
                  disabled={isCancellingOrder || !isAuthorized}
                  className="btn btn-error w-full"
                >
                  {isCancellingOrder ? "取消中..." : "取消订单"}
                </button>
                {!isAuthorized && (
                  <div className="alert alert-error">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>需要授权才能取消订单</span>
                  </div>
                )}
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
              {revokeData?.hash && (
                <p className="text-error">
                  撤销交易: <span className="font-mono">{revokeData.hash}</span>
                </p>
              )}
              {depositData?.hash && (
                <p className="text-success">
                  存款交易: <span className="font-mono">{depositData.hash}</span>
                </p>
              )}
              {buyOrderData?.hash && (
                <p className="text-success">
                  限价买入订单: <span className="font-mono">{buyOrderData.hash}</span>
                </p>
              )}
              {sellOrderData?.hash && (
                <p className="text-error">
                  限价卖出订单: <span className="font-mono">{sellOrderData.hash}</span>
                </p>
              )}
              {marketBuyOrderData?.hash && (
                <p className="text-info">
                  市价买入订单: <span className="font-mono">{marketBuyOrderData.hash}</span>
                </p>
              )}
              {marketSellOrderData?.hash && (
                <p className="text-warning">
                  市价卖出订单: <span className="font-mono">{marketSellOrderData.hash}</span>
                </p>
              )}
              {cancelOrderData?.hash && (
                <p className="text-error">
                  取消订单: <span className="font-mono">{cancelOrderData.hash}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
