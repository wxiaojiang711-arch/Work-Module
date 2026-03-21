import React, { useEffect, useMemo, useState } from "react";
import dayjs, { type Dayjs } from "dayjs";
import {
  Button,
  DatePicker,
  Descriptions,
  Divider,
  Drawer,
  Form,
  Input,
  List,
  message,
  Select,
  Space,
  Tabs,
  Tag,
  Timeline,
  Typography,
} from "antd";

import type { DataAsset, DrawerTabKey } from "../types";
import styles from "./AssetDetailsDrawer.module.css";

const { TextArea } = Input;

interface AssetDetailsDrawerProps {
  open: boolean;
  asset: DataAsset | null;
  initialTab?: DrawerTabKey;
  onClose: () => void;
  onAssetUpdate: (asset: DataAsset) => void;
}

interface MetadataFormValues {
  sourceUnit: string;
  createdAt: Dayjs;
  updateCycle: string;
  summary: string;
  keywords: string[];
  owner: string;
  openness: string;
}

const AssetDetailsDrawer: React.FC<AssetDetailsDrawerProps> = ({
  open,
  asset,
  initialTab = "metadata",
  onClose,
  onAssetUpdate,
}) => {
  const [form] = Form.useForm<MetadataFormValues>();
  const [isEditingMetadata, setIsEditingMetadata] = useState(false);
  const [activeTab, setActiveTab] = useState<DrawerTabKey>(initialTab);
  const [currentTags, setCurrentTags] = useState<string[]>([]);

  useEffect(() => {
    if (!asset) return;
    form.setFieldsValue({
      sourceUnit: asset.sourceUnit,
      createdAt: dayjs(asset.createdAt),
      updateCycle: asset.updateCycle,
      summary: asset.summary,
      keywords: asset.keywords,
      owner: asset.owner,
      openness: asset.openness,
    });
    setCurrentTags(asset.tags);
    setIsEditingMetadata(false);
  }, [asset, form]);

  useEffect(() => {
    if (open) {
      setActiveTab(initialTab);
    }
  }, [initialTab, open]);

  const metadataView = useMemo(() => {
    if (!asset) return null;
    return (
      <Descriptions column={2} bordered size="small">
        <Descriptions.Item label="来源单位">{asset.sourceUnit}</Descriptions.Item>
        <Descriptions.Item label="创建时间">{asset.createdAt}</Descriptions.Item>
        <Descriptions.Item label="更新周期">{asset.updateCycle}</Descriptions.Item>
        <Descriptions.Item label="负责人">{asset.owner}</Descriptions.Item>
        <Descriptions.Item label="公开属性">{asset.openness}</Descriptions.Item>
        <Descriptions.Item label="关键词" span={2}>
          <Space wrap>
            {asset.keywords.map((k) => (
              <Tag key={k}>{k}</Tag>
            ))}
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="摘要" span={2}>
          {asset.summary}
        </Descriptions.Item>
      </Descriptions>
    );
  }, [asset]);

  const handleSaveMetadata = (values: MetadataFormValues) => {
    if (!asset) return;
    const updated: DataAsset = {
      ...asset,
      sourceUnit: values.sourceUnit,
      createdAt: values.createdAt.format("YYYY-MM-DD"),
      updateCycle: values.updateCycle,
      summary: values.summary,
      keywords: values.keywords ?? [],
      owner: values.owner,
      openness: values.openness,
      lastUpdated: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    };
    onAssetUpdate(updated);
    setIsEditingMetadata(false);
    message.success("元数据已更新");
  };

  const renderMetadataTab = () => (
    <div className={styles.tabContainer}>
      <div className={styles.tabHeader}>
        <Typography.Title level={5} className={styles.tabTitle}>
          元数据管理
        </Typography.Title>
        {!isEditingMetadata ? (
          <Button type="primary" onClick={() => setIsEditingMetadata(true)}>
            编辑
          </Button>
        ) : null}
      </div>

      {!isEditingMetadata ? (
        metadataView
      ) : (
        <Form form={form} layout="vertical" onFinish={handleSaveMetadata}>
          <Form.Item label="来源单位" name="sourceUnit" rules={[{ required: true, message: "请输入来源单位" }]}>
            <Input />
          </Form.Item>
          <div className={styles.formRow}>
            <Form.Item className={styles.formCol} label="创建时间" name="createdAt" rules={[{ required: true, message: "请选择创建时间" }]}>
              <DatePicker className={styles.fullWidth} />
            </Form.Item>
            <Form.Item className={styles.formCol} label="更新周期" name="updateCycle" rules={[{ required: true, message: "请选择更新周期" }]}>
              <Select
                options={[
                  { label: "日更", value: "日更" },
                  { label: "周更", value: "周更" },
                  { label: "月更", value: "月更" },
                  { label: "季更", value: "季更" },
                  { label: "按需更新", value: "按需更新" },
                ]}
              />
            </Form.Item>
          </div>
          <div className={styles.formRow}>
            <Form.Item className={styles.formCol} label="负责人" name="owner" rules={[{ required: true, message: "请输入负责人" }]}>
              <Input />
            </Form.Item>
            <Form.Item className={styles.formCol} label="公开属性" name="openness" rules={[{ required: true, message: "请选择公开属性" }]}>
              <Select
                options={[
                  { label: "可公开", value: "可公开" },
                  { label: "组织内公开", value: "组织内公开" },
                  { label: "不可公开", value: "不可公开" },
                ]}
              />
            </Form.Item>
          </div>
          <Form.Item label="关键词" name="keywords">
            <Select mode="tags" tokenSeparators={[","]} />
          </Form.Item>
          <Form.Item label="摘要" name="summary" rules={[{ required: true, message: "请输入摘要" }]}>
            <TextArea rows={4} />
          </Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">保存</Button>
            <Button onClick={() => setIsEditingMetadata(false)}>取消</Button>
          </Space>
        </Form>
      )}
    </div>
  );

  const renderTagsTab = () => (
    <div className={styles.tabContainer}>
      <Typography.Title level={5} className={styles.tabTitle}>标签体系</Typography.Title>
      <Typography.Text type="secondary">当前标签</Typography.Text>
      <div className={styles.tagWrap}>
        {currentTags.map((tag) => (
          <Tag
            key={tag}
            closable
            className={styles.tagItem}
            onClose={() => {
              if (!asset) return;
              const next = currentTags.filter((t) => t !== tag);
              setCurrentTags(next);
              onAssetUpdate({ ...asset, tags: next });
            }}
          >
            {tag}
          </Tag>
        ))}
      </div>
      <Divider />
      <Select
        mode="tags"
        className={styles.fullWidth}
        value={currentTags}
        onChange={(next) => {
          if (!asset) return;
          setCurrentTags(next);
          onAssetUpdate({ ...asset, tags: next });
        }}
        tokenSeparators={[","]}
        placeholder="输入标签后回车"
      />
    </div>
  );

  const renderRelationsTab = () => (
    <div className={styles.tabContainer}>
      <div className={styles.tabHeader}>
        <Typography.Title level={5} className={styles.tabTitle}>关联关系</Typography.Title>
        <Button onClick={() => message.info("可接入添加关联弹窗")}>添加关联</Button>
      </div>
      <List
        bordered
        className={styles.relationList}
        dataSource={asset?.relationships ?? []}
        locale={{ emptyText: "暂无关联" }}
        renderItem={(item) => <List.Item>{item.name}</List.Item>}
      />
    </div>
  );

  const renderVersionsTab = () => (
    <div className={styles.tabContainer}>
      <Typography.Title level={5} className={styles.tabTitle}>版本记录</Typography.Title>
      <Timeline
        items={(asset?.versions ?? []).map((v) => ({
          key: v.id,
          children: (
            <div className={styles.versionItem}>
              <Typography.Text strong>{v.version}</Typography.Text>
              <div className={styles.versionMeta}>
                <Typography.Text type="secondary">{v.timestamp}</Typography.Text>
                <Typography.Text type="secondary">操作人：{v.operator}</Typography.Text>
              </div>
              <Typography.Paragraph className={styles.versionSummary}>变更摘要：{v.summary}</Typography.Paragraph>
            </div>
          ),
        }))}
      />
    </div>
  );

  return (
    <Drawer
      width={560}
      open={open}
      onClose={onClose}
      destroyOnClose={false}
      title={asset ? `资产详情 - ${asset.fileName}` : "资产详情"}
    >
      <Tabs
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key as DrawerTabKey)}
        items={[
          { key: "metadata", label: "元数据", children: renderMetadataTab() },
          { key: "tags", label: "标签", children: renderTagsTab() },
          { key: "relations", label: "关联", children: renderRelationsTab() },
          { key: "versions", label: "版本", children: renderVersionsTab() },
        ]}
      />
    </Drawer>
  );
};

export default AssetDetailsDrawer;
