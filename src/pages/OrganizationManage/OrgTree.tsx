import React, { useMemo } from "react";
import { Button, Input, Popconfirm, Space, Tabs, Tooltip, Tree, message } from "antd";
import type { DataNode, TreeProps } from "antd/es/tree";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";

import type { OrgNode, OrgType } from "./orgConstants";
import { orgTypeLabelMap } from "./orgConstants";
import styles from "./OrganizationManagePage.module.css";

interface OrgTreeProps {
  activeType: OrgType;
  treeData: OrgNode[];
  selectedKey?: string;
  expandedKeys: string[];
  searchKeyword: string;
  onTypeChange: (type: OrgType) => void;
  onSearchChange: (keyword: string) => void;
  onSelect: (key: string) => void;
  onExpand: (keys: string[]) => void;
  onCreateRoot: () => void;
  onCreateChild: (parent: OrgNode) => void;
  onEdit: (node: OrgNode) => void;
  onDelete: (node: OrgNode) => void;
}

const highlightText = (text: string, keyword: string): React.ReactNode => {
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
      <span className={styles.matchText}>{text.slice(idx, idx + kw.length)}</span>
      {text.slice(idx + kw.length)}
    </>
  );
};

const buildTreeData = (
  nodes: OrgNode[],
  keyword: string,
  handlers: Pick<OrgTreeProps, "onCreateChild" | "onEdit" | "onDelete">,
): DataNode[] => {
  const kw = keyword.trim().toLowerCase();
  const filterNode = (node: OrgNode): DataNode | null => {
    const children = node.children
      .map((child) => filterNode(child))
      .filter(Boolean) as DataNode[];
    const selfMatch = !kw || node.title.toLowerCase().includes(kw);
    const childMatch = children.length > 0;
    if (!selfMatch && !childMatch) {
      return null;
    }

    return {
      key: node.key,
      title: (
        <div className={styles.treeNode}>
          <span className={styles.nodeName}>{highlightText(node.title, keyword)}</span>
          <Space size={6} className={styles.nodeActions}>
            <Tooltip title="新增下级组织">
              <PlusOutlined
                className={styles.actionIcon}
                onClick={(event) => {
                  event.stopPropagation();
                  handlers.onCreateChild(node);
                }}
              />
            </Tooltip>
            <Tooltip title="编辑">
              <EditOutlined
                className={styles.actionIcon}
                onClick={(event) => {
                  event.stopPropagation();
                  handlers.onEdit(node);
                }}
              />
            </Tooltip>
            <Tooltip title="删除">
              <DeleteOutlined
                className={styles.actionIconDanger}
                onClick={(event) => {
                  event.stopPropagation();
                  if (node.children.length > 0) {
                    message.warning("请先删除或移动下级组织后再操作");
                    return;
                  }
                  handlers.onDelete(node);
                }}
              />
            </Tooltip>
          </Space>
        </div>
      ),
      children,
    };
  };

  return nodes.map((item) => filterNode(item)).filter(Boolean) as DataNode[];
};

const OrgTree: React.FC<OrgTreeProps> = ({
  activeType,
  treeData,
  selectedKey,
  expandedKeys,
  searchKeyword,
  onTypeChange,
  onSearchChange,
  onSelect,
  onExpand,
  onCreateRoot,
  onCreateChild,
  onEdit,
  onDelete,
}) => {
  const treeNodes = useMemo(
    () => buildTreeData(treeData, searchKeyword, { onCreateChild, onEdit, onDelete }),
    [onCreateChild, onDelete, onEdit, searchKeyword, treeData],
  );

  const tabItems = (Object.keys(orgTypeLabelMap) as OrgType[]).map((type) => ({
    key: type,
    label: orgTypeLabelMap[type],
  }));

  const handleSelect: TreeProps["onSelect"] = (keys) => {
    const key = keys?.[0];
    if (key) {
      onSelect(String(key));
    }
  };

  return (
    <>
      <Tabs
        activeKey={activeType}
        items={tabItems}
        onChange={(key) => onTypeChange(key as OrgType)}
      />

      <div className={styles.toolbar}>
        <Space style={{ width: "100%" }}>
          <Input.Search
            placeholder="搜索组织名称"
            allowClear
            value={searchKeyword}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{ width: 190 }}
          />
          <Button type="primary" size="small" icon={<PlusOutlined />} onClick={onCreateRoot}>
            新增组织
          </Button>
        </Space>
      </div>

      <Tree
        showLine
        blockNode
        selectedKeys={selectedKey ? [selectedKey] : []}
        expandedKeys={expandedKeys}
        onExpand={(keys) => onExpand(keys.map((item) => String(item)))}
        treeData={treeNodes}
        onSelect={handleSelect}
      />
    </>
  );
};

export default OrgTree;
