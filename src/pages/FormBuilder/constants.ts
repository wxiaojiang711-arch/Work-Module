import {
  CalendarOutlined,
  CheckSquareOutlined,
  DownSquareOutlined,
  FileTextOutlined,
  NumberOutlined,
  PicCenterOutlined,
  RadarChartOutlined,
  UploadOutlined,
  TagsOutlined,
  PictureOutlined,
  BgColorsOutlined,
  GroupOutlined,
  TeamOutlined,
  TableOutlined,
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
  | "location"
  | "textLabel"
  | "image"
  | "richText"
  | "group"
  | "orgTree"
  | "coreBusiness"
  | "taskBreakdownTable"
  | "indicatorTable";

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  children?: FormField[];
  props: {
    placeholder?: string;
    options?: Array<{ label: string; value: string }>;
    min?: number;
    max?: number;
    format?: string;
    // 文本标签
    text?: string;
    textAlign?: "left" | "center" | "right";
    textColor?: string;
    fontSize?: "small" | "medium" | "large";
    // 图片
    uploadLimit?: number;
    imageWidth?: string;
    imageHeight?: string;
    showPreview?: boolean;
    // 富文本
    editorHeight?: number;
    toolbarFeatures?: string[];
    showWordCount?: boolean;
    maxWords?: number;
    // 分组
    groupTitle?: string;
    borderStyle?: "solid" | "dashed" | "none";
    borderColor?: string;
    backgroundColor?: string;
    padding?: number;
    // 业务树 / 核心业务
    treeLevel?: 2 | 3;
    allowAddLevel1?: boolean;
    allowAddLevel2?: boolean;
    defaultExpandLevel?: "all" | "first" | "none";
    // 指标数据
    tableRows?: number;
    tableCols?: number;
    typeHeaders?: string[];
    rowHeaders?: string[];
    colHeaders?: string[];
    allowAddRow?: boolean;
    showIndicatorType?: boolean;
    // 更新频率
    updateFrequency?: "daily" | "weekly" | "monthly" | "quarterly" | "irregular";
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
      { type: "textLabel", label: "文本标签", icon: React.createElement(TagsOutlined) },
      { type: "image", label: "图片", icon: React.createElement(PictureOutlined) },
      { type: "richText", label: "富文本编辑器", icon: React.createElement(BgColorsOutlined) },
    ],
  },
  {
    key: "select",
    label: "选择控件",
    children: [
      { type: "radio", label: "单项选择", icon: React.createElement(CheckSquareOutlined) },
      { type: "checkbox", label: "多项选择", icon: React.createElement(CheckSquareOutlined) },
      { type: "select", label: "下拉选择", icon: React.createElement(DownSquareOutlined) },
      { type: "datePicker", label: "日期选择", icon: React.createElement(CalendarOutlined) },
    ],
  },
  {
    key: "advanced",
    label: "高级控件",
    children: [
      { type: "upload", label: "文件上传", icon: React.createElement(UploadOutlined) },
      { type: "location", label: "地理位置", icon: React.createElement(RadarChartOutlined) },
      { type: "group", label: "分组控件", icon: React.createElement(GroupOutlined) },
      { type: "orgTree", label: "业务树", icon: React.createElement(TeamOutlined) },
      { type: "coreBusiness", label: "核心业务", icon: React.createElement(RadarChartOutlined) },
      { type: "taskBreakdownTable", label: "任务分解表", icon: React.createElement(TableOutlined) },
      { type: "indicatorTable", label: "指标数据表", icon: React.createElement(TableOutlined) },
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
  textLabel: "文本标签",
  image: "图片",
  richText: "富文本",
  group: "分组",
  orgTree: "业务树",
  coreBusiness: "核心业务",
  taskBreakdownTable: "任务分解表",
  indicatorTable: "指标数据表",
};

export const createFieldByType = (type: FieldType): FormField => {
  const uid = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`;

  const baseField: FormField = {
    id: `field_${uid}`,
    type,
    label: typeLabelMap[type],
    children: [],
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

  // 为新组件设置默认属性
  if (type === "textLabel") {
    baseField.props.text = "文本标签";
    baseField.props.textAlign = "left";
    baseField.props.textColor = "#000000";
    baseField.props.fontSize = "medium";
  } else if (type === "image") {
    baseField.props.uploadLimit = 1;
    baseField.props.showPreview = true;
  } else if (type === "richText") {
    baseField.props.editorHeight = 300;
    baseField.props.toolbarFeatures = ["bold", "italic", "underline"];
    baseField.props.showWordCount = true;
  } else if (type === "group") {
    baseField.props.borderStyle = "solid";
    baseField.props.borderColor = "#d9d9d9";
    baseField.props.backgroundColor = "#ffffff";
    baseField.props.padding = 16;
  } else if (type === "orgTree") {
    baseField.props.treeLevel = 2;
    baseField.props.allowAddLevel1 = true;
    baseField.props.allowAddLevel2 = true;
    baseField.props.defaultExpandLevel = "all";
  } else if (type === "coreBusiness") {
    baseField.props.treeLevel = 2;
    baseField.props.allowAddLevel1 = true;
    baseField.props.allowAddLevel2 = true;
    baseField.props.defaultExpandLevel = "all";
  } else if (type === "indicatorTable") {
    baseField.props.tableRows = 2;
    baseField.props.tableCols = 3;
    baseField.props.typeHeaders = ["类型A", "类型B"];
    baseField.props.rowHeaders = ["指标1", "指标2"];
    baseField.props.colHeaders = ["列1", "列2", "列3"];
    baseField.props.allowAddRow = false;
    baseField.props.showIndicatorType = true;
  } else if (type === "taskBreakdownTable") {
    baseField.props.tableRows = 2;
    baseField.props.tableCols = 4;
    baseField.props.rowHeaders = ["任务1", "任务2"];
    baseField.props.colHeaders = ["第一季度", "第二季度", "第三季度", "第四季度", "责任人"];
    baseField.props.allowAddRow = false;
  }

  return baseField;
};
