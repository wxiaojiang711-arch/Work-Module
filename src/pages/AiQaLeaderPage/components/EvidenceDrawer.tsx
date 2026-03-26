import React from "react";
import { Alert, Descriptions, Drawer, List, Tabs, Timeline, Tree, Typography } from "antd";

import type { QaAnswer } from "../types";

interface EvidenceDrawerProps {
  visible: boolean;
  onClose: () => void;
  evidence: QaAnswer["evidence"];
  trust: QaAnswer["trust"];
  answerId: string;
}

const EvidenceDrawer: React.FC<EvidenceDrawerProps> = ({ visible, onClose, evidence, trust, answerId }) => {
  const alertType = trust.consistency === "consistent" ? "info" : "warning";

  return (
    <Drawer title="依据与口径" placement="right" width={720} open={visible} onClose={onClose}>
      <Alert
        type={alertType}
        showIcon
        style={{ marginBottom: 12 }}
        message={`口径一致性：${trust.consistency === "consistent" ? "一致" : "存在冲突"}；数据新鲜度：${trust.freshness}；证据完整性：${
          trust.completeness === "complete" ? "齐全" : "不足"
        }`}
        description={trust.conflictDetails ?? trust.incompleteReason}
      />

      <Tabs
        items={[
          {
            key: "definition",
            label: "指标口径",
            children: evidence.definitions.map((item) => (
              <Descriptions key={item.id} size="small" bordered column={1} style={{ marginBottom: 10 }}>
                <Descriptions.Item label="指标名称">{item.name}</Descriptions.Item>
                <Descriptions.Item label="定义">
                  <Typography.Text mark>{item.content}</Typography.Text>
                </Descriptions.Item>
                <Descriptions.Item label="责任单位">{item.responsible}</Descriptions.Item>
                <Descriptions.Item label="更新时间">{item.updatedAt}</Descriptions.Item>
              </Descriptions>
            )),
          },
          {
            key: "rules",
            label: "规则结果",
            children: (
              <List
                dataSource={evidence.rules}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta title={`${item.id} - ${item.name}`} description={`${item.content}（最近运行：${item.updatedAt}）`} />
                  </List.Item>
                )}
              />
            ),
          },
          {
            key: "lineage",
            label: "血缘影响",
            children: (
              <Tree
                defaultExpandAll
                treeData={evidence.lineage.map((item) => ({
                  key: item.id,
                  title: item.name,
                  children: [{ key: `${item.id}-content`, title: item.content }],
                }))}
              />
            ),
          },
          {
            key: "changes",
            label: "任务/变更",
            children: (
              <Timeline
                items={evidence.changes.map((item) => ({
                  children: `${item.updatedAt} ${item.name}：${item.content}`,
                }))}
              />
            ),
          },
        ]}
      />

      <Typography.Text type="secondary">
        审计信息：问答编号 {answerId}；引用知识条目ID：
        {[...evidence.definitions, ...evidence.rules, ...evidence.lineage, ...evidence.changes].map((i) => i.id).join("、")}
      </Typography.Text>
    </Drawer>
  );
};

export default EvidenceDrawer;
