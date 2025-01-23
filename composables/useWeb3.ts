// composables/useWeb3.ts
import { useWeb3Store } from '@/stores/web3'
import { storeToRefs } from 'pinia'

export function useWeb3() {
  const web3Store = useWeb3Store()
  
  // Destructure what we need from the store
  const {
    account,
    chainId,
    isConnecting,
    isConnected,
    shortAddress,
    networkName
  } = storeToRefs(web3Store)

  // Make a safe computed balance
  const balance = computed(() => {
    try {
      return web3Store.balance ? ethers.utils.formatEther(web3Store.balance) : '0.00'
    } catch {
      return '0.00'
    }
  })

  // Get store methods
  const {
    connect,
    disconnect,
    loadPool,
    formatEther,
    parseEther
  } = web3Store

  return {
    // Reactive state
    account,
    chainId,
    isConnecting,
    isConnected,
    shortAddress,
    balance,
    networkName,

    // Methods
    connect,
    disconnect,
    loadPool,
    formatEther,
    parseEther
  }
}

// Type declarations for Nuxt auto-imports
declare module '#app' {
  interface NuxtApp {
    $web3: ReturnType<typeof useWeb3>
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $web3: ReturnType<typeof useWeb3>
  }
}

export default defineNuxtPlugin(() => {
  return {
    provide: {
      web3: useWeb3()
    }
  }
})