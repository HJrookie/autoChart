import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    //    chunkSplitPlugin({
    //   strategy: 'default',
    //   // customSplitting: {
    //   //   // `react` and `react-dom` 会被打包到一个名为`render-vendor`的 chunk 里面(包括它们的一些依赖，如 object-assign)
    //   //   // 'react-vendor': ['react', 'react-dom'],
    //   //   // 源码中 utils 目录的代码都会打包进 `utils` 这个 chunk 中
    //   //   'utils': [/src\/utils/],
    //   //   // 'antd':['@antv/antv-spec','@antv/ava','@antv/ava-react','@antv/g2','@antv/smart-color']
    //   // }
    // })
  ],
  server: {
    port: 4005,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          lodash: ["lodash", "exceljs", "axios", "classnames"],
          library: ["@antv/antv-spec", "@antv/ava", "@antv/ava-react","@antv/g2", "@antv/smart-color"],
          // vendor: [],
        },
      },
    },
  },
});
