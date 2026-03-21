import React from "react";
import { Card, Tree, Typography } from "antd";
import type { DataNode, TreeProps } from "antd/es/tree";

import type { KnowledgeNode } from "../types";
import styles from "./KnowledgeBaseTree.module.css";

interface KnowledgeTreeDataNode extends DataNode {
  meta?: KnowledgeNode;
  children?: KnowledgeTreeDataNode[];
}

interface KnowledgeBaseTreeProps {
  selectedKey?: string;
  onSelectNode: (node: KnowledgeNode | null) => void;
}

const treeData: KnowledgeTreeDataNode[] = [
  {
    key: "unit-root",
    title: "单位库",
    meta: { key: "unit-root", title: "单位库", category: "root" },
    children: [
      { key: "unit-finance", title: "区财政局", meta: { key: "unit-finance", title: "区财政局", category: "unit" } },
      { key: "unit-police", title: "区公安局", meta: { key: "unit-police", title: "区公安局", category: "unit" } },
      { key: "unit-health", title: "区卫健委", meta: { key: "unit-health", title: "区卫健委", category: "unit" } },
    ],
  },
  {
    key: "topic-root",
    title: "主题库",
    meta: { key: "topic-root", title: "主题库", category: "root" },
    children: [
      { key: "topic-smart-city", title: "智慧城市", meta: { key: "topic-smart-city", title: "智慧城市", category: "topic" } },
      { key: "topic-carbon", title: "双碳治理", meta: { key: "topic-carbon", title: "双碳治理", category: "topic" } },
    ],
  },
];

const KnowledgeBaseTree: React.FC<KnowledgeBaseTreeProps> = ({ selectedKey, onSelectNode }) => {
  const handleSelect: TreeProps["onSelect"] = (_, info) => {
    const node = info.node as KnowledgeTreeDataNode;
    onSelectNode(node.meta ?? null);
  };

  return (
    <Card className={styles.card} bodyStyle={{ padding: 12 }}>
      <Typography.Title level={5} className={styles.title}>知识库导航</Typography.Title>
      <Tree
        showLine
        defaultExpandAll
        treeData={treeData}
        selectedKeys={selectedKey ? [selectedKey] : []}
        onSelect={handleSelect}
        className={styles.tree}
      />
    </Card>
  );
};

export default KnowledgeBaseTree;
