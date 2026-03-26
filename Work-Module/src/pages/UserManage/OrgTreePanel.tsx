import React, { useMemo } from "react";
import { Card, Input, Tabs, Tree } from "antd";
import type { DataNode } from "antd/es/tree";

import styles from "./UserManagePage.module.css";
import type { OrgTreeNode, OrgType } from "./userData";
import { orgTypeLabelMap, orgTreeMap } from "./userData";

interface OrgTreePanelProps {
  activeType: OrgType;
  selectedOrgId: string;
  searchText: string;
  onTypeChange: (type: OrgType) => void;
  onSearchChange: (value: string) => void;
  onSelectOrg: (orgId: string) => void;
}

const highlight = (text: string, keyword: string): React.ReactNode => {
  const kw = keyword.trim();
  if (!kw) {
    return text;
  }
  const idx = text.toLowerCase().indexOf(kw.toLowerCase());
  if (idx < 0) {
    return text;
  }
  return (
    <>
      {text.slice(0, idx)}
      <span className={styles.match}>{text.slice(idx, idx + kw.length)}</span>
      {text.slice(idx + kw.length)}
    </>
  );
};

const buildData = (nodes: OrgTreeNode[], keyword: string): DataNode[] => {
  const kw = keyword.trim().toLowerCase();
  const filterNode = (node: OrgTreeNode): DataNode | null => {
    const children = (node.children ?? []).map((child) => filterNode(child)).filter(Boolean) as DataNode[];
    const selfMatch = !kw || node.title.toLowerCase().includes(kw);
    if (!selfMatch && children.length === 0) {
      return null;
    }
    return { key: node.key, title: highlight(node.title, keyword), children };
  };
  return nodes.map((n) => filterNode(n)).filter(Boolean) as DataNode[];
};

const collectKeys = (nodes: OrgTreeNode[]): string[] => {
  const keys: string[] = [];
  const walk = (list: OrgTreeNode[]) => {
    list.forEach((n) => {
      keys.push(n.key);
      if (n.children?.length) {
        walk(n.children);
      }
    });
  };
  walk(nodes);
  return keys;
};

const OrgTreePanel: React.FC<OrgTreePanelProps> = ({
  activeType,
  selectedOrgId,
  searchText,
  onTypeChange,
  onSearchChange,
  onSelectOrg,
}) => {
  const currentTree = orgTreeMap[activeType];
  const treeData = useMemo(() => buildData(currentTree, searchText), [currentTree, searchText]);
  const expandedKeys = useMemo(() => (searchText.trim() ? collectKeys(currentTree) : ["all"]), [currentTree, searchText]);

  return (
    <Card className={styles.orgCard}>
      <Tabs
        size="small"
        type="card"
        activeKey={activeType}
        onChange={(key) => onTypeChange(key as OrgType)}
        items={(Object.keys(orgTypeLabelMap) as OrgType[]).map((type) => ({ key: type, label: orgTypeLabelMap[type] }))}
      />
      <Input.Search
        allowClear
        size="small"
        placeholder="搜索组织名称"
        value={searchText}
        onChange={(e) => onSearchChange(e.target.value)}
        style={{ marginBottom: 10 }}
      />
      <Tree
        showLine
        blockNode
        treeData={treeData}
        selectedKeys={[selectedOrgId]}
        expandedKeys={expandedKeys}
        onSelect={(keys) => onSelectOrg((keys[0] as string) || "all")}
      />
    </Card>
  );
};

export default OrgTreePanel;
