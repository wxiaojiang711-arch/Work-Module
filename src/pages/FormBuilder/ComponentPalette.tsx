import React from "react";
import { Card, Collapse } from "antd";
import { useDraggable } from "@dnd-kit/core";

import { componentGroups, type FieldType } from "./constants";

interface PaletteItemProps {
  type: FieldType;
  label: string;
  icon: React.ReactNode;
}

const PaletteItem: React.FC<PaletteItemProps> = ({ type, label, icon }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `palette_${type}`,
    data: {
      from: "palette",
      componentType: type,
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        border: "1px solid #e5eaf3",
        borderRadius: 8,
        padding: "10px 12px",
        marginBottom: 8,
        display: "flex",
        alignItems: "center",
        gap: 8,
        cursor: "grab",
        background: "#fff",
        userSelect: "none",
        opacity: isDragging ? 0.45 : 1,
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
      }}
    >
      <span style={{ color: "#1677ff", display: "inline-flex" }}>{icon}</span>
      <span>{label}</span>
    </div>
  );
};

const ComponentPalette: React.FC = () => {
  return (
    <Card title="组件面板" size="small" bodyStyle={{ paddingBottom: 8 }}>
      <Collapse
        defaultActiveKey={componentGroups.map((group) => group.key)}
        items={componentGroups.map((group) => ({
          key: group.key,
          label: group.label,
          children: group.children.map((item) => (
            <PaletteItem key={item.type} type={item.type} label={item.label} icon={item.icon} />
          )),
        }))}
      />
    </Card>
  );
};

export default ComponentPalette;
