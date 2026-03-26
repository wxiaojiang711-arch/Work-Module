import React, { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { Badge, Button, Card, Dialog, NavBar, Space, Tag, Tabs, Toast } from 'antd-mobile';
import { BellOutline, ClockCircleOutline, LeftOutline, RedoOutline } from 'antd-mobile-icons';
import { useNavigate } from 'react-router-dom';

import { getDraftKey, getDeadlineState } from './reportFillMockData';
import {
  pendingReportList,
  submittedReportList,
  type PendingReportItem,
  type SubmittedReportItem,
} from '../../pages/DataReport/reportMockData';
import { pendingStatusMap, reviewStatusMap, urgencyMap as pcUrgencyMap } from '../../pages/DataReport/reportConstants';

const now = dayjs('2024-03-21 12:00:00');

const DataReportTaskListPage: React.FC = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'pending' | 'submitted'>('pending');

  const pendingList = useMemo(() => {
    return [...pendingReportList].sort((a, b) => {
      const ua = pcUrgencyMap[a.urgency].order;
      const ub = pcUrgencyMap[b.urgency].order;
      if (ua !== ub) return ub - ua;
      return dayjs(a.deadline).valueOf() - dayjs(b.deadline).valueOf();
    });
  }, []);

  const submittedList = useMemo(() => {
    return [...submittedReportList].sort((a, b) => dayjs(b.submitTime).valueOf() - dayjs(a.submitTime).valueOf());
  }, []);

  const renderPendingCard = (task: PendingReportItem) => {
    const deadline = getDeadlineState(task.deadline);
    const hasDraftFromFill = !!localStorage.getItem(getDraftKey(task.id));

    return (
      <Card key={task.id} style={{ borderRadius: 10, marginBottom: 10 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: '#333' }}>{task.taskName}</div>

        <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <Tag color={pcUrgencyMap[task.urgency].color}>{pcUrgencyMap[task.urgency].label}</Tag>
          <Tag color={pendingStatusMap[task.status].color}>{pendingStatusMap[task.status].label}</Tag>
          {hasDraftFromFill ? <Tag color='primary'>草稿中</Tag> : null}
        </div>

        <div style={{ marginTop: 6, fontSize: 12, color: '#666' }}>下发单位：{task.issuer}</div>
        <div style={{ marginTop: 4, fontSize: 12, color: '#666' }}>关联表单：{task.formCount} 个</div>

        <div
          style={{
            marginTop: 6,
            fontSize: 12,
            color: deadline.type === 'normal' ? '#666' : '#ff4d4f',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          {deadline.type !== 'normal' ? <ClockCircleOutline /> : null}
          {deadline.type === 'normal' ? `截止：${task.deadline}` : deadline.text}
        </div>

        {task.urgeCount > 0 ? (
          <div style={{ marginTop: 6, fontSize: 12, color: '#ff4d4f', display: 'flex', alignItems: 'center', gap: 4 }}>
            <BellOutline /> 催办次数：{task.urgeCount}
          </div>
        ) : null}

        <div style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          {task.status === 'rejected' ? (
            <Button
              size='small'
              onClick={() => {
                Dialog.alert({ title: '退回原因', content: task.rejectReason || '无' });
              }}
            >
              查看退回原因
            </Button>
          ) : null}
          <Button color='primary' size='small' onClick={() => navigate(`/m/data-report-fill/${task.id}`)}>
            {task.status === 'rejected' ? '重新上报' : '去上报'}
          </Button>
        </div>
      </Card>
    );
  };

  const renderSubmittedCard = (task: SubmittedReportItem) => {
    return (
      <Card key={task.id} style={{ borderRadius: 10, marginBottom: 10 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: '#333' }}>{task.taskName}</div>
        <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <Tag color={reviewStatusMap[task.reviewStatus].color}>{reviewStatusMap[task.reviewStatus].label}</Tag>
        </div>
        <div style={{ marginTop: 6, fontSize: 12, color: '#666' }}>下发单位：{task.issuer}</div>
        <div style={{ marginTop: 4, fontSize: 12, color: '#666' }}>提交时间：{task.submitTime}</div>
        <div style={{ marginTop: 4, fontSize: 12, color: '#666' }}>提交人：{task.submitter}</div>

        <div style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button
            size='small'
            onClick={() => {
              Dialog.alert({
                title: '查看详情',
                content: '移动端详情页开发中，敬请期待',
              });
            }}
          >
            查看详情
          </Button>
          <Button
            size='small'
            onClick={() => {
              Toast.show({ content: '导出功能开发中，敬请期待' });
            }}
          >
            导出
          </Button>
        </div>
      </Card>
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', paddingBottom: 62 }}>
      <NavBar onBack={() => navigate('/m/profile')} backArrow={<LeftOutline />}>数据上报</NavBar>

      <div style={{ padding: 12 }}>
        <Tabs
          activeKey={tab}
          onChange={(key) => setTab(key as 'pending' | 'submitted')}
          style={{ '--title-font-size': '14px' }}
        >
          <Tabs.Tab
            title={
              <Space>
                待上报
                <Badge content={pendingList.length} style={{ '--right': '-10px' }} />
              </Space>
            }
            key='pending'
          />
          <Tabs.Tab
            title={
              <Space>
                已上报
                <Badge content={submittedList.length} style={{ '--right': '-10px' }} />
              </Space>
            }
            key='submitted'
          />
        </Tabs>

        <div style={{ marginTop: 10 }}>
          {tab === 'pending' ? pendingList.map(renderPendingCard) : submittedList.map(renderSubmittedCard)}
        </div>

        <Card style={{ borderRadius: 10, marginTop: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 13, color: '#666' }}>任务列表已与PC端业务字段对齐</div>
            <Button
              size='mini'
              fill='outline'
              onClick={() => {
                Toast.show({ content: '已刷新' });
              }}
            >
              <RedoOutline /> 刷新
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DataReportTaskListPage;

