import React from "react";
import { Form, Input, Typography, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import type { TaskConfig } from "./taskConstants";

interface TaskBasicInfoStepProps {
  taskConfig: TaskConfig;
  onChange: (patch: Partial<TaskConfig>) => void;
}

const TaskBasicInfoStep: React.FC<TaskBasicInfoStepProps> = ({ taskConfig, onChange }) => {
  return (
    <Form layout="vertical" style={{ maxWidth: 700, margin: "0 auto", paddingBottom: 8 }}>
      <Form.Item label="任务名称" required>
        <Input
          value={taskConfig.name}
          placeholder="请输入采集任务名称"
          onChange={(event) => onChange({ name: event.target.value })}
        />
      </Form.Item>

      <Form.Item label="任务描述">
        <Input.TextArea
          value={taskConfig.description}
          placeholder="请输入任务描述或要求"
          maxLength={500}
          showCount
          rows={4}
          onChange={(event) => onChange({ description: event.target.value })}
        />
      </Form.Item>

      <Form.Item label="填报说明附件">
        <Upload.Dragger
          multiple
          fileList={taskConfig.attachments as any}
          beforeUpload={() => false}
          onChange={({ fileList }) => onChange({ attachments: fileList as any[] })}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
          <p className="ant-upload-hint">
            可上传填报指南、模板说明等附件，支持 PDF、Word、Excel 格式
          </p>
        </Upload.Dragger>
      </Form.Item>

      <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
        超过截止时间后，填报入口将自动关闭，相关人员仅可查看已提交的数据。
      </Typography.Paragraph>
    </Form>
  );
};

export default TaskBasicInfoStep;
