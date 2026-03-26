import React from "react";
import { Card, Layout, Typography } from "antd";
import type { KnowledgeBase } from "../KnowledgeBaseManagement/types";

import styles from "./DataAssetManagementPage.module.css";

const { Content } = Layout;

interface DataAssetManagementPageProps {
  knowledgeBase: KnowledgeBase;
  onBack: () => void;
}

const DataAssetManagementPage: React.FC<DataAssetManagementPageProps> = ({ knowledgeBase }) => {
  return (
    <Layout className={styles.page}>
      <Layout>
        <Content className={styles.content}>
          <div className={styles.contentHeader}>
            <Typography.Title level={5} className={styles.pageTitle}>
              {knowledgeBase.title}
            </Typography.Title>
          </div>

          <Card>
            <Typography.Text type="secondary">
              数据资产管理模块正在升级中。该页面已修复编译问题，后续可接入资产列表与详情抽屉。
            </Typography.Text>
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DataAssetManagementPage;
