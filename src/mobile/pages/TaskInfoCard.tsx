import React from 'react';
import { Collapse, Tag } from 'antd-mobile';
import { ClockCircleOutline } from 'antd-mobile-icons';

import { getDeadlineState, urgencyMap, type taskInfo as TaskInfoType } from './reportFillMockData';

type TaskInfoCardProps = {
  taskInfo: typeof import('./reportFillMockData').taskInfo;
};

const TaskInfoCard: React.FC<TaskInfoCardProps> = ({ taskInfo }) => {
  const deadlineState = getDeadlineState(taskInfo.deadline);

  return (
    <div style={{ margin: '12px 16px', background: '#fff', borderRadius: 8, padding: 12 }}>
      <Collapse defaultActiveKey={[]}>
        <Collapse.Panel
          key='task-info'
          title={
            <div>
              <div style={{ fontSize: 15, fontWeight: 500, color: '#333' }}>{taskInfo.name}</div>
              <div
                style={{
                  marginTop: 6,
                  fontSize: 13,
                  color: deadlineState.type === 'normal' ? '#666' : '#ff4d4f',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                {deadlineState.type !== 'normal' ? <ClockCircleOutline /> : null}
                {deadlineState.type === 'normal' ? `截止时间：${taskInfo.deadline}` : deadlineState.text}
              </div>
            </div>
          }
        >
          <div style={{ fontSize: 13, color: '#666', lineHeight: 1.8 }}>
            <div>下发单位：{taskInfo.issuer}</div>
            <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
              紧急程度：
              <Tag color={urgencyMap[taskInfo.urgency as keyof typeof urgencyMap].color}>
                {urgencyMap[taskInfo.urgency as keyof typeof urgencyMap].label}
              </Tag>
            </div>
            <div style={{ marginTop: 6 }}>任务描述：{taskInfo.description}</div>
            {taskInfo.attachment ? (
              <div style={{ marginTop: 6 }}>
                上报说明附件：
                <span style={{ color: '#1677ff', cursor: 'pointer' }}>{taskInfo.attachment.name}（{taskInfo.attachment.size}）</span>
              </div>
            ) : null}
          </div>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

export default TaskInfoCard;
