import React, { useMemo, useState } from 'react';
import { Button, Input, Modal, Popconfirm, Space, Table } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

import UserSelectModal from './UserSelectModal';
import type { PlatformUser, RoleUser } from './roleMockData';

type Props = {
  open: boolean;
  roleName: string;
  roleCode: string;
  users: RoleUser[];
  onClose: () => void;
  onChangeUsers: (users: RoleUser[]) => void;
};

const RoleUsersModal: React.FC<Props> = ({ open, roleName, roleCode, users, onClose, onChangeUsers }) => {
  const [keyword, setKeyword] = useState('');
  const [selectOpen, setSelectOpen] = useState(false);

  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    if (!kw) return users;
    return users.filter((u) => u.name.toLowerCase().includes(kw) || u.account.toLowerCase().includes(kw));
  }, [users, keyword]);

  const columns: ColumnsType<RoleUser> = [
    { title: '用户姓名', dataIndex: 'name', key: 'name', width: 100 },
    { title: '账号', dataIndex: 'account', key: 'account', width: 120 },
    { title: '所属单位', dataIndex: 'orgName', key: 'orgName', width: 140 },
    { title: '手机号', dataIndex: 'phone', key: 'phone', width: 120 },
    { title: '添加时间', dataIndex: 'addedAt', key: 'addedAt', width: 180 },
    {
      title: '操作',
      key: 'actions',
      width: 80,
      render: (_, record) => (
        <Popconfirm
          title={`确认将用户“${record.name}”从角色“${roleName}”中移除？移除后该用户将失去对应权限。`}
          okText='确认'
          cancelText='取消'
          onConfirm={() => onChangeUsers(users.filter((u) => u.id !== record.id))}
        >
          <Button type='link' danger>移除</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <>
      <Modal
        title={`角色关联用户 - ${roleName}`}
        open={open}
        onCancel={onClose}
        footer={null}
        width={640}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ whiteSpace: "nowrap" }}>用户关键词：</span>
            <Input.Search
              allowClear
              placeholder='搜索用户姓名或账号'
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              style={{ width: 280 }}
            />
          </div>
          <Button type='primary' size='small' icon={<PlusOutlined />} onClick={() => setSelectOpen(true)}>
            添加用户
          </Button>
        </div>

        <Table<RoleUser>
          rowKey='id'
          size='small'
          pagination={{ pageSize: 6 }}
          columns={columns}
          dataSource={filtered}
          scroll={{ x: 700 }}
        />
      </Modal>

      <UserSelectModal
        open={selectOpen}
        roleCode={roleCode}
        existingUserIds={users.map((u) => u.id)}
        onCancel={() => setSelectOpen(false)}
        onConfirm={(list: PlatformUser[]) => {
          const append = list
            .filter((u) => !users.some((x) => x.id === u.id))
            .map<RoleUser>((u) => ({
              id: u.id,
              name: u.name,
              account: u.account,
              orgName: u.orgName,
              phone: '138****1000',
              addedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
            }));
          onChangeUsers([...users, ...append]);
          setSelectOpen(false);
        }}
      />
    </>
  );
};

export default RoleUsersModal;

