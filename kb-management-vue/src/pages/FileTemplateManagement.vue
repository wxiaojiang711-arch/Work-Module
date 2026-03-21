<template>
  <section class="template-page">
    <a-card :bordered="false" class="template-page__card">
      <div class="template-page__header">
        <a-row :gutter="[12, 12]" align="middle" class="template-page__filter-row">
          <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="7">
            <a-input-search
              v-model:value="filters.keyword"
              allow-clear
              placeholder="请输入表单名称或描述"
              enter-button
              @search="handleQuery"
            />
          </a-col>
          <a-col :xs="24" :sm="12" :md="6" :lg="4" :xl="3">
            <a-select
              v-model:value="filters.status"
              :options="statusFilterOptions"
              class="template-page__full"
              placeholder="表单状态"
            />
          </a-col>
          <a-col :xs="24" :sm="12" :md="6" :lg="4" :xl="4">
            <a-select
              v-model:value="filters.permissions"
              :options="permissionFilterOptions"
              class="template-page__full"
              placeholder="表单权限"
            />
          </a-col>
          <a-col :xs="24" :sm="24" :md="12" :lg="6" :xl="5">
            <a-range-picker
              v-model:value="filters.createdAtRange"
              class="template-page__full"
              format="YYYY-MM-DD"
            />
          </a-col>
          <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="5">
            <div class="template-page__actions-top">
              <a-space :size="8" wrap>
                <a-button type="primary" :loading="tableLoading" @click="handleQuery">查询</a-button>
                <a-button @click="handleReset">重置</a-button>
                <a-button type="primary" @click="handleCreateForm">创建表单</a-button>
              </a-space>
            </div>
          </a-col>
        </a-row>
      </div>

      <a-table
        :columns="columns"
        :data-source="displayList"
        :loading="tableLoading"
        :pagination="pagination"
        :locale="tableLocale"
        :row-key="(record: FormItem) => record.id"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            <a-button type="link" class="template-page__name-btn" @click="handlePreview(record)">
              {{ record.name }}
            </a-button>
          </template>

          <template v-else-if="column.key === 'permissions'">
            <a-tag :color="getPermissionTagColor(record.permissions)">
              {{ record.permissions }}
            </a-tag>
          </template>

          <template v-else-if="column.key === 'status'">
            <a-tag :color="getStatusTagColor(record.status)">
              {{ record.status }}
            </a-tag>
          </template>

          <template v-else-if="column.key === 'actions'">
            <a-space :size="2" wrap>
              <a-button type="link" @click="handleEdit(record)">编辑</a-button>
              <a-button type="link" @click="handlePreview(record)">预览</a-button>
              <a-button type="link" @click="handleData(record)">数据</a-button>
              <a-popconfirm
                :title="record.status === '发布中' ? '确认暂停该表单吗？' : '确认发布该表单吗？'"
                ok-text="确认"
                cancel-text="取消"
                @confirm="() => handleToggleStatus(record)"
              >
                <a-button type="link" :loading="actionLoadingIds.has(record.id)">
                  {{ record.status === '发布中' ? '暂停' : '发布' }}
                </a-button>
              </a-popconfirm>
              <a-popconfirm
                title="确认删除该表单吗？删除后不可恢复。"
                ok-text="删除"
                cancel-text="取消"
                @confirm="() => handleDelete(record)"
              >
                <a-button type="link" danger :loading="actionLoadingIds.has(record.id)">删除</a-button>
              </a-popconfirm>
                <a-dropdown>
                  <a-button type="link">更多</a-button>
                  <template #overlay>
                  <a-menu @click="createMoreMenuHandler(record)">
                    <a-menu-item key="copy">复制</a-menu-item>
                    <a-menu-item key="export">导出配置</a-menu-item>
                    <a-menu-item key="share">分享</a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>
  </section>
</template>

<script setup lang="ts">
import type { Dayjs } from "dayjs";
import type { TableColumnsType } from "ant-design-vue";
import { message } from "ant-design-vue";
import { computed, reactive, ref } from "vue";

type FormStatus = "发布中" | "草稿" | "已结束";
type FormPermission = "公开" | "部门内可见" | "指定人员可见";
type FilterStatus = "全部" | FormStatus;
type FilterPermission = "全部" | FormPermission;

interface FormItem {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  creator: string;
  permissions: FormPermission;
  submissionCount: number;
  status: FormStatus;
  lastUpdated: string;
}

