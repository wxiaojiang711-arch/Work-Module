import React, { useMemo } from 'react';
import { DatePicker, Dialog, Form, Tag, TextArea } from 'antd-mobile';
import dayjs from 'dayjs';

import {
  currentUser,
  formFieldsConfig,
  periodLabelMap,
  periodOptions,
  type FormFieldKey,
  type ReportFormData,
} from './reportFillMockData';

type ReportFormProps = {
  formData: ReportFormData;
  aiFilledKeys: Set<FormFieldKey>;
  invalidKeys: Set<FormFieldKey>;
  fieldRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
  onFieldChange: (key: FormFieldKey, value: string) => void;
  attachFiles: Array<{ id: string; name: string; size: string }>;
  onAddAttachFiles: (files: Array<{ id: string; name: string; size: string }>) => void;
  onDeleteAttachFile: (id: string) => void;
};

const groupOrder = ['基本信息', '本季度工作完成情况', '特色亮点', '存在问题与困难', '下季度工作计划', '附件上传'];

const placeholderMap: Partial<Record<FormFieldKey, string>> = {
  keyWorkCompletion: '请详细描述本季度重点工作的完成情况，包括目标达成度、关键节点完成情况等',
  quantitativeIndicators: '请列举本季度主要量化指标的完成数据，如任务完成数、完成率、同比增长等',
  keyProjectProgress: '如有重点项目，请描述项目进展、投资完成情况、存在问题等',
  budgetExecution: '请说明本季度相关经费的使用情况，包括预算执行率、主要支出方向等',
  innovationHighlights: '请描述本季度工作中的创新做法、典型经验或突出成效',
  honorsAndAwards: '如有获得上级表彰、媒体报道等情况，请简要说明',
  mainProblems: '请客观分析本季度工作中遇到的主要问题、困难和不足',
  causeAnalysis: '请分析产生上述问题的主要原因',
  keyWorkPlan: '请列出下季度的重点工作计划和目标',
  resourceSupport: '请说明下季度工作推进中预计需要的人力、资金、政策等资源支持',
  coordinationMatters: '如需上级部门或其他单位协调支持的事项，请具体说明',
};

const GroupTitle: React.FC<{ title: string }> = ({ title }) => (
  <div style={{ borderLeft: '3px solid #1890ff', paddingLeft: 10, fontSize: 15, fontWeight: 500, color: '#333', marginTop: 20, marginBottom: 12 }}>
    {title}
  </div>
);

const FieldLabel: React.FC<{ title: string; required?: boolean }> = ({ title, required }) => (
  <span>{required ? <span style={{ color: '#ff4d4f', fontSize: 14, marginRight: 4 }}>*</span> : null}{title}</span>
);

