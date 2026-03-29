import React, { Suspense, useEffect, useMemo, useState } from "react";
import {
  HomeOutlined,
  BookOutlined,
  FolderOpenOutlined,
  SettingOutlined,
  TagsOutlined,
  ShareAltOutlined,
  FileSearchOutlined,
  FundViewOutlined,
} from "@ant-design/icons";
import { Card, Layout, Menu, Typography, message } from "antd";
import type { MenuProps } from "antd";
import { matchPath, useLocation, useNavigate } from "react-router-dom";

import styles from "./App.module.css";
import GlobalHeader from "./components/GlobalHeader/GlobalHeader";
import MobileApp from "./mobile/MobileApp";

const KnowledgeBaseManagementPage = React.lazy(() => import("./pages/KnowledgeBaseManagement"));
const KnowledgeBaseDetailPage = React.lazy(() => import("./pages/KnowledgeBaseManagement/KnowledgeBaseDetailPage"));
const TemplateCategoryPage = React.lazy(() => import("./pages/TemplateCategory"));
const FormListPage = React.lazy(() => import("./pages/FormList"));
const OrganizationTemplateListPage = React.lazy(() => import("./pages/FormList/OrganizationListPage"));
const FormBuilderPage = React.lazy(() => import("./pages/FormBuilder"));
const TaskListPage = React.lazy(() => import("./pages/Task"));
const TaskFormPage = React.lazy(() => import("./pages/Task/TaskFormPage"));
const TaskDetailPage = React.lazy(() => import("./pages/Task/TaskDetailPage"));
const TaskDataViewPage = React.lazy(() => import("./pages/Task/TaskDataViewPage"));
const OrganizationListPage = React.lazy(() => import("./pages/OrganizationList"));
const UserManagePage = React.lazy(() => import("./pages/UserManage"));
const RoleManagePage = React.lazy(() => import("./pages/RoleManage"));
const PositionManagePage = React.lazy(() => import("./pages/PositionManage"));
const DataReportListPage = React.lazy(() => import("./pages/DataReport/DataReportListPage"));
const DataReportFormPage = React.lazy(() => import("./pages/DataReport/DataReportFormPage"));
const FileTemplatePreviewPage = React.lazy(() => import("./pages/FileTemplateManagement/FileTemplatePreviewPage"));
const WorkModuleFillPage = React.lazy(() => import("./pages/DataReport/WorkModuleFillPage"));
const WorkModuleColumnPage = React.lazy(() => import("./pages/DataReport/WorkModuleColumnPage"));
const ReportDetailPage = React.lazy(() => import("./pages/DataReport/ReportDetailPage"));
const DashboardPage = React.lazy(() => import("./pages/Dashboard"));
const AiQaLeaderPage = React.lazy(() => import("./pages/AiQaLeaderPage"));
const SmartReportPage = React.lazy(() => import("./pages/SmartReport"));
const LoginPage = React.lazy(() => import("./pages/Login"));

type SubMenuKey =
  | "workbench"
  | "knowledge-base-management"
  | "knowledge-tags"
  | "knowledge-data-report"
  | "knowledge-params-config"
  | "knowledge-templates"
  | "collection-tasks"
  | "sharing-data-recall"
  | "sharing-intelligent-report"
  | "settings-user-management"
  | "settings-role-management"
  | "settings-position-management"
  | "settings-organization";

const menuPathMap: Record<SubMenuKey, string> = {
  workbench: "/dashboard",
  "knowledge-base-management": "/knowledge/base-management",
  "knowledge-tags": "/knowledge/tags",
  "knowledge-data-report": "/report",
  "knowledge-params-config": "/collection/params-config",
  "knowledge-templates": "/template",
  "collection-tasks": "/task",
  "sharing-data-recall": "/sharing/intelligent-qa",
  "sharing-intelligent-report": "/sharing/intelligent-report",
  "settings-user-management": "/settings/users",
  "settings-role-management": "/settings/roles",
  "settings-position-management": "/settings/positions",
  "settings-organization": "/settings/organizations",
};

