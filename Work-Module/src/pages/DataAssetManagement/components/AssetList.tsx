import React, { useMemo, useState } from "react";
import { Button, Card, Dropdown, Input, Space, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { MenuProps } from "antd";
import { DownOutlined, FilterOutlined } from "@ant-design/icons";

import type { DataAsset, DrawerTabKey } from "../types";
import type { KnowledgeBase } from "../../KnowledgeBaseManagement/types";
import styles from "./AssetList.module.css";

interface AssetListProps {
  assets: DataAsset[];
  knowledgeBase: KnowledgeBase;
  onOpenAsset: (asset: DataAsset, tabKey?: DrawerTabKey) => void;
}

const typeLabelMap: Record<KnowledgeBase["type"], string> = {
  unit: "单位库",
  theme: "主题库",
};

const frequencyColorMap: Record<string, string> = {
  每天更新: "green",
  每周更新: "blue",
  每月更新: "orange",
  不定期更新: "default",
};

const AssetList: React.FC<AssetListProps> = ({ assets, knowledgeBase, onOpenAsset }) => {
  const [searchText, setSearchText] = useState("");
  const [frequencyFilter, setFrequencyFilter] = useState<string>("all");
  const [fileTypeFilter, setFileTypeFilter] = useState<string>("all");

  const filteredAssets = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();
    return assets.filter((item) => {
      const matchSearch =
        !keyword ||
        item.fileName.toLowerCase().includes(keyword) ||
        item.sourceUnit.toLowerCase().includes(keyword) ||
        item.owner.toLowerCase().includes(keyword);
      const matchFrequency = frequencyFilter === "all" || item.updateFrequency === frequencyFilter;
      const matchType = fileTypeFilter === "all" || item.fileType === fileTypeFilter;
      return matchSearch && matchFrequency && matchType;
    });
  }, [assets, fileTypeFilter, frequencyFilter, searchText]);

  const filterMenuItems: MenuProps["items"] = [
    {
      key: "group-frequency",
      type: "group",
      label: "按更新频率",
      children: [
        { key: "frequency:all", label: "全部" },
        { key: "frequency:每天更新", label: "每天更新" },
        { key: "frequency:每周更新", label: "每周更新" },
        { key: "frequency:每月更新", label: "每月更新" },
        { key: "frequency:不定期更新", label: "不定期更新" },
      ],
    },
    {
      key: "group-type",
      type: "group",
      label: "按文件类型",
      children: [
        { key: "type:all", label: "全部" },
        { key: "type:CSV", label: "CSV" },
        { key: "type:Excel", label: "Excel" },
        { key: "type:API", label: "API" },
        { key: "type:PDF", label: "PDF" },
        { key: "type:Word", label: "Word" },
      ],
    },
    { type: "divider" },
    { key: "reset", label: "清空筛选" },
  ];

  const handleFilterClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "reset") {
      setFrequencyFilter("all");
      setFileTypeFilter("all");
      return;
    }
    if (key.startsWith("frequency:")) {
      setFrequencyFilter(key.replace("frequency:", ""));
      return;
    }
    if (key.startsWith("type:")) {
      setFileTypeFilter(key.replace("type:", ""));
    }
  };

  const columns: ColumnsType<DataAsset> = [
    {
      title: "文件名称",
      dataIndex: "fileName",
      key: "fileName",
      ellipsis: true,
      width: 240,
      render: (value: string, record) => (
        <Button type="link" style={{ paddingInline: 0 }} onClick={() => onOpenAsset(record, "metadata")}>
          {value}
        </Button>
      ),
    },
    { title: "来源单位", dataIndex: "sourceUnit", key: "sourceUnit", width: 180 },
    { title: "负责人", dataIndex: "owner", key: "owner", width: 120 },
    {
      title: "更新频率",
      dataIndex: "updateFrequency",
      key: "updateFrequency",
      width: 120,
      render: (value: string) => <Tag color={frequencyColorMap[value] ?? "default"}>{value}</Tag>,
    },
    { title: "下发时间", dataIndex: "issuedAt", key: "issuedAt", width: 180 },
    { title: "最近更新", dataIndex: "lastUpdated", key: "lastUpdated", width: 180 },
    {
      title: "操作",
      key: "actions",
      fixed: "right",
      width: 240,
      render: (_, record) => (
        <Space size={2} className={styles.actionSpace}>
          <Button type="link" className={styles.actionBtn} onClick={() => onOpenAsset(record, "metadata")}>编辑</Button>
          <Button type="link" className={styles.actionBtn} onClick={() => onOpenAsset(record, "relations")}>关联</Button>
          <Button type="link" className={styles.actionBtn} onClick={() => onOpenAsset(record, "versions")}>版本</Button>
        </Space>
      ),
    },
  ];

  return (
    <Card className={styles.card} bodyStyle={{ padding: 16 }}>
      <Space direction="vertical" size={14} className={styles.fullWidth}>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <Typography.Text type="secondary">
            知识库类型：<Tag color={knowledgeBase.type === "unit" ? "purple" : "cyan"}>{typeLabelMap[knowledgeBase.type]}</Tag>
          </Typography.Text>
          <Typography.Text type="secondary">
            公开方式：<Tag color="blue">{knowledgeBase.visibility}</Tag>
          </Typography.Text>
        </div>

        <div className={styles.toolbar}>
          <Input.Search
            allowClear
            className={styles.search}
            placeholder="搜索文件名、来源单位或负责人"
            enterButton
            value={searchText}
            onSearch={setSearchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Dropdown menu={{ items: filterMenuItems, onClick: handleFilterClick }} trigger={["click"]}>
            <Button icon={<FilterOutlined />}>
              筛选 <DownOutlined />
            </Button>
          </Dropdown>
        </div>

        <Typography.Text type="secondary">
          当前筛选：更新频率 {frequencyFilter === "all" ? "全部" : frequencyFilter} / 文件类型 {fileTypeFilter === "all" ? "全部" : fileTypeFilter}，共 {filteredAssets.length} 条
        </Typography.Text>

        <Table<DataAsset>
          rowKey="id"
          columns={columns}
          dataSource={filteredAssets}
          pagination={{ pageSize: 8, showSizeChanger: false }}
          scroll={{ x: 1200 }}
          onRow={(record) => ({
            onDoubleClick: () => onOpenAsset(record, "metadata"),
          })}
        />
      </Space>
    </Card>
  );
};

export default AssetList;
