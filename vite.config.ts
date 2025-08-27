import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { fileURLToPath } from "url";

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    // Server Configuration
    server: {
      // Use IPv6 host to listen on all network interfaces
      host: "::",
      // Default port (will auto-increment if busy)
      port: 8080,
      // Automatically open browser on server start
      open: false,
      // Enable CORS for development
      cors: true,
      // Proxy configuration for API calls (if needed)
      // proxy: {
      //   '/api': {
      //     target: 'http://localhost:3000',
      //     changeOrigin: true,
      //   }
      // },
      // HMR (Hot Module Replacement) configuration
      hmr: {
        // Use WebSocket for HMR
        protocol: 'ws',
        // Port for HMR WebSocket (defaults to server.port)
        port: 8080,
      },
      // Watch options for file changes
      watch: {
        // Ignore node_modules to improve performance
        ignored: ['**/node_modules/**', '**/dist/**'],
      },
    },

    // Build Configuration
    build: {
      // Output directory
      outDir: 'dist',
      // Assets directory (relative to outDir)
      assetsDir: 'assets',
      // Enable source maps for production debugging
      sourcemap: mode === 'development',
      // Rollup options for advanced configuration
      rollupOptions: {
        output: {
          // Manual chunking for better caching
          manualChunks: {
            // Vendor chunk for React and related libraries
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            // UI library chunk
            'ui-vendor': [
              '@radix-ui/react-dialog',
              '@radix-ui/react-dropdown-menu',
              '@radix-ui/react-toast',
            ],
            // Utility libraries chunk
            'utils-vendor': ['clsx', 'tailwind-merge', 'date-fns'],
          },
          // Asset file naming
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name?.split('.');
            const ext = info?.[info.length - 1];
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext || '')) {
              return `assets/images/[name]-[hash][extname]`;
            }
            if (/woff2?|ttf|otf|eot/i.test(ext || '')) {
              return `assets/fonts/[name]-[hash][extname]`;
            }
            return `assets/[name]-[hash][extname]`;
          },
          // Chunk file naming
          chunkFileNames: 'assets/js/[name]-[hash].js',
          // Entry file naming
          entryFileNames: 'assets/js/[name]-[hash].js',
        },
      },
      // Minification options
      minify: mode === 'production' ? 'terser' : false,
      // Terser options for production
      terserOptions: mode === 'production' ? {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      } : undefined,
      // Chunk size warning limit (in KB)
      chunkSizeWarningLimit: 1000,
      // Target browsers
      target: 'esnext',
      // CSS code splitting
      cssCodeSplit: true,
      // Assets inline limit (4kb)
      assetsInlineLimit: 4096,
    },

    // Plugin Configuration
    plugins: [
      // React plugin with SWC for fast compilation
      react({
        // Use SWC instead of Babel for faster builds
        // SWC is a Rust-based compiler that's much faster than Babel
        // Enable React Fast Refresh
        fastRefresh: true,
        // JSX runtime configuration
        jsxRuntime: 'automatic',
        // Development mode optimizations
        development: mode === 'development',
      }),
    ].filter(Boolean),

    // Module Resolution
    resolve: {
      // Aliases for cleaner imports
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@components": path.resolve(__dirname, "./src/components"),
        "@hooks": path.resolve(__dirname, "./src/hooks"),
        "@lib": path.resolve(__dirname, "./src/lib"),
        "@features": path.resolve(__dirname, "./src/features"),
        "@pages": path.resolve(__dirname, "./src/pages"),
        "@types": path.resolve(__dirname, "./src/types"),
        "@utils": path.resolve(__dirname, "./src/lib/utils"),
        "@config": path.resolve(__dirname, "./src/config"),
        "@integrations": path.resolve(__dirname, "./src/integrations"),
      },
      // Extensions to resolve
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
    },

    // CSS Configuration
    css: {
      // CSS modules configuration
      modules: {
        // Local scope by default for CSS modules
        localsConvention: 'camelCaseOnly',
        // Generate scoped class names
        generateScopedName: mode === 'production'
          ? '[hash:base64:8]'
          : '[name]__[local]__[hash:base64:5]',
      },
      // PostCSS is configured separately in postcss.config.js
      // Preprocessor options if using SCSS/Less/Stylus
      preprocessorOptions: {
        // scss: {
        //   additionalData: `@import "@/styles/variables.scss";`
        // }
      },
    },

    // Optimization Configuration
    optimizeDeps: {
      // Pre-bundle these dependencies for faster cold start
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@clerk/clerk-react',
        '@tanstack/react-query',
        'framer-motion',
        '@supabase/supabase-js',
        '@supabase/postgrest-js',
      ],
      // Exclude these from pre-bundling
      exclude: [],
      // Force optimization of these dependencies
      force: false,
    },

    // Environment Variables
    define: {
      // Define global constants
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
      __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
      __DEV__: mode === 'development',
    },

    // Performance options
    esbuild: {
      // Drop console and debugger in production
      drop: mode === 'production' ? ['console', 'debugger'] : [],
      // Legal comments in output
      legalComments: 'none',
      // Target for esbuild
      target: 'es2022',
    },

    // Preview server configuration (for production preview)
    preview: {
      host: '::',
      port: 4173,
      strictPort: false,
    },

    // Worker configuration
    worker: {
      format: 'es',
      rollupOptions: {
        output: {
          entryFileNames: 'assets/worker/[name]-[hash].js',
        },
      },
    },
  };
});
