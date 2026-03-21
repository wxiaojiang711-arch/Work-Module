import React from "react";
import { Tooltip } from "antd";
import { LinkOutlined } from "@ant-design/icons";

type SourceTagProps = {
  source: string;
};

const SourceTag: React.FC<SourceTagProps> = ({ source }) => (
  <Tooltip title={`来源：${source}`}>
    <LinkOutlined style={{ fontSize: 12, color: "#1890ff", marginLeft: 4, cursor: "pointer" }} />
  </Tooltip>
);

export default SourceTag;
