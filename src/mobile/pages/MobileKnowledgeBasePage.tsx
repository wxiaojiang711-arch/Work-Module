import React, { useMemo, useState } from 'react';
import { Card, NavBar, SearchBar, Space, Tabs, Tag } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';

import type { KnowledgeBase, KnowledgeBaseType, UnitCategory } from '../../pages/KnowledgeBaseManagement/types';
import { knowledgeBaseListMock } from '../../pages/KnowledgeBaseManagement/knowledgeBaseMockData';

const typeLabelMap: Record<KnowledgeBaseType, string> = {
  decision: '决策库',
  unit: '单位库',
  theme: '主题库',
};

const unitCategoryLabelMap: Record<UnitCategory, string> = {
  department: '部门',
  town: '镇街',
  soe: '国企',
};

const MobileKnowledgeBasePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | KnowledgeBaseType>('all');
  const [unitTab, setUnitTab] = useState<UnitCategory>('department');
  const [keyword, setKeyword] = useState('');

  const filteredList = useMemo(() => {
    return knowledgeBaseListMock.filter((kb) => {
      const matchType = activeTab === 'all' || kb.type === activeTab;
      const matchUnit = activeTab !== 'unit' || kb.unitCategory === unitTab;
      const matchKeyword =
        !keyword.trim() ||
        kb.title.includes(keyword.trim()) ||
        kb.description.includes(keyword.trim());
      return matchType && matchUnit && matchKeyword;
    });
  }, [activeTab, keyword, unitTab]);

  const typeCounts = useMemo(() => {
    return {
      all: knowledgeBaseListMock.length,
      decision: knowledgeBaseListMock.filter((k) => k.type === 'decision').length,
      unit: knowledgeBaseListMock.filter((k) => k.type === 'unit').length,
      theme: knowledgeBaseListMock.filter((k) => k.type === 'theme').length,
    };
  }, []);

  const unitCounts = useMemo(() => {
    return {
      department: knowledgeBaseListMock.filter((k) => k.type === 'unit' && k.unitCategory === 'department').length,
      town: knowledgeBaseListMock.filter((k) => k.type === 'unit' && k.unitCategory === 'town').length,
      soe: knowledgeBaseListMock.filter((k) => k.type === 'unit' && k.unitCategory === 'soe').length,
    };
  }, []);

  const getTypeTagText = (kb: KnowledgeBase) => {
    if (kb.type === 'unit' && kb.unitCategory) {
      return `${typeLabelMap.unit}-${unitCategoryLabelMap[kb.unitCategory]}`;
    }
    return typeLabelMap[kb.type];
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <NavBar back={null}>知识库</NavBar>
      <div style={{ padding: 12 }}>
        <SearchBar
          value={keyword}
          placeholder="搜索知识库名称或描述"
          onChange={(val) => setKeyword(val)}
          style={{ '--height': '36px' }}
        />
        <div style={{ marginTop: 12 }}>
          <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key as 'all' | KnowledgeBaseType)}>
            <Tabs.Tab title={`全部 (${typeCounts.all})`} key="all" />
            <Tabs.Tab title={`决策库 (${typeCounts.decision})`} key="decision" />
            <Tabs.Tab title={`单位库 (${typeCounts.unit})`} key="unit" />
            <Tabs.Tab title={`主题库 (${typeCounts.theme})`} key="theme" />
          </Tabs>
        </div>
        {activeTab === 'unit' ? (
          <div style={{ marginTop: 8 }}>
            <Tabs activeKey={unitTab} onChange={(key) => setUnitTab(key as UnitCategory)}>
              <Tabs.Tab title={`部门 (${unitCounts.department})`} key="department" />
              <Tabs.Tab title={`镇街 (${unitCounts.town})`} key="town" />
              <Tabs.Tab title={`国企 (${unitCounts.soe})`} key="soe" />
            </Tabs>
          </div>
        ) : null}
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filteredList.map((kb) => (
            <Card
              key={kb.id}
              onClick={() =>
                navigate(`/m/kb/${kb.id}`, {
                  state: {
                    kbName: kb.title,
                    kbType: kb.type,
                    unitCategory: kb.unitCategory,
                    visibility: kb.visibility,
                  },
                })
              }
              style={{ borderRadius: 12 }}
            >
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>{kb.title}</div>
              <div style={{ fontSize: 12, color: '#666', lineHeight: 1.5 }}>{kb.description}</div>
              <Space wrap style={{ marginTop: 10 }}>
                <Tag color="primary">{getTypeTagText(kb)}</Tag>
                <Tag color="success">{kb.visibility}</Tag>
                <Tag color="warning">{kb.itemCount} 个文件</Tag>
              </Space>
              <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>更新：{kb.lastUpdated}</div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileKnowledgeBasePage;
