import React, { useMemo, useState } from 'react';
import { Button, Card, DatePicker, ErrorBlock, InfiniteScroll, NavBar, SearchBar, Tag } from 'antd-mobile';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

import {
  allKnowledgeBases,
  getFilteredKnowledgeBases,
  kbTypeMeta,
  kbTypeOptions,
  orgTypeOptions,
  searchResults,
  type KbTypeFilter,
  type OrgTypeFilter,
  type SearchResultItem,
} from '../mobileMockData';

const pageSize = 4;

const quickRanges = [
  { label: '近一周', value: '7d', days: 7 },
  { label: '近一月', value: '1m', days: 30 },
  { label: '近三月', value: '3m', days: 90 },
  { label: '近半年', value: '6m', days: 180 },
  { label: '近一年', value: '1y', days: 365 },
] as const;

const highlightText = (text: string, keyword: string) => {
  if (!keyword.trim()) return text;
  const idx = text.toLowerCase().indexOf(keyword.toLowerCase());
  if (idx === -1) return text;
  const before = text.slice(0, idx);
  const hit = text.slice(idx, idx + keyword.length);
  const after = text.slice(idx + keyword.length);
  return (
    <>
      {before}
      <span style={{ color: '#ff4d4f' }}>{hit}</span>
      {after}
    </>
  );
};

