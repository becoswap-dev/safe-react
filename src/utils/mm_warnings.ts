// https://docs.metamask.io/guide/ethereum-provider.html#ethereum-autorefreshonnetworkchange
export const disableMMAutoRefreshWarning = (): void => {
  if (window.kardiachain && window.kardiachain.isMetaMask) {
    window.kardiachain.autoRefreshOnNetworkChange = false
  }
}
