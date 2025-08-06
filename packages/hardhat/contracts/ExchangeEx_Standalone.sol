// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// ============================================================================
// 独立版本的 ExchangeEx.sol - 包含所有必要依赖
// 可以直接复制到其他项目中使用
// ============================================================================

// ============================================================================
// CosmosTypes.sol - Cosmos 类型定义
// ============================================================================
library Cosmos {
    struct Coin {
        uint256 amount;
        string denom;
    }
}

// ============================================================================
// ExchangeTypes.sol - Exchange 类型定义
// ============================================================================
library ExchangeTypes {
    /// @dev User-defined type for exchange methods that can be approved. This 
    /// matches the MsgType type defined in the Exchange authz types.
    type MsgType is uint8;

    /// @dev Define all the exchange methods available for approval.
    MsgType public constant MsgType_Deposit = MsgType.wrap(1);
    MsgType public constant MsgType_Withdraw = MsgType.wrap(2);
    MsgType public constant MsgType_SubaccountTransfer = MsgType.wrap(3);
    MsgType public constant MsgType_ExternalTransfer = MsgType.wrap(4);
    MsgType public constant MsgType_IncreasePositionMargin = MsgType.wrap(5);
    MsgType public constant MsgType_DecreasePositionMargin = MsgType.wrap(6);
    MsgType public constant MsgType_BatchUpdateOrders = MsgType.wrap(7);
    MsgType public constant MsgType_CreateDerivativeLimitOrder = MsgType.wrap(8);
    MsgType public constant MsgType_BatchCreateDerivativeLimitOrders = MsgType.wrap(9);
    MsgType public constant MsgType_CreateDerivativeMarketOrder = MsgType.wrap(10);
    MsgType public constant MsgType_CancelDerivativeOrder = MsgType.wrap(11);
    MsgType public constant MsgType_BatchCancelDerivativeOrders = MsgType.wrap(12);
    MsgType public constant MsgType_CreateSpotLimitOrder = MsgType.wrap(13);
    MsgType public constant MsgType_BatchCreateSpotLimitOrders = MsgType.wrap(14);
    MsgType public constant MsgType_CreateSpotMarketOrder = MsgType.wrap(15);
    MsgType public constant MsgType_CancelSpotOrder = MsgType.wrap(16);
    MsgType public constant MsgType_BatchCancelSpotOrders = MsgType.wrap(17);
    MsgType public constant MsgType_Unknown = MsgType.wrap(18);
}

// ============================================================================
// Exchange.sol - Exchange 预编译合约接口
// ============================================================================
interface IExchangeModule {
    // ========================================================================
    // AUTHZ
    // ========================================================================
    struct Authorization {
        ExchangeTypes.MsgType method;
        Cosmos.Coin[] spendLimit;
        uint256 duration;
    }

    function approve(
        address grantee,
        Authorization[] calldata authorizations
    ) external returns (bool approved);

    function revoke(
        address grantee,
        ExchangeTypes.MsgType[] calldata methods
    ) external returns (bool revoked);

    function allowance(
        address grantee,
        address granter,
        ExchangeTypes.MsgType method
    ) external view returns (bool allowed);

    // ========================================================================
    // ACCOUNT QUERIES
    // ========================================================================
    function subaccountDeposit(
        string calldata subaccountID,
        string calldata denom
    ) external view returns (uint256 availableBalance, uint256 totalBalance);

    function subaccountDeposits(
        string calldata subaccountID,
        string calldata trader,
        uint32 subaccountNonce
    ) external view returns (SubaccountDepositData[] calldata deposits);

    struct SubaccountDepositData {
        string denom;
        uint256 availableBalance;
        uint256 totalBalance;
    }

    function subaccountPositions(
        string calldata subaccountID
    ) external view returns (DerivativePosition[] calldata positions);

    struct DerivativePosition {
        string subaccountID;
        string marketID;
        bool isLong;
        uint256 quantity;
        uint256 entryPrice;
        uint256 margin;
        uint256 cumulativeFundingEntry;
    }

    // ========================================================================
    // ACCOUNT TRANSACTIONS
    // ========================================================================
    function deposit(
        address sender,
        string calldata subaccountID,
        string calldata denom,
        uint256 amount
    ) external returns (bool success);

    function withdraw(
        address sender,
        string calldata subaccountID,
        string calldata denom,
        uint256 amount
    ) external returns (bool success);

