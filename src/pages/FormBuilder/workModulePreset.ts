import type { FormField } from "./constants";

export const workModulePresetFields: FormField[] = [
  {
    id: "field_dept_intro_group",
    type: "group",
    label: "部门简介",
    props: {
      groupTitle: "部门简介",
      borderStyle: "solid",
      borderColor: "#d9d9d9",
      backgroundColor: "#ffffff",
      padding: 16,
      updateFrequency: "irregular",
    },
    validation: { required: true },
    children: [
      {
        id: "field_dept_intro_duty",
        type: "richText",
        label: "职能职责",
        props: {
          editorHeight: 260,
          toolbarFeatures: ["bold", "italic", "underline"],
          showWordCount: true,
          maxWords: 500,
          updateFrequency: "irregular",
        },
        validation: { required: true },
      },
      {
        id: "field_dept_intro_org",
        type: "richText",
        label: "组织架构",
        props: {
          editorHeight: 260,
          toolbarFeatures: ["bold", "italic", "underline"],
          showWordCount: true,
          maxWords: 500,
          updateFrequency: "irregular",
        },
        validation: { required: false },
      },
    ],
  },
  {
    id: "field_org_chart",
    type: "upload",
    label: "工作体系架构图",
    props: {
      placeholder: "请上传体系架构图片",
      updateFrequency: "irregular",
    },
    validation: { required: true },
  },
  {
    id: "field_core_business_group",
    type: "coreBusiness",
    label: "核心业务",
    props: {
      treeLevel: 2,
      allowAddLevel1: true,
      allowAddLevel2: true,
      defaultExpandLevel: "all",
      updateFrequency: "irregular",
    },
    validation: { required: false },
  },
  {
    id: "field_advantages",
    type: "advantageCards",
    label: "特色优势",
    props: {
      updateFrequency: "irregular",
    },
    validation: { required: false },
  },
  {
    id: "field_achievements_group",
    type: "group",
    label: "标志性成果打造情况",
    props: {
      groupTitle: "标志性成果打造情况",
      borderStyle: "solid",
      borderColor: "#d9d9d9",
      backgroundColor: "#ffffff",
      padding: 16,
      updateFrequency: "irregular",
    },
    validation: { required: false },
    children: [
      {
        id: "field_achievements_title",
        type: "input",
        label: "成果标题",
        props: {
          placeholder: "请输入成果标题",
          updateFrequency: "irregular",
        },
        validation: { required: false },
      },
      {
        id: "field_achievements_desc",
        type: "textarea",
        label: "成果详细说明",
        props: {
          placeholder: "请输入成果详细说明",
          updateFrequency: "irregular",
        },
        validation: { required: false },
      },
    ],
  },
  {
    id: "field_problems_group",
    type: "group",
    label: "存在的主要问题",
    props: {
      groupTitle: "存在的主要问题",
      borderStyle: "solid",
      borderColor: "#d9d9d9",
      backgroundColor: "#ffffff",
      padding: 16,
      updateFrequency: "irregular",
    },
    validation: { required: false },
    children: [
      {
        id: "field_problems_title",
        type: "input",
        label: "问题标题",
        props: {
          placeholder: "请输入问题标题",
          updateFrequency: "irregular",
        },
        validation: { required: false },
      },
      {
        id: "field_problems_desc",
        type: "textarea",
        label: "问题详细说明",
        props: {
          placeholder: "请输入问题详细说明",
          updateFrequency: "irregular",
        },
        validation: { required: false },
      },
    ],
  },
  {
    id: "field_indicators",
    type: "indicatorTable",
    label: "主要指标数据表",
    props: {
      tableRows: 2,
      colHeaders: ["2021年", "2022年", "2023年", "2024年", "2025年", "2026年目标", "2030年目标"],
      allowAddRow: true,
      updateFrequency: "monthly",
    },
    validation: { required: false },
  },
  {
    id: "field_quarterly_tasks",
    type: "taskBreakdownTable",
    label: "季度主要目标任务分解表",
    props: {
      tableRows: 2,
      colHeaders: ["第一季度", "第二季度", "第三季度", "第四季度"],
      allowAddRow: true,
      updateFrequency: "quarterly",
    },
    validation: { required: false },
  },
];