interface QueryFilters {
  keyword: string;
  status: FilterStatus;
  permissions: FilterPermission;
  createdAtRange: [Dayjs, Dayjs] | null;
}

const tableLoading = ref(false);
const actionLoadingIds = ref(new Set<string>());

const filters = reactive<QueryFilters>({
  keyword: "",
  status: "全部",
  permissions: "全部",
  createdAtRange: null,
});

const appliedFilters = ref<QueryFilters>({
  keyword: "",
  status: "全部",
  permissions: "全部",
  createdAtRange: null,
});

const formList = ref<FormItem[]>([
  {
    id: "form-001",
    name: "2024年度部门工作总结汇报",
    description: "收集各部门2024年度工作总结和计划",
    createdAt: "2024-01-15 10:30:00",
    creator: "张三",
    permissions: "部门内可见",
    submissionCount: 125,
    status: "发布中",
    lastUpdated: "2024-03-01 14:00:00",
  },
  {
    id: "form-002",
    name: "智慧城市建设需求调研",
    description: "面向市民和企业征集智慧城市建设意见",
    createdAt: "2023-11-20 09:00:00",
    creator: "李四",
    permissions: "公开",
    submissionCount: 876,
    status: "已结束",
    lastUpdated: "2024-01-10 16:00:00",
  },
  {
    id: "form-003",
    name: "新员工入职信息采集",
    description: "采集基础信息用于办理入职流程",
    createdAt: "2024-02-10 08:45:00",
    creator: "王五",
    permissions: "指定人员可见",
    submissionCount: 42,
    status: "草稿",
    lastUpdated: "2024-02-11 12:20:00",
  },
  {
    id: "form-004",
    name: "季度客户满意度调查",
    description: "用于分析客户反馈并优化服务流程",
    createdAt: "2024-03-05 15:10:00",
    creator: "赵六",
    permissions: "公开",
    submissionCount: 210,
    status: "发布中",
    lastUpdated: "2024-03-08 09:35:00",
  },
]);

const statusFilterOptions: Array<{ label: FilterStatus; value: FilterStatus }> = [
  { label: "全部", value: "全部" },
  { label: "发布中", value: "发布中" },
  { label: "草稿", value: "草稿" },
  { label: "已结束", value: "已结束" },
];

const permissionFilterOptions: Array<{ label: FilterPermission; value: FilterPermission }> = [
  { label: "全部", value: "全部" },
  { label: "公开", value: "公开" },
  { label: "部门内可见", value: "部门内可见" },
  { label: "指定人员可见", value: "指定人员可见" },
];

const statusTagColorMap: Record<FormStatus, string> = {
  发布中: "success",
  草稿: "processing",
  已结束: "default",
};

const permissionTagColorMap: Record<FormPermission, string> = {
  公开: "green",
  部门内可见: "blue",
  指定人员可见: "orange",
};

const columns: TableColumnsType<FormItem> = [
  { title: "表单名称", dataIndex: "name", key: "name", ellipsis: true },
  { title: "创建时间", dataIndex: "createdAt", key: "createdAt", width: 180 },
  { title: "创建人", dataIndex: "creator", key: "creator", width: 120 },
  { title: "表单权限", dataIndex: "permissions", key: "permissions", width: 140 },
  { title: "填写次数", dataIndex: "submissionCount", key: "submissionCount", width: 110 },
  { title: "状态", dataIndex: "status", key: "status", width: 110 },
  { title: "操作", key: "actions", width: 420, fixed: "right" },
];

const pagination = reactive({
  current: 1,
  pageSize: 10,
  showSizeChanger: true,
  showQuickJumper: true,
  pageSizeOptions: ["10", "20", "50", "100"],
  showTotal: (total: number) => `共 ${total} 条`,
});

const tableLocale = { emptyText: "暂无表单数据，请先创建表单" };

const getStatusTagColor = (status: FormStatus): string => statusTagColorMap[status];

const getPermissionTagColor = (permission: FormPermission): string =>
  permissionTagColorMap[permission];

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });

