import React, { useMemo, useState } from "react";
import { Breadcrumb, Button, Card, Space, Steps, Typography, message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import FormDesignStep from "./FormDesignStep";
import PermissionStep from "./PermissionStep";
import type { FormConfig } from "./constants";
import { categories, templateFormsMock } from "../FileTemplateManagement/templateConstants";
import { workModulePresetFields } from "./workModulePreset";

const initialFormConfig: FormConfig = {
  formSchema: [],
  updateFrequency: null,
  editPermissions: [],
  viewPermissions: [],
};

const isWorkModuleTemplate = (formId?: string): boolean => {
  if (!formId) {
    return false;
  }
  if (formId === "form-work-module") {
    return true;
  }
  const matched = templateFormsMock.find((item) => item.id === formId);
  return matched?.name?.includes("部门工作模块") ?? false;
};

const getInitialFormConfig = (formId?: string, preset?: string): FormConfig => {
  if (preset === "work-module" || isWorkModuleTemplate(formId)) {
    return {
      ...initialFormConfig,
      formSchema: workModulePresetFields,
    };
  }
  return initialFormConfig;
};

const FormBuilder: React.FC = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const { categoryId, formId } = useParams<{ categoryId?: string; formId?: string }>();
  const preset = useMemo(() => new URLSearchParams(search).get("preset") ?? undefined, [search]);
  const [currentStep, setCurrentStep] = useState(0);
  const [formConfig, setFormConfig] = useState<FormConfig>(() => getInitialFormConfig(formId, preset));

  React.useEffect(() => {
    setFormConfig(getInitialFormConfig(formId, preset));
  }, [formId, preset]);

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
  const showUpdateFrequency = isEditMode || preset === "work-module";

  return (
    <div style={{ padding: 16, height: "100%", overflow: "auto", background: "#f3f6fb" }}>
      <Card style={{ marginBottom: 12 }}>
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
      </Card>

      <div style={{ marginTop: 16, marginBottom: 88 }}>
        <FormDesignStep
          showUpdateFrequency={showUpdateFrequency}
          formSchema={formConfig.formSchema}
          setFormSchema={(updater) =>
            setFormConfig((prev) => ({
              ...prev,
              formSchema: typeof updater === "function" ? updater(prev.formSchema) : updater,
            }))
          }
        />
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
        <Button type="primary" onClick={handlePublish}>
          发布表单
        </Button>
      </div>
    </div>
  );
};

export default FormBuilder;
