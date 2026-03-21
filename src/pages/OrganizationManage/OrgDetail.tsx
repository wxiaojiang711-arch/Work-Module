import React, { useMemo } from "react";
import { Button, Card, Descriptions, Empty, Space, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

import type { OrgNode } from "./orgConstants";
import { orgStatusTagMap, orgTypeLabelMap } from "./orgConstants";
import styles from "./OrganizationManagePage.module.css";

interface OrgDetailProps {
  selectedNode: OrgNode | null;
  parentName: string;
  onEdit: () => void;
  onDelete: () => void;
  onViewChild: (key: string) => void;
}

const OrgDetail: React.FC<OrgDetailProps> = ({ selectedNode, parentName, onEdit, onDelete, onViewChild }) => {
  const childColumns = useMemo<ColumnsType<OrgNode>>(
    () => [
      { title: "组织名称", dataIndex: "title", key: "title" },
      { title: "组织编码", dataIndex: "code", key: "code", width: 180 },
      { title: "负责人", dataIndex: "leader", key: "leader", width: 120 },
      {
        title: "状态",
        dataIndex: "status",
        key: "status",
        width: 100,
        render: (status: OrgNode["status"]) => (
          <Tag color={orgStatusTagMap[status].color}>{orgStatusTagMap[status].text}</Tag>
        ),
      },
      {
        title: "操作",
        key: "actions",
        width: 100,
        render: (_value, record) => (
          <Button type="link" onClick={() => onViewChild(record.key)}>
            查看
          </Button>
        ),
      },
    ],
    [onViewChild],
  );

  if (!selectedNode) {
    return (
      <div className={styles.emptyWrap}>
        <Empty description="请在左侧选择一个组织查看详情" />
      </div>
    );
  }

  return (
    <Card
      title={selectedNode.title}
      extra={
        <Space>
          <Button icon={<EditOutlined />} onClick={onEdit}>
            编辑
          </Button>
          <Button danger icon={<DeleteOutlined />} onClick={onDelete}>
            删除
          </Button>
        </Space>
      }
    >
      <Descriptions column={2} bordered size="small">
        <Descriptions.Item label="组织全称">{selectedNode.fullName}</Descriptions.Item>
        <Descriptions.Item label="组织简称">{selectedNode.title}</Descriptions.Item>
        <Descriptions.Item label="组织编码">{selectedNode.code}</Descriptions.Item>
        <Descriptions.Item label="组织类型">{orgTypeLabelMap[selectedNode.type]}</Descriptions.Item>
        <Descriptions.Item label="上级组织">{parentName || "-"}</Descriptions.Item>
        <Descriptions.Item label="负责人">{selectedNode.leader || "-"}</Descriptions.Item>
        <Descriptions.Item label="联系电话">{selectedNode.phone || "-"}</Descriptions.Item>
        <Descriptions.Item label="排序号">{selectedNode.sort || "-"}</Descriptions.Item>
        <Descriptions.Item label="状态">
          <Tag color={orgStatusTagMap[selectedNode.status].color}>{orgStatusTagMap[selectedNode.status].text}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="创建时间">{selectedNode.createdAt}</Descriptions.Item>
        <Descriptions.Item label="备注" span={2}>
          {selectedNode.remark || "-"}
        </Descriptions.Item>
      </Descriptions>

      <Typography.Title level={5} className={styles.childTitle}>
        下属组织
      </Typography.Title>
      {selectedNode.children.length > 0 ? (
        <Table
          rowKey="key"
          size="small"
          pagination={false}
          columns={childColumns}
          dataSource={selectedNode.children}
        />
      ) : (
        <Empty description="暂无下属组织" />
      )}
    </Card>
  );
};

export default OrgDetail;
