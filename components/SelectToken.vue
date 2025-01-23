<!-- components/SelectToken.vue -->
<template>
    <div class="relative">
      <button
        @click="isOpen = !isOpen"
        class="flex items-center gap-2 px-3 py-1 bg-gray-600 rounded-lg hover:bg-gray-500"
      >
        <template v-if="modelValue">
          <img 
            :src="getTokenLogo(modelValue.symbol)" 
            class="w-5 h-5 rounded-full"
            :alt="modelValue.symbol"
          />
          <span>{{ modelValue.symbol }}</span>
        </template>
        <template v-else>
          <span>Select Token</span>
        </template>
        <Icon 
          name="lucide:chevron-down" 
          class="w-4 h-4"
          :class="{ 'rotate-180': isOpen }"
        />
      </button>
  
      <!-- Token Selection Modal -->
      <Transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <div
          v-if="isOpen"
          class="absolute top-full mt-2 w-72 bg-gray-800 rounded-xl shadow-lg z-50"
        >
          <div class="p-4">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-medium">Select a Token</h3>
              <button
                @click="isOpen = false"
                class="text-gray-400 hover:text-white"
              >
                <Icon name="lucide:x" class="w-5 h-5" />
              </button>
            </div>
  
            <!-- Search -->
            <div class="relative mb-4">
              <Icon
                name="lucide:search"
                class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
              />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search token name or paste address"
                class="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
  
            <!-- Token List -->
            <div class="max-h-96 overflow-y-auto">
              <button
                v-for="token in filteredTokens"
                :key="token.address"
                @click="selectToken(token)"
                class="w-full flex items-center gap-3 p-3 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <img 
                  :src="getTokenLogo(token.symbol)"
                  class="w-8 h-8 rounded-full"
                  :alt="token.symbol"
                />
                <div class="flex flex-col items-start">
                  <span class="font-medium">{{ token.symbol }}</span>
                  <span class="text-sm text-gray-400">{{ token.name }}</span>
                </div>
                <div v-if="token.balance" class="ml-auto text-right">
                  <span class="font-medium">{{ formatBalance(token.balance) }}</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  import type { Token } from '@/types'
  
  const props = defineProps<{
    modelValue: Token | null
    tokens: Token[]
  }>()
  
  const emit = defineEmits<{
    (e: 'update:modelValue', value: Token): void
  }>()
  
  const isOpen = ref(false)
  const searchQuery = ref('')
  
  const filteredTokens = computed(() => {
    if (!searchQuery.value) return props.tokens
    
    const query = searchQuery.value.toLowerCase()
    return props.tokens.filter(token => 
      token.symbol.toLowerCase().includes(query) ||
      token.name.toLowerCase().includes(query) ||
      token.address.toLowerCase().includes(query)
    )
  })
  
  const selectToken = (token: Token) => {
    emit('update:modelValue', token)
    isOpen.value = false
  }
  
  const getTokenLogo = (symbol: string) => {
    // TODO: Replace with actual token logo logic
    return `/tokens/${symbol.toLowerCase()}.png`
  }
  
  const formatBalance = (balance: string) => {
    return parseFloat(balance).toFixed(4)
  }
  
  // Close modal when clicking outside
  onClickOutside(isOpen)
  </script>