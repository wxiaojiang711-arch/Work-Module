import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  Checkbox,
  Collapse,
  Drawer,
  Form,
  Input,
  Modal,
  Space,
  Switch,
  Tooltip,
  Tree,
  TreeSelect,
  Typography,
  message,
} from "antd";
import type { DataNode } from "antd/es/tree";
import { CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";

import styles from "./UserManagePage.module.css";
import {
  buildMergedPermissions,
  orgNameMap,
  orgTree,
  permissionTree,
  roleOptions,
  rolePermissionMap,
  type RoleCode,
  type UserItem,
} from "./userData";

const { Text } = Typography;

export interface UserFormValues {
  name: string;
  account: string;
  phone: string;
  password?: string;
  orgId: string;
  position?: string;
  isDataOfficer: boolean;
  roles: RoleCode[];
  extraDataAuth?: string[];
  email?: string;
}

interface UserFormDrawerProps {
  open: boolean;
  mode: "create" | "edit";
  record?: UserItem | null;
  users: UserItem[];
  canAssignSystemAdmin: boolean;
  focusSection?: "basic" | "org" | "permission";
  onClose: () => void;
  onSubmit: (values: UserFormValues & { replaceDataOfficerUserId?: string }) => void;
}

type TreeNode = {
  title: string;
  value: string;
  key: string;
  children?: TreeNode[];
};

const mapTreeData = (nodes: Array<{ key: string; title: string; children?: Array<{ key: string; title: string; children?: any[] }> }>): TreeNode[] =>
  nodes.map((node) => ({
    title: node.title,
    value: node.key,
    key: node.key,
    children: node.children?.length ? mapTreeData(node.children) : undefined,
  }));

const filterExtraTree = (nodes: TreeNode[], selectedOrgId?: string): TreeNode[] => {
  const walk = (node: TreeNode): TreeNode | null => {
    if (node.value === selectedOrgId) {
      return null;
    }
    const nextChildren = (node.children ?? []).map(walk).filter(Boolean) as TreeNode[];
    if (node.children && !nextChildren.length && node.value.startsWith("dept") === false && node.value.startsWith("town") === false && node.value.startsWith("soe") === false) {
      return { ...node, children: [] };
    }
    return { ...node, children: nextChildren.length ? nextChildren : undefined };
  };

  return nodes.map(walk).filter(Boolean) as TreeNode[];
};

const sectionTitle = (title: string) => <div className={styles.formSectionTitle}>{title}</div>;

const UserFormDrawer: React.FC<UserFormDrawerProps> = ({
  open,
  mode,
  record,
  users,
  canAssignSystemAdmin,
  focusSection,
  onClose,
  onSubmit,
}) => {
  const [form] = Form.useForm<UserFormValues>();
  const [replaceDataOfficerUserId, setReplaceDataOfficerUserId] = useState<string>();
  const permissionRef = useRef<HTMLDivElement>(null);

  const allOrgTreeData = useMemo(() => mapTreeData(orgTree), []);
  const selectedOrgId = Form.useWatch("orgId", form);
  const selectedRoles = (Form.useWatch("roles", form) ?? []) as RoleCode[];
  const isDataOfficer = Boolean(Form.useWatch("isDataOfficer", form));

  const extraAuthTreeData = useMemo(() => filterExtraTree(allOrgTreeData, selectedOrgId), [allOrgTreeData, selectedOrgId]);
  const mergedPermissions = useMemo(() => buildMergedPermissions(selectedRoles), [selectedRoles]);

  useEffect(() => {
    if (!open) {
      return;
    }
    setReplaceDataOfficerUserId(undefined);
    form.setFieldsValue({
      name: record?.name,
      account: record?.account,
      phone: record?.phone?.includes("****") ? "" : record?.phone,
      email: record?.email,
      orgId: record?.orgId,
      position: record?.position,
      isDataOfficer: record?.isDataOfficer ?? false,
      roles: record?.roles ?? ["user"],
      extraDataAuth: record?.extraDataAuth ?? [],
      password: undefined,
    });
  }, [open, form, record]);

  useEffect(() => {
    if (!open || focusSection !== "permission") {
      return;
    }
    requestAnimationFrame(() => {
      permissionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [open, focusSection]);

  const permissionTreeData: DataNode[] = useMemo(() => {
    const grantedSet = new Set(mergedPermissions.filter((item) => item.granted).map((item) => item.key));
    return permissionTree.map((module) => ({
      key: module.key,
      title: module.title,
      children: module.children.map((perm) => {
        const granted = grantedSet.has(perm.key);
        return {
          key: perm.key,
          title: (
            <Space size={8}>
              {granted ? (
                <CheckCircleFilled style={{ color: "#52c41a" }} />
              ) : (
                <CloseCircleFilled style={{ color: "#d9d9d9" }} />
              )}
              <span style={{ color: granted ? "rgba(0,0,0,0.88)" : "#bfbfbf" }}>{perm.title}</span>
            </Space>
          ),
        };
      }),
    }));
  }, [mergedPermissions]);

  const ensureDataOfficerRole = (nextChecked: boolean) => {
    const roles = (form.getFieldValue("roles") ?? []) as RoleCode[];
    if (nextChecked) {
      if (!roles.includes("data_officer")) {
        form.setFieldValue("roles", [...roles, "data_officer"]);
      }
    } else {
      form.setFieldValue(
        "roles",
        roles.filter((role) => role !== "data_officer"),
      );
      setReplaceDataOfficerUserId(undefined);
    }
  };

  const handleDataOfficerSwitch = (checked: boolean) => {
    if (!checked) {
      form.setFieldValue("isDataOfficer", false);
      ensureDataOfficerRole(false);
      return;
    }

    const orgId = form.getFieldValue("orgId") as string | undefined;
    if (!orgId) {
      message.warning("请先选择所属组织");
      return;
    }

    const conflictUser = users.find(
      (item) =>
        item.orgId === orgId &&
        item.id !== record?.id &&
        (item.isDataOfficer || item.roles.includes("data_officer")),
    );

    if (!conflictUser) {
      form.setFieldValue("isDataOfficer", true);
      ensureDataOfficerRole(true);
      return;
    }

    Modal.confirm({
      title: "确认替换数据专员",
      content: `当前单位已有数据专员"${conflictUser.name}"，是否替换？替换后原数据专员将被移除该角色。`,
      okText: "确认替换",
      cancelText: "取消",
      onOk: () => {
        setReplaceDataOfficerUserId(conflictUser.id);
        form.setFieldValue("isDataOfficer", true);
        ensureDataOfficerRole(true);
      },
      onCancel: () => {
        form.setFieldValue("isDataOfficer", false);
      },
    });
  };

  const toggleRole = (roleCode: RoleCode, disabled: boolean) => {
    if (disabled) {
      return;
    }
    const roles = (form.getFieldValue("roles") ?? []) as RoleCode[];
    const exists = roles.includes(roleCode);

    if (exists) {
      if (roleCode === "data_officer" && isDataOfficer) {
        return;
      }
      form.setFieldValue(
        "roles",
        roles.filter((role) => role !== roleCode),
      );
      return;
    }

    form.setFieldValue("roles", [...roles, roleCode]);
  };

  const handleCancel = () => {
    if (form.isFieldsTouched()) {
      Modal.confirm({
        title: "确认关闭",
        content: "存在未保存的修改，确认关闭吗？",
        okText: "确认关闭",
        cancelText: "继续编辑",
        onOk: onClose,
      });
      return;
    }
    onClose();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit({
        ...values,
        replaceDataOfficerUserId,
      });
    } catch (error: any) {
      const firstField = error?.errorFields?.[0]?.name;
      if (firstField) {
        form.scrollToField(firstField, { block: "center" });
      }
    }
  };

  return (
    <Drawer
      open={open}
      width={560}
      title={mode === "create" ? "新增用户" : `编辑用户 - ${record?.name ?? ""}`}
      placement="right"
      destroyOnClose
      onClose={handleCancel}
      footer={
        <div className={styles.drawerFooter}>
          <Space>
            <Button onClick={handleCancel}>取消</Button>
            <Button type="primary" onClick={handleSubmit}>
              确认
            </Button>
          </Space>
        </div>
      }
      styles={{ body: { padding: 24 } }}
    >
      <Form form={form} layout="vertical">
        {sectionTitle("基本信息")}
        <Form.Item name="name" label="姓名" rules={[{ required: true, message: "请输入用户姓名" }]}> 
          <Input placeholder="请输入用户姓名" maxLength={20} />
        </Form.Item>

        <Form.Item
          name="account"
          label="账号"
          rules={[
            { required: true, message: "请输入登录账号" },
            { pattern: /^[A-Za-z0-9_]+$/, message: "仅允许英文字母、数字和下划线" },
          ]}
        >
          <Input placeholder="请输入登录账号" maxLength={30} disabled={mode === "edit"} />
        </Form.Item>

        <Form.Item
          name="phone"
          label="手机号"
          rules={[
            { required: true, message: "请输入手机号" },
            { pattern: /^1\d{10}$/, message: "请输入11位手机号" },
          ]}
        >
          <Input placeholder="请输入手机号" maxLength={11} />
        </Form.Item>

        {mode === "create" ? (
          <>
            <Form.Item
              name="password"
              label="初始密码"
              rules={[
                { required: true, message: "请输入初始密码" },
                { min: 6, message: "初始密码至少6位" },
              ]}
            >
              <Input.Password placeholder="请输入初始密码" />
            </Form.Item>
            <Text type="secondary" style={{ display: "block", marginTop: -12, marginBottom: 8 }}>
              用户首次登录后需修改密码
            </Text>
          </>
        ) : null}

        <Form.Item name="email" label="邮箱" rules={[{ type: "email", message: "请输入合法邮箱" }]}> 
          <Input placeholder="请输入邮箱" />
        </Form.Item>

        {sectionTitle("组织与岗位")}
        <Form.Item name="orgId" label="所属组织" rules={[{ required: true, message: "请选择所属组织" }]}> 
          <TreeSelect
            treeData={allOrgTreeData}
            treeDefaultExpandAll
            showSearch
            placeholder="请选择所属组织"
            treeNodeFilterProp="title"
          />
        </Form.Item>
        <Text type="secondary" style={{ display: "block", marginTop: -12, marginBottom: 8 }}>
          所属组织决定了用户的基础数据可见范围
        </Text>

        <Form.Item name="position" label="职务/岗位">
          <Input placeholder="请输入职务或岗位名称，如副局长、信息化专员" maxLength={30} />
        </Form.Item>

        <Form.Item name="isDataOfficer" label="是否为本单位数据专员" valuePropName="checked">
          <Space>
            <Switch onChange={handleDataOfficerSwitch} />
            <Text>开启后自动分配数据专员角色</Text>
          </Space>
        </Form.Item>
        <Text type="secondary" style={{ display: "block", marginTop: -12, marginBottom: 8 }}>
          开启后该用户将负责本单位的数据上报和采集任务填报工作
        </Text>

        <div ref={permissionRef}>{sectionTitle("权限配置")}</div>

        <Form.Item
          name="roles"
          label="角色分配"
          rules={[
            { required: true, message: "请至少选择一个角色" },
            {
              validator: (_, value: RoleCode[]) =>
                value && value.length > 0 ? Promise.resolve() : Promise.reject(new Error("请至少选择一个角色")),
            },
          ]}
        >
          <div className={styles.roleCardGroup}>
            {roleOptions.map((role) => {
              const checked = selectedRoles.includes(role.code);
              const sysAdminDisabled = role.code === "system_admin" && !canAssignSystemAdmin;
              const dataOfficerLocked = role.code === "data_officer" && isDataOfficer;
              const disabled = sysAdminDisabled;

              const content = (
                <div
                  className={`${styles.roleCard} ${checked ? styles.roleCardChecked : ""} ${disabled ? styles.roleCardDisabled : ""}`}
                  onClick={() => toggleRole(role.code, disabled)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      toggleRole(role.code, disabled);
                    }
                  }}
                >
                  <Space style={{ width: "100%", justifyContent: "space-between" }}>
                    <Space>
                      <span className={styles.roleColorDot} style={{ background: role.color }} />
                      <span style={{ fontSize: 13 }}>{role.name}</span>
                    </Space>
                    <Checkbox checked={checked} disabled={disabled || dataOfficerLocked} />
                  </Space>
                </div>
              );

              if (sysAdminDisabled) {
                return (
                  <Tooltip key={role.id} title="仅系统管理员可分配此角色">
                    {content}
                  </Tooltip>
                );
              }

              return <React.Fragment key={role.id}>{content}</React.Fragment>;
            })}
          </div>
        </Form.Item>

        <Collapse
          items={[
            {
              key: "preview",
              label: "已选角色权限预览（点击展开）",
              children: (
                <>
                  <Tree treeData={permissionTreeData} defaultExpandAll selectable={false} />
                  <Text type="secondary">以上权限由所选角色自动确定，如需调整请前往角色管理页面修改</Text>
                </>
              ),
            },
          ]}
        />

        <Form.Item name="extraDataAuth" label="额外数据授权（可选）" style={{ marginTop: 16 }}>
          <TreeSelect
            treeData={extraAuthTreeData}
            multiple
            treeCheckable
            showSearch
            maxTagCount={3}
            treeDefaultExpandAll
            placeholder="如需访问其他单位数据，请在此选择"
            treeNodeFilterProp="title"
          />
        </Form.Item>
        <Text type="secondary">
          授权后该用户可查看所选单位的知识库和上报数据（仅查看权限，不可编辑）
        </Text>
      </Form>
    </Drawer>
  );
};

export default UserFormDrawer;
