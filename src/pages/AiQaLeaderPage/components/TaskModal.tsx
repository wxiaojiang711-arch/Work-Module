import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  Checkbox,
  DatePicker,
  Descriptions,
  Form,
  Input,
  Modal,
  Select,
  Switch,
  TreeSelect,
  Typography,
  Radio,
} from "antd";

import { mockOrgTree, mockTopics } from "../mock";
import type { BatchTaskMode, ReportTaskPayload } from "../types";

interface TaskModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (payload: ReportTaskPayload) => Promise<void>;
  initialValues?: Partial<ReportTaskPayload>;
  mode: BatchTaskMode;
}

const TaskModal: React.FC<TaskModalProps> = ({ visible, onClose, onSubmit, initialValues, mode }) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  const template = Form.useWatch("template", form) as ReportTaskPayload["template"] | undefined;
  const isCaliberChange = Form.useWatch(["templateFields", "isCaliberChange"], form);
  const batchStrategy = Form.useWatch("batchStrategy", form);

  useEffect(() => {
    if (!visible) return;
    form.setFieldsValue({
      taskName: initialValues?.taskName ?? "【数据质量核查】待确认对象-指标异常（近30天）",
      targetOrg: initialValues?.targetOrg,
      assistOrgs: initialValues?.assistOrgs,
      deadline: dayjs().add(7, "day"),
      urgency: initialValues?.urgency ?? "normal",
      relatedTopics: initialValues?.relatedTopics ?? ["topic-population"],
      template: initialValues?.template ?? "quality",
      templateFields: initialValues?.templateFields ?? {},
      batchStrategy: "single",
    });
  }, [form, initialValues, visible]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setConfirmLoading(true);
      await onSubmit({
        taskName: values.taskName,
        targetOrg: values.targetOrg,
        assistOrgs: values.assistOrgs,
        deadline: values.deadline.format("YYYY-MM-DD"),
        urgency: values.urgency,
        relatedTopics: values.relatedTopics,
        template: values.template,
        templateFields: { ...values.templateFields, batchStrategy: mode === "batch" ? batchStrategy : undefined },
        attachedSummary: initialValues?.attachedSummary ?? "",
        attachedEvidenceIds: initialValues?.attachedEvidenceIds ?? [],
        linkedRiskId: initialValues?.linkedRiskId,
      });
      form.resetFields();
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <Modal
      width={800}
      title="生成数据上报任务"
      open={visible}
      onCancel={onClose}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        {mode === "batch" && (
          <Form.Item name="batchStrategy" label="批量生成方式">
            <Radio.Group
              options={[
                { label: "单任务（合并所有风险）", value: "single" },
                { label: "多任务（每条风险一个任务）", value: "multi" },
              ]}
            />
          </Form.Item>
        )}

        <Form.Item name="taskName" label="任务名称" rules={[{ required: true, message: "请输入任务名称" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="targetOrg" label="上报对象" rules={[{ required: true, message: "请选择上报对象" }]}>
          <TreeSelect treeData={mockOrgTree} placeholder="请选择上报对象" treeDefaultExpandAll />
        </Form.Item>
        <Form.Item name="assistOrgs" label="协办单位">
          <TreeSelect treeData={mockOrgTree} placeholder="请选择协办单位（可选）" treeCheckable />
        </Form.Item>
        <Form.Item name="deadline" label="截止时间" rules={[{ required: true, message: "请选择截止时间" }]}>
          <DatePicker disabledDate={(current) => !!current && current < dayjs().startOf("day")} />
        </Form.Item>
        <Form.Item name="urgency" label="紧急程度" rules={[{ required: true, message: "请选择紧急程度" }]}>
          <Select
            options={[
              { label: "一般", value: "normal" },
              { label: "较急", value: "urgent" },
              { label: "紧急", value: "critical" },
            ]}
          />
        </Form.Item>
        <Form.Item name="relatedTopics" label="关联主题/指标" rules={[{ required: true, message: "请选择主题或指标" }]}>
          <Select mode="multiple" options={mockTopics} />
        </Form.Item>
        <Form.Item name="template" label="上报模板" rules={[{ required: true, message: "请选择上报模板" }]}>
          <Select
            options={[
              { label: "质量异常核查", value: "quality" },
              { label: "口径冲突澄清", value: "conflict" },
              { label: "数据延迟/缺失说明", value: "delay" },
              { label: "共享堵点反馈", value: "sharing" },
            ]}
          />
        </Form.Item>

        {template === "quality" && (
          <>
            <Form.Item name={["templateFields", "reasonType"]} label="异常原因初判">
              <Select
                options={[
                  { label: "采集错误", value: "collect" },
                  { label: "汇聚异常", value: "merge" },
                  { label: "规则误判", value: "rule" },
                  { label: "口径变更", value: "caliber" },
                  { label: "其他", value: "other" },
                ]}
              />
            </Form.Item>
            <Form.Item name={["templateFields", "reasonDesc"]} label="补充说明">
              <Input.TextArea rows={2} />
            </Form.Item>
            <Form.Item name={["templateFields", "isCaliberChange"]} label="是否口径变更" valuePropName="checked">
              <Switch />
            </Form.Item>
            {isCaliberChange && (
              <>
                <Form.Item name={["templateFields", "caliberDate"]} label="变更时间">
                  <DatePicker />
                </Form.Item>
                <Form.Item name={["templateFields", "caliberDesc"]} label="变更说明">
                  <Input.TextArea rows={2} />
                </Form.Item>
              </>
            )}
            <Form.Item name={["templateFields", "rectify"]} label="整改措施">
              <Checkbox.Group
                options={[
                  "补采",
                  "去重",
                  "修规则",
                  "补字典",
                  "补文档",
                  "其他",
                ]}
              />
            </Form.Item>
            <Form.Item
              name={["templateFields", "planFinishDate"]}
              label="计划完成时间"
              rules={[{ required: true, message: "请选择计划完成时间" }]}
            >
              <DatePicker />
            </Form.Item>
          </>
        )}

        {template === "conflict" && (
          <>
            <Form.Item name={["templateFields", "conflictType"]} label="冲突类型">
              <Select
                options={[
                  { label: "定义不一致", value: "definition" },
                  { label: "统计口径不同", value: "stat" },
                  { label: "数据源差异", value: "source" },
                  { label: "其他", value: "other" },
                ]}
              />
            </Form.Item>
            <Form.Item name={["templateFields", "relatedOrgs"]} label="涉及部门">
              <TreeSelect treeData={mockOrgTree} treeCheckable />
            </Form.Item>
            <Form.Item
              name={["templateFields", "conflictDesc"]}
              label="冲突描述"
              rules={[{ required: true, message: "请输入冲突描述" }]}
            >
              <Input.TextArea rows={2} />
            </Form.Item>
            <Form.Item
              name={["templateFields", "proposal"]}
              label="建议统一方案"
              rules={[{ required: true, message: "请输入建议统一方案" }]}
            >
              <Input.TextArea rows={2} />
            </Form.Item>
          </>
        )}

        {template === "delay" && (
          <>
            <Form.Item name={["templateFields", "delayType"]} label="延迟/缺失原因">
              <Select
                options={[
                  { label: "系统故障", value: "system" },
                  { label: "人工操作延迟", value: "manual" },
                  { label: "数据源未更新", value: "source" },
                  { label: "其他", value: "other" },
                ]}
              />
            </Form.Item>
            <Form.Item name={["templateFields", "delayDesc"]} label="补充说明">
              <Input.TextArea rows={2} />
            </Form.Item>
            <Form.Item name={["templateFields", "impact"]} label="影响范围" rules={[{ required: true }]}>
              <Input.TextArea rows={2} />
            </Form.Item>
            <Form.Item name={["templateFields", "recoveryTime"]} label="恢复时间" rules={[{ required: true }]}>
              <DatePicker />
            </Form.Item>
            <Form.Item name={["templateFields", "fix"]} label="补救措施" rules={[{ required: true }]}>
              <Input.TextArea rows={2} />
            </Form.Item>
          </>
        )}

        {template === "sharing" && (
          <>
            <Form.Item name={["templateFields", "blockType"]} label="堵点类型">
              <Select
                options={[
                  { label: "权限申请流程长", value: "permission" },
                  { label: "接口不稳定", value: "interface" },
                  { label: "数据质量差", value: "quality" },
                  { label: "文档不清晰", value: "doc" },
                  { label: "其他", value: "other" },
                ]}
              />
            </Form.Item>
            <Form.Item name={["templateFields", "impactBiz"]} label="影响业务">
              <Select mode="multiple" options={mockTopics} />
            </Form.Item>
            <Form.Item name={["templateFields", "needDesc"]} label="需求说明" rules={[{ required: true }]}>
              <Input.TextArea rows={2} />
            </Form.Item>
            <Form.Item name={["templateFields", "expectTime"]} label="期望解决时间">
              <DatePicker />
            </Form.Item>
          </>
        )}

        <Typography.Title level={5}>自动附带</Typography.Title>
        <Descriptions bordered size="small" column={1}>
          <Descriptions.Item label="问答结论摘要">{initialValues?.attachedSummary ?? "-"}</Descriptions.Item>
          <Descriptions.Item label="引用证据ID">
            {(initialValues?.attachedEvidenceIds ?? []).join("、") || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="关键图表快照">已保存图表快照</Descriptions.Item>
        </Descriptions>
      </Form>
    </Modal>
  );
};

export default TaskModal;
