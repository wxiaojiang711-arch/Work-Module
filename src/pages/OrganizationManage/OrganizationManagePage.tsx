import React, { useMemo, useState } from "react";
import { Modal, message } from "antd";

import OrgDetail from "./OrgDetail";
import OrgFormModal, { type OrgFormValues } from "./OrgFormModal";
import OrgTree from "./OrgTree";
import {
  departmentTreeData,
  soeTreeData,
  townTreeData,
  type OrgNode,
  type OrgType,
} from "./orgConstants";
import styles from "./OrganizationManagePage.module.css";

type TreeState = Record<OrgType, OrgNode[]>;

const cloneTree = (tree: OrgNode[]): OrgNode[] => JSON.parse(JSON.stringify(tree));

const findNode = (nodes: OrgNode[], key?: string): OrgNode | null => {
  if (!key) {
    return null;
  }
  for (const node of nodes) {
    if (node.key === key) {
      return node;
    }
    const inChildren = findNode(node.children, key);
    if (inChildren) {
      return inChildren;
    }
  }
  return null;
};

const findParent = (nodes: OrgNode[], key?: string, parent: OrgNode | null = null): OrgNode | null => {
  if (!key) {
    return null;
  }
  for (const node of nodes) {
    if (node.key === key) {
      return parent;
    }
    const inChildren = findParent(node.children, key, node);
    if (inChildren || inChildren === null) {
      if (findNode(node.children, key)) {
        return inChildren;
      }
    }
  }
  return null;
};

const collectKeys = (nodes: OrgNode[]): string[] => {
  const result: string[] = [];
  const walk = (list: OrgNode[]) => {
    list.forEach((node) => {
      result.push(node.key);
      if (node.children.length) {
        walk(node.children);
      }
    });
  };
  walk(nodes);
  return result;
};

const addNode = (nodes: OrgNode[], newNode: OrgNode, parentKey?: string): OrgNode[] => {
  if (!parentKey) {
    return [...nodes, newNode].sort((a, b) => (a.sort ?? 999) - (b.sort ?? 999));
  }
  return nodes.map((node) => {
    if (node.key === parentKey) {
      const children = [...node.children, newNode].sort((a, b) => (a.sort ?? 999) - (b.sort ?? 999));
      return { ...node, children };
    }
    return { ...node, children: addNode(node.children, newNode, parentKey) };
  });
};

const updateNode = (nodes: OrgNode[], key: string, patch: Partial<OrgNode>): OrgNode[] =>
  nodes.map((node) => {
    if (node.key === key) {
      return { ...node, ...patch };
    }
    return { ...node, children: updateNode(node.children, key, patch) };
  });

const removeNode = (nodes: OrgNode[], key: string): OrgNode[] =>
  nodes
    .filter((node) => node.key !== key)
    .map((node) => ({ ...node, children: removeNode(node.children, key) }));

const getDefaultExpanded = (nodes: OrgNode[]): string[] => nodes.map((node) => node.key);

