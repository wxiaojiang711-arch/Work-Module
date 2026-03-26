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

    <a-row :gutter="[16, 16]">
      <a-col
        v-for="item in knowledgeBaseList"
        :key="item.id"
        :xs="24"
        :sm="12"
        :md="12"
        :lg="8"
        :xl="6"
      >
        <KnowledgeBaseCard :item="item" @open="handleOpenInNewTab" @menuAction="handleCardMenuAction" />
      </a-col>
    </a-row>

    <a-empty v-if="!knowledgeBaseList.length" description="暂无知识库数据" class="kb-page__empty" />
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
    title: "检验检查报告解读",
    lastUpdated: "2026-03-03 15:46:43",
    description: "临床检验检查与体检报告解读",
    visibility: "组织内公开",
    itemCount: 9,
    type: "unit",
  },
  {
    id: "kb-002",
    title: "医共体知识馆",
    lastUpdated: "2026-02-09 00:51:35",
    description: "医共体共享协同与运行监管",
    visibility: "组织内公开",
    itemCount: 9,
    type: "unit",
  },
  {
    id: "kb-003",
    title: "基层慢病管理规范",
    lastUpdated: "2026-03-14 10:02:11",
    description: "基层医疗机构慢病管理流程与评估指标",
    visibility: "指定部门/人员",
    itemCount: 24,
    type: "unit",
  },
  {
    id: "kb-004",
    title: "公共卫生应急主题库",
    lastUpdated: "2026-03-11 09:18:06",
    description: "公共卫生应急响应、演练与处置经验沉淀",
    visibility: "组织内公开",
    itemCount: 31,
    type: "theme",
  },
  {
    id: "kb-005",
    title: "医保支付政策解读",
    lastUpdated: "2026-01-25 16:20:40",
    description: "医保支付规则、控费机制与政策问答",
    visibility: "指定部门/人员",
    itemCount: 17,
    type: "theme",
  },
  {
    id: "kb-006",
    title: "区域检验协同专题",
    lastUpdated: "2026-03-16 13:26:50",
    description: "跨机构检验协同与质控标准体系",
    visibility: "组织内公开",
    itemCount: 12,
    type: "theme",
  },
]);

const filteredList = ref<KnowledgeBaseItem[]>([]);

const knowledgeBaseList = computed(() => filteredList.value);

const applyFilters = () => {
  const keyword = filters.keyword.trim().toLowerCase();

  filteredList.value = allKnowledgeBases.value.filter((item) => {
    const isTypeMatch = item.type === activeTab.value;
    const isVisibilityMatch = filters.visibility === "全部" || item.visibility === filters.visibility;
    const isKeywordMatch =
      !keyword ||
      item.title.toLowerCase().includes(keyword) ||
      item.description.toLowerCase().includes(keyword);

    return isTypeMatch && isVisibilityMatch && isKeywordMatch;
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
