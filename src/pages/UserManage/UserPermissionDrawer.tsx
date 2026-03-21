import React, { useMemo } from "react";
import { Avatar, Button, Card, Drawer, List, Space, Tag, Typography } from "antd";
import type { DataNode } from "antd/es/tree";
import { CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";
import { Tree } from "antd";

import styles from "./UserManagePage.module.css";
import {
  orgNameMap,
  permissionTree,
  roleColorMap,
  roleNameMap,
  statusMap,
  type UserPermissionDetail,
} from "./userData";

const { Text } = Typography;

interface UserPermissionDrawerProps {
  open: boolean;
  detail: UserPermissionDetail | null;
  onClose: () => void;
  onEdit: () => void;
}

const UserPermissionDrawer: React.FC<UserPermissionDrawerProps> = ({ open, detail, onClose, onEdit }) => {
  const permissionTreeData: DataNode[] = useMemo(() => {
    if (!detail) {
      return [];
    }

    const permissionMap = new Map(detail.mergedPermissions.map((item) => [item.key, item]));

    return permissionTree.map((module) => ({
      key: module.key,
      title: module.title,
      children: module.children.map((node) => {
        const found = permissionMap.get(node.key);
        const granted = Boolean(found?.granted);

        return {
          key: node.key,
          title: (
            <div className={styles.permissionRow}>
              <Space size={8}>
                {granted ? (
                  <CheckCircleFilled style={{ color: "#52c41a" }} />
                ) : (
                  <CloseCircleFilled style={{ color: "#d9d9d9" }} />
                )}
                <span style={{ color: granted ? "rgba(0,0,0,0.88)" : "#bfbfbf" }}>{node.title}</span>
              </Space>
              <span className={styles.permissionSource}>来自：{found?.fromRole ?? "-"}</span>
            </div>
          ),
        };
      }),
    }));
  }, [detail]);

  return (
    <Drawer
      open={open}
      width={560}
      placement="right"
      title={detail ? `${detail.name} - 权限详情` : "权限详情"}
      onClose={onClose}
      destroyOnClose
      footer={
        <div className={styles.drawerFooter}>
          <Space>
            <Button onClick={onClose}>关闭</Button>
            <Button
              type="primary"
              onClick={() => {
                onClose();
                onEdit();
              }}
            >
              编辑权限
            </Button>
          </Space>
        </div>
      }
      styles={{ body: { padding: 24 } }}
    >
      {detail ? (
        <Space direction="vertical" size={16} style={{ width: "100%" }}>
          <Card className={styles.userInfoCard}>
            <Space align="start" size={12}>
              <Avatar
                size={48}
                style={{
                  background: "#e6f4ff",
                  color: "#1677ff",
                  fontWeight: 600,
                }}
              >
                {detail.name.slice(0, 1)}
              </Avatar>
              <Space direction="vertical" size={4}>
                <Text strong>
                  {detail.name}（{detail.account}）
                </Text>
                <Text type="secondary">所属组织：{detail.orgName}</Text>
                <Text type="secondary">职务/岗位：{detail.position || "-"}</Text>
                <Space wrap>
                  {detail.roles.map((code) => (
                    <Tag key={code} color={roleColorMap[code] ?? "#722ed1"}>
                      {roleNameMap[code] ?? code}
                    </Tag>
                  ))}
                  <Tag color={detail.status === "active" ? "green" : "default"}>{statusMap[detail.status].label}</Tag>
                </Space>
              </Space>
            </Space>
          </Card>

          <Card title="数据可见范围" size="small">
            <Space direction="vertical" size={12} style={{ width: "100%" }}>
              <Text>
                基础范围：{detail.dataScope.base}
                <Text type="secondary">（基于所属组织）</Text>
              </Text>
              <div>
                <Text>额外授权范围：</Text>
                <div style={{ marginTop: 8 }}>
                  {detail.dataScope.extra.length ? (
                    <Space wrap>
                      {detail.dataScope.extra.map((orgId) => (
                        <Tag key={orgId}>{orgNameMap[orgId] ?? orgId}</Tag>
                      ))}
                    </Space>
                  ) : (
                    <Text type="secondary">无额外授权</Text>
                  )}
                </div>
              </div>

              <div>
                <Text style={{ display: "block", marginBottom: 8 }}>知识库可见列表</Text>
                <List
                  size="small"
                  bordered
                  dataSource={detail.accessibleKnowledgeBases}
                  renderItem={(item) => (
                    <List.Item>
                      <Space wrap>
                        <Text>{item.name}</Text>
                        <Tag color={item.type === "unit" ? "blue" : "gold"}>{item.type === "unit" ? "单位库" : "主题库"}</Tag>
                        <Tag color={item.permission === "edit" ? "success" : "default"}>
                          {item.permission === "edit" ? "可编辑" : "仅查看"}
                        </Tag>
                        {item.reason ? <Text type="secondary">{item.reason}</Text> : null}
                      </Space>
                    </List.Item>
                  )}
                />
              </div>
            </Space>
          </Card>

          <Card title="功能操作权限" size="small">
            <Tree treeData={permissionTreeData} defaultExpandAll selectable={false} />
          </Card>
        </Space>
      ) : null}
    </Drawer>
  );
};

export default UserPermissionDrawer;