const OrganizationManagePage: React.FC = () => {
  const [treeMap, setTreeMap] = useState<TreeState>({
    department: cloneTree(departmentTreeData),
    town: cloneTree(townTreeData),
    soe: cloneTree(soeTreeData),
  });
  const [activeType, setActiveType] = useState<OrgType>("department");
  const [selectedKey, setSelectedKey] = useState<string>();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [expandedKeys, setExpandedKeys] = useState<string[]>(getDefaultExpanded(departmentTreeData));

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingNode, setEditingNode] = useState<OrgNode | null>(null);
  const [createParentKey, setCreateParentKey] = useState<string>();
  const [parentFixed, setParentFixed] = useState(false);

  const currentTree = treeMap[activeType];
  const selectedNode = useMemo(() => findNode(currentTree, selectedKey), [currentTree, selectedKey]);
  const parentNode = useMemo(() => findParent(currentTree, selectedKey), [currentTree, selectedKey]);

  const openCreateModal = (parentKey?: string, fixed = false) => {
    setModalMode("create");
    setEditingNode(null);
    setCreateParentKey(parentKey);
    setParentFixed(fixed);
    setModalOpen(true);
  };

  const openEditModal = (node: OrgNode) => {
    setModalMode("edit");
    setEditingNode(node);
    setCreateParentKey(undefined);
    setParentFixed(false);
    setModalOpen(true);
  };

  const handleDelete = (node: OrgNode) => {
    if (node.children.length > 0) {
      message.warning("请先删除或移动下级组织后再操作");
      return;
    }
    setTreeMap((prev) => ({
      ...prev,
      [activeType]: removeNode(prev[activeType], node.key),
    }));
    if (selectedKey === node.key) {
      setSelectedKey(undefined);
    }
    message.success("删除成功");
  };

  const handleTypeChange = (type: OrgType) => {
    setActiveType(type);
    setSelectedKey(undefined);
    setSearchKeyword("");
    setExpandedKeys(getDefaultExpanded(treeMap[type]));
  };

  const handleSearchChange = (keyword: string) => {
    setSearchKeyword(keyword);
    if (!keyword.trim()) {
      setExpandedKeys(getDefaultExpanded(currentTree));
      return;
    }
    setExpandedKeys(collectKeys(currentTree));
  };

  const handleSubmitModal = (values: OrgFormValues) => {
    if (modalMode === "create") {
      const newNode: OrgNode = {
        key: `${activeType}-${Date.now()}`,
        title: values.title,
        fullName: values.fullName,
        code: values.code,
        type: activeType,
        leader: values.leader ?? "",
        phone: values.phone ?? "",
        sort: values.sort ?? 999,
        status: values.status,
        remark: values.remark ?? "",
        createdAt: new Date().toISOString().slice(0, 19).replace("T", " "),
        children: [],
      };

      setTreeMap((prev) => ({
        ...prev,
        [activeType]: addNode(prev[activeType], newNode, values.parentKey ?? createParentKey),
      }));
      setExpandedKeys((prev) => Array.from(new Set([...prev, values.parentKey ?? createParentKey ?? ""])).filter(Boolean));
      setSelectedKey(newNode.key);
      message.success("新增成功");
    } else if (editingNode) {
      setTreeMap((prev) => ({
        ...prev,
        [activeType]: updateNode(prev[activeType], editingNode.key, {
          title: values.title,
          fullName: values.fullName,
          leader: values.leader ?? "",
          phone: values.phone ?? "",
          sort: values.sort ?? 999,
          status: values.status,
          remark: values.remark ?? "",
        }),
      }));
      message.success("更新成功");
    }
    setModalOpen(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.layout}>
        <div className={styles.leftPanel}>
          <OrgTree
            activeType={activeType}
            treeData={currentTree}
            selectedKey={selectedKey}
            expandedKeys={expandedKeys}
            searchKeyword={searchKeyword}
            onTypeChange={handleTypeChange}
            onSearchChange={handleSearchChange}
            onSelect={setSelectedKey}
            onExpand={setExpandedKeys}
            onCreateRoot={() => openCreateModal(undefined, false)}
            onCreateChild={(node) => openCreateModal(node.key, true)}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        </div>

        <div className={styles.rightPanel}>
          <OrgDetail
            selectedNode={selectedNode}
            parentName={parentNode?.title ?? ""}
            onEdit={() => selectedNode && openEditModal(selectedNode)}
            onDelete={() => {
              if (!selectedNode) {
                return;
              }
              Modal.confirm({
                title: "确认删除该组织吗？",
                content: "删除后不可恢复。",
                okText: "删除",
                okType: "danger",
                cancelText: "取消",
                onOk: () => handleDelete(selectedNode),
              });
            }}
            onViewChild={(key) => {
              setSelectedKey(key);
              setExpandedKeys((prev) => Array.from(new Set([...prev, key])));
            }}
          />
        </div>
      </div>

      <OrgFormModal
        open={modalOpen}
        mode={modalMode}
        currentType={activeType}
        treeData={currentTree}
        initialValues={
          modalMode === "edit" && editingNode
            ? {
                title: editingNode.title,
                fullName: editingNode.fullName,
                code: editingNode.code,
                type: editingNode.type,
                parentKey: findParent(currentTree, editingNode.key)?.key,
                leader: editingNode.leader,
                phone: editingNode.phone,
                sort: editingNode.sort,
                status: editingNode.status,
                remark: editingNode.remark,
              }
            : {
                type: activeType,
                parentKey: createParentKey,
              }
        }
        parentFixed={parentFixed}
        typeFixed
        onCancel={() => setModalOpen(false)}
        onSubmit={handleSubmitModal}
      />
    </div>
  );
};

export default OrganizationManagePage;
