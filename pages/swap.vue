<!-- pages/swap.vue -->
<template>
    <div class="max-w-lg mx-auto">
      <div class="bg-gray-800 rounded-xl p-4 shadow-lg">
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold">Swap</h2>
          <button
            @click="showSettings = !showSettings"
            class="p-2 rounded-lg hover:bg-gray-700"
          >
            <Icon name="lucide:settings" class="w-5 h-5" />
          </button>
        </div>
  
        <!-- Settings Modal -->
        <div v-if="showSettings" class="mb-4 p-4 bg-gray-700 rounded-lg">
          <h3 class="text-sm font-medium mb-2">Slippage Tolerance</h3>
          <div class="flex gap-2">
            <button 
              v-for="preset in slippagePresets"
              :key="preset"
              :class="[
                'px-3 py-1 rounded-lg text-sm',
                slippage === preset ? 'bg-blue-600' : 'bg-gray-600'
              ]"
              @click="slippage = preset"
            >
              {{ preset }}%
            </button>
            <input
              v-model="slippage"
              type="number"
              class="w-20 px-3 py-1 text-sm rounded-lg bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Custom"
            />
            <span class="text-sm flex items-center">%</span>
          </div>
        </div>
  
        <!-- Input Token -->
        <div class="bg-gray-700 rounded-xl p-4 mb-2">
          <div class="flex justify-between mb-2">
            <input
              v-model="inputAmount"
              type="number"
              placeholder="0.0"
              class="bg-transparent text-2xl w-2/3 focus:outline-none"
            />
            <button class="flex items-center gap-2 px-3 py-1 bg-gray-600 rounded-lg hover:bg-gray-500">
              <img src="/eth-logo.svg" class="w-5 h-5" alt="ETH" />
              <span>ETH</span>
            </button>
          </div>
          <div class="text-gray-400 text-sm">
            Balance: {{ ethBalance }} ETH
          </div>
        </div>
  
        <!-- Swap Direction Button -->
        <div class="flex justify-center -my-2">
          <button 
            class="bg-gray-700 p-2 rounded-lg hover:bg-gray-600"
            @click="swapDirection"
          >
            <Icon name="lucide:arrow-down-up" class="w-5 h-5" />
          </button>
        </div>
  
        <!-- Output Token -->
        <div class="bg-gray-700 rounded-xl p-4 mt-2">
          <div class="flex justify-between mb-2">
            <input
              v-model="outputAmount"
              type="number"
              placeholder="0.0"
              class="bg-transparent text-2xl w-2/3 focus:outline-none"
              readonly
            />
            <SelectToken 
              v-model="selectedToken"
              :tokens="availableTokens"
            />
          </div>
          <div class="text-gray-400 text-sm">
            Balance: {{ selectedTokenBalance }}
          </div>
        </div>
  
        <!-- Price Impact & Route -->
        <div class="mt-4 space-y-2">
          <div class="flex justify-between text-sm text-gray-400">
            <span>Price Impact</span>
            <span :class="{ 'text-red-500': priceImpact > 5 }">
              {{ priceImpact.toFixed(2) }}%
            </span>
          </div>
          <div class="flex justify-between text-sm text-gray-400">
            <span>Route</span>
            <span>{{ route }}</span>
          </div>
        </div>
  
        <!-- Swap Button -->
        <button
          class="w-full mt-4 px-4 py-3 bg-blue-600 rounded-xl font-medium hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!isValid || isLoading"
          @click="executeSwap"
        >
          <span v-if="isLoading">
            <Icon name="lucide:loader" class="w-5 h-5 animate-spin" />
          </span>
          <span v-else>
            {{ buttonText }}
          </span>
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useWeb3Store } from '@/stores/web3'
  
  const web3Store = useWeb3Store()
  
  // State
  const inputAmount = ref('')
  const outputAmount = ref('')
  const slippage = ref('0.5')
  const showSettings = ref(false)
  const isLoading = ref(false)
  const selectedToken = ref(null)
  
  // Constants
  const slippagePresets = ['0.5', '1.0', '2.0']
  const availableTokens = [
    { symbol: 'DEGEN', address: '0x...' },
    { symbol: 'PEPE', address: '0x...' },
    // Add more tokens
  ]
  
  // Computed
  const ethBalance = computed(() => {
    return web3Store.balance ? web3Store.formatEther(web3Store.balance) : '0.00'
  })
  
  const selectedTokenBalance = computed(() => {
    if (!selectedToken.value) return '0.00'
    return '0.00' // TODO: Implement token balance lookup
  })
  
  const priceImpact = computed(() => {
    // TODO: Calculate price impact
    return 0
  })
  
  const route = computed(() => {
    return 'ETH > DEGEN'
  })
  
  const isValid = computed(() => {
    return inputAmount.value && outputAmount.value && selectedToken.value
  })
  
  const buttonText = computed(() => {
    if (!web3Store.isConnected) return 'Connect Wallet'
    if (!selectedToken.value) return 'Select a Token'
    if (!inputAmount.value) return 'Enter an Amount'
    return 'Swap'
  })
  
  // Methods
  const swapDirection = () => {
    const temp = inputAmount.value
    inputAmount.value = outputAmount.value
    outputAmount.value = temp
  }
  
  const executeSwap = async () => {
    try {
      isLoading.value = true
      // TODO: Implement swap logic
      await web3Store.executeSwap(
        selectedToken.value.address,
        inputAmount.value,
        outputAmount.value,
        slippage.value
      )
    } catch (error) {
      console.error('Swap failed:', error)
    } finally {
      isLoading.value = false
    }
  }
  </script>