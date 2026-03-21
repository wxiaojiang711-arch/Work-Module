import React, { useMemo, useState } from 'react';
import { Input, Modal, Table, Tree, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { DataNode } from 'antd/es/tree';

import { allUsers, orgTree, type PlatformUser } from './roleMockData';

type Props = {
  open: boolean;
  roleCode: string;
  existingUserIds: string[];
  onCancel: () => void;
  onConfirm: (users: PlatformUser[]) => void;
};

const UserSelectModal: React.FC<Props> = ({ open, roleCode, existingUserIds, onCancel, onConfirm }) => {
  const [selectedOrgId, setSelectedOrgId] = useState<string>('dept-001');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const userList = useMemo(
    () => allUsers.filter((u) => u.orgId === selectedOrgId),
    [selectedOrgId],
  );

  const columns: ColumnsType<PlatformUser> = [
    { title: '姓名', dataIndex: 'name', key: 'name', width: 100 },
    { title: '账号', dataIndex: 'account', key: 'account', width: 120 },
    {
      title: '当前角色',
      key: 'roles',
      render: (_, r) => r.roles.join('、') || '-',
    },
  ];

  const treeData: DataNode[] = orgTree as unknown as DataNode[];

  return (
    <Modal
      title='选择用户'
      open={open}
      width={560}
      onCancel={onCancel}
      onOk={() => {
        onConfirm(allUsers.filter((u) => selectedRowKeys.includes(u.id)));
        setSelectedRowKeys([]);
      }}
      okText='确认添加'
      cancelText='取消'
    >
      <div style={{ display: 'flex', height: 360 }}>
        <div style={{ width: 180, borderRight: '1px solid #f0f0f0', padding: 8, overflow: 'auto' }}>
          <Tree
            treeData={treeData}
            defaultExpandAll
            selectedKeys={[selectedOrgId]}
            onSelect={(keys) => {
              if (keys.length) setSelectedOrgId(String(keys[0]));
            }}
          />
        </div>
        <div style={{ flex: 1, padding: 8, overflow: 'auto' }}>
          <Table<PlatformUser>
            rowKey='id'
            size='small'
            pagination={false}
            columns={columns}
            dataSource={userList}
            rowSelection={{
              selectedRowKeys,
              onChange: setSelectedRowKeys,
              getCheckboxProps: (record) => {
                const disabled = existingUserIds.includes(record.id) || record.roles.includes(roleCode);
                return { disabled };
              },
            }}
            rowClassName={(record) =>
              existingUserIds.includes(record.id) || record.roles.includes(roleCode) ? 'role-user-disabled-row' : ''
            }
          />
          <Typography.Text type='secondary' style={{ display: 'block', marginTop: 8 }}>
            已选择 {selectedRowKeys.length} 人
          </Typography.Text>
        </div>
      </div>
    </Modal>
  );
};

export default UserSelectModal;
