// types/index.ts
export interface Token {
    address: string
    name: string
    symbol: string
    decimals: number
    logoURI?: string
    balance?: string
    price?: number
  }
  
  export interface Pool {
    id: string
    token0: Token
    token1: Token
    reserve0: string
    reserve1: string
    totalSupply: string
    apr?: number
    volume24h?: number
    fees24h?: number
  }
  
  export interface Trade {
    inputAmount: string
    outputAmount: string
    route: Token[]
    priceImpact: number
    minimumReceived: string
    expectedPrice: string
    slippage: number
  }
  
  export interface TransactionState {
    hash?: string
    status: 'pending' | 'confirmed' | 'failed'
    summary?: string
    timestamp?: number
    action: 'swap' | 'addLiquidity' | 'removeLiquidity'
  }
  
  export interface TokenList {
    name: string
    timestamp: string
    version: {
      major: number
      minor: number
      patch: number
    }
    tokens: Token[]
    logoURI?: string
  }
  
  export interface Web3Error extends Error {
    code?: number
    data?: any
  }
  
  // Form Types
  export interface SwapForm {
    inputToken: Token | null
    outputToken: Token | null
    inputAmount: string
    outputAmount: string
    slippage: string
    deadline: number
  }
  
  export interface PoolForm {
    token0: Token | null
    token1: Token | null
    amount0: string
    amount1: string
  }
  
  // API Response Types
  export interface TokenPrice {
    symbol: string
    price: number
    change24h: number
    volume24h: number
    marketCap: number
  }
  
  export interface PoolStats {
    poolId: string
    tvl: number
    volume24h: number
    fees24h: number
    apr: number
  }
  
  // Store State Types
  export interface Web3State {
    account: string
    chainId: number
    isConnecting: boolean
    error: string | null
    transactions: Record<string, TransactionState>
  }
  
  export interface TokenState {
    tokens: Record<string, Token>
    lists: Record<string, TokenList>
    activeListUrls: string[]
    isLoading: boolean
    error: string | null
  }
  
  export interface PoolState {
    pools: Record<string, Pool>
    userPositions: Record<string, string>
    isLoading: boolean
    error: string | null
  }