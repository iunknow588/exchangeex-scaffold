"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, CurrencyDollarIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <>
      <div className="flex items-center flex-col grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">ExchangeEx Test Platform</span>
            <span className="block text-lg mt-2 text-base-content/70">基于 Scaffold-ETH 2 的智能合约测试平台</span>
          </h1>
          <div className="flex justify-center items-center space-x-2 flex-col">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>

          <p className="text-center text-lg mt-4">测试 ExchangeEx_Standalone.sol 智能合约的各种功能</p>
        </div>

        <div className="grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col md:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <CurrencyDollarIcon className="h-8 w-8 fill-secondary" />
              <p>
                测试 ExchangeEx 合约功能，包括{" "}
                <Link href="/exchange-test" passHref className="link">
                  ExchangeEx 测试页面
                </Link>{" "}
                进行交易测试。
              </p>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <BugAntIcon className="h-8 w-8 fill-secondary" />
              <p>
                使用{" "}
                <Link href="/debug" passHref className="link">
                  Debug Contracts
                </Link>{" "}
                调试您的智能合约。
              </p>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <MagnifyingGlassIcon className="h-8 w-8 fill-secondary" />
              <p>
                通过{" "}
                <Link href="/blockexplorer" passHref className="link">
                  Block Explorer
                </Link>{" "}
                查看本地交易记录。
              </p>
            </div>
          </div>
        </div>

        {/* ExchangeEx 功能说明 */}
        <div className="w-full mt-8 px-8">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl">ExchangeEx 合约功能</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <h3 className="font-semibold text-lg mb-3">权限管理</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• 授权和撤销交易员权限</li>
                    <li>• 基于地址的访问控制</li>
                    <li>• 所有者权限管理</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-3">子账户管理</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• 生成和管理子账户ID</li>
                    <li>• 子账户间资金转移</li>
                    <li>• 外部账户转账</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-3">现货交易</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• 创建限价买入/卖出订单</li>
                    <li>• 创建市价买入/卖出订单</li>
                    <li>• 批量订单操作</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-3">衍生品交易</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• 创建衍生品限价订单</li>
                    <li>• 查询持仓信息</li>
                    <li>• 保证金管理</li>
                  </ul>
                </div>
              </div>
              <div className="card-actions justify-center mt-6">
                <Link href="/exchange-test" className="btn btn-primary">
                  开始测试 ExchangeEx 合约
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