const displayList = computed(() => {
  const keyword = appliedFilters.value.keyword.trim().toLowerCase();

  return formList.value.filter((item) => {
    const keywordMatch =
      keyword.length === 0 ||
      item.name.toLowerCase().includes(keyword) ||
      item.description.toLowerCase().includes(keyword);

    const statusMatch =
      appliedFilters.value.status === "全部" || item.status === appliedFilters.value.status;

    const permissionMatch =
      appliedFilters.value.permissions === "全部" ||
      item.permissions === appliedFilters.value.permissions;

    const dateRange = appliedFilters.value.createdAtRange;
    if (!dateRange) {
      return keywordMatch && statusMatch && permissionMatch;
    }

    const createdDay = item.createdAt.slice(0, 10);
    const startDay = dateRange[0].format("YYYY-MM-DD");
    const endDay = dateRange[1].format("YYYY-MM-DD");
    const dateMatch = createdDay >= startDay && createdDay <= endDay;

    return keywordMatch && statusMatch && permissionMatch && dateMatch;
  });
});

const navigateTo = (path: string, newTab = false): void => {
  if (newTab) {
    window.open(path, "_blank", "noopener,noreferrer");
    return;
  }
  window.location.href = path;
};

const syncPaginationTotal = () => {
  pagination.current = 1;
};

const handleCreateForm = () => {
  navigateTo("/form/create");
};

const handleQuery = async () => {
  tableLoading.value = true;
  appliedFilters.value = {
    keyword: filters.keyword,
    status: filters.status,
    permissions: filters.permissions,
    createdAtRange: filters.createdAtRange,
  };

  syncPaginationTotal();
  await delay(300);
  tableLoading.value = false;
};

const handleReset = async () => {
  filters.keyword = "";
  filters.status = "全部";
  filters.permissions = "全部";
  filters.createdAtRange = null;
  await handleQuery();
};

const handlePreview = (record: FormItem) => {
  navigateTo(`/form/preview/${record.id}`, true);
};

const handleEdit = (record: FormItem) => {
  navigateTo(`/form/edit/${record.id}`);
};

const handleData = (record: FormItem) => {
  navigateTo(`/form/data/${record.id}`);
};

const handleToggleStatus = async (record: FormItem) => {
  actionLoadingIds.value.add(record.id);

  try {
    await delay(400);
    const targetStatus: FormStatus = record.status === "发布中" ? "草稿" : "发布中";
    const index = formList.value.findIndex((item) => item.id === record.id);

    if (index === -1) {
      message.error("状态更新失败，未找到对应表单");
      return;
    }

    formList.value[index] = {
      ...formList.value[index],
      status: targetStatus,
      lastUpdated: new Date().toISOString().slice(0, 19).replace("T", " "),
    };

    message.success(`表单已${targetStatus === "发布中" ? "发布" : "暂停"}`);
  } catch {
    message.error("状态更新失败，请稍后重试");
  } finally {
    actionLoadingIds.value.delete(record.id);
  }
};

const handleDelete = async (record: FormItem) => {
  actionLoadingIds.value.add(record.id);

  try {
    await delay(400);
    formList.value = formList.value.filter((item) => item.id !== record.id);
    message.success("表单删除成功");
  } catch {
    message.error("删除失败，请稍后重试");
  } finally {
    actionLoadingIds.value.delete(record.id);
  }
};

const handleMoreAction = (key: string, record: FormItem) => {
  if (key === "copy") {
    message.success(`已复制表单：${record.name}`);
    return;
  }

  if (key === "export") {
    message.success(`已导出配置：${record.name}`);
    return;
  }

  if (key === "share") {
    message.success(`已生成分享链接：${record.name}`);
    return;
  }

  message.warning("暂不支持该操作");
};

const createMoreMenuHandler =
  (record: FormItem) =>
  (info: { key: string | number }) => {
    handleMoreAction(String(info.key), record);
  };

const handleTableChange = (pageInfo: { current?: number; pageSize?: number }) => {
  pagination.current = pageInfo.current ?? pagination.current;
  pagination.pageSize = pageInfo.pageSize ?? pagination.pageSize;
};

void handleQuery();
</script>

<style scoped>
.template-page {
  min-height: 100%;
}

.template-page__card {
  border-radius: 8px;
}

.template-page__header {
  margin-bottom: 16px;
}

.template-page__filter-row {
  width: 100%;
}

.template-page__full {
  width: 100%;
}

.template-page__actions-top {
  display: flex;
  justify-content: flex-end;
}

.template-page__name-btn {
  padding-left: 0;
}

@media (max-width: 1200px) {
  .template-page__actions-top {
    justify-content: flex-start;
  }
}
</style>
