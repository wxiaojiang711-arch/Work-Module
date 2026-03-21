import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Button,
  Checkbox,
  Drawer,
  Space,
  Tree,
  Typography,
  message,
  Modal,
} from 'antd';
import {
  CloudUploadOutlined,
  DatabaseOutlined,
  FileSearchOutlined,
  FileTextOutlined,
  ScheduleOutlined,
  SearchOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import type { DataNode } from 'antd/es/tree';

import { permissionTree, type PermissionTreeNode, type RoleItem } from './roleMockData';

type Props = {
  open: boolean;
  role: RoleItem | null;
  onClose: () => void;
  onSave: (permissions: string[]) => void;
};

const iconMap: Record<string, React.ReactNode> = {
  DatabaseOutlined: <DatabaseOutlined style={{ color: '#1890ff' }} />,
  ScheduleOutlined: <ScheduleOutlined style={{ color: '#1890ff' }} />,
  CloudUploadOutlined: <CloudUploadOutlined style={{ color: '#1890ff' }} />,
  FileTextOutlined: <FileTextOutlined style={{ color: '#1890ff' }} />,
  SearchOutlined: <SearchOutlined style={{ color: '#1890ff' }} />,
  SettingOutlined: <SettingOutlined style={{ color: '#1890ff' }} />,
};

const allLeafKeys = permissionTree.flatMap((m) => m.children.map((c) => c.key));

const PermissionDrawer: React.FC<Props> = ({ open, role, onClose, onSave }) => {
  const isSystemAdmin = role?.code === 'system_admin';
  const isPreset = role?.type === 'preset';

  const initialChecked = useMemo(() => {
    if (!role) return [] as string[];
    if (isSystemAdmin) return allLeafKeys;
    if (role.permissions.includes('all')) return allLeafKeys;
    return role.permissions;
  }, [role, isSystemAdmin]);

  const [checkedKeys, setCheckedKeys] = useState<string[]>(initialChecked);
  const [savedKeys, setSavedKeys] = useState<string[]>(initialChecked);

  useEffect(() => {
    setCheckedKeys(initialChecked);
    setSavedKeys(initialChecked);
  }, [initialChecked, open]);

  const dirty = useMemo(
    () => JSON.stringify([...checkedKeys].sort()) !== JSON.stringify([...savedKeys].sort()),
    [checkedKeys, savedKeys],
  );

  const checkedWithParent = useMemo(() => {
    const parents: string[] = [];
    permissionTree.forEach((m) => {
      const count = m.children.filter((c) => checkedKeys.includes(c.key)).length;
      if (count === m.children.length) parents.push(m.key);
    });
    return [...checkedKeys, ...parents];
  }, [checkedKeys]);

  const treeData: DataNode[] = permissionTree.map((m) => {
    const checkedCount = m.children.filter((c) => checkedKeys.includes(c.key)).length;
    return {
      key: m.key,
      title: (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space size={6}>
            {iconMap[m.icon]}
            <span style={{ fontSize: 14, fontWeight: 500 }}>{m.title}</span>
          </Space>
          <span style={{ fontSize: 12, color: '#bfbfbf' }}>已选 {checkedCount}/{m.children.length}</span>
        </div>
      ),
      children: m.children.map((c) => ({
        key: c.key,
        title: <span style={{ fontSize: 13, color: '#333' }}>{c.title}</span>,
      })),
    };
  });

  const closeWithGuard = () => {
    if (!dirty) {
      onClose();
      return;
    }
    Modal.confirm({
      title: '权限配置尚未保存',
      content: '确认关闭抽屉？未保存修改将丢失。',
      okText: '确认关闭',
      cancelText: '继续编辑',
      onOk: onClose,
    });
  };

  return (
    <Drawer
      title={`${role?.name ?? ''} - 权限配置`}
      placement='right'
      width={640}
      open={open}
      onClose={closeWithGuard}
      destroyOnClose
    >
      <div style={{ marginBottom: 12 }}>
        <Typography.Text type='secondary'>{role?.description}</Typography.Text>
      </div>

      {isSystemAdmin ? (
        <Alert type='info' showIcon message='系统管理员拥有全部权限，不可修改。' style={{ marginBottom: 12 }} />
      ) : null}

      {isPreset && !isSystemAdmin ? (
        <Alert
          type='warning'
          showIcon
          message='修改系统预置角色的权限可能影响现有用户的操作，请谨慎操作。'
          style={{ marginBottom: 12 }}
        />
      ) : null}

      <Tree
        checkable
        treeData={treeData}
        checkedKeys={checkedWithParent}
        disabled={isSystemAdmin}
        onCheck={(keys, info) => {
          const arr = (Array.isArray(keys) ? keys : keys.checked) as React.Key[];
          const leaf = arr.filter((k) => allLeafKeys.includes(String(k))).map(String);

          // If parent clicked, include/exclude its children manually for deterministic behavior.
          const trigger = String(info.node.key);
          const module = permissionTree.find((m) => m.key === trigger);
          if (module) {
            const childKeys = module.children.map((c) => c.key);
            const allHit = childKeys.every((k) => leaf.includes(k));
            setCheckedKeys(allHit ? Array.from(new Set([...leaf])) : leaf.filter((k) => !childKeys.includes(k)));
            return;
          }

          setCheckedKeys(Array.from(new Set(leaf)));
        }}
      />

      <div style={{ position: 'sticky', bottom: 0, background: '#fff', borderTop: '1px solid #f0f0f0', padding: '12px 24px', marginTop: 16 }}>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Checkbox
            checked={checkedKeys.length === allLeafKeys.length}
            indeterminate={checkedKeys.length > 0 && checkedKeys.length < allLeafKeys.length}
            disabled={isSystemAdmin}
            onChange={(e) => setCheckedKeys(e.target.checked ? allLeafKeys : [])}
          >
            全选所有权限
          </Checkbox>
          <Space>
            <Button onClick={closeWithGuard}>取消</Button>
            <Button
              type='primary'
              disabled={isSystemAdmin}
              onClick={() => {
                setSavedKeys(checkedKeys);
                onSave(checkedKeys);
                message.success('权限配置已保存');
                onClose();
              }}
            >
              保存权限配置
            </Button>
          </Space>
        </Space>
      </div>
    </Drawer>
  );
};

export default PermissionDrawer;
