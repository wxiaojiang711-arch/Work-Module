import {
  CalendarOutlined,
  CheckSquareOutlined,
  DownSquareOutlined,
  FileTextOutlined,
  NumberOutlined,
  PicCenterOutlined,
  RadarChartOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import React from "react";

export type FieldType =
  | "input"
  | "textarea"
  | "number"
  | "radio"
  | "checkbox"
  | "select"
  | "datePicker"
  | "upload"
  | "location";

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  props: {
    placeholder?: string;
    options?: Array<{ label: string; value: string }>;
    min?: number;
    max?: number;
    format?: string;
  };
  validation: {
    required: boolean;
  };
}

export interface FormConfig {
  formSchema: FormField[];
  updateFrequency: null | "daily" | "weekly" | "monthly" | "irregular";
  editPermissions: string[];
  viewPermissions: string[];
}

export const frequencyOptions = [
  { label: "每天更新", value: "daily" },
  { label: "每周更新", value: "weekly" },
  { label: "每月更新", value: "monthly" },
  { label: "不定期更新", value: "irregular" },
];

export const permissionTreeData = [
  {
    title: "委办部门",
    value: "gov_departments",
    key: "gov_departments",
    selectable: false,
    children: [
      { title: "区大数据局", value: "dept_bigdata", key: "dept_bigdata" },
      { title: "区发改委", value: "dept_fagai", key: "dept_fagai" },
      { title: "区文旅委", value: "dept_wenlv", key: "dept_wenlv" },
      { title: "区住建委", value: "dept_zhujian", key: "dept_zhujian" },
      { title: "区交通局", value: "dept_jiaotong", key: "dept_jiaotong" },
      { title: "区教育局", value: "dept_jiaoyu", key: "dept_jiaoyu" },
      { title: "区卫健委", value: "dept_weijian", key: "dept_weijian" },
      {
        title: "区市场监管局",
        value: "dept_shichangjianguan",
        key: "dept_shichangjianguan",
      },
      { title: "区生态环境局", value: "dept_shengtai", key: "dept_shengtai" },
      { title: "区人社局", value: "dept_renshe", key: "dept_renshe" },
    ],
  },
  {
    title: "镇街",
    value: "towns",
    key: "towns",
    selectable: false,
    children: [{ title: "（由接口动态加载）", value: "placeholder_towns", key: "placeholder_towns", disabled: true }],
  },
  {
    title: "国企",
    value: "state_owned_enterprises",
    key: "state_owned_enterprises",
    selectable: false,
    children: [{ title: "（由接口动态加载）", value: "placeholder_soe", key: "placeholder_soe", disabled: true }],
  },
];

const defaultOptions = [
  { label: "选项1", value: "option_1" },
  { label: "选项2", value: "option_2" },
];

export const componentGroups: Array<{
  key: string;
  label: string;
  children: Array<{ type: FieldType; label: string; icon: React.ReactNode }>;
}> = [
  {
    key: "basic",
    label: "基础控件",
    children: [
      { type: "input", label: "单行文本", icon: React.createElement(FileTextOutlined) },
      { type: "textarea", label: "多行文本", icon: React.createElement(PicCenterOutlined) },
      { type: "number", label: "数字输入", icon: React.createElement(NumberOutlined) },
    ],
  },
  {
    key: "select",
    label: "选择控件",
    children: [
      { type: "radio", label: "单项选择", icon: React.createElement(CheckSquareOutlined) },
      { type: "checkbox", label: "多项选择", icon: React.createElement(CheckSquareOutlined) },
      { type: "select", label: "下拉选择", icon: React.createElement(DownSquareOutlined) },
    ],
  },
  {
    key: "advanced",
    label: "高级控件",
    children: [
      { type: "datePicker", label: "日期选择", icon: React.createElement(CalendarOutlined) },
      { type: "upload", label: "文件上传", icon: React.createElement(UploadOutlined) },
      { type: "location", label: "地理位置", icon: React.createElement(RadarChartOutlined) },
    ],
  },
];

const typeLabelMap: Record<FieldType, string> = {
  input: "单行文本",
  textarea: "多行文本",
  number: "数字输入",
  radio: "单项选择",
  checkbox: "多项选择",
  select: "下拉选择",
  datePicker: "日期选择",
  upload: "文件上传",
  location: "地理位置",
};

export const createFieldByType = (type: FieldType): FormField => {
  const uid = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`;

  return {
    id: `field_${uid}`,
    type,
    label: typeLabelMap[type],
    props: {
      placeholder: `请输入${typeLabelMap[type]}`,
      options: type === "radio" || type === "checkbox" || type === "select" ? [...defaultOptions] : undefined,
      min: type === "number" ? undefined : undefined,
      max: type === "number" ? undefined : undefined,
      format: type === "datePicker" ? "YYYY-MM-DD" : undefined,
    },
    validation: {
      required: false,
    },
  };
};
