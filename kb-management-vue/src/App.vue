<template>
  <a-config-provider>
    <a-layout class="app-layout">
      <a-layout-sider :width="220" class="app-layout__sider">
        <div class="app-layout__logo">业务管理后台</div>
        <a-menu v-model:selectedKeys="selectedKeys" mode="inline" :items="menuItems" />
      </a-layout-sider>

      <a-layout class="app-layout__main">
        <a-layout-content class="app-layout__content">
          <FileTemplateManagement v-if="selectedKeys[0] === 'file-template'" />
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-config-provider>
</template>

<script setup lang="ts">
import { ref } from "vue";

import FileTemplateManagement from "./pages/FileTemplateManagement.vue";

const selectedKeys = ref<string[]>(["file-template"]);

const menuItems = [
  {
    key: "file-template",
    label: "文件模板管理",
  },
];
</script>

<style scoped>
.app-layout {
  width: 100%;
  min-height: 100vh;
}

.app-layout__sider {
  border-right: 1px solid #f0f0f0;
  background: #fff;
}

.app-layout__logo {
  height: 56px;
  padding: 0 16px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
}

:deep(.app-layout__sider .ant-menu) {
  border-inline-end: 0;
}

.app-layout__main {
  background: #f5f7fa;
}

.app-layout__content {
  padding: 16px;
}

@media (max-width: 768px) {
  .app-layout__sider {
    width: 180px;
    min-width: 180px;
    max-width: 180px;
    flex: 0 0 180px;
  }

  .app-layout__content {
    padding: 12px;
  }
}
</style>
