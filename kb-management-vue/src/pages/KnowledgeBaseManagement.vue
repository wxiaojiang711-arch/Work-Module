<template>
  <section class="kb-page">
    <div class="kb-page__header">
      <a-tabs v-model:activeKey="activeTab" @change="handleTabChange">
        <a-tab-pane key="unit" tab="单位库" />
        <a-tab-pane key="theme" tab="主题库" />
      </a-tabs>

      <a-space :size="12" class="kb-page__filters">
        <a-select
          v-model:value="filters.visibility"
          class="kb-page__select"
          placeholder="公开范围"
          :options="visibilityOptions"
        />
        <a-input
          v-model:value="filters.keyword"
          class="kb-page__input"
          allow-clear
          placeholder="请输入知识库名称或描述"
          @pressEnter="handleQuery"
        />
        <a-button type="primary" @click="handleQuery">查询</a-button>
      </a-space>
    </div>

    <div class="kb-page__actions">
      <a-space>
        <a-button type="primary" @click="handleCreate">创建知识库</a-button>
        <a-button @click="handleImport">导入知识库</a-button>
      </a-space>
    </div>

    <a-row v-if="knowledgeBaseList.length" :gutter="[16, 16]">
      <a-col
        v-for="item in knowledgeBaseList"
        :key="item.id"
        :xs="24"
        :sm="12"
        :md="8"
        :lg="8"
        :xl="6"
      >
        <KnowledgeBaseCard
          :item="item"
          @open="handleOpenInNewTab"
          @menuAction="handleCardMenuAction"
        />
      </a-col>
    </a-row>

    <a-empty v-else description="暂无知识库数据" class="kb-page__empty" />
  </section>
</template>

<script setup lang="ts">
import { message } from "ant-design-vue";
import { computed, reactive, ref } from "vue";

import KnowledgeBaseCard from "../components/KnowledgeBaseCard.vue";
import type { KnowledgeBaseItem } from "../components/KnowledgeBaseCard.vue";

type KnowledgeBaseType = "unit" | "theme";
type VisibilityFilter = "全部" | "组织内公开" | "指定部门/人员";

const activeTab = ref<KnowledgeBaseType>("unit");

const filters = reactive<{
  visibility: VisibilityFilter;
  keyword: string;
}>({
  visibility: "全部",
  keyword: "",
});

const visibilityOptions: Array<{ label: VisibilityFilter; value: VisibilityFilter }> = [
  { label: "全部", value: "全部" },
  { label: "组织内公开", value: "组织内公开" },
  { label: "指定部门/人员", value: "指定部门/人员" },
];

const allKnowledgeBases = ref<KnowledgeBaseItem[]>([
  {
    id: "kb-001",
    title: "区大数据局",
    lastUpdated: "2026-03-18 09:12:20",
    description: "区大数据局单位知识库",
    visibility: "组织内公开",
    itemCount: 18,
    type: "unit",
  },
  {
    id: "kb-002",
    title: "区发改委",
    lastUpdated: "2026-03-18 09:15:43",
    description: "区发改委单位知识库",
    visibility: "组织内公开",
    itemCount: 16,
    type: "unit",
  },
  {
    id: "kb-003",
    title: "区文旅委",
    lastUpdated: "2026-03-18 09:18:06",
    description: "区文旅委单位知识库",
    visibility: "组织内公开",
    itemCount: 14,
    type: "unit",
  },
  {
    id: "kb-004",
    title: "区经信委",
    lastUpdated: "2026-03-18 09:23:11",
    description: "区经信委单位知识库",
    visibility: "指定部门/人员",
    itemCount: 12,
    type: "unit",
  },
  {
    id: "kb-005",
    title: "区教委",
    lastUpdated: "2026-03-18 09:28:52",
    description: "区教委单位知识库",
    visibility: "组织内公开",
    itemCount: 20,
    type: "unit",
  },
  {
    id: "kb-006",
    title: "区公安分局",
    lastUpdated: "2026-03-18 09:33:09",
    description: "区公安分局单位知识库",
    visibility: "指定部门/人员",
    itemCount: 22,
    type: "unit",
  },
  {
    id: "kb-007",
    title: "区民政局",
    lastUpdated: "2026-03-18 09:37:24",
    description: "区民政局单位知识库",
    visibility: "组织内公开",
    itemCount: 11,
    type: "unit",
  },
  {
    id: "kb-008",
    title: "区司法局",
    lastUpdated: "2026-03-18 09:41:58",
    description: "区司法局单位知识库",
    visibility: "组织内公开",
    itemCount: 13,
    type: "unit",
  },
  {
    id: "kb-009",
    title: "区财政局",
    lastUpdated: "2026-03-18 09:46:36",
    description: "区财政局单位知识库",
    visibility: "指定部门/人员",
    itemCount: 17,
    type: "unit",
  },
  {
    id: "kb-010",
    title: "区商务委",
    lastUpdated: "2026-03-18 09:51:04",
    description: "区商务委单位知识库",
    visibility: "指定部门/人员",
    itemCount: 15,
    type: "unit",
  },
  {
    id: "kb-011",
    title: "“16912”事项库",
    lastUpdated: "2026-03-19 10:05:17",
    description: "“16912”事项主题知识库",
    visibility: "组织内公开",
    itemCount: 28,
    type: "theme",
  },
  {
    id: "kb-012",
    title: "重大事项库",
    lastUpdated: "2026-03-19 10:11:49",
    description: "重大事项主题知识库",
    visibility: "指定部门/人员",
    itemCount: 26,
    type: "theme",
  },
  {
    id: "kb-013",
    title: "重大项目库",
    lastUpdated: "2026-03-19 10:18:03",
    description: "重大项目主题知识库",
    visibility: "组织内公开",
    itemCount: 30,
    type: "theme",
  },
]);

