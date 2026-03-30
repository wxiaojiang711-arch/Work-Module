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
  Image,
  Tree,
  Table,
} from "antd";
import { DeleteOutlined, UploadOutlined, PlusOutlined } from "@ant-design/icons";

import type { FormField } from "./constants";
import styles from "./FormCanvas.module.css";

interface FormCanvasProps {
  formSchema: FormField[];
  activeComponentId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

const renderPreview = (field: FormField) => {
  const fontSizeMap = { small: 14, medium: 16, large: 18 };
  
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
    case "textLabel":
      const alignClass = `align-${field.props.textAlign ?? "left"}`;
      const sizeClass = `size-${field.props.fontSize ?? "medium"}`;
      return (
        <div
          className={`${styles["text-label-component"]} ${styles[alignClass]} ${styles[sizeClass]}`}
          style={{ color: field.props.textColor ?? "#000000" }}
        >
          {field.props.text ?? "文本标签"}
        </div>
      );
    case "image":
      return (
        <div className={styles["image-upload-component"]}>
          <div className={styles["image-upload-list"]}>
            {Array.from({ length: field.props.uploadLimit ?? 1 }).map((_, i) => (
              <button key={i} className={styles["image-upload-btn"]}>
                <div className={styles["image-upload-icon"]}>
                  <UploadOutlined />
                </div>
                <div className={styles["image-upload-text"]}>上传图片</div>
              </button>
            ))}
          </div>
        </div>
      );
    case "richText":
      return (
        <div className={styles["rich-text-component"]}>
          <div className={styles["rich-text-toolbar"]}>
            <button className={`${styles["rich-text-btn"]} ${styles.active}`}>B</button>
            <button className={styles["rich-text-btn"]}>I</button>
            <button className={styles["rich-text-btn"]}>U</button>
          </div>
          <div
            className={styles["rich-text-editor"]}
            style={{ minHeight: field.props.editorHeight ?? 300 }}
          >
            请输入内容...
          </div>
          {field.props.showWordCount && (
            <div className={styles["rich-text-footer"]}>
              字数: 0 {field.props.maxWords ? `/ ${field.props.maxWords}` : ""}
            </div>
          )}
        </div>
      );
    case "group":
      const groupChildren = field.children ?? [];
      return (
        <div
          className={styles["form-group-container"]}
          style={{
            borderStyle: field.props.borderStyle ?? "solid",
            borderColor: field.props.borderColor ?? "#d9d9d9",
            padding: field.props.padding ?? 20,
            background: field.props.backgroundColor ?? "#ffffff",
          }}
        >
          <div className={styles["form-group-content"]}>
            {groupChildren.length === 0 ? (
              <div className={styles["form-group-empty"]}>拖拽组件到此处</div>
            ) : (
              groupChildren.map((child) => (
                <div key={child.id} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                    {child.validation.required ? <span style={{ color: "#ff4d4f", marginRight: 4 }}>*</span> : null}
                    <Typography.Text strong>{child.label}</Typography.Text>
                  </div>
                  {renderPreview(child)}
                </div>
              ))
            )}
          </div>
        </div>
      );
    case "orgTree":
      const levels = field.props.treeLevel ?? 2;
      return (
        <div className={styles["org-tree-container"]}>
          <div className={styles["org-tree-level-1"]}>
            <div className={styles["org-tree-level-1-item"]}>
              <div className={styles["org-tree-level-1-header"]}>
                <span className={styles["org-tree-icon"]}>📁</span>
                <span className={styles["org-tree-name"]}>一级业务</span>
                <div className={styles["org-tree-actions"]}>
                  <button className={`${styles["org-tree-btn"]} ${styles.delete}`}>
                    <DeleteOutlined />
                  </button>
                </div>
              </div>
              <div className={styles["org-tree-level-2"]}>
                <div className={styles["org-tree-level-2-item"]}>
                  <span className={styles["org-tree-level-2-icon"]}>📄</span>
                  <span className={styles["org-tree-level-2-name"]}>二级业务</span>
                  <div className={styles["org-tree-level-2-actions"]}>
                    {field.props.allowAddLevel2 && (
                      <button className={styles["org-tree-level-2-btn"]}>
                        <PlusOutlined />
                      </button>
                    )}
                    <button className={`${styles["org-tree-level-2-btn"]} ${styles.delete}`}>
                      <DeleteOutlined />
                    </button>
                  </div>
                </div>
                {levels === 3 && (
                  <div className={styles["org-tree-level-3"]}>
                    <div className={styles["org-tree-level-3-item"]}>
                      <span className={styles["org-tree-level-3-icon"]}>📝</span>
                      <span className={styles["org-tree-level-3-name"]}>三级业务</span>
                      <div className={styles["org-tree-level-3-actions"]}>
                        <button className={`${styles["org-tree-level-3-btn"]} ${styles.delete}`}>
                          <DeleteOutlined />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {field.props.allowAddLevel1 && (
            <button className={styles["org-tree-add-btn"]}>
              <PlusOutlined /> 添加一级业务
            </button>
          )}
        </div>
      );
    case "coreBusiness":
      return (
        <div className={styles["core-biz-container"]}>
          <div className={styles["core-biz-level-1"]}>
            <div className={styles["core-biz-level-1-item"]}>
              <div className={styles["core-biz-level-1-header"]}>
                <span className={styles["core-biz-icon"]}>📁</span>
                <span className={styles["core-biz-name"]}>{"一级业务"}</span>
                <div className={styles["core-biz-actions"]}>
                  <button className={styles["core-biz-btn"]}>
                    <DeleteOutlined />
                  </button>
                </div>
              </div>
              <div className={styles["core-biz-level-2"]}>
                {[0, 1].map((idx) => (
                  <div key={idx} className={styles["core-biz-level-2-item"]}>
                    <span className={styles["core-biz-level-2-icon"]}>📄</span>
                    <span className={styles["core-biz-level-2-name"]}>{"二级业务"}</span>
                    <div className={styles["core-biz-level-2-actions"]}>
                      {field.props.allowAddLevel2 && (
                        <button className={styles["core-biz-level-2-btn"]}>
                          <PlusOutlined />
                        </button>
                      )}
                      <button className={`${styles["core-biz-level-2-btn"]} ${styles.delete}`}>
                        <DeleteOutlined />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className={styles["core-biz-desc"]}>
                <div className={styles["core-biz-desc-label"]}>{"业务说明"}</div>
                <div className={styles["core-biz-desc-box"]} />
              </div>
            </div>
          </div>
          {field.props.allowAddLevel1 && (
            <button className={styles["core-biz-add-btn"]}>
              <PlusOutlined /> {"添加一级业务"}
            </button>
          )}
        </div>
      );
    case "taskBreakdownTable": {
      const taskRows = field.props.tableRows ?? 2;
      const quarterHeaders = field.props.colHeaders ?? ["第一季度", "第二季度", "第三季度", "第四季度"];
      return (
        <div className={styles["task-breakdown-container"]}>
          <div className={styles["task-breakdown-table-wrap"]}>
            <table className={styles["task-breakdown-table"]}>
              <thead>
                <tr>
                  <th>{"任务名称"}</th>
                  {quarterHeaders.map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                  <th>{"责任人"}</th>
                  <th className={styles["center-cell"]}>{"操作"}</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: taskRows }).map((_, i) => (
                  <tr key={i}>
                    <td>
                      <Input.TextArea rows={3} placeholder={"请输入"} disabled />
                    </td>
                    {quarterHeaders.map((q) => (
                      <td key={q}>
                        <Input.TextArea rows={3} placeholder={"请输入"} disabled />
                      </td>
                    ))}
                    <td>
                      <Input.TextArea rows={3} placeholder={"请输入"} disabled />
                    </td>
                    <td className={styles["center-cell"]}>
                      <button className={styles["table-delete-btn"]} disabled>
                        <DeleteOutlined />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {field.props.allowAddRow && (
            <button className={styles["task-breakdown-add-btn"]} disabled>
              <PlusOutlined /> {"添加任务"}
            </button>
          )}
        </div>
      );
    }
    case "indicatorTable":
      const rows = field.props.tableRows ?? 2;
      const yearHeaders = ["2021年", "2022年", "2023年", "2024年", "2025年", "2026年目标", "2030年目标"];
      const showType = field.props.showIndicatorType !== false;
      return (
        <div className={styles["indicator-data-container"]}>
          <div className={styles["indicator-data-table-wrap"]}>
            <table className={styles["indicator-data-table"]}>
              <colgroup>
                {showType ? <col className={styles["col-type"]} /> : null}
                <col className={styles["col-name"]} />
                <col className={styles["col-year"]} />
                <col className={styles["col-year"]} />
                <col className={styles["col-year"]} />
                <col className={styles["col-year"]} />
                <col className={styles["col-year"]} />
                <col className={styles["col-target"]} />
                <col className={styles["col-target"]} />
                <col className={styles["col-op"]} />
              </colgroup>
              <thead>
                <tr>
                  {showType ? <th className={styles["center-cell"]}>{"指标类型"}</th> : null}
                  <th className={styles["center-cell"]}>{"指标名称"}</th>
                  {yearHeaders.map((h) =>
                    ["2021年", "2022年", "2023年", "2024年", "2025年"].includes(h) ? (
                      <th key={h} className={`${styles["split-col"]} ${styles["year-header-shift"]}`}>
                        <div className={styles["year-header"]}>
                          <div>{h}</div>
                          <div className={`${styles["split-grid"]} ${styles["year-header-divider"]}`}>
                            <div className={`${styles["split-grid-col"]} ${styles["split-grid-col-header"]}`}>{"我区情况"}</div>
                            <div className={`${styles["split-grid-col"]} ${styles["split-grid-col-header"]}`}>{"全市排名"}</div>
                          </div>
                        </div>
                      </th>
                    ) : (
                      <th key={h} className={styles["center-cell"]}>{h}</th>
                    ),
                  )}
                  <th className={`${styles["center-cell"]} ${styles["op-col"]}`}>{"操作"}</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: rows }).map((_, i) => (
                  <tr key={i}>
                    {showType ? (
                      <td className={styles["center-cell"]}>
                        <input type="text" placeholder={"请输入"} disabled />
                      </td>
                    ) : null}
                    <td className={styles["center-cell"]}>
                      <input type="text" placeholder={"请输入"} disabled />
                    </td>
                    {yearHeaders.map((_, j) => (
                      <td key={j} className={j <= 4 ? styles["split-col"] : styles["center-cell"]}>
                        {j <= 4 ? (
                          <div className={styles["split-grid"]}>
                            <div className={styles["split-grid-col"]}>
                              <input type="text" placeholder={"请输入"} disabled />
                            </div>
                            <div className={styles["split-grid-col"]}>
                              <input type="text" placeholder={"请输入"} disabled />
                            </div>
                          </div>
                        ) : (
                          <input type="text" placeholder={"请输入"} disabled />
                        )}
                      </td>
                    ))}
                    <td className={`${styles["center-cell"]} ${styles["op-col"]}`}>
                      <button className={styles["indicator-data-row-btn"]} disabled>
                        <DeleteOutlined />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {field.props.allowAddRow && (
            <button className={styles["indicator-data-add-btn"]}>
              <PlusOutlined /> {"添加行"}
            </button>
          )}
        </div>
      );
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
        <Space size={4}>
          {field.validation.required && <span style={{ color: "#ff4d4f", fontSize: 16, lineHeight: 1 }}>*</span>}
          <Typography.Text strong>
            {field.type === "orgTree" && field.label === "组织树" ? "业务树" : field.label}
          </Typography.Text>
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
