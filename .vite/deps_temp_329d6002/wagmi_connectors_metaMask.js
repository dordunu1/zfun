"use client";
import {
  ConnectorNotFoundError,
  InjectedConnector,
  __privateAdd,
  __privateGet,
  __privateSet
} from "./chunk-EH4YT64S.js";
import "./chunk-FEESO44D.js";
import "./chunk-IODIOONO.js";
import "./chunk-2UU34GTM.js";
import "./chunk-55XFJABX.js";
import "./chunk-QCGPEAVX.js";
import {
  ResourceUnavailableRpcError,
  UserRejectedRequestError,
  getAddress
} from "./chunk-VQ35IVSK.js";
import "./chunk-NV6WWUQM.js";
import "./chunk-ZDM6JSZO.js";
import "./chunk-GWMKVQ4W.js";
import "./chunk-FV3PPQPS.js";
import "./chunk-256EKJAK.js";

// node_modules/@wagmi/connectors/dist/metaMask.js
var _UNSTABLE_shimOnConnectSelectAccount;
var MetaMaskConnector = class extends InjectedConnector {
  constructor({
    chains,
    options: options_
  } = {}) {
    const options = {
      name: "MetaMask",
      shimDisconnect: true,
      getProvider() {
        function getReady(ethereum2) {
          const isMetaMask = !!(ethereum2 == null ? void 0 : ethereum2.isMetaMask);
          if (!isMetaMask)
            return;
          if (ethereum2.isBraveWallet && !ethereum2._events && !ethereum2._state)
            return;
          if (ethereum2.isApexWallet)
            return;
          if (ethereum2.isAvalanche)
            return;
          if (ethereum2.isBitKeep)
            return;
          if (ethereum2.isBlockWallet)
            return;
          if (ethereum2.isCoin98)
            return;
          if (ethereum2.isFordefi)
            return;
          if (ethereum2.isMathWallet)
            return;
          if (ethereum2.isOkxWallet || ethereum2.isOKExWallet)
            return;
          if (ethereum2.isOneInchIOSWallet || ethereum2.isOneInchAndroidWallet)
            return;
          if (ethereum2.isOpera)
            return;
          if (ethereum2.isPortal)
            return;
          if (ethereum2.isRabby)
            return;
          if (ethereum2.isDefiant)
            return;
          if (ethereum2.isTokenPocket)
            return;
          if (ethereum2.isTokenary)
            return;
          if (ethereum2.isZeal)
            return;
          if (ethereum2.isZerion)
            return;
          return ethereum2;
        }
        if (typeof window === "undefined")
          return;
        const ethereum = window.ethereum;
        if (ethereum == null ? void 0 : ethereum.providers)
          return ethereum.providers.find(getReady);
        return getReady(ethereum);
      },
      ...options_
    };
    super({ chains, options });
    this.id = "metaMask";
    this.shimDisconnectKey = `${this.id}.shimDisconnect`;
    __privateAdd(this, _UNSTABLE_shimOnConnectSelectAccount, void 0);
    __privateSet(this, _UNSTABLE_shimOnConnectSelectAccount, options.UNSTABLE_shimOnConnectSelectAccount);
  }
  async connect({ chainId } = {}) {
    var _a, _b, _c, _d;
    try {
      const provider = await this.getProvider();
      if (!provider)
        throw new ConnectorNotFoundError();
      if (provider.on) {
        provider.on("accountsChanged", this.onAccountsChanged);
        provider.on("chainChanged", this.onChainChanged);
        provider.on("disconnect", this.onDisconnect);
      }
      this.emit("message", { type: "connecting" });
      let account = null;
      if (__privateGet(this, _UNSTABLE_shimOnConnectSelectAccount) && ((_a = this.options) == null ? void 0 : _a.shimDisconnect) && !((_b = this.storage) == null ? void 0 : _b.getItem(this.shimDisconnectKey))) {
        account = await this.getAccount().catch(() => null);
        const isConnected = !!account;
        if (isConnected)
          try {
            await provider.request({
              method: "wallet_requestPermissions",
              params: [{ eth_accounts: {} }]
            });
            account = await this.getAccount();
          } catch (error) {
            if (this.isUserRejectedRequestError(error))
              throw new UserRejectedRequestError(error);
            if (error.code === new ResourceUnavailableRpcError(error).code)
              throw error;
          }
      }
      if (!account) {
        const accounts = await provider.request({
          method: "eth_requestAccounts"
        });
        account = getAddress(accounts[0]);
      }
      let id = await this.getChainId();
      let unsupported = this.isChainUnsupported(id);
      if (chainId && id !== chainId) {
        const chain = await this.switchChain(chainId);
        id = chain.id;
        unsupported = this.isChainUnsupported(id);
      }
      if ((_c = this.options) == null ? void 0 : _c.shimDisconnect)
        (_d = this.storage) == null ? void 0 : _d.setItem(this.shimDisconnectKey, true);
      return { account, chain: { id, unsupported }, provider };
    } catch (error) {
      if (this.isUserRejectedRequestError(error))
        throw new UserRejectedRequestError(error);
      if (error.code === -32002)
        throw new ResourceUnavailableRpcError(error);
      throw error;
    }
  }
};
_UNSTABLE_shimOnConnectSelectAccount = /* @__PURE__ */ new WeakMap();
export {
  MetaMaskConnector
};
//# sourceMappingURL=wagmi_connectors_metaMask.js.map
