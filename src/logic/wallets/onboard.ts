import Onboard from 'bnc-onboard'
import { API, Wallet } from 'bnc-onboard/dist/src/interfaces'
import { store } from 'src/store'
import { _getChainId, getChainName } from 'src/config'
import { setWeb3 } from './getWeb3'
import { fetchProvider, removeProvider } from './store/actions'
import transactionDataCheck from './transactionDataCheck'


const customSDKWalletLogo = `
	<svg 
		height="40" 
		viewBox="0 0 40 40" 
		width="40" 
		xmlns="http://www.w3.org/2000/svg"
	>
		<path 
			d="m2744.99995 1155h9.99997" 
			fill="#617bff" 
		/>
	</svg>
`

// create custom wallet
const customExtensionWallet = {
	name: 'Kai',
	svg: customSDKWalletLogo,
	wallet: async helpers => {
		const { createModernProviderInterface } = helpers
		const provider = window.kardiachain;
		const correctWallet = true

		return {
			provider,
			interface: correctWallet ? createModernProviderInterface(provider) : null
		}
	},
  type: "injected" as any,
	link: 'https://some-extension-wallet.io',
	installMessage: wallets => {
		const { currentWallet, selectedWallet } = wallets
		if (currentWallet) {
			return `You have ${currentWallet} installed already but if you would prefer to use ${selectedWallet} instead, then click below to install.`
		}

		return `You will need to install ${selectedWallet} to continue. Click below to install.`
	},
	desktop: true
}

const getOnboardConfiguration = () => {
  let lastUsedAddress = ''
  let providerName: string | null = null
  let lastNetworkId = ''

  return {
    networkId: parseInt(_getChainId(), 10),
    // Is it mandatory for Ledger to work to send network name in lowercase
    networkName: getChainName().toLowerCase(),
    subscriptions: {
      wallet: (wallet: Wallet) => {
        if (wallet.provider) {
          // this function will intialize web3 and store it somewhere available throughout the dapp and
          // can also instantiate your contracts with the web3 instance
          setWeb3(wallet.provider)
          providerName = wallet.name
        }
      },
      address: (address: string) => {
        const networkId = _getChainId()

        if (!lastUsedAddress && address && providerName) {
          lastUsedAddress = address
          lastNetworkId = networkId
          store.dispatch(fetchProvider(providerName))
        }

        // we don't have an unsubscribe event so we rely on this
        if (!address && lastUsedAddress) {
          lastUsedAddress = ''
          providerName = null
          store.dispatch(removeProvider({ keepStorageKey: lastNetworkId !== networkId }))
        }
      },
    },
    walletSelect: {
      description: 'Please select a wallet to connect to Gnosis Safe',
      wallets: [ customExtensionWallet ],
    },
    walletCheck: [
      { checkName: 'derivationPath' },
      { checkName: 'connect' },
      { checkName: 'accounts' },
      { checkName: 'network' },
      transactionDataCheck(),
    ],
  }
}

let currentOnboardInstance: API
export const onboard = (): API => {
  const chainId = _getChainId()
  if (!currentOnboardInstance || currentOnboardInstance.getState().appNetworkId.toString() !== chainId) {
    currentOnboardInstance = Onboard(getOnboardConfiguration())
  }

  return currentOnboardInstance
}

export default onboard
