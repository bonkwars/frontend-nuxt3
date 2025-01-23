<!-- layouts/default.vue -->
<template>
    <div class="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <nav class="border-b border-gray-700">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="flex h-16 items-center justify-between">
            <!-- Logo & Desktop Nav -->
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <h1 class="text-xl font-bold text-green-400">Degen4Life</h1>
              </div>
              <div class="hidden md:block">
                <div class="ml-10 flex items-baseline space-x-4">
                  <NuxtLink 
                    to="/swap" 
                    class="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                  >
                    Swap
                  </NuxtLink>
                  <NuxtLink 
                    to="/pools" 
                    class="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                  >
                    Pools
                  </NuxtLink>
                  <NuxtLink 
                    to="/tokens" 
                    class="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                  >
                    Tokens
                  </NuxtLink>
                </div>
              </div>
            </div>
  
            <!-- Connect Wallet Button -->
            <div class="hidden md:block">
              <button
                :class="[
                  'flex items-center px-4 py-2 rounded-lg font-medium',
                  isConnected ? 'bg-gray-700 hover:bg-gray-600' : 'bg-blue-600 hover:bg-blue-500'
                ]"
                @click="handleConnect"
                :disabled="isConnecting"
              >
                <Icon name="lucide:wallet" class="w-4 h-4 mr-2" />
                <span v-if="isConnecting">Connecting...</span>
                <span v-else-if="isConnected">{{ shortAddress }}</span>
                <span v-else>Connect Wallet</span>
                <Icon 
                  v-if="isConnected" 
                  name="lucide:chevron-down" 
                  class="w-4 h-4 ml-2" 
                />
              </button>
            </div>
  
            <!-- Mobile menu button -->
            <div class="md:hidden">
              <button
                class="inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-700"
                @click="mobileMenuOpen = !mobileMenuOpen"
              >
                <Icon 
                  :name="mobileMenuOpen ? 'lucide:x' : 'lucide:menu'" 
                  class="w-6 h-6" 
                />
              </button>
            </div>
          </div>
        </div>
  
        <!-- Mobile menu -->
        <div 
          v-show="mobileMenuOpen" 
          class="md:hidden"
        >
          <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NuxtLink 
              to="/swap"
              class="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
            >
              Swap
            </NuxtLink>
            <NuxtLink 
              to="/pools"
              class="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
            >
              Pools
            </NuxtLink>
            <NuxtLink 
              to="/tokens"
              class="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
            >
              Tokens
            </NuxtLink>
          </div>
          <div class="px-4 py-3 border-t border-gray-700">
            <button
              class="w-full flex items-center justify-center px-4 py-2 rounded-lg font-medium bg-blue-600 hover:bg-blue-500"
              @click="handleConnect"
              :disabled="isConnecting"
            >
              <Icon name="lucide:wallet" class="w-4 h-4 mr-2" />
              <span v-if="isConnecting">Connecting...</span>
              <span v-else-if="isConnected">{{ shortAddress }}</span>
              <span v-else>Connect Wallet</span>
            </button>
          </div>
        </div>
      </nav>
  
      <!-- Main content -->
      <main class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <slot />
      </main>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useWeb3Store } from '@/stores/web3'
  
  const web3Store = useWeb3Store()
  
  const mobileMenuOpen = ref(false)
  const { 
    isConnecting,
    isConnected,
    shortAddress,
    connect: handleConnect 
  } = storeToRefs(web3Store)
  </script>