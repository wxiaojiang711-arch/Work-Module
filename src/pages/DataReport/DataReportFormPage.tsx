import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Collapse,
  DatePicker,
  Form,
  Input,
  Modal,
  Progress,
  Space,
  Tabs,
  Tag,
  Typography,
  Upload,
  message,
} from 'antd';
import {
  CheckCircleFilled,
  ClockCircleOutlined,
  CloseCircleFilled,
  DeleteOutlined,
  DownloadOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import type { UploadFile } from 'antd';
import dayjs from 'dayjs';
import { useNavigate, useParams } from 'react-router-dom';

import {
  aiParsedData,
  buildInitialFormData,
  currentUser,
  formFieldsConfig,
  getDeadlineState,
  getDraftKey,
  periodLabelMap,
  taskInfo,
  urgencyMap,
  type FormFieldKey,
  type ReportFormData,
} from '../../mobile/pages/reportFillMockData';
import styles from './DataReport.module.css';

interface DataReportFormPageProps {
  mode?: 'edit' | 'view';
}

type ParseStatus = 'idle' | 'uploading' | 'parsing' | 'success' | 'failed';

const groupOrder = ['基本信息', '本季度工作完成情况', '特色亮点', '存在问题与困难', '下季度工作计划'];

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

interface TaskFormTabConfig {
  key: string;
  label: string;
  groups: string[];
}

type TabAttachmentFiles = Record<string, UploadFile[]>;

const taskFormTabsMap: Record<string, TaskFormTabConfig[]> = {
  'task-001': [
    { key: 'quarter-overview', label: '季度总览表', groups: ['基本信息', '本季度工作完成情况'] },
    { key: 'highlight-problems', label: '亮点问题表', groups: ['基本信息', '特色亮点', '存在问题与困难'] },
    { key: 'next-plan', label: '下季度计划表', groups: ['基本信息', '下季度工作计划'] },
  ],
  'task-002': [
    { key: 'quarter-overview', label: '季度总览表', groups: ['基本信息', '本季度工作完成情况'] },
    { key: 'highlight-problems', label: '亮点问题表', groups: ['基本信息', '特色亮点', '存在问题与困难'] },
    { key: 'next-plan', label: '下季度计划表', groups: ['基本信息', '下季度工作计划'] },
  ],
};

const DataReportFormPage: React.FC<DataReportFormPageProps> = ({ mode = 'edit' }) => {
  const isView = mode === 'view';
  const navigate = useNavigate();
  const { taskId = taskInfo.id } = useParams<{ taskId: string }>();

  const [formData, setFormData] = useState<ReportFormData>(buildInitialFormData());
  const [savedSnapshot, setSavedSnapshot] = useState<string>(JSON.stringify(buildInitialFormData()));
  const [aiFilledKeys, setAiFilledKeys] = useState<Set<FormFieldKey>>(new Set());
  const [invalidKeys, setInvalidKeys] = useState<Set<FormFieldKey>>(new Set());
  const [parseStatus, setParseStatus] = useState<ParseStatus>('idle');
  const [parseProgress, setParseProgress] = useState(0);
  const [parsedFieldCount, setParsedFieldCount] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string } | null>(null);
  const [attachmentFilesByTab, setAttachmentFilesByTab] = useState<TabAttachmentFiles>({});
  const [activeFormTab, setActiveFormTab] = useState('default-form');

  const [conflictOpen, setConflictOpen] = useState(false);
  const [pendingPayload, setPendingPayload] = useState<Partial<ReportFormData> | null>(null);

  const fieldRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const draftKey = getDraftKey(taskId);
  const deadlineState = getDeadlineState(taskInfo.deadline);
  const today = dayjs().format('YYYY-MM-DD');

  const grouped = useMemo(() => {
    const map: Record<string, Array<(typeof formFieldsConfig)[number]>> = {
      基本信息: [],
      本季度工作完成情况: [],
      特色亮点: [],
      存在问题与困难: [],
      下季度工作计划: [],
    };
    formFieldsConfig.forEach((f) => map[f.group].push(f));
    return map;
  }, []);

  const requiredFields = useMemo(() => formFieldsConfig.filter((f) => f.required), []);
  const completedRequired = useMemo(
    () => requiredFields.filter((f) => String(formData[f.key] || '').trim()).length,
    [formData, requiredFields],
  );
  const progressPercent = Math.round((completedRequired / requiredFields.length) * 100);
  const formTabs = useMemo<TaskFormTabConfig[]>(
    () => taskFormTabsMap[taskId] ?? [{ key: 'default-form', label: '任务主表', groups: groupOrder }],
    [taskId],
  );
  const activeTabGroups = useMemo(() => {
    const activeTab = formTabs.find((tab) => tab.key === activeFormTab) ?? formTabs[0];
    return activeTab?.groups ?? groupOrder;
  }, [activeFormTab, formTabs]);
  const activeTabAttachmentFiles = attachmentFilesByTab[activeFormTab] ?? [];
  // const isAttachmentModeActive = !isView && activeTabAttachmentFiles.length > 0;

  useEffect(() => {
    const cached = localStorage.getItem(draftKey);
    if (!cached) return;
    try {
      const parsed = JSON.parse(cached) as {
        formData: ReportFormData;
        attachmentFilesByTab?: TabAttachmentFiles;
        attachmentFiles?: UploadFile[];
      };
      if (parsed?.formData) {
        setFormData(parsed.formData);
        setAttachmentFilesByTab(parsed.attachmentFilesByTab || { 'default-form': parsed.attachmentFiles || [] });
        setSavedSnapshot(JSON.stringify(parsed.formData));
        message.info('已恢复上次保存的草稿');
      }
    } catch {
      localStorage.removeItem(draftKey);
    }
  }, [draftKey]);

  useEffect(() => {
    setActiveFormTab(formTabs[0]?.key ?? 'default-form');
  }, [formTabs]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      localStorage.setItem(draftKey, JSON.stringify({ formData, attachmentFilesByTab }));
    }, 30000);
    return () => window.clearInterval(timer);
  }, [draftKey, formData, attachmentFilesByTab]);

  const saveDraft = (notify = true) => {
    localStorage.setItem(draftKey, JSON.stringify({ formData, attachmentFilesByTab }));
    setSavedSnapshot(JSON.stringify(formData));
    if (notify) message.success('草稿已保存');
  };

  const hasUnsavedChanges = JSON.stringify(formData) !== savedSnapshot;

  const handleBack = () => {
    if (!hasUnsavedChanges) {
      navigate('/report');
      return;
    }

    const modal = Modal.confirm({
      title: '当前有未保存的修改',
      content: '离开后未保存的内容将丢失',
      okText: '保存草稿并离开',
      cancelText: '取消',
      onOk: () => {
        saveDraft(false);
        navigate('/report');
      },
      footer: (_, { OkBtn, CancelBtn }) => (
        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
          <Button
            onClick={() => {
              modal.destroy();
              navigate('/report');
            }}
          >
            直接离开
          </Button>
          <CancelBtn />
          <OkBtn />
        </Space>
      ),
    });
  };

  const applyAiResult = (payload: Partial<ReportFormData>, mode: 'overwrite' | 'fill-empty') => {
    setFormData((prev) => {
      const next = { ...prev };
      const filled: FormFieldKey[] = [];
      (Object.keys(payload) as FormFieldKey[]).forEach((k) => {
        const incoming = String(payload[k] ?? '');
        if (mode === 'overwrite') {
          next[k] = incoming;
          filled.push(k);
          return;
        }
        if (!String(prev[k] || '').trim()) {
          next[k] = incoming;
          filled.push(k);
        }
      });
      setParsedFieldCount(filled.length);
      setAiFilledKeys((old) => new Set([...Array.from(old), ...filled]));
      return next;
    });
  };

  const beginParse = () => {
    const payload = aiParsedData as Partial<ReportFormData>;
    const hasManualInput = Object.values(formData).some((v) => String(v).trim());

    if (hasManualInput) {
      setPendingPayload(payload);
      setConflictOpen(true);
      return;
    }

    applyAiResult(payload, 'overwrite');
    setParseStatus('success');
  };

  const handlePickParseFile = (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext || !['doc', 'docx', 'xls', 'xlsx'].includes(ext)) {
      message.error('仅支持 .doc .docx .xls .xlsx');
      return;
    }

    setUploadedFile({ name: file.name, size: `${(file.size / 1024 / 1024).toFixed(2)}MB` });
    setParseStatus('uploading');
    setParseProgress(0);

    let p = 0;
    const timer = window.setInterval(() => {
      p += 20;
      setParseProgress(Math.min(100, p));
      if (p >= 100) {
        window.clearInterval(timer);
        setParseStatus('parsing');
        window.setTimeout(() => {
          const shouldFail = Math.random() < 0.1;
          if (shouldFail) {
            setParseStatus('failed');
            return;
          }
          beginParse();
        }, 3000);
      }
    }, 220);
  };

  const requiredMissing = () =>
    requiredFields.map((f) => f.key).filter((k) => !String(formData[k] || '').trim()) as FormFieldKey[];

  const submit = async () => {
    const missing = requiredMissing();
    if (missing.length) {
      setInvalidKeys(new Set(missing));
      message.error('请填写所有必填项');
      fieldRefs.current[missing[0]]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setInvalidKeys(new Set());
    Modal.confirm({
      title: '确认提交上报？提交后在审核前可撤回修改。',
      okText: '确认提交',
      cancelText: '取消',
      onOk: () => {
        message.success('提交成功');
        window.setTimeout(() => navigate('/report'), 1000);
      },
    });
  };

  return (
    <div className={styles.page}>
      <Card className={styles.formCard}>
        <Collapse
          items={[
            {
              key: 'task',
              label: (
                <div>
                  <div style={{ fontSize: 15, fontWeight: 500 }}>{taskInfo.name}</div>
                  <div
                    style={{
                      marginTop: 6,
                      fontSize: 13,
                      color: deadlineState.type === 'normal' ? '#666' : '#ff4d4f',
                    }}
                  >
                    {deadlineState.type !== 'normal' ? <ClockCircleOutlined style={{ marginRight: 4 }} /> : null}
                    {deadlineState.type === 'normal' ? `截止时间：${taskInfo.deadline}` : deadlineState.text}
                  </div>
                </div>
              ),
              children: (
                <div style={{ lineHeight: 1.9, color: '#666' }}>
                  <div>下发单位：{taskInfo.issuer}</div>
                  <div>
                    紧急程度：
                    <Tag color={urgencyMap[taskInfo.urgency as keyof typeof urgencyMap].color}>
                      {urgencyMap[taskInfo.urgency as keyof typeof urgencyMap].label}
                    </Tag>
                  </div>
                  <div>任务描述：{taskInfo.description}</div>
                  <div>
                    填报说明附件：
                    <Button type='link'>{taskInfo.attachment?.name}</Button>
                  </div>
                </div>
              ),
            },
          ]}
        />

        <Tabs
          activeKey={activeFormTab}
          onChange={setActiveFormTab}
          style={{ marginTop: 12 }}
          items={formTabs.map((tab) => ({
            key: tab.key,
            label: tab.label,
          }))}
        />

        <div className={styles.tabUploadEntry}>
          <div className={styles.tabUploadHeader}>
            <span className={styles.tabUploadTitle}>附件上报</span>
            <span className={styles.tabUploadHint}>一键上传附件，AI自动解析</span>
          </div>
          <Upload
            disabled={isView}
            multiple
            beforeUpload={() => false}
            fileList={activeTabAttachmentFiles}
            onPreview={(file) => {
              const url = file.url || (file.originFileObj ? URL.createObjectURL(file.originFileObj) : '');
              if (!url) {
                message.warning('当前文件暂不支持预览');
                return;
              }
              window.open(url, '_blank', 'noopener,noreferrer');
            }}
            showUploadList={{ showPreviewIcon: true, showRemoveIcon: true }}
            onChange={({ fileList }) => {
              setAttachmentFilesByTab((prev) => ({ ...prev, [activeFormTab]: fileList }));
            }}
          >
            <Button icon={<UploadOutlined />}>上传附件</Button>
          </Upload>
        </div>

        <div className={styles.formSection}>
          <Form layout='vertical' style={{ marginTop: 16 }}>
          {activeTabGroups.map((groupName, groupIndex) => (
            <div key={groupName}>
              <div style={{ marginTop: groupIndex === 0 ? 0 : 20, marginBottom: 12, fontSize: 15, fontWeight: 500 }}>
                {groupIndex + 1 === 1 ? '第一组：' : groupIndex + 1 === 2 ? '第二组：' : groupIndex + 1 === 3 ? '第三组：' : groupIndex + 1 === 4 ? '第四组：' : '第五组：'}
                {groupName}
              </div>

              {groupName === '基本信息' ? (
                <>
                  <Form.Item label='填报单位'>
                    <Input value={currentUser.orgName} disabled style={{ background: '#f5f5f5' }} />
                  </Form.Item>
                  <Form.Item label='填报人'>
                    <Input value={currentUser.name} disabled style={{ background: '#f5f5f5' }} />
                  </Form.Item>
                  <Form.Item label='填报日期'>
                    <Input value={today} disabled style={{ background: '#f5f5f5' }} />
                  </Form.Item>
                </>
              ) : null}

              {grouped[groupName].map((field) => {
                const key = field.key;
                const value = formData[key] || '';
                const maxLen = field.maxLength || 0;
                const count = value.length;
                const ratio = maxLen ? count / maxLen : 0;
                const countColor = maxLen && count >= maxLen ? '#ff4d4f' : ratio > 0.9 ? '#fa8c16' : '#bfbfbf';
                const invalid = invalidKeys.has(key);

                if (key === 'reportPeriod') {
                  return (
                    <div key={key} ref={(el) => { fieldRefs.current[key] = el; }} style={{ position: 'relative' }}>
                      <Form.Item label={<span>{field.required ? <span style={{ color: '#ff4d4f', marginRight: 4 }}>*</span> : null}{field.label}</span>}>
                        <select
                          disabled={isView /* || isAttachmentModeActive */}
                          value={value}
                          onChange={(e) => {
                            setFormData((prev) => ({ ...prev, reportPeriod: e.target.value }));
                            setInvalidKeys((prev) => {
                              const next = new Set(prev);
                              next.delete('reportPeriod');
                              return next;
                            });
                          }}
                          style={{
                            width: '100%',
                            height: 36,
                            borderRadius: 8,
                            border: `1px solid ${invalid ? '#ff4d4f' : '#e8e8e8'}`,
                            padding: '0 10px',
                          }}
                        >
                          <option value=''>请选择报告期间</option>
                          <option value='2024-Q1'>2024年第一季度</option>
                          <option value='2024-Q2'>2024年第二季度</option>
                          <option value='2024-Q3'>2024年第三季度</option>
                          <option value='2024-Q4'>2024年第四季度</option>
                        </select>
                      </Form.Item>
                      {aiFilledKeys.has(key) ? (
                        <span style={{ position: 'absolute', top: 4, right: 4, fontSize: 10, background: '#e6f7ff', color: '#1890ff', borderRadius: 4, padding: '1px 6px' }}>
                          AI填充
                        </span>
                      ) : null}
                    </div>
                  );
                }

                return (
                  <div key={key} ref={(el) => { fieldRefs.current[key] = el; }} style={{ position: 'relative' }}>
                    <Form.Item label={<span>{field.required ? <span style={{ color: '#ff4d4f', marginRight: 4 }}>*</span> : null}{field.label}</span>}>
                      <Input.TextArea
                        disabled={isView /* || isAttachmentModeActive */}
                        autoSize={{ minRows: 4, maxRows: 10 }}
                        maxLength={maxLen}
                        value={value}
                        placeholder={placeholderMap[key]}
                        onChange={(e) => {
                          const v = e.target.value;
                          setFormData((prev) => ({ ...prev, [key]: v }));
                          setInvalidKeys((prev) => {
                            const next = new Set(prev);
                            next.delete(key);
                            return next;
                          });
                        }}
                        style={{
                          borderRadius: 8,
                          borderColor: invalid ? '#ff4d4f' : '#e8e8e8',
                        }}
                      />
                      <div style={{ textAlign: 'right', fontSize: 12, color: countColor }}>{count}/{maxLen}</div>
                    </Form.Item>
                    {aiFilledKeys.has(key) ? (
                      <span style={{ position: 'absolute', top: 4, right: 4, fontSize: 10, background: '#e6f7ff', color: '#1890ff', borderRadius: 4, padding: '1px 6px' }}>
                        AI填充
                      </span>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ))}
          </Form>
          {/* {isAttachmentModeActive ? (
            <div className={styles.formMask}>
              <div className={styles.formMaskTitle}>当前为“附件上报”模式</div>
              <div className={styles.formMaskDesc}>已上传附件后不可继续在线填表；如需恢复填报，请先删除当前标签下的附件。</div>
            </div>
          ) : null} */}
        </div>
      </Card>

      {!isView ? (
        <div className={styles.stickyFooter}>
          <Space>
            <Button style={{ width: 140 }} onClick={() => saveDraft(true)}>暂存草稿</Button>
            <Button type='primary' style={{ width: 220 }} onClick={submit}>提交上报</Button>
            <Button onClick={handleBack}>返回</Button>
          </Space>
        </div>
      ) : (
        <div className={styles.stickyFooter}>
          <Button icon={<DownloadOutlined />} onClick={() => message.info('导出功能开发中')}>
            导出
          </Button>
        </div>
      )}

      <Modal
        open={conflictOpen}
        title='检测到部分字段已填写'
        onCancel={() => {
          setConflictOpen(false);
          setParseStatus('idle');
          setUploadedFile(null);
        }}
        footer={[
          <Button
            key='overwrite'
            type='primary'
            onClick={() => {
              if (pendingPayload) applyAiResult(pendingPayload, 'overwrite');
              setConflictOpen(false);
              setParseStatus('success');
            }}
          >
            覆盖全部
          </Button>,
          <Button
            key='fill-empty'
            onClick={() => {
              if (pendingPayload) applyAiResult(pendingPayload, 'fill-empty');
              setConflictOpen(false);
              setParseStatus('success');
            }}
          >
            仅填充空白字段
          </Button>,
          <Button
            key='cancel'
            onClick={() => {
              setConflictOpen(false);
              setParseStatus('idle');
              setUploadedFile(null);
            }}
          >
            取消
          </Button>,
        ]}
      >
        是否用解析结果覆盖已填写的内容？
      </Modal>
    </div>
  );
};

export default DataReportFormPage;