const ReportForm: React.FC<ReportFormProps> = ({
  formData,
  aiFilledKeys,
  invalidKeys,
  fieldRefs,
  onFieldChange,
  attachFiles,
  onAddAttachFiles,
  onDeleteAttachFile,
}) => {
  const grouped = useMemo(() => {
    const map: Record<string, Array<(typeof formFieldsConfig)[number]>> = {
      基本信息: [],
      本季度工作完成情况: [],
      特色亮点: [],
      存在问题与困难: [],
      下季度工作计划: [],
      附件上传: [],
    };
    formFieldsConfig.forEach((f) => {
      map[f.group].push(f);
    });
    return map;
  }, []);

  const nowDate = dayjs().format('YYYY-MM-DD');

  return (
    <div style={{ padding: '0 16px 90px' }}>
      <Form layout='horizontal'>
        {groupOrder.map((group) => {
          if (group === '附件上传') {
            return (
              <div key={group}>
                <GroupTitle title='第六组：附件上传' />
                <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e8e8e8', padding: 12 }}>
                  <div style={{ fontSize: 14, color: '#333', marginBottom: 8 }}>补充材料</div>
                  <div style={{ fontSize: 12, color: '#999', marginBottom: 8 }}>可上传佐证材料、数据表格、图片等补充文件，单文件不超过50MB</div>
                  <input
                    type='file'
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files ?? []).map((f) => ({
                        id: `attach-${Date.now()}-${Math.random()}`,
                        name: f.name,
                        size: `${(f.size / 1024 / 1024).toFixed(2)}MB`,
                      }));
                      if (files.length) onAddAttachFiles(files);
                      e.currentTarget.value = '';
                    }}
                  />
                  <div style={{ marginTop: 10 }}>
                    {attachFiles.map((f) => (
                      <div key={f.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
                        <span style={{ color: '#333' }}>{f.name}（{f.size}）</span>
                        <span style={{ color: '#ff4d4f', cursor: 'pointer' }} onClick={() => onDeleteAttachFile(f.id)}>删除</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          }

          const title = group === '基本信息' ? '第一组：基本信息' : group === '本季度工作完成情况' ? '第二组：本季度工作完成情况' : group === '特色亮点' ? '第三组：特色亮点' : group === '存在问题与困难' ? '第四组：存在问题与困难' : '第五组：下季度工作计划';

          return (
            <div key={group}>
              <GroupTitle title={title} />

              {group === '基本信息' ? (
                <>
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 13, color: '#666', marginBottom: 6 }}>填报单位</div>
                    <div style={{ background: '#f5f5f5', borderRadius: 8, padding: '10px 12px', fontSize: 14, color: '#666' }}>{currentUser.orgName}</div>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 13, color: '#666', marginBottom: 6 }}>填报人</div>
                    <div style={{ background: '#f5f5f5', borderRadius: 8, padding: '10px 12px', fontSize: 14, color: '#666' }}>{currentUser.name}</div>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 13, color: '#666', marginBottom: 6 }}>填报日期</div>
                    <div style={{ background: '#f5f5f5', borderRadius: 8, padding: '10px 12px', fontSize: 14, color: '#666' }}>{nowDate}</div>
                  </div>
                </>
              ) : null}

              {grouped[group].map((field) => {
                const key = field.key;
                const value = formData[key] ?? '';
                const maxLen = field.maxLength || 0;
                const count = value.length;
                const ratio = maxLen ? count / maxLen : 0;
                const countColor = maxLen && count >= maxLen ? '#ff4d4f' : ratio > 0.9 ? '#fa8c16' : '#bfbfbf';
                const invalid = invalidKeys.has(key);

                if (key === 'reportPeriod') {
                  return (
                    <div key={key} ref={(el) => { fieldRefs.current[key] = el; }} style={{ marginBottom: 12, position: 'relative' }}>
                      <div style={{ fontSize: 13, color: '#666', marginBottom: 6 }}><FieldLabel title={field.label} required={field.required} /></div>
                      {aiFilledKeys.has(key) ? <Tag style={{ position: 'absolute', top: 4, right: 4, fontSize: 10, background: '#e6f7ff', color: '#1890ff', borderRadius: 4, padding: '1px 6px' }}>AI填充</Tag> : null}
                      <DatePicker
                        precision='year'
                        value={null}
                        title='选择报告期间'
                        onConfirm={() => {}}
                      >
                        {(items) => (
                          <div
                            onClick={() => {
                              Dialog.show({
                                title: '选择报告期间',
                                content: (
                                  <div>
                                    {periodOptions[0].map((op) => (
                                      <div
                                        key={op.value}
                                        style={{ padding: '10px 0', borderBottom: '1px solid #f0f0f0', cursor: 'pointer' }}
                                        onClick={() => {
                                          onFieldChange('reportPeriod', op.value);
                                          Dialog.clear();
                                        }}
                                      >
                                        {op.label}
                                      </div>
                                    ))}
                                  </div>
                                ),
                                closeOnAction: true,
                              });
                            }}
                            style={{
                              background: '#fff',
                              borderRadius: 8,
                              border: `1px solid ${invalid ? '#ff4d4f' : '#e8e8e8'}`,
                              padding: '10px 12px',
                              fontSize: 14,
                              color: value ? '#333' : '#999',
                            }}
                          >
                            {value ? periodLabelMap[value] : '请选择报告期间'}
                          </div>
                        )}
                      </DatePicker>
                    </div>
                  );
                }

                return (
                  <div key={key} ref={(el) => { fieldRefs.current[key] = el; }} style={{ marginBottom: 12, position: 'relative' }}>
                    <div style={{ fontSize: 13, color: '#666', marginBottom: 6 }}><FieldLabel title={field.label} required={field.required} /></div>
                    {aiFilledKeys.has(key) ? <Tag style={{ position: 'absolute', top: 4, right: 4, fontSize: 10, background: '#e6f7ff', color: '#1890ff', borderRadius: 4, padding: '1px 6px' }}>AI填充</Tag> : null}
                    <TextArea
                      value={value}
                      onChange={(v) => onFieldChange(key, v)}
                      placeholder={placeholderMap[key]}
                      autoSize={{ minRows: 4, maxRows: 10 }}
                      maxLength={maxLen}
                      style={{
                        '--font-size': '14px',
                        '--placeholder-color': '#999',
                        background: '#fff',
                        borderRadius: 8,
                        border: `1px solid ${invalid ? '#ff4d4f' : '#e8e8e8'}`,
                        padding: 8,
                      }}
                    />
                    <div style={{ fontSize: 12, color: countColor, textAlign: 'right', marginTop: 4 }}>{count}/{maxLen}</div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </Form>
    </div>
  );
};

export default ReportForm;
