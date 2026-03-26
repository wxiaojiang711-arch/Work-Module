import React, { useMemo } from "react";
import { Card, Col, Row } from "antd";
import { DndContext, PointerSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

import ComponentPalette from "./ComponentPalette";
import FormCanvas from "./FormCanvas";
import PropertyInspector from "./PropertyInspector";
import { createFieldByType, type FieldType, type FormField } from "./constants";

interface FormDesignStepProps {
  formSchema: FormField[];
  setFormSchema: React.Dispatch<React.SetStateAction<FormField[]>>;
}

const FormDesignStep: React.FC<FormDesignStepProps> = ({ formSchema, setFormSchema }) => {
  const [activeComponentId, setActiveComponentId] = React.useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const activeComponent = useMemo(
    () => formSchema.find((item) => item.id === activeComponentId) ?? null,
    [activeComponentId, formSchema],
  );

  React.useEffect(() => {
    if (!activeComponentId) {
      return;
    }

    if (!formSchema.some((item) => item.id === activeComponentId)) {
      setActiveComponentId(null);
    }
  }, [activeComponentId, formSchema]);

  const insertField = (type: FieldType, overId: string) => {
    const created = createFieldByType(type);

    setFormSchema((prev) => {
      const next = [...prev];
      if (overId === "form-canvas") {
        next.push(created);
      } else {
        const idx = next.findIndex((item) => item.id === overId);
        if (idx === -1) {
          next.push(created);
        } else {
          next.splice(idx + 1, 0, created);
        }
      }
      return next;
    });

    setActiveComponentId(created.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) {
      return;
    }

    const activeFrom = active.data.current?.from as string | undefined;

    if (activeFrom === "palette") {
      const type = active.data.current?.componentType as FieldType | undefined;
      if (!type) {
        return;
      }
      insertField(type, String(over.id));
      return;
    }

    if (activeFrom === "canvas-item") {
      const oldId = String(active.id);
      const overId = String(over.id);
      if (overId === "form-canvas" || oldId === overId) {
        return;
      }

      setFormSchema((prev) => {
        const oldIndex = prev.findIndex((item) => item.id === oldId);
        const newIndex = prev.findIndex((item) => item.id === overId);
        if (oldIndex === -1 || newIndex === -1) {
          return prev;
        }
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  const handleDelete = (id: string) => {
    setFormSchema((prev) => prev.filter((item) => item.id !== id));
    if (activeComponentId === id) {
      setActiveComponentId(null);
    }
  };

  const onUpdateComponent = (id: string, updater: (field: FormField) => FormField) => {
    setFormSchema((prev) => prev.map((field) => (field.id === id ? updater(field) : field)));
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <Row gutter={16} align="top" style={{ marginTop: 12 }}>
        <Col span={6}>
          <ComponentPalette />
        </Col>

        <Col span={12}>
          <Card title="表单画布" size="small" bodyStyle={{ padding: 12 }}>
            <FormCanvas
              formSchema={formSchema}
              activeComponentId={activeComponentId}
              onSelect={setActiveComponentId}
              onDelete={handleDelete}
            />
          </Card>
        </Col>

        <Col span={6}>
          <PropertyInspector activeComponent={activeComponent} onUpdateComponent={onUpdateComponent} />
        </Col>
      </Row>
    </DndContext>
  );
};

export default FormDesignStep;