const menuItems: MenuProps["items"] = [
  {
    key: "workbench",
    icon: <HomeOutlined />,
    label: "工作台",
  },
  {
    key: "knowledge-collection",
    icon: <FolderOpenOutlined />,
    label: "知识采集",
    children: [
      { key: "knowledge-templates", label: "文件模板管理" },
      { key: "collection-tasks", label: "采集任务" },
      { key: "knowledge-data-report", label: "数据上报" },
    ],
  },
  {
    key: "knowledge-base",
    icon: <BookOutlined />,
    label: "知识库",
    children: [
      { key: "knowledge-base-management", label: "知识库管理" },
      { key: "knowledge-tags", label: "知识标签" },
    ],
  },
  {
    key: "knowledge-sharing",
    icon: <ShareAltOutlined />,
    label: "知识共享",
    children: [
      { key: "sharing-data-recall", label: "智能问数" },
      { key: "sharing-intelligent-report", label: "智能报告" },
    ],
  },
  {
    key: "basic-settings",
    icon: <SettingOutlined />,
    label: "基础设置",
    children: [
      { key: "settings-user-management", label: "用户管理" },
      { key: "settings-role-management", label: "角色管理" },
      { key: "settings-position-management", label: "职务管理" },
      { key: "settings-organization", label: "组织机构" },
    ],
  },
];

const PlaceholderPage: React.FC<{ title: string; icon: React.ReactNode; description?: string }> = ({
  title,
  icon,
  description,
}) => (
  <div className={styles.placeholderWrap}>
    <Card className={styles.placeholderCard}>
      <Typography.Title level={5} className={styles.placeholderTitle}>
        {icon} {title}
      </Typography.Title>
      <Typography.Text type="secondary">
        {description ?? "该页面正在建设中，后续可继续扩展业务内容。"}
      </Typography.Text>
    </Card>
  </div>
);

const resolveMenuKeyByPath = (pathname: string): SubMenuKey => {
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/workbench")) {
    return "workbench";
  }
  if (pathname.startsWith("/knowledge/base-management")) {
    return "knowledge-base-management";
  }
  if (pathname.startsWith("/knowledge/tags")) {
    return "knowledge-tags";
  }
  if (pathname === "/report" || pathname.startsWith("/report/")) {
    return "knowledge-data-report";
  }
  if (pathname.startsWith("/collection/params-config")) {
    return "knowledge-params-config";
  }
  if (pathname === "/template" || pathname.startsWith("/template/")) {
    return "knowledge-templates";
  }
  if (pathname === "/task" || pathname.startsWith("/task/")) {
    return "collection-tasks";
  }
  if (pathname.startsWith("/sharing/intelligent-qa") || pathname.startsWith("/sharing/data-recall")) {
    return "sharing-data-recall";
  }
  if (pathname.startsWith("/sharing/intelligent-report")) {
    return "sharing-intelligent-report";
  }
  if (pathname.startsWith("/settings/users") || pathname.startsWith("/settings/user-management")) {
    return "settings-user-management";
  }
  if (pathname.startsWith("/settings/roles") || pathname.startsWith("/settings/role-management")) {
    return "settings-role-management";
  }
  if (pathname.startsWith("/settings/positions") || pathname.startsWith("/settings/position-management")) {
    return "settings-position-management";
  }
  if (pathname.startsWith("/settings/organizations") || pathname.startsWith("/settings/organization")) {
    return "settings-organization";
  }

  if (
    matchPath("/form/create", pathname) ||
    matchPath("/form/edit/:id", pathname) ||
    matchPath("/form/data/:id", pathname) ||
    matchPath("/form/preview/:id", pathname)
  ) {
    return "knowledge-templates";
  }

  return "knowledge-base-management";
};

