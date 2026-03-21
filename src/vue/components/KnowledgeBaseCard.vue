<template>
  <a-card hoverable class="kb-card">
    <template #body>
      <div class="kb-card__content">
        <a-card-meta>
          <template #avatar>
            <div class="kb-card__avatar">
              <DatabaseOutlined />
            </div>
          </template>
          <template #title>
            <span class="kb-card__title">{{ item.title }}</span>
          </template>
          <template #description>
            <span class="kb-card__updated">更新时间：{{ item.lastUpdated }}</span>
          </template>
        </a-card-meta>

        <p class="kb-card__description">{{ item.description }}</p>

        <div class="kb-card__footer">
          <span class="kb-card__meta">{{ item.visibility }} | {{ item.itemCount }}个知识内容</span>

          <div class="kb-card__actions">
            <a-tooltip title="在新标签页中打开">
              <a-button type="text" size="small" @click="emit('open', item)">
                <template #icon>
                  <ExportOutlined />
                </template>
              </a-button>
            </a-tooltip>

            <a-dropdown placement="bottomRight" trigger="click">
              <a-button type="text" size="small">
                <template #icon>
                  <EllipsisOutlined />
                </template>
              </a-button>
              <template #overlay>
                <a-menu @click="({ key }) => emit('menuAction', key, item)">
                  <a-menu-item key="edit">编辑</a-menu-item>
                  <a-menu-item key="permission">权限设置</a-menu-item>
                  <a-menu-item key="delete" danger>删除</a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
        </div>
      </div>
    </template>
  </a-card>
</template>

<script setup lang="ts">
import { DatabaseOutlined, EllipsisOutlined, ExportOutlined } from "@ant-design/icons-vue";

export interface KnowledgeBaseItem {
  id: string;
  title: string;
  lastUpdated: string;
  description: string;
  visibility: "组织内公开" | "指定部门/人员" | "全部";
  itemCount: number;
  type: "unit" | "theme";
}

defineProps<{
  item: KnowledgeBaseItem;
}>();

const emit = defineEmits<{
  (e: "open", item: KnowledgeBaseItem): void;
  (e: "menuAction", actionKey: string, item: KnowledgeBaseItem): void;
}>();
</script>

<style scoped>
.kb-card {
  border: 1px solid #e8eaf2;
  border-radius: 12px;
  box-shadow: 0 4px 14px rgba(31, 42, 68, 0.06);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.kb-card:hover {
  transform: translateY(-2px) scale(1.01);
  box-shadow: 0 10px 24px rgba(31, 42, 68, 0.14);
}

.kb-card__content {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.kb-card__avatar {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #ffffff;
  background: linear-gradient(135deg, #6d4cff 0%, #8d74ff 100%);
}

.kb-card__title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2a44;
}

.kb-card__updated {
  color: #8f98ad;
  font-size: 12px;
}

.kb-card__description {
  margin: 0;
  color: #4f5d75;
  line-height: 1.5;
  min-height: 22px;
}

.kb-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 8px;
  border-top: 1px solid #eef2fa;
}

.kb-card__meta {
  color: #6f7890;
  font-size: 12px;
}

.kb-card__actions {
  display: inline-flex;
  align-items: center;
  gap: 2px;
}
</style>
