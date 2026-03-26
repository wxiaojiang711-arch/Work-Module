import React from 'react';
import { Card, List } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';

const MobileProfilePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', padding: 16, paddingBottom: 66 }}>
      <Card style={{ borderRadius: 10 }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: '#333' }}>张三</div>
        <div style={{ marginTop: 4, fontSize: 13, color: '#999' }}>区大数据局</div>
      </Card>

      <Card style={{ borderRadius: 10, marginTop: 12 }}>
        <List>
          <List.Item onClick={() => navigate('/m/data-report')}>数据上报任务</List.Item>
          <List.Item>账号设置</List.Item>
          <List.Item>消息通知</List.Item>
          <List.Item>关于系统</List.Item>
        </List>
      </Card>
    </div>
  );
};

export default MobileProfilePage;
