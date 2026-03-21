# Vue 3 页面接入说明

当前目录包含你要的 Vue 页面与组件：

- `pages/KnowledgeBaseManagement.vue`
- `components/KnowledgeBaseCard.vue`
- `App.vue`
- `main.ts`
- `styles.css`

## 1) 安装依赖

在 Vue 3 + Vite 项目中安装：

```bash
npm i vue ant-design-vue @ant-design/icons-vue
npm i -D @vitejs/plugin-vue
```

## 2) Vite 配置

`vite.config.ts` 至少包含：

```ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
});
```

## 3) 入口挂载

- 把 `src/vue/main.ts` 内容放到你 Vue 项目的 `src/main.ts`
- 确保 `index.html` 里有 `<div id="app"></div>`

## 4) 启动

```bash
npm run dev
```

> 说明：你当前仓库是 React 工程，这套 `.vue` 文件是独立可复用实现。直接放入 Vue 项目即可运行。
