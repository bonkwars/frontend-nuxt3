// stores/web3.ts
import { defineStore } from 'pinia'
import { ethers } from 'ethers'

// Types for window.ethereum
declare global {
  interface Window {
    ethereum?: ethers.BrowserProvider
  }
}
import { useNotificationStore } from './notification'

// Contract ABIs
import MemeDexFactoryABI from '@/abis/MemeDexFactory.json'
import MemePoolABI from '@/abis/MemePool.json'
import HydraOpenZeppelinABI from '@/abis/HydraOpenZeppelin.json'

export const useWeb3Store = defineStore('web3', {
  state: () => ({
    account: '',
    chainId: BigInt(0),
    isConnecting: false,
    error: '',
    balance: '0',
    provider: null as ethers.BrowserProvider | null,
    signer: null as ethers.Signer | null,
    contracts: {
      dexFactory: null as ethers.Contract | null,
      hydra: null as ethers.Contract | null,
      pools: {} as Record<string, ethers.Contract>
    },
    transactions: {} as Record<string, {
      hash: string
      status: 'pending' | 'completed' | 'failed'
      type: string
    }>
  }),

  getters: {
    isConnected: (state) => !!state.account,
    shortAddress: (state) => {
      if (!state.account) return ''
      return `${state.account.slice(0, 6)}...${state.account.slice(-4)}`
    },
    networkName: (state) => {
      switch (state.chainId) {
        case BigInt(1): return 'Ethereum'
        case BigInt(5): return 'Goerli'
        case BigInt(137): return 'Polygon'
        default: return 'Unknown Network'
      }
    }
  },

  actions: {
    async connect() {
      const notifications = useNotificationStore()
      
      try {
        this.isConnecting = true
        this.error = ''

        // Check if MetaMask is installed
        if (!window.ethereum) {
          throw new Error('Please install MetaMask')
        }

        // Request account access
        const [account] = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        })

        // Setup provider and signer
        if (!window.ethereum) {
          throw new Error('No Ethereum provider found')
        }
        
        this.provider = new ethers.BrowserProvider(window.ethereum, 'any')
        this.signer = this.provider.getSigner()
        
        // Get chain ID and balance
        const network = await this.provider.getNetwork()
        this.chainId = network.chainId
        this.account = account
        this.balance = await this.provider.getBalance(account).then(b => b.toString())

        // Initialize contracts
        await this.initializeContracts()

        // Setup event listeners
        window.ethereum.on('accountsChanged', this.handleAccountChange)
        window.ethereum.on('chainChanged', this.handleChainChange)
        window.ethereum.on('disconnect', this.handleDisconnect)

        notifications.success('Connected', 'Wallet connected successfully')
      } catch (error: any) {
        this.error = error.message
        notifications.error('Connection Failed', error.message)
        throw error
      } finally {
        this.isConnecting = false
      }
    },

    async disconnect() {
      this.account = ''
      this.balance = '0'
      this.provider = null
      this.signer = null
      this.contracts.dexFactory = null
      this.contracts.hydra = null
      this.contracts.pools = {}
      this.error = ''

      // Remove listeners
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', this.handleAccountChange)
        window.ethereum.removeListener('chainChanged', this.handleChainChange)
        window.ethereum.removeListener('disconnect', this.handleDisconnect)
      }

      const notifications = useNotificationStore()
      notifications.info('Disconnected', 'Wallet disconnected')
    },

    async initializeContracts() {
      if (!this.signer) return

      const config = useRuntimeConfig()
      
      // Initialize factory contract
      this.contracts.dexFactory = new ethers.Contract(
        config.public.memeDexFactoryAddress,
        MemeDexFactoryABI.abi,
        this.signer
      )

      // Initialize Hydra contract
      this.contracts.hydra = new ethers.Contract(
        config.public.hydraAddress,
        HydraOpenZeppelinABI.abi,
        this.signer
      )
    },

    async loadPool(tokenAddress: string) {
      if (!this.signer || !this.contracts.dexFactory) return null

      if (!this.contracts.pools[tokenAddress]) {
        const poolAddress = await this.contracts.dexFactory.getPool(tokenAddress)
        if (poolAddress && poolAddress !== ethers.ZeroAddress) {
          this.contracts.pools[tokenAddress] = new ethers.Contract(
            poolAddress,
            MemePoolABI.abi,
            this.signer
          )
        }
      }
      
      return this.contracts.pools[tokenAddress] || null
    },

    handleAccountChange(accounts: string[]) {
      if (accounts.length === 0) {
        this.disconnect()
      } else {
        this.account = accounts[0]
        this.loadBalance()
      }
    },

    handleChainChange() {
      window.location.reload()
    },

    handleDisconnect() {
      this.disconnect()
    },

    async loadBalance() {
      if (this.provider && this.account) {
        this.balance = await this.provider.getBalance(this.account).then(b => b.toString())
      }
    },

    // Utility function to format ether
    formatEther(value: string | undefined) {
      if (!value) return '0'
      try {
        return ethers.formatEther(value)
      } catch {
        return '0'
      }
    },

    // Utility function to parse ether
    parseEther(value: string) {
      return ethers.parseEther(value)
    }
  }
}) 