    function subaccountTransfer(
        address sender,
        string calldata sourceSubaccountID,
        string calldata destinationSubaccountID,
        string calldata denom,
        uint256 amount
    ) external returns (bool success);

    function externalTransfer(
        address sender,
        string calldata sourceSubaccountID,
        string calldata destinationSubaccountID,
        string calldata denom,
        uint256 amount
    ) external returns (bool success);

    // ========================================================================
    // DERIVATIVE MARKETS TRANSACTIONS
    // ========================================================================
    struct DerivativeOrder {
        string marketID;
        string subaccountID;
        string feeRecipient;
        uint256 price;
        uint256 quantity;
        string cid;
        string orderType;
        uint256 margin;
        uint256 triggerPrice;
    }

    struct CreateDerivativeLimitOrderResponse {
        string orderHash;
        string cid;
    }

    function createDerivativeLimitOrder(
        address sender,
        DerivativeOrder calldata order
    ) external returns (CreateDerivativeLimitOrderResponse calldata response);

    // ========================================================================
    // SPOT MARKETS TRANSACTIONS
    // ========================================================================
    struct SpotOrder {
        string marketID;
        string subaccountID;
        string feeRecipient;
        uint256 price;
        uint256 quantity;
        string cid;
        string orderType;
        uint256 triggerPrice;
    }

    struct CreateSpotLimitOrderResponse {
        string orderHash;
        string cid;
    }

    struct CreateSpotMarketOrderResponse {
        string orderHash;
        string cid;
        uint256 quantity;
        uint256 price;
        uint256 fee;
    }

    struct BatchCreateSpotLimitOrdersResponse {
        string[] orderHashes;
        string[] createdOrdersCids;
        string[] failedOrdersCids;
    }

    struct OrderData {
        string marketID;
        string subaccountID;
        string orderHash;
        int32 orderMask;
        string cid;
    }

    function createSpotLimitOrder(
        address sender,
        SpotOrder calldata order
    ) external returns (CreateSpotLimitOrderResponse calldata response);

    function createSpotMarketOrder(
        address sender,
        SpotOrder calldata order
    ) external returns (CreateSpotMarketOrderResponse calldata response);

    function cancelSpotOrder(
        address sender,
        string calldata marketID,
        string calldata subaccountID,
        string calldata orderHash,
        string calldata cid
    ) external returns (bool success);

    function batchCreateSpotLimitOrders(
        address sender,
        SpotOrder[] calldata orders
    ) external returns (BatchCreateSpotLimitOrdersResponse calldata response);

    function batchCancelSpotOrders(
        address sender,
        OrderData[] calldata orderData
    ) external returns (bool[] calldata success);

    // ========================================================================
    // SPOT MARKETS QUERIES
    // ========================================================================
    struct SpotOrdersRequest {
        string marketID;
        string subaccountID;
        string[] orderHashes;
    }

    struct TrimmedSpotLimitOrder {
        uint256 price;
        uint256 quantity;
        uint256 fillable;
        bool isBuy;
        string orderHash;
        string cid;
    }

    function spotOrdersByHashes(
        SpotOrdersRequest calldata request
    ) external returns (TrimmedSpotLimitOrder[] calldata orders);
}

