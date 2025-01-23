<!-- pages/index.vue -->
<template>
    <div class="max-w-4xl mx-auto px-4 py-12">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-degen-primary mb-4">
          Create Your Meme Token
        </h1>
        <p class="text-xl text-gray-300">
          Launch your meme token in minutes with our safe and easy wizard
        </p>
      </div>
  
      <!-- Main Wizard -->
      <div class="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <!-- Progress Bar -->
        <div class="bg-gray-700 p-4">
          <div class="flex justify-between mb-2">
            <span class="text-sm text-gray-300">Step {{ currentStep }} of {{ totalSteps }}</span>
            <span class="text-sm text-gray-300">{{ Math.round((currentStep / totalSteps) * 100) }}% Complete</span>
          </div>
          <div class="h-2 bg-gray-600 rounded-full">
            <div 
              class="h-full bg-degen-primary rounded-full transition-all duration-300"
              :style="{ width: `${(currentStep / totalSteps) * 100}%` }"
            ></div>
          </div>
        </div>
  
        <!-- Step Content -->
        <div class="p-6">
          <!-- Step 1: Basic Info -->
          <div v-if="currentStep === 1" class="space-y-6">
            <h2 class="text-2xl font-semibold mb-4">Basic Token Info</h2>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Token Name
                </label>
                <input
                  v-model="tokenData.name"
                  type="text"
                  placeholder="e.g. Degen Coin"
                  class="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-degen-primary"
                />
              </div>
  
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Token Symbol
                </label>
                <input
                  v-model="tokenData.symbol"
                  type="text"
                  placeholder="e.g. DEGEN"
                  class="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-degen-primary uppercase"
                  maxlength="10"
                />
              </div>
            </div>
          </div>
  
          <!-- Step 2: Token Image & Description -->
          <div v-if="currentStep === 2" class="space-y-6">
            <h2 class="text-2xl font-semibold mb-4">Token Image & Description</h2>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Token Image URL
                </label>
                <input
                  v-model="tokenData.imageUri"
                  type="url"
                  placeholder="https:// or ipfs://"
                  class="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-degen-primary"
                />
              </div>
  
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  v-model="tokenData.description"
                  rows="4"
                  placeholder="Describe your meme token..."
                  class="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-degen-primary resize-none"
                ></textarea>
              </div>
            </div>
          </div>
  
          <!-- Step 3: Supply & Distribution -->
          <div v-if="currentStep === 3" class="space-y-6">
            <h2 class="text-2xl font-semibold mb-4">Token Supply</h2>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Initial Supply
                </label>
                <div class="relative">
                  <input
                    v-model="tokenData.initialSupply"
                    type="number"
                    min="1"
                    step="1"
                    placeholder="1,000,000"
                    class="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-degen-primary"
                  />
                  <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    tokens
                  </span>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Step 4: Review & Deploy -->
          <div v-if="currentStep === 4" class="space-y-6">
            <h2 class="text-2xl font-semibold mb-4">Review & Deploy</h2>
            
            <div class="space-y-4 bg-gray-700 p-4 rounded-lg">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <span class="text-sm text-gray-400">Name:</span>
                  <p class="font-medium">{{ tokenData.name }}</p>
                </div>
                <div>
                  <span class="text-sm text-gray-400">Symbol:</span>
                  <p class="font-medium">{{ tokenData.symbol }}</p>
                </div>
                <div>
                  <span class="text-sm text-gray-400">Initial Supply:</span>
                  <p class="font-medium">{{ formatNumber(tokenData.initialSupply) }}</p>
                </div>
              </div>
  
              <div class="mt-4">
                <span class="text-sm text-gray-400">Description:</span>
                <p class="font-medium">{{ tokenData.description }}</p>
              </div>
  
              <div class="mt-4">
                <span class="text-sm text-gray-400">Image:</span>
                <img 
                  :src="tokenData.imageUri" 
                  class="w-24 h-24 mt-2 rounded-lg object-cover"
                  alt="Token Image"
                />
              </div>
            </div>
  
            <!-- Deployment Status -->
            <div v-if="deploymentStatus" class="mt-4">
              <div 
                :class="[
                  'p-4 rounded-lg',
                  deploymentStatus === 'success' ? 'bg-green-900/50' : 
                  deploymentStatus === 'error' ? 'bg-red-900/50' : 
                  'bg-blue-900/50'
                ]"
              >
                <p class="flex items-center">
                  <Icon 
                    :name="
                      deploymentStatus === 'success' ? 'lucide:check-circle' :
                      deploymentStatus === 'error' ? 'lucide:x-circle' :
                      'lucide:loader'
                    "
                    class="w-5 h-5 mr-2"
                    :class="{ 'animate-spin': deploymentStatus === 'pending' }"
                  />
                  {{ deploymentMessage }}
                </p>
              </div>
            </div>
          </div>
  
          <!-- Navigation Buttons -->
          <div class="flex justify-between mt-8">
            <button
              v-if="currentStep > 1"
              @click="currentStep--"
              class="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
            >
              Back
            </button>
            <button
              v-if="currentStep < totalSteps"
              @click="nextStep"
              class="ml-auto px-6 py-2 bg-degen-primary hover:bg-degen-primary/80 rounded-lg"
              :disabled="!canProceed"
            >
              Next
            </button>
            <button
              v-else
              @click="deployToken"
              class="ml-auto px-6 py-2 bg-degen-primary hover:bg-degen-primary/80 rounded-lg"
              :disabled="isDeploying || !isConnected"
            >
              {{ isDeploying ? 'Deploying...' : isConnected ? 'Deploy Token' : 'Connect Wallet' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useWeb3 } from '@/composables/useWeb3'
  import { useLoadingStore } from '@/stores/loading'
  import { useNotificationStore } from '@/stores/notification'
  
  const { isConnected, connect } = useWeb3()
  const loading = useLoadingStore()
  const notifications = useNotificationStore()
  
  // Step management
  const currentStep = ref(1)
  const totalSteps = 4
  
  // Token data
  const tokenData = ref({
    name: '',
    symbol: '',
    imageUri: '',
    description: '',
    initialSupply: 1000000
  })
  
  // Deployment state
  const isDeploying = ref(false)
  const deploymentStatus = ref<'pending' | 'success' | 'error' | null>(null)
  const deploymentMessage = ref('')
  
  // Validation
  const canProceed = computed(() => {
    switch (currentStep.value) {
      case 1:
        return tokenData.value.name.length >= 3 && tokenData.value.symbol.length >= 2
      case 2:
        return tokenData.value.imageUri.startsWith('http') && tokenData.value.description.length >= 10
      case 3:
        return tokenData.value.initialSupply >= 1
      default:
        return true
    }
  })
  
  // Navigation
  const nextStep = () => {
    if (canProceed.value) {
      currentStep.value++
    }
  }
  
  // Token deployment
  const deployToken = async () => {
    if (!isConnected.value) {
      await connect()
      return
    }
  
    try {
      isDeploying.value = true
      deploymentStatus.value = 'pending'
      deploymentMessage.value = 'Deploying your token...'
  
      // TO DO: Implement actual deployment logic
      await new Promise(resolve => setTimeout(resolve, 2000))
  
      deploymentStatus.value = 'success'
      deploymentMessage.value = 'Token deployed successfully!'
      notifications.success('Token Deployed', 'Your meme token has been created!')
  
    } catch (error) {
      console.error('Deployment failed:', error)
      deploymentStatus.value = 'error'
      deploymentMessage.value = 'Deployment failed. Please try again.'
      notifications.error('Deployment Failed', 'Unable to deploy token. Please try again.')
    } finally {
      isDeploying.value = false
    }
  }
  
  // Utilities
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num)
  }
  </script>