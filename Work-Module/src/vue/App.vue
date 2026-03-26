<template>
  <a-config-provider :theme="themeConfig">
    <div class="app-shell">
      <KnowledgeBaseManagement />
    </div>
  </a-config-provider>
</template>

<script setup lang="ts">
import type { ThemeConfig } from "ant-design-vue/es/config-provider/context";

import KnowledgeBaseManagement from "./pages/KnowledgeBaseManagement.vue";

const themeConfig: ThemeConfig = {
  token: {
    colorPrimary: "#4f46e5",
    borderRadius: 8,
  },
};
</script>

<style scoped>
.app-shell {
  width: 100%;
  min-height: 100vh;
  background: #f5f7fc;
}
</style>
