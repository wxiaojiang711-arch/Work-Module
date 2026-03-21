import React, { useMemo, useState } from "react";
import { Breadcrumb, Button, Card, Space, Steps, Typography, message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Link, useNavigate, useParams } from "react-router-dom";

import FormDesignStep from "./FormDesignStep";
import PermissionStep from "./PermissionStep";
import type { FormConfig } from "./constants";
import { categories } from "../FileTemplateManagement/templateConstants";

const initialFormConfig: FormConfig = {
  formSchema: [],
  updateFrequency: null,
  editPermissions: [],
  viewPermissions: [],
};

const FormBuilder: React.FC = () => {
  const navigate = useNavigate();
  const { categoryId, formId } = useParams<{ categoryId?: string; formId?: string }>();
  const [currentStep, setCurrentStep] = useState(0);
  const [formConfig, setFormConfig] = useState<FormConfig>(initialFormConfig);

  const stepItems = useMemo(
    () => [
      { title: "表单设计", description: "拖拽控件配置表单内容" },
      { title: "权限与发布", description: "配置权限及更新频率" },
    ],
    [],
  );

  const handleNext = () => {
    if (formConfig.formSchema.length === 0) {
      message.warning("请至少添加一个表单控件");
      return;
    }
    setCurrentStep(1);
  };

  const handlePublish = () => {
    if (!formConfig.updateFrequency) {
      message.warning("请选择更新频率");
      return;
    }

    if (formConfig.editPermissions.length === 0) {
      message.warning("请选择编辑权限");
      return;
    }

    if (formConfig.viewPermissions.length === 0) {
      message.warning("请选择查看权限");
      return;
    }

    message.success("表单发布成功");
    // 模拟发布输出
    // eslint-disable-next-line no-console
    console.log("发布配置", formConfig);
  };

  const resolvedCategoryId = (categoryId ?? "department") as string;
  const currentCategory =
    categories.find((item) => item.id === resolvedCategoryId) ?? categories.find((item) => item.id === "department");
  const listPath = `/template/${currentCategory?.id ?? "department"}`;
  const isEditMode = Boolean(formId);
  const pageTitle = isEditMode ? "编辑表单" : "创建表单";

  return (
    <div style={{ padding: 16, height: "100%", overflow: "auto", background: "#f3f6fb" }}>
      <Card style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div>
            <Breadcrumb
              items={[
                { title: <Link to="/template">文件模板管理</Link> },
                { title: <Link to={listPath}>{currentCategory?.title ?? "部门工作模块"}</Link> },
                { title: pageTitle },
              ]}
            />
            <Typography.Title level={5} style={{ margin: "10px 0 0" }}>
              {pageTitle}
            </Typography.Title>
          </div>

          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(listPath)}>
            返回表单列表
          </Button>
        </div>
      </Card>

      <Card>
        <Steps current={currentStep} items={stepItems} />
      </Card>

      <div style={{ marginTop: 16, marginBottom: 88 }}>
        {currentStep === 0 ? (
          <FormDesignStep
            formSchema={formConfig.formSchema}
            setFormSchema={(updater) =>
              setFormConfig((prev) => ({
                ...prev,
                formSchema: typeof updater === "function" ? updater(prev.formSchema) : updater,
              }))
            }
          />
        ) : (
          <PermissionStep
            formConfig={formConfig}
            onChange={(patch) => setFormConfig((prev) => ({ ...prev, ...patch }))}
          />
        )}
      </div>

      <div
        style={{
          position: "fixed",
          left: 240,
          right: 0,
          bottom: 0,
          borderTop: "1px solid #e6ebf5",
          background: "#fff",
          padding: "12px 20px",
          display: "flex",
          justifyContent: "flex-end",
          zIndex: 12,
        }}
      >
        {currentStep === 0 ? (
          <Button type="primary" onClick={handleNext}>
            下一步
          </Button>
        ) : (
          <Space>
            <Button onClick={() => setCurrentStep(0)}>上一步</Button>
            <Button type="primary" onClick={handlePublish}>
              发布表单
            </Button>
          </Space>
        )}
      </div>
    </div>
  );
};

export default FormBuilder;
