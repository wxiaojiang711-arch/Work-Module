import React, { useMemo } from 'react';
import { TabBar } from 'antd-mobile';
import { FileOutline, MessageFill, MessageOutline, UserOutline, UserSetOutline } from 'antd-mobile-icons';
import { useLocation, useNavigate } from 'react-router-dom';

const BottomTabBar: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const activeKey = useMemo(() => {
    if (pathname.startsWith('/m/report')) return '/m/report';
    if (pathname.startsWith('/m/profile')) return '/m/profile';
    return '/m/home';
  }, [pathname]);

  return (
    <div
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        height: 50,
        background: '#fff',
        borderTop: '1px solid #f0f0f0',
        zIndex: 100,
      }}
    >
      <TabBar activeKey={activeKey} onChange={(key) => navigate(key)}>
        <TabBar.Item
          key="/m/home"
          title="AI问数"
          icon={(active) => (active ? <MessageFill /> : <MessageOutline />)}
        />
        <TabBar.Item
          key="/m/report"
          title="智能报告"
          icon={<FileOutline />}
        />
        <TabBar.Item
          key="/m/profile"
          title="个人中心"
          icon={(active) => (active ? <UserSetOutline /> : <UserOutline />)}
        />
      </TabBar>
      <style>{`
        .adm-tab-bar-item-active,
        .adm-tab-bar-item-active .adm-tab-bar-item-title,
        .adm-tab-bar-item-active .adm-tab-bar-item-icon {
          color: #1890ff !important;
        }
        .adm-tab-bar-item,
        .adm-tab-bar-item .adm-tab-bar-item-title,
        .adm-tab-bar-item .adm-tab-bar-item-icon {
          color: #999;
        }
      `}</style>
    </div>
  );
};

export default BottomTabBar;

