import React from "react";
import { Typography } from "antd";

const MobileHomePage: React.FC = () => {
  return (
    <div style={{ padding: 16 }}>
      <Typography.Title level={5} style={{ marginTop: 0 }}>移动端首页</Typography.Title>
      <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
        这里是移动端骨架首页，可继续接入你的业务模块。
      </Typography.Paragraph>
    </div>
  );
};

export default MobileHomePage;
