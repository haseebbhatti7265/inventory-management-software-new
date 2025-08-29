// Application configuration using environment variables
export const config = {
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Inventory Management System',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  },
  storage: {
    prefix: import.meta.env.VITE_STORAGE_PREFIX || 'inventory_app_',
  },
  features: {
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    enableDebug: import.meta.env.VITE_ENABLE_DEBUG === 'true',
  },
} as const;

// Storage keys using the configured prefix
export const STORAGE_KEYS = {
  PRODUCTS: `${config.storage.prefix}products`,
  CATEGORIES: `${config.storage.prefix}categories`,
  STOCK_ENTRIES: `${config.storage.prefix}stock_entries`,
  SALES: `${config.storage.prefix}sales`,
} as const;