const AdvancedSearchPage: React.FC = () => {
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState('');
  const [orgType, setOrgType] = useState<OrgTypeFilter>('all');
  const [kbType, setKbType] = useState<KbTypeFilter>('all');
  const [kbId, setKbId] = useState<string | null>(null);
  const [quickRange, setQuickRange] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [showFilters, setShowFilters] = useState(true);
  const [searched, setSearched] = useState(false);
  const [visibleCount, setVisibleCount] = useState(pageSize);

  const kbOptions = useMemo(() => getFilteredKnowledgeBases(orgType, kbType), [orgType, kbType]);

  const filteredResults = useMemo(() => {
    return searchResults.filter((item) => {
      const byKeyword = !keyword.trim() || item.fileName.includes(keyword) || item.summary.includes(keyword);
      const byKb = !kbId || allKnowledgeBases.find((kb) => kb.id === kbId)?.name === item.kbName;
      const byOrgType = orgType === 'all' || allKnowledgeBases.find((kb) => kb.name === item.kbName)?.orgType === orgType;
      const byKbType = kbType === 'all' || item.kbType === kbType;

      const ts = dayjs(item.reportTime);
      const byDate =
        (!startDate || ts.isAfter(dayjs(startDate).startOf('day')) || ts.isSame(dayjs(startDate).startOf('day'))) &&
        (!endDate || ts.isBefore(dayjs(endDate).endOf('day')) || ts.isSame(dayjs(endDate).endOf('day')));

      return byKeyword && byKb && byOrgType && byKbType && byDate;
    });
  }, [keyword, kbId, orgType, kbType, startDate, endDate]);

  const visibleResults = filteredResults.slice(0, visibleCount);
  const hasMore = visibleCount < filteredResults.length;

  const loadMore = async () => {
    await new Promise((resolve) => window.setTimeout(resolve, 500));
    setVisibleCount((prev) => Math.min(prev + pageSize, filteredResults.length));
  };

  const handleQuickRange = (item: (typeof quickRanges)[number]) => {
    setQuickRange(item.value);
    setStartDate(dayjs().subtract(item.days, 'day').toDate());
    setEndDate(dayjs().toDate());
  };

  const onChangeOrgType = (value: OrgTypeFilter) => {
    setOrgType(value);
    setKbId(null);
  };

  const onChangeKbType = (value: KbTypeFilter) => {
    setKbType(value);
    setKbId(null);
    if (value === 'theme') setOrgType('all');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f5f5f5',
        paddingBottom: 50,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
      }}
    >
      <NavBar onBack={() => navigate(-1)}>高级检索</NavBar>

      {showFilters ? (
        <div style={{ padding: 16 }}>
          <div style={{ marginBottom: 16 }}>
            <SearchBar placeholder="请输入关键词" value={keyword} onChange={setKeyword} style={{ borderRadius: 8 }} />
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: '#333', marginBottom: 8 }}>组织类型</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {orgTypeOptions.map((opt) => {
                const selected = orgType === opt.value;
                return (
                  <div
                    key={opt.value}
                    onClick={() => onChangeOrgType(opt.value)}
                    style={{
                      padding: '6px 16px',
                      borderRadius: 16,
                      fontSize: 13,
                      background: selected ? '#1890ff' : '#f5f5f5',
                      color: selected ? '#fff' : '#333',
                      cursor: 'pointer',
                    }}
                  >
                    {opt.label}
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: '#333', marginBottom: 8 }}>知识库类型</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {kbTypeOptions.map((opt) => {
                const selected = kbType === opt.value;
                return (
                  <div
                    key={opt.value}
                    onClick={() => onChangeKbType(opt.value)}
                    style={{
                      padding: '6px 16px',
                      borderRadius: 16,
                      fontSize: 13,
                      background: selected ? '#1890ff' : '#f5f5f5',
                      color: selected ? '#fff' : '#333',
                      cursor: 'pointer',
                    }}
                  >
                    {opt.label}
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: '#333', marginBottom: 8 }}>选择知识库</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <div
                onClick={() => setKbId(null)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 16,
                  fontSize: 13,
                  background: kbId === null ? '#1890ff' : '#f5f5f5',
                  color: kbId === null ? '#fff' : '#333',
                  cursor: 'pointer',
                }}
              >
                全部
              </div>
              {kbOptions.map((kb) => {
                const selected = kbId === kb.id;
                return (
                  <div
                    key={kb.id}
                    onClick={() => setKbId(kb.id)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 16,
                      fontSize: 13,
                      background: selected ? '#1890ff' : '#f5f5f5',
                      color: selected ? '#fff' : '#333',
                      cursor: 'pointer',
                    }}
                  >
                    {kb.name}
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: '#333', marginBottom: 8 }}>上报时间</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
              {quickRanges.map((item) => {
                const selected = quickRange === item.value;
                return (
                  <div
                    key={item.value}
                    onClick={() => handleQuickRange(item)}
                    style={{
                      padding: '6px 16px',
                      borderRadius: 16,
                      fontSize: 13,
                      background: selected ? '#1890ff' : '#f5f5f5',
                      color: selected ? '#fff' : '#333',
                      cursor: 'pointer',
                    }}
                  >
                    {item.label}
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <DatePicker
                precision="day"
                value={startDate}
                onConfirm={(val) => {
                  setStartDate(val);
                  setQuickRange(null);
                }}
              >
                {(value) => (
                  <div
                    style={{
                      flex: 1,
                      height: 36,
                      borderRadius: 8,
                      background: '#fff',
                      border: '1px solid #f0f0f0',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 10px',
                      color: value ? '#333' : '#999',
                      fontSize: 13,
                    }}
                  >
                    {value ? dayjs(value).format('YYYY-MM-DD') : '开始日期'}
                  </div>
                )}
              </DatePicker>

              <DatePicker
                precision="day"
                value={endDate}
                onConfirm={(val) => {
                  setEndDate(val);
                  setQuickRange(null);
                }}
              >
                {(value) => (
                  <div
                    style={{
                      flex: 1,
                      height: 36,
                      borderRadius: 8,
                      background: '#fff',
                      border: '1px solid #f0f0f0',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 10px',
                      color: value ? '#333' : '#999',
                      fontSize: 13,
                    }}
                  >
                    {value ? dayjs(value).format('YYYY-MM-DD') : '结束日期'}
                  </div>
                )}
              </DatePicker>
            </div>
          </div>

          <Button
            color="primary"
            block
            size="large"
            style={{ borderRadius: 8, marginTop: 8 }}
            onClick={() => {
              setSearched(true);
              setShowFilters(false);
              setVisibleCount(pageSize);
            }}
          >
            开始检索
          </Button>
        </div>
      ) : (
        <div style={{ padding: '10px 16px 0' }}>
          <Button size="small" fill="outline" onClick={() => setShowFilters(true)}>
            筛选条件
          </Button>
        </div>
      )}

      {searched ? (
        <>
          <div style={{ fontSize: 13, color: '#999', padding: '12px 16px 0' }}>共找到 {filteredResults.length} 条结果</div>
          <div style={{ padding: '0 16px 80px' }}>
            {filteredResults.length === 0 ? (
              <div style={{ marginTop: 20 }}>
                <ErrorBlock status="empty" description="未找到相关内容，请调整筛选条件后重试" />
              </div>
            ) : (
              <>
                {visibleResults.map((item: SearchResultItem) => (
                  <Card
                    key={item.id}
                    style={{
                      marginTop: 12,
                      borderRadius: 8,
                      border: '1px solid #f0f0f0',
                      background: '#fff',
                    }}
                    onClick={() => navigate(`/m/preview/${item.id}`)}
                  >
                    <div style={{ fontSize: 15, fontWeight: 500, color: '#333' }}>{highlightText(item.fileName, keyword)}</div>
                    <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <Tag color={item.kbType === 'theme' ? 'purple' : 'success'} fill="outline">
                        {kbTypeMeta[item.kbType].label}
                      </Tag>
                      <Tag color="primary" fill="outline">
                        {item.orgName}
                      </Tag>
                    </div>
                    <div
                      style={{
                        marginTop: 8,
                        fontSize: 13,
                        color: '#666',
                        lineHeight: 1.6,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {highlightText(item.summary, keyword)}
                    </div>
                    <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>上报时间：{item.reportTime}</div>
                  </Card>
                ))}
                <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
              </>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default AdvancedSearchPage;