// ============================================================================
// ExchangeEx.sol - 主要合约
// ============================================================================
contract ExchangeEx {
    address constant exchangeContract = 0x0000000000000000000000000000000000000065;
    IExchangeModule exchange = IExchangeModule(exchangeContract);

    // 权限控制
    mapping(address => bool) public authorizedTraders;
    address public owner;

    // 事件定义
    event SpotOrderCreated(string marketID, string orderHash, string cid, string orderType);
    event SpotOrderCancelled(string marketID, string orderHash, bool success);
    event DerivativeOrderCreated(string marketID, string orderHash, string cid);
    event TraderAuthorized(address trader);
    event TraderRevoked(address trader);

    constructor() {
        owner = msg.sender;
        authorizedTraders[msg.sender] = true;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier onlyAuthorized() {
        require(authorizedTraders[msg.sender], "Not authorized trader");
        _;
    }

    // ========================================================================
    // 权限管理
    // ========================================================================
    function authorizeTrader(address trader) external onlyOwner {
        authorizedTraders[trader] = true;
        emit TraderAuthorized(trader);
    }

    function revokeTrader(address trader) external onlyOwner {
        authorizedTraders[trader] = false;
        emit TraderRevoked(trader);
    }

    // ========================================================================
    // 基础功能
    // ========================================================================
    function deposit(
        string calldata subaccountID,
        string calldata denom,
        uint256 amount
    ) external onlyAuthorized returns (bool) {
        try exchange.deposit(address(this), subaccountID, denom, amount) returns (bool success) {
            return success;
        } catch Error(string memory reason) {
            revert(string(abi.encodePacked("Deposit error: ", reason)));
        } catch {
            revert("Unknown error during deposit");
        }
    }

    function withdraw(
        string calldata subaccountID,
        string calldata denom,
        uint256 amount
    ) external onlyAuthorized returns (bool) {
        try exchange.withdraw(address(this), subaccountID, denom, amount) returns (bool success) {
            return success;
        } catch Error(string memory reason) {
            revert(string(abi.encodePacked("Withdraw error: ", reason)));
        } catch {
            revert("Unknown error during withdraw");
        }
    }

    function subaccountPositions(
        string calldata subaccountID
    ) external view returns (IExchangeModule.DerivativePosition[] memory positions) {
        return exchange.subaccountPositions(subaccountID);
    }

    function createDerivativeLimitOrder(
        IExchangeModule.DerivativeOrder calldata order
    ) external onlyAuthorized returns (IExchangeModule.CreateDerivativeLimitOrderResponse memory response) {
        try exchange.createDerivativeLimitOrder(address(this), order) returns (IExchangeModule.CreateDerivativeLimitOrderResponse memory resp) {
            emit DerivativeOrderCreated(order.marketID, resp.orderHash, resp.cid);
            return resp;
        } catch Error(string memory reason) {
            revert(string(abi.encodePacked("CreateDerivativeLimitOrder error: ", reason)));
        } catch {
            revert("Unknown error during createDerivativeLimitOrder");
        }
    }

    // ========================================================================
    // 现货市场功能
    // ========================================================================
    function createSpotLimitOrder(
        IExchangeModule.SpotOrder calldata order
    ) external onlyAuthorized returns (IExchangeModule.CreateSpotLimitOrderResponse memory response) {
        try exchange.createSpotLimitOrder(address(this), order) returns (IExchangeModule.CreateSpotLimitOrderResponse memory resp) {
            emit SpotOrderCreated(order.marketID, resp.orderHash, resp.cid, order.orderType);
            return resp;
        } catch Error(string memory reason) {
            revert(string(abi.encodePacked("CreateSpotLimitOrder error: ", reason)));
        } catch {
            revert("Unknown error during createSpotLimitOrder");
        }
    }

    function createSpotMarketOrder(
        IExchangeModule.SpotOrder calldata order
    ) external onlyAuthorized returns (IExchangeModule.CreateSpotMarketOrderResponse memory response) {
        try exchange.createSpotMarketOrder(address(this), order) returns (IExchangeModule.CreateSpotMarketOrderResponse memory resp) {
            emit SpotOrderCreated(order.marketID, resp.orderHash, resp.cid, order.orderType);
            return resp;
        } catch Error(string memory reason) {
            revert(string(abi.encodePacked("CreateSpotMarketOrder error: ", reason)));
        } catch {
            revert("Unknown error during createSpotMarketOrder");
        }
    }

    function cancelSpotOrder(
        string calldata marketID,
        string calldata subaccountID,
        string calldata orderHash,
        string calldata cid
    ) external onlyAuthorized returns (bool success) {
        try exchange.cancelSpotOrder(address(this), marketID, subaccountID, orderHash, cid) returns (bool result) {
            emit SpotOrderCancelled(marketID, orderHash, result);
            return result;
        } catch Error(string memory reason) {
            revert(string(abi.encodePacked("CancelSpotOrder error: ", reason)));
        } catch {
            revert("Unknown error during cancelSpotOrder");
        }
    }

    function getSpotOrders(
        string calldata marketID,
        string calldata subaccountID,
        string[] calldata orderHashes
    ) external returns (IExchangeModule.TrimmedSpotLimitOrder[] memory orders) {
        IExchangeModule.SpotOrdersRequest memory request = IExchangeModule.SpotOrdersRequest({
            marketID: marketID,
            subaccountID: subaccountID,
            orderHashes: orderHashes
        });
        return exchange.spotOrdersByHashes(request);
    }

    function batchCreateSpotLimitOrders(
        IExchangeModule.SpotOrder[] calldata orders
    ) external onlyAuthorized returns (IExchangeModule.BatchCreateSpotLimitOrdersResponse memory response) {
        try exchange.batchCreateSpotLimitOrders(address(this), orders) returns (IExchangeModule.BatchCreateSpotLimitOrdersResponse memory resp) {
            for (uint i = 0; i < resp.orderHashes.length; i++) {
                emit SpotOrderCreated(orders[i].marketID, resp.orderHashes[i], resp.createdOrdersCids[i], orders[i].orderType);
            }
            return resp;
        } catch Error(string memory reason) {
            revert(string(abi.encodePacked("BatchCreateSpotLimitOrders error: ", reason)));
        } catch {
            revert("Unknown error during batchCreateSpotLimitOrders");
        }
    }

    function batchCancelSpotOrders(
        IExchangeModule.OrderData[] calldata orderData
    ) external onlyAuthorized returns (bool[] memory success) {
        try exchange.batchCancelSpotOrders(address(this), orderData) returns (bool[] memory results) {
            for (uint i = 0; i < orderData.length; i++) {
                emit SpotOrderCancelled(orderData[i].marketID, orderData[i].orderHash, results[i]);
            }
            return results;
        } catch Error(string memory reason) {
            revert(string(abi.encodePacked("BatchCancelSpotOrders error: ", reason)));
        } catch {
            revert("Unknown error during batchCancelSpotOrders");
        }
    }

    // ========================================================================
    // 便捷功能
    // ========================================================================
    function createSpotBuyOrder(
        string calldata marketID,
        string calldata subaccountID,
        uint256 price,
        uint256 quantity,
        string calldata cid
    ) external onlyAuthorized returns (IExchangeModule.CreateSpotLimitOrderResponse memory response) {
        IExchangeModule.SpotOrder memory order = IExchangeModule.SpotOrder({
            marketID: marketID,
            subaccountID: subaccountID,
            feeRecipient: toAsciiString(address(this)),
            price: price,
            quantity: quantity,
            cid: cid,
            orderType: "buy",
            triggerPrice: 0
        });
        return this.createSpotLimitOrder(order);
    }

    function createSpotSellOrder(
        string calldata marketID,
        string calldata subaccountID,
        uint256 price,
        uint256 quantity,
        string calldata cid
    ) external onlyAuthorized returns (IExchangeModule.CreateSpotLimitOrderResponse memory response) {
        IExchangeModule.SpotOrder memory order = IExchangeModule.SpotOrder({
            marketID: marketID,
            subaccountID: subaccountID,
            feeRecipient: toAsciiString(address(this)),
            price: price,
            quantity: quantity,
            cid: cid,
            orderType: "sell",
            triggerPrice: 0
        });
        return this.createSpotLimitOrder(order);
    }

    function createSpotMarketBuyOrder(
        string calldata marketID,
        string calldata subaccountID,
        uint256 quantity,
        string calldata cid
    ) external onlyAuthorized returns (IExchangeModule.CreateSpotMarketOrderResponse memory response) {
        IExchangeModule.SpotOrder memory order = IExchangeModule.SpotOrder({
            marketID: marketID,
            subaccountID: subaccountID,
            feeRecipient: toAsciiString(address(this)),
            price: 0,
            quantity: quantity,
            cid: cid,
            orderType: "buy",
            triggerPrice: 0
        });
        return this.createSpotMarketOrder(order);
    }

    function createSpotMarketSellOrder(
        string calldata marketID,
        string calldata subaccountID,
        uint256 quantity,
        string calldata cid
    ) external onlyAuthorized returns (IExchangeModule.CreateSpotMarketOrderResponse memory response) {
        IExchangeModule.SpotOrder memory order = IExchangeModule.SpotOrder({
            marketID: marketID,
            subaccountID: subaccountID,
            feeRecipient: toAsciiString(address(this)),
            price: 0,
            quantity: quantity,
            cid: cid,
            orderType: "sell",
            triggerPrice: 0
        });
        return this.createSpotMarketOrder(order);
    }

    // ========================================================================
    // 子账户管理
    // ========================================================================
    function generateSubaccountID(uint32 nonce) public view returns (string memory) {
        string memory nonceHex = toHexString(nonce);
        while (bytes(nonceHex).length < 24) {
            nonceHex = string(abi.encodePacked("0", nonceHex));
        }
        return string(abi.encodePacked(toAsciiString(address(this)), nonceHex));
    }

    function getDefaultSubaccountID() public view returns (string memory) {
        return generateSubaccountID(0);
    }

    function getSubaccountID(uint32 nonce) public view returns (string memory) {
        return generateSubaccountID(nonce);
    }

    function getSubaccountDeposit(
        string calldata subaccountID,
        string calldata denom
    ) external view returns (uint256 availableBalance, uint256 totalBalance) {
        return exchange.subaccountDeposit(subaccountID, denom);
    }

    function getSubaccountDeposits(
        string calldata subaccountID
    ) external view returns (IExchangeModule.SubaccountDepositData[] memory deposits) {
        return exchange.subaccountDeposits(subaccountID, toAsciiString(address(this)), 0);
    }

    function transferBetweenSubaccounts(
        string calldata sourceSubaccountID,
        string calldata destinationSubaccountID,
        string calldata denom,
        uint256 amount
    ) external onlyAuthorized returns (bool success) {
        try exchange.subaccountTransfer(address(this), sourceSubaccountID, destinationSubaccountID, denom, amount) returns (bool result) {
            return result;
        } catch Error(string memory reason) {
            revert(string(abi.encodePacked("SubaccountTransfer error: ", reason)));
        } catch {
            revert("Unknown error during subaccountTransfer");
        }
    }

    function transferToExternalSubaccount(
        string calldata sourceSubaccountID,
        string calldata destinationSubaccountID,
        string calldata denom,
        uint256 amount
    ) external onlyAuthorized returns (bool success) {
        try exchange.externalTransfer(address(this), sourceSubaccountID, destinationSubaccountID, denom, amount) returns (bool result) {
            return result;
        } catch Error(string memory reason) {
            revert(string(abi.encodePacked("ExternalTransfer error: ", reason)));
        } catch {
            revert("Unknown error during externalTransfer");
        }
    }

    // ========================================================================
    // 辅助功能
    // ========================================================================
    function toAsciiString(address x) internal pure returns (string memory) {
        bytes memory s = new bytes(40);
        for (uint i = 0; i < 20; i++) {
            bytes1 b = bytes1(uint8(uint(uint160(x)) / (2**(8*(19 - i)))));
            bytes1 hi = bytes1(uint8(b) / 16);
            bytes1 lo = bytes1(uint8(b) - 16 * uint8(hi));
            s[2*i] = char(hi);
            s[2*i+1] = char(lo);
        }
        return string(s);
    }

    function toHexString(uint32 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 16;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint8(value & 0xf)));
            if (uint8(value & 0xf) > 9) {
                buffer[digits] = bytes1(uint8(87 + uint8(value & 0xf)));
            }
            value >>= 4;
        }
        return string(buffer);
    }

    function char(bytes1 b) internal pure returns (bytes1 c) {
        if (uint8(b) < 10) return bytes1(uint8(b) + 0x30);
        else return bytes1(uint8(b) + 0x57);
    }

    function batchDepositToSubaccounts(
        uint32[] calldata nonces,
        string calldata denom,
        uint256[] calldata amounts
    ) external onlyAuthorized returns (bool[] memory) {
        require(nonces.length == amounts.length, "Array lengths must match");
        bool[] memory results = new bool[](nonces.length);
        for (uint i = 0; i < nonces.length; i++) {
            string memory subaccountID = generateSubaccountID(nonces[i]);
            try exchange.deposit(address(this), subaccountID, denom, amounts[i]) returns (bool success) {
                results[i] = success;
            } catch {
                results[i] = false;
            }
        }
        return results;
    }

    function batchWithdrawFromSubaccounts(
        uint32[] calldata nonces,
        string calldata denom,
        uint256[] calldata amounts
    ) external onlyAuthorized returns (bool[] memory) {
        require(nonces.length == amounts.length, "Array lengths must match");
        bool[] memory results = new bool[](nonces.length);
        for (uint i = 0; i < nonces.length; i++) {
            string memory subaccountID = generateSubaccountID(nonces[i]);
            try exchange.withdraw(address(this), subaccountID, denom, amounts[i]) returns (bool success) {
                results[i] = success;
            } catch {
                results[i] = false;
            }
        }
        return results;
    }

    function getAllSubaccountDeposits(uint32[] calldata nonces) external view returns (IExchangeModule.SubaccountDepositData[][] memory allDeposits) {
        allDeposits = new IExchangeModule.SubaccountDepositData[][](nonces.length);
        for (uint i = 0; i < nonces.length; i++) {
            string memory subaccountID = generateSubaccountID(nonces[i]);
            allDeposits[i] = exchange.subaccountDeposits(subaccountID, toAsciiString(address(this)), 0);
        }
        return allDeposits;
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function emergencyWithdraw() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
} 