const App: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [openKeys, setOpenKeys] = useState<string[]>([
    "knowledge-base",
    "knowledge-collection",
    "knowledge-sharing",
    "basic-settings",
  ]);

  useEffect(() => {
    if (pathname === "/") {
      navigate(menuPathMap.workbench, { replace: true });
    }
  }, [navigate, pathname]);

  const activeMenu = useMemo(() => resolveMenuKeyByPath(pathname), [pathname]);

  if (pathname.startsWith("/m")) {
    return <MobileApp />;
  }

  if (pathname === "/login") {
    return (
      <Suspense fallback={null}>
        <LoginPage />
      </Suspense>
    );
  }

  const renderPage = () => {

    if (matchPath("/knowledge/base-management/:kbId", pathname)) {
      return (
        <Suspense fallback={null}>
          <KnowledgeBaseDetailPage />
        </Suspense>
      );
    }

    if (pathname.startsWith("/knowledge/base-management")) {
      return (
        <Suspense fallback={null}>
          <KnowledgeBaseManagementPage />
        </Suspense>
      );
    }

    if (pathname.startsWith("/dashboard") || pathname.startsWith("/workbench")) {
      return (
        <Suspense fallback={null}>
          <DashboardPage />
        </Suspense>
      );
    }

    if (pathname.startsWith("/knowledge/tags")) {
      return <PlaceholderPage title="知识标签" icon={<TagsOutlined />} />;
    }

    if (pathname === "/report") {
      return (
        <Suspense fallback={null}>
          <DataReportListPage />
        </Suspense>
      );
    }

    if (pathname === "/report/fill/task-000") {
      return (
        <Suspense fallback={null}>
          <WorkModuleFillPage />
        </Suspense>
      );
    }

    if (pathname === "/report/work-module") {
      return (
        <Suspense fallback={null}>
          <WorkModuleColumnPage />
        </Suspense>
      );
    }

    if (matchPath("/report/fill/:taskId", pathname)) {
      return (
        <Suspense fallback={null}>
          <DataReportFormPage mode="edit" />
        </Suspense>
      );
    }

    if (matchPath("/report/view/:taskId", pathname)) {
      return (
        <Suspense fallback={null}>
          <ReportDetailPage />
        </Suspense>
      );
    }

    if (pathname === "/template") {
      return (
        <Suspense fallback={null}>
          <TemplateCategoryPage />
        </Suspense>
      );
    }

    if (matchPath("/template/:categoryId/form/create", pathname)) {
      return (
        <Suspense fallback={null}>
          <FormBuilderPage />
        </Suspense>
      );
    }

    if (matchPath("/template/:categoryId/form/edit/:formId", pathname)) {
      return (
        <Suspense fallback={null}>
          <FormBuilderPage />
        </Suspense>
      );
    }

    if (matchPath("/template/:categoryId/form/data/:formId", pathname)) {
      return (
        <PlaceholderPage
          title="表单数据"
          icon={<FolderOpenOutlined />}
          description="此路由已打通。你可以在这里接入提交数据查看页面。"
        />
      );
    }

    if (matchPath("/form/preview/:id", pathname)) {
      return (
        <Suspense fallback={null}>
          <FileTemplatePreviewPage />
        </Suspense>
      );
    }

    if (matchPath("/template/:categoryId/form/preview/:formId", pathname)) {
      return (
        <Suspense fallback={null}>
          <FileTemplatePreviewPage />
        </Suspense>
      );
    }

    const categoryMatch = matchPath("/template/:categoryId", pathname);
    if (categoryMatch) {
      const categoryId = categoryMatch.params.categoryId;

      if (categoryId === "organization") {
        return (
          <Suspense fallback={null}>
            <OrganizationTemplateListPage />
          </Suspense>
        );
      }

      return (
        <Suspense fallback={null}>
          <FormListPage categoryId={categoryId as "department" | "town" | "soe" | "theme" | "decision"} />
        </Suspense>
      );
    }

    if (pathname === "/task") {
      return (
        <Suspense fallback={null}>
          <TaskListPage />
        </Suspense>
      );
    }

    if (matchPath("/task/create", pathname)) {
      return (
        <Suspense fallback={null}>
          <TaskFormPage />
        </Suspense>
      );
    }

    if (matchPath("/task/:taskId/view/:unitId", pathname)) {
      return (
        <Suspense fallback={null}>
          <TaskDataViewPage />
        </Suspense>
      );
    }

    if (matchPath("/task/create", pathname)) {
      return (
        <Suspense fallback={null}>
          <TaskFormPage />
        </Suspense>
      );
    }

    if (matchPath("/task/edit/:taskId", pathname)) {
      return (
        <Suspense fallback={null}>
          <TaskFormPage />
        </Suspense>
      );
    }

    if (matchPath("/task/detail/:taskId", pathname)) {
      return (
        <Suspense fallback={null}>
          <TaskDetailPage />
        </Suspense>
      );
    }

    if (matchPath("/task/:taskId", pathname)) {
      return (
        <Suspense fallback={null}>
          <TaskDetailPage />
        </Suspense>
      );
    }

    if (pathname.startsWith("/sharing/intelligent-qa") || pathname.startsWith("/sharing/data-recall")) {
      return (
        <Suspense fallback={null}>
          <AiQaLeaderPage />
        </Suspense>
      );
    }

    if (pathname.startsWith("/collection/params-config")) {
      return <PlaceholderPage title="参数配置" icon={<SettingOutlined />} />;
    }

    if (pathname.startsWith("/sharing/intelligent-report")) {
      return (
        <Suspense fallback={null}>
          <SmartReportPage />
        </Suspense>
      );
    }

    if (pathname.startsWith("/settings/users") || pathname.startsWith("/settings/user-management")) {
      return (
        <Suspense fallback={null}>
          <UserManagePage />
        </Suspense>
      );
    }

    if (pathname.startsWith("/settings/roles") || pathname.startsWith("/settings/role-management")) {
      return (
        <Suspense fallback={null}>
          <RoleManagePage />
        </Suspense>
      );
    }

    if (pathname.startsWith("/settings/positions") || pathname.startsWith("/settings/position-management")) {
      return (
        <Suspense fallback={null}>
          <PositionManagePage />
        </Suspense>
      );
    }

    if (pathname.startsWith("/settings/organizations") || pathname.startsWith("/settings/organization")) {
      return (
        <Suspense fallback={null}>
          <OrganizationListPage />
        </Suspense>
      );
    }

    return (
      <PlaceholderPage
        title="页面不存在"
        icon={<FolderOpenOutlined />}
        description="未匹配到路由，请检查路径。"
      />
    );
  };

  const hideGlobalHeader = pathname.startsWith("/sharing/intelligent-qa") || pathname.startsWith("/sharing/data-recall");

  return (
    <Layout className={styles.appLayout}>
      {!hideGlobalHeader && <GlobalHeader />}
      <Layout className={`${styles.mainLayout} ${hideGlobalHeader ? styles.mainLayoutNoHeader : ""}`}>
        <Layout.Sider width={240} className={`${styles.navSider} ${hideGlobalHeader ? styles.navSiderNoHeader : ""}`}>
          <Menu
            mode="inline"
            className={styles.menu}
            items={menuItems}
            selectedKeys={[activeMenu]}
            openKeys={openKeys}
            onOpenChange={(keys) => setOpenKeys(keys)}
            onClick={(info) => {
              const key = info.key as SubMenuKey;
              if (key === "knowledge-tags") {
                message.info("该功能正在建设中，敬请期待");
                return;
              }
              navigate(menuPathMap[key]);
            }}
          />
        </Layout.Sider>
        <Layout.Content className={`${styles.content} ${hideGlobalHeader ? styles.contentNoHeader : ""}`}>
          {renderPage()}
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

export default App;
