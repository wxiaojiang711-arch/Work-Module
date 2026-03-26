export interface CurrentUser {
  id: string;
  name: string;
  account: string;
  avatar: string | null;
  orgId: string;
  orgName: string;
  orgFullName: string;
  role: string;
  phone: string;
  email: string;
}

export type NotificationType = "urge" | "reject" | "system";

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  time: string;
  isRead: boolean;
}

export const currentUser: CurrentUser = {
  id: "user-001",
  name: "张三",
  account: "zhangsan",
  avatar: null,
  orgId: "dept-001",
  orgName: "区大数据局",
  orgFullName: "广州市XX区大数据发展管理局",
  role: "admin",
  phone: "138****1001",
  email: "zhangsan@gov.cn",
};

export const notificationListMock: NotificationItem[] = [
  {
    id: "noti-001",
    type: "urge",
    title: "【催办】区发改委催办您尽快完成《2024年第一季度经济运行数据采集》",
    time: "2024-03-20 09:00:00",
    isRead: false,
  },
  {
    id: "noti-002",
    type: "reject",
    title: "【退回】区财政局退回了您提交的《2024年度部门预算执行情况报告》",
    time: "2024-03-18 10:30:00",
    isRead: false,
  },
  {
    id: "noti-003",
    type: "urge",
    title: "【催办】区应急管理局催办您尽快完成《安全生产隐患排查月报》",
    time: "2024-03-21 15:00:00",
    isRead: false,
  },
  {
    id: "noti-004",
    type: "system",
    title: "【系统通知】您有一个新的采集任务《营商环境优化工作进展季报》待填报",
    time: "2024-03-15 11:00:00",
    isRead: true,
  },
  {
    id: "noti-005",
    type: "system",
    title: "【系统通知】平台将于本周六凌晨2:00-6:00进行系统维护升级",
    time: "2024-03-14 16:00:00",
    isRead: true,
  },
  {
    id: "noti-006",
    type: "system",
    title: "【系统通知】您的密码已超过90天未修改，建议尽快更新",
    time: "2024-03-10 08:00:00",
    isRead: false,
  },
];

