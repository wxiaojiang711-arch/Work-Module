import React, { useMemo, useState } from "react";
import {
  Badge,
  Dropdown,
  Layout,
  Modal,
  Popover,
  Space,
  Typography,
  message,
} from "antd";
import {
  BellOutlined,
  DatabaseOutlined,
  LockOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

import ChangePasswordModal from "./ChangePasswordModal";
import "./GlobalHeader.css";
import { currentUser, notificationListMock } from "./headerMockData";
import NotificationPopover from "./NotificationPopover";

const GlobalHeader: React.FC = () => {
  const navigate = useNavigate();
  const [notificationList, setNotificationList] = useState(notificationListMock);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  const unreadCount = useMemo(() => notificationList.filter((item) => !item.isRead).length, [notificationList]);
  const todayText = useMemo(() => {
    const now = dayjs();
    const week = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"][now.day()];
    return `${now.format("YYYY年MM月DD日")}，${week}`;
  }, []);

  const menuItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "个人信息",
      onClick: () => message.info("个人信息页面可继续接入"),
    },
    {
      key: "change-password",
      icon: <LockOutlined />,
      label: "修改密码",
      onClick: () => setChangePasswordOpen(true),
    },
    { type: "divider" },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: <span className="logout-menu-item">退出登录</span>,
      onClick: () => {
        Modal.confirm({
          title: "确认退出登录？",
          okText: "退出",
          cancelText: "取消",
          okButtonProps: { danger: true },
          onOk: () => {
            message.success("已退出登录");
            navigate("/login");
          },
        });
      },
    },
  ];

  return (
    <>
      <Layout.Header className="global-header">
        <div className="global-header-left">
          <Space align="center">
            <DatabaseOutlined style={{ fontSize: 24, color: "#1890ff" }} />
            <Typography.Title level={5} style={{ marginBottom: 0, marginLeft: 8, color: "#333", whiteSpace: "nowrap" }}>
              工作模块数字化平台
            </Typography.Title>
          </Space>
        </div>

        <div className="global-header-right">
          <Typography.Text className="header-date-text">{todayText}</Typography.Text>
          <span className="header-divider" />

          <Dropdown menu={{ items: menuItems }} placement="bottomRight" trigger={["click"]}>
            <div className="user-trigger">
              <div className="user-info">
                <Typography.Text style={{ fontSize: 14, color: "#333" }}>你好，{currentUser.name}！</Typography.Text>
                <Typography.Text style={{ fontSize: 12, color: "#999" }}>{currentUser.orgName}</Typography.Text>
              </div>
            </div>
          </Dropdown>

          <div className="notice-wrap">
            <Popover
              placement="bottomRight"
              trigger="click"
              content={
                <NotificationPopover
                  list={notificationList}
                  onMarkAllRead={() => {
                    setNotificationList((prev) => prev.map((item) => ({ ...item, isRead: true })));
                    message.success("已全部标记为已读");
                  }}
                  onViewAll={() => message.info("通知列表页路由预留")}
                />
              }
            >
              <Badge count={unreadCount} size="small">
                <BellOutlined className="notify-trigger" />
              </Badge>
            </Popover>
          </div>
        </div>
      </Layout.Header>

      <ChangePasswordModal
        open={changePasswordOpen}
        onCancel={() => setChangePasswordOpen(false)}
        onSubmit={() => {
          setChangePasswordOpen(false);
          message.success("密码修改成功");
        }}
      />
    </>
  );
};

export default GlobalHeader;
