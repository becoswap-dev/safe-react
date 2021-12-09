import { WalletInitOptions } from 'bnc-onboard/dist/src/interfaces'

import { getRpcServiceUrl, getDisabledWallets, _getChainId } from 'src/config'
import { WALLETS } from 'src/config/chain.d'
import { FORTMATIC_KEY, PORTIS_ID } from 'src/utils/constants'

type Wallet = WalletInitOptions & {
  desktop: boolean
  walletName: WALLETS
}

const wallets = (): Wallet[] => {

  return [
    { walletName: WALLETS.KAI, desktop: false },
  ]
}

export const getSupportedWallets = (): WalletInitOptions[] => {
  if (window.isDesktop) {
    return wallets()
      .filter((wallet) => wallet.desktop)
      .map(({ desktop, ...rest }) => rest)
  }

  return wallets()
    .map(({ desktop, ...rest }) => rest)
}
