import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import {
  Button,
  Checkbox,
  DatePicker,
  Empty,
  Input,
  InputNumber,
  Radio,
  Select,
  Space,
  Tag,
  Upload,
  Typography,
} from "antd";
import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";

import type { FormField } from "./constants";

interface FormCanvasProps {
  formSchema: FormField[];
  activeComponentId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

const renderPreview = (field: FormField) => {
  switch (field.type) {
    case "input":
      return <Input disabled placeholder={field.props.placeholder} />;
    case "textarea":
      return <Input.TextArea disabled rows={3} placeholder={field.props.placeholder} />;
    case "number":
      return <InputNumber disabled style={{ width: "100%" }} placeholder={field.props.placeholder} min={field.props.min} max={field.props.max} />;
    case "radio":
      return <Radio.Group disabled options={(field.props.options ?? []).map((item) => ({ label: item.label, value: item.value }))} />;
    case "checkbox":
      return <Checkbox.Group disabled options={(field.props.options ?? []).map((item) => ({ label: item.label, value: item.value }))} />;
    case "select":
      return <Select disabled placeholder={field.props.placeholder} options={(field.props.options ?? []).map((item) => ({ label: item.label, value: item.value }))} />;
    case "datePicker":
      return <DatePicker disabled style={{ width: "100%" }} format={field.props.format ?? "YYYY-MM-DD"} />;
    case "upload":
      return (
        <Upload disabled>
          <Button icon={<UploadOutlined />}>点击上传</Button>
        </Upload>
      );
    case "location":
      return <Input disabled placeholder="请选择地理位置" />;
    default:
      return null;
  }
};

interface SortableItemProps {
  field: FormField;
  active: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

const SortableItem: React.FC<SortableItemProps> = ({ field, active, onSelect, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: field.id,
    data: {
      from: "canvas-item",
      itemId: field.id,
    },
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        border: active ? "2px solid #1677ff" : "1px solid #d9e0ee",
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        background: "#fff",
        position: "relative",
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.55 : 1,
        boxShadow: active ? "0 0 0 2px rgba(22,119,255,0.15)" : undefined,
      }}
      onClick={() => onSelect(field.id)}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <Space size={8}>
          <Tag color={field.validation.required ? "error" : "default"}>{field.validation.required ? "必填" : "选填"}</Tag>
          <Typography.Text strong>{field.label}</Typography.Text>
        </Space>

        <Space size={4}>
          <Button size="small" type="text" danger icon={<DeleteOutlined />} onClick={(event) => {
            event.stopPropagation();
            onDelete(field.id);
          }} />
        </Space>
      </div>

      <div {...attributes} {...listeners} style={{ cursor: "move" }}>
        {renderPreview(field)}
      </div>
    </div>
  );
};

const FormCanvas: React.FC<FormCanvasProps> = ({ formSchema, activeComponentId, onSelect, onDelete }) => {
  const { setNodeRef, isOver } = useDroppable({ id: "form-canvas" });

  return (
    <div
      ref={setNodeRef}
      style={{
        border: `1px dashed ${isOver ? "#1677ff" : "#c7d4ea"}`,
        borderRadius: 10,
        minHeight: 560,
        padding: 16,
        background: isOver ? "#f0f6ff" : "#fafcff",
      }}
    >
      {formSchema.length === 0 ? (
        <div style={{ height: 520, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Empty description="从左侧拖拽控件到此处开始创建表单" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </div>
      ) : (
        <SortableContext items={formSchema.map((field) => field.id)} strategy={verticalListSortingStrategy}>
          {formSchema.map((field) => (
            <SortableItem
              key={field.id}
              field={field}
              active={activeComponentId === field.id}
              onSelect={onSelect}
              onDelete={onDelete}
            />
          ))}
        </SortableContext>
      )}
    </div>
  );
};

export default FormCanvas;
