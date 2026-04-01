import React, { useMemo, useState } from 'react';
import { Button, Card, DatePicker, NavBar, Popup, SearchBar, Selector, Space, Tag } from 'antd-mobile';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';

import {
  knowledgeBaseFileListMock,
  knowledgeBaseListMock,
  type KnowledgeBaseFileAsset,
} from '../../pages/KnowledgeBaseManagement/knowledgeBaseMockData';

type LocationState = {
  kbName?: string;
  kbType?: 'unit' | 'theme';
  unitCategory?: 'department' | 'town' | 'soe';
  visibility?: string;
};

const MobileKnowledgeBaseDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { kbId } = useParams<{ kbId: string }>();
  const location = useLocation();
  const state = (location.state ?? {}) as LocationState;

  const kbMeta = useMemo(() => knowledgeBaseListMock.find((item) => item.id === kbId), [kbId]);
  const kbName = state.kbName ?? kbMeta?.title ?? `知识库-${kbId ?? ''}`;
  const kbType = state.kbType ?? kbMeta?.type ?? 'unit';
  const unitCategory = state.unitCategory ?? kbMeta?.unitCategory;
  const visibility = state.visibility ?? kbMeta?.visibility ?? '组织内公开';

  const kbTypeLabel =
    kbType === 'theme'
      ? '主题库'
      : `单位库-${unitCategory === 'town' ? '镇街' : unitCategory === 'soe' ? '国企' : '部门'}`;

  const fileList = useMemo(() => {
    if (kbType === 'theme') {
      return knowledgeBaseFileListMock.filter((item) => item.kbType === 'theme');
    }
    return knowledgeBaseFileListMock.filter((item) => item.kbType === 'unit');
  }, [kbType]);

  const [query, setQuery] = useState({
    keyword: '',
    category: '',
    reporter: '',
    sourceUnit: '',
    startDate: null as Date | null,
    endDate: null as Date | null,
  });
  const [appliedQuery, setAppliedQuery] = useState(query);
  const [filterOpen, setFilterOpen] = useState(false);

  const filteredFiles = useMemo(() => {
    const keyword = appliedQuery.keyword.trim();
    const start = appliedQuery.startDate;
    const end = appliedQuery.endDate;

    return fileList.filter((file) => {
      const matchKeyword =
        !keyword ||
        file.fileName.includes(keyword) ||
        (file.description?.includes(keyword) ?? false);
      const matchCategory = !appliedQuery.category || file.fileCategory === appliedQuery.category;
      const matchReporter = !appliedQuery.reporter || file.reporter === appliedQuery.reporter;
      const matchSource = !appliedQuery.sourceUnit || file.sourceUnit === appliedQuery.sourceUnit;
      const matchDate =
        (!start && !end) ||
        ((start ? dayjs(file.reportTime).isAfter(dayjs(start).startOf('day').subtract(1, 'minute')) : true) &&
          (end ? dayjs(file.reportTime).isBefore(dayjs(end).endOf('day').add(1, 'minute')) : true));
      return matchKeyword && matchCategory && matchReporter && matchSource && matchDate;
    });
  }, [appliedQuery, fileList]);

  const fileTypeLabelMap: Record<KnowledgeBaseFileAsset['fileType'], string> = {
    docx: 'Word',
    xlsx: 'Excel',
    pdf: 'PDF',
    png: '图片',
    jpg: '图片',
    mp4: '视频',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <NavBar
        onBack={() => navigate('/m/kb')}
        right={
          <Button size="small" onClick={() => setFilterOpen(true)}>
            筛选
          </Button>
        }
      >
        知识库详情
      </NavBar>
      <div style={{ padding: 12 }}>
        <Card style={{ borderRadius: 12 }}>
          <div style={{ fontSize: 18, fontWeight: 600 }}>{kbName}</div>
          <Space wrap style={{ marginTop: 10 }}>
            <Tag color="primary">{kbTypeLabel}</Tag>
            <Tag color="success">{visibility}</Tag>
            {kbMeta ? <Tag color="warning">{kbMeta.itemCount} 个文件</Tag> : null}
          </Space>
          <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
            最近更新：{kbMeta?.lastUpdated ?? '-'}
          </div>
        </Card>

        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filteredFiles.map((file) => (
            <Card key={file.id} style={{ borderRadius: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{file.fileName}</div>
                <Tag color="primary">{fileTypeLabelMap[file.fileType]}</Tag>
              </div>
              {file.description ? (
                <div style={{ marginTop: 6, fontSize: 12, color: '#666' }}>{file.description}</div>
              ) : null}
              <Space wrap style={{ marginTop: 8 }}>
                <Tag color="success">{file.sourceUnit}</Tag>
                <Tag color="warning">{file.reporter}</Tag>
              </Space>
              <div style={{ marginTop: 6, fontSize: 12, color: '#999' }}>
                上报时间：{file.reportTime}
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Popup
        visible={filterOpen}
        onMaskClick={() => setFilterOpen(false)}
        position="bottom"
        bodyStyle={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
      >
        <div style={{ padding: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>筛选条件</div>
          <SearchBar
            value={query.keyword}
            placeholder="搜索文件名或描述"
            onChange={(val) => setQuery((prev) => ({ ...prev, keyword: val }))}
            style={{ '--height': '36px' }}
          />
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 12, color: '#666', marginBottom: 6 }}>文件分类</div>
            <Selector
              options={[
                { label: '工作汇报', value: 'work_report' },
                { label: '会议纪要', value: 'meeting_minutes' },
              ]}
              value={query.category ? [query.category] : []}
              onChange={(val) => setQuery((prev) => ({ ...prev, category: val[0] ?? '' }))}
            />
          </div>
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 12, color: '#666', marginBottom: 6 }}>上报人</div>
            <Selector
              options={[
                { label: '张三', value: '张三' },
                { label: '赵刚', value: '赵刚' },
                { label: '李伟', value: '李伟' },
                { label: '刘洋', value: '刘洋' },
              ]}
              value={query.reporter ? [query.reporter] : []}
              onChange={(val) => setQuery((prev) => ({ ...prev, reporter: val[0] ?? '' }))}
            />
          </div>
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 12, color: '#666', marginBottom: 6 }}>文件来源单位</div>
            <Selector
              options={[
                { label: '区大数据发展管理局', value: '区大数据发展管理局' },
                { label: '区发改委', value: '区发改委' },
                { label: '镇街A', value: '镇街A' },
                { label: '国企B', value: '国企B' },
              ]}
              value={query.sourceUnit ? [query.sourceUnit] : []}
              onChange={(val) => setQuery((prev) => ({ ...prev, sourceUnit: val[0] ?? '' }))}
            />
          </div>
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 12, color: '#666', marginBottom: 6 }}>上报时间</div>
            <Space wrap>
              <DatePicker
                precision="day"
                value={query.startDate}
                onConfirm={(val) => setQuery((prev) => ({ ...prev, startDate: val }))}
              >
                {(value) => (
                  <div
                    style={{
                      width: 150,
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
                value={query.endDate}
                onConfirm={(val) => setQuery((prev) => ({ ...prev, endDate: val }))}
              >
                {(value) => (
                  <div
                    style={{
                      width: 150,
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
            </Space>
          </div>
          <Space style={{ marginTop: 16, justifyContent: 'center', width: '100%' }}>
            <Button
              color="primary"
              style={{ width: 140 }}
              onClick={() => {
                setAppliedQuery(query);
                setFilterOpen(false);
              }}
            >
              查看
            </Button>
            <Button
              style={{ width: 140 }}
              onClick={() => {
                const reset = {
                  keyword: '',
                  category: '',
                  reporter: '',
                  sourceUnit: '',
                  startDate: null,
                  endDate: null,
                };
                setQuery(reset);
                setAppliedQuery(reset);
              }}
            >
              重置
            </Button>
          </Space>
        </div>
      </Popup>
    </div>
  );
};

export default MobileKnowledgeBaseDetailPage;