const filteredList = ref<KnowledgeBaseItem[]>([]);

const knowledgeBaseList = computed(() => filteredList.value);

const applyFilters = () => {
  const keyword = filters.keyword.trim().toLowerCase();
  filteredList.value = allKnowledgeBases.value.filter((item) => {
    const typeMatch = item.type === activeTab.value;
    const visibilityMatch = filters.visibility === "全部" || item.visibility === filters.visibility;
    const keywordMatch =
      keyword.length === 0 ||
      item.title.toLowerCase().includes(keyword) ||
      item.description.toLowerCase().includes(keyword);
    return typeMatch && visibilityMatch && keywordMatch;
  });
};

const loadKnowledgeBaseList = () => {
  applyFilters();
};

const handleTabChange = () => {
  loadKnowledgeBaseList();
};

const handleQuery = () => {
  loadKnowledgeBaseList();
};

const handleCreate = () => {
  message.info("创建知识库");
};

const handleImport = () => {
  message.info("导入知识库");
};

const handleOpenInNewTab = (item: KnowledgeBaseItem) => {
  const targetUrl = `/knowledge-base/${item.id}`;
  window.open(targetUrl, "_blank", "noopener,noreferrer");
};

const handleCardMenuAction = (actionKey: string, item: KnowledgeBaseItem) => {
  const actionMap: Record<string, string> = {
    edit: "编辑",
    permission: "权限设置",
    delete: "删除",
  };
  const actionText = actionMap[actionKey] ?? actionKey;
  message.info(`${actionText}：${item.title}`);
};

loadKnowledgeBaseList();
</script>

<style scoped>
.kb-page {
  min-height: 100%;
  padding: 20px;
  background: #f5f7fc;
}

.kb-page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 14px;
}

:deep(.kb-page__header .ant-tabs) {
  margin-bottom: 0;
}

:deep(.kb-page__header .ant-tabs-nav) {
  margin: 0;
}

.kb-page__filters {
  flex-wrap: wrap;
  justify-content: flex-end;
}

.kb-page__select {
  width: 150px;
}

.kb-page__input {
  width: 280px;
}

.kb-page__actions {
  margin-bottom: 16px;
}

.kb-page__empty {
  margin-top: 20px;
}

@media (max-width: 992px) {
  .kb-page__header {
    flex-direction: column;
    align-items: flex-start;
  }

  .kb-page__filters {
    width: 100%;
    justify-content: flex-start;
  }

  .kb-page__input {
    width: 220px;
  }
}

@media (max-width: 576px) {
  .kb-page {
    padding: 14px;
  }

  .kb-page__select,
  .kb-page__input {
    width: 100%;
  }
}
</style>
