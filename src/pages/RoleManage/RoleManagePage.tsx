import React, { useMemo, useState } from 'react';
import { Button, Col, Input, Row, Select, Space, Table, Tag, Typography, Popconfirm, message } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, SettingOutlined, TeamOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

import PermissionDrawer from './PermissionDrawer';
import RoleFormModal from './RoleFormModal';
import RoleUsersModal from './RoleUsersModal';
import { roleList as initRoleList, roleUsers as initRoleUsers, type RoleItem, type RoleUser } from './roleMockData';

type RoleTypeFilter = 'all' | 'preset' | 'custom';

const RoleManagePage: React.FC = () => {
  const [roles, setRoles] = useState<RoleItem[]>(initRoleList);
  const [usersMap, setUsersMap] = useState<Record<string, RoleUser[]>>(initRoleUsers);

  const [query, setQuery] = useState({ keyword: '', type: 'all' as RoleTypeFilter });
  const [appliedQuery, setAppliedQuery] = useState(query);

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingRole, setEditingRole] = useState<RoleItem | null>(null);

  const [permissionRole, setPermissionRole] = useState<RoleItem | null>(null);
  const [permissionOpen, setPermissionOpen] = useState(false);

  const [userRole, setUserRole] = useState<RoleItem | null>(null);
  const [userOpen, setUserOpen] = useState(false);

  const filteredRoles = useMemo(() => {
    return roles.filter((r) => {
      const kw = appliedQuery.keyword.trim().toLowerCase();
      const byKw = !kw || r.name.toLowerCase().includes(kw) || r.code.toLowerCase().includes(kw);
      const byType = appliedQuery.type === 'all' || r.type === appliedQuery.type;
      return byKw && byType;
    });
  }, [roles, appliedQuery]);

  const roleUsers = useMemo(() => usersMap[userRole?.id ?? ''] ?? [], [usersMap, userRole]);

  const openCreate = () => {
    setFormMode('create');
    setEditingRole({
      id: '',
      name: '',
      code: '',
      description: '',
      type: 'custom',
      color: '#722ed1',
      userCount: 0,
      permissionModules: [],
      permissions: [],
    });
    setFormOpen(true);
  };

  const onSaveRole = (payload: Pick<RoleItem, 'name' | 'code' | 'description' | 'type' | 'color' | 'userCount' | 'permissionModules' | 'permissions'>) => {
    if (formMode === 'create') {
      if (roles.some((r) => r.code === payload.code)) {
        message.error('角色编码已存在');
        return;
      }
      const next: RoleItem = {
        id: `role-${Date.now()}`,
        ...payload,
      };
      setRoles((prev) => [next, ...prev]);
      message.success('角色已创建');
    } else if (editingRole) {
      setRoles((prev) => prev.map((r) => (r.id === editingRole.id ? { ...r, ...payload, code: editingRole.code } : r)));
      message.success('角色已更新');
    }
    setFormOpen(false);
  };

  const columns: ColumnsType<RoleItem> = [
    {
      title: '角色名称',
      key: 'name',
      width: 200,
      render: (_, record) => (
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#333' }}>{record.name}</div>
          <div style={{ fontSize: 12, color: '#999' }}>{record.code}</div>
        </div>
      ),
    },
    {
      title: '角色类型',
      dataIndex: 'type',
      key: 'type',
      width: 110,
      render: (v: RoleItem['type']) => <Tag color={v === 'preset' ? 'blue' : 'green'}>{v === 'preset' ? '系统预置' : '自定义'}</Tag>,
    },
    {
      title: '角色描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '关联用户',
      dataIndex: 'userCount',
      key: 'userCount',
      width: 100,
      render: (v: number) => `${v}人`,
    },
    {
      title: '操作',
      key: 'actions',
      width: 340,
      fixed: 'right',
      render: (_, role) => (
        <Space size={0}>
          <Button
            type='link'
            icon={<SettingOutlined />}
            style={{ paddingInline: 4 }}
            onClick={() => {
              setPermissionRole(role);
              setPermissionOpen(true);
            }}
          >
            配置权限
          </Button>

          <Button
            type='link'
            icon={<EditOutlined />}
            style={{ paddingInline: 4 }}
            onClick={() => {
              setFormMode('edit');
              setEditingRole(role);
              setFormOpen(true);
            }}
          >
            编辑
          </Button>

          <Popconfirm
            title={`确认删除角色"${role.name}"？删除后该角色下的用户将失去对应权限。`}
            okText='确认'
            cancelText='取消'
            disabled={role.type === 'preset'}
            onConfirm={() => {
              setRoles((prev) => prev.filter((r) => r.id !== role.id));
              message.success('角色已删除');
            }}
          >
            <Button
              type='link'
              danger
              icon={<DeleteOutlined />}
              disabled={role.type === 'preset'}
              style={{ paddingInline: 4 }}
            >
              删除
            </Button>
          </Popconfirm>

          <Button
            type='link'
            icon={<TeamOutlined />}
            style={{ paddingInline: 4 }}
            onClick={() => {
              setUserRole(role);
              setUserOpen(true);
            }}
          >
            查看用户
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ height: '100%', overflow: 'auto', background: '#f3f6fb', padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <Typography.Title level={5} style={{ margin: 0 }}>角色管理</Typography.Title>
        <Button type='primary' icon={<PlusOutlined />} onClick={openCreate}>新建角色</Button>
      </div>

      <div style={{ background: '#fafafa', borderRadius: 8, padding: '16px 20px', maxWidth: 900, marginBottom: 12 }}>
        <Row gutter={[12, 12]} align='middle'>
          <Col span={8}>
            <Input.Search
              allowClear
              placeholder='搜索角色名称或编码'
              value={query.keyword}
              onChange={(e) => setQuery((prev) => ({ ...prev, keyword: e.target.value }))}
              onSearch={() => setAppliedQuery(query)}
            />
          </Col>
          <Col span={5}>
            <Select
              style={{ width: '100%' }}
              value={query.type}
              options={[
                { label: '全部类型', value: 'all' },
                { label: '系统预置', value: 'preset' },
                { label: '自定义', value: 'custom' },
              ]}
              onChange={(value) => setQuery((prev) => ({ ...prev, type: value }))}
            />
          </Col>
          <Col span={6}>
            <Space>
              <Button type='primary' onClick={() => setAppliedQuery(query)}>查询</Button>
              <Button
                onClick={() => {
                  const reset = { keyword: '', type: 'all' as RoleTypeFilter };
                  setQuery(reset);
                  setAppliedQuery(reset);
                }}
              >
                重置
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      <Table<RoleItem>
        rowKey='id'
        columns={columns}
        dataSource={filteredRoles}
        scroll={{ x: 1500 }}
        pagination={{
          showQuickJumper: true,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
      />

      <RoleFormModal
        open={formOpen}
        mode={formMode}
        role={editingRole}
        onCancel={() => setFormOpen(false)}
        onSubmit={onSaveRole}
      />

      <PermissionDrawer
        open={permissionOpen}
        role={permissionRole}
        onClose={() => setPermissionOpen(false)}
        onSave={(permissions) => {
          if (!permissionRole) return;
          setRoles((prev) => prev.map((r) => (r.id === permissionRole.id ? { ...r, permissions } : r)));
        }}
      />

      <RoleUsersModal
        open={userOpen}
        roleName={userRole?.name ?? ''}
        roleCode={userRole?.code ?? ''}
        users={roleUsers}
        onClose={() => setUserOpen(false)}
        onChangeUsers={(nextUsers) => {
          if (!userRole) return;
          setUsersMap((prev) => ({ ...prev, [userRole.id]: nextUsers }));
          setRoles((prev) => prev.map((r) => (r.id === userRole.id ? { ...r, userCount: nextUsers.length } : r)));
        }}
      />
    </div>
  );
};

export default RoleManagePage;
