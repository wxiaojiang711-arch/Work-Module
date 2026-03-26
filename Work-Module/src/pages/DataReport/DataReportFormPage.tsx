import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Breadcrumb,
  Button,
  Card,
  Collapse,
  DatePicker,
  Dropdown,
  Form,
  Input,
  MenuProps,
  Modal,
  Progress,
  Space,
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
  MoreOutlined,
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
  const [attachmentFiles, setAttachmentFiles] = useState<UploadFile[]>([]);

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

  useEffect(() => {
    const cached = localStorage.getItem(draftKey);
    if (!cached) return;
    try {
      const parsed = JSON.parse(cached) as { formData: ReportFormData; attachmentFiles: UploadFile[] };
      if (parsed?.formData) {
        setFormData(parsed.formData);
        setAttachmentFiles(parsed.attachmentFiles || []);
        setSavedSnapshot(JSON.stringify(parsed.formData));
        message.info('已恢复上次保存的草稿');
      }
    } catch {
      localStorage.removeItem(draftKey);
    }
  }, [draftKey]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      localStorage.setItem(draftKey, JSON.stringify({ formData, attachmentFiles }));
    }, 30000);
    return () => window.clearInterval(timer);
  }, [draftKey, formData, attachmentFiles]);

  const saveDraft = (notify = true) => {
    localStorage.setItem(draftKey, JSON.stringify({ formData, attachmentFiles }));
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

  const clearForm = () => {
    Modal.confirm({
      title: '确认清空所有已填写的内容？',
      okText: '确认清空',
      cancelText: '取消',
      onOk: () => {
        setFormData(buildInitialFormData());
        setAiFilledKeys(new Set());
        setInvalidKeys(new Set());
        setParseStatus('idle');
        setParseProgress(0);
        setParsedFieldCount(0);
        setUploadedFile(null);
      },
    });
  };

  const moreItems: MenuProps['items'] = [
    {
      key: 'instruction',
      label: '查看填报说明',
      onClick: () => Modal.info({ title: '填报说明', content: taskInfo.description }),
    },
    {
      key: 'tpl',
      label: '下载附件模板',
      onClick: () => message.info('模板下载功能开发中'),
    },
    {
      key: 'clear',
      label: <span style={{ color: '#ff4d4f' }}>清空表单</span>,
      onClick: clearForm,
    },
  ];

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
      <Breadcrumb items={[{ title: '数据上报' }, { title: taskInfo.name }]} style={{ marginBottom: 12 }} />

      <Card
        className={styles.formCard}
        title='数据上报'
        extra={
          <Space>
            <Button onClick={handleBack}>返回</Button>
            <Dropdown menu={{ items: moreItems }} trigger={['click']}>
              <Button icon={<MoreOutlined />} />
            </Dropdown>
          </Space>
        }
      >
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

        <div style={{ padding: '8px 0 0', marginBottom: 12 }}>
          <div style={{ fontSize: 13, color: progressPercent === 100 ? '#52c41a' : '#999', marginBottom: 6 }}>
            {progressPercent === 100 ? '✅ 已填写完毕，可提交' : `填报进度：${completedRequired}/${requiredFields.length}（${progressPercent}%）`}
          </div>
          <Progress percent={progressPercent} showInfo={false} strokeColor={progressPercent === 100 ? '#52c41a' : '#1890ff'} />
        </div>

        <div style={{ marginBottom: 16 }}>
          {parseStatus === 'idle' ? (
            <Upload.Dragger
              disabled={isView}
              accept='.doc,.docx,.xls,.xlsx'
              beforeUpload={(file) => {
                handlePickParseFile(file as File);
                return false;
              }}
              showUploadList={false}
              style={{ background: '#fafafa', border: '1px dashed #d9d9d9', borderRadius: 8 }}
            >
              <UploadOutlined style={{ fontSize: 30, color: '#1890ff' }} />
              <div style={{ marginTop: 8, fontSize: 14 }}>上传文件，AI自动解析填充表单</div>
              <div style={{ marginTop: 4, fontSize: 12, color: '#999' }}>支持 .doc .docx .xls .xlsx 格式</div>
            </Upload.Dragger>
          ) : null}

          {parseStatus === 'uploading' ? (
            <Card size='small'>
              <div>{uploadedFile?.name}</div>
              <div style={{ color: '#999', fontSize: 12 }}>{uploadedFile?.size}</div>
              <Progress percent={parseProgress} showInfo={false} style={{ marginTop: 8 }} />
              <div style={{ marginTop: 4, fontSize: 12, color: '#999' }}>正在上传...</div>
            </Card>
          ) : null}

          {parseStatus === 'parsing' ? (
            <Alert showIcon type='info' message='AI正在解析文件内容...' style={{ marginTop: 8 }} />
          ) : null}

          {parseStatus === 'success' ? (
            <div style={{ background: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 8, padding: 12 }}>
              <Space style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Space>
                  <CheckCircleFilled style={{ color: '#52c41a' }} />
                  <span style={{ color: '#389e0d' }}>解析完成，已自动填充 {parsedFieldCount} 个字段</span>
                </Space>
                {!isView ? (
                  <Button
                    danger
                    type='link'
                    icon={<DeleteOutlined />}
                    onClick={() => {
                      setParseStatus('idle');
                      setUploadedFile(null);
                      setAiFilledKeys(new Set());
                    }}
                  >
                    删除
                  </Button>
                ) : null}
              </Space>
              <div style={{ marginTop: 6, fontSize: 12, color: '#666' }}>{uploadedFile?.name} · {uploadedFile?.size}</div>
            </div>
          ) : null}

          {parseStatus === 'failed' ? (
            <div style={{ background: '#fff2f0', border: '1px solid #ffccc7', borderRadius: 8, padding: 12 }}>
              <Space>
                <CloseCircleFilled style={{ color: '#ff4d4f' }} />
                <span style={{ color: '#cf1322' }}>解析失败，请检查文件格式或手动填写</span>
              </Space>
              {!isView ? (
                <div style={{ marginTop: 8 }}>
                  <Button
                    onClick={() => {
                      setParseStatus('idle');
                    }}
                  >
                    重新上传
                  </Button>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        <Form layout='vertical'>
          {groupOrder.map((groupName, groupIndex) => (
            <div key={groupName}>
              <div style={{ borderLeft: '3px solid #1890ff', paddingLeft: 10, marginTop: groupIndex === 0 ? 0 : 20, marginBottom: 12, fontSize: 15, fontWeight: 500 }}>
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
                          disabled={isView}
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
                        disabled={isView}
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

          <div style={{ borderLeft: '3px solid #1890ff', paddingLeft: 10, marginTop: 20, marginBottom: 12, fontSize: 15, fontWeight: 500 }}>
            第六组：附件上传
          </div>
          <Upload
            disabled={isView}
            multiple
            beforeUpload={() => false}
            fileList={attachmentFiles}
            onChange={({ fileList }) => setAttachmentFiles(fileList)}
          >
            <Button icon={<UploadOutlined />}>上传补充材料</Button>
          </Upload>
          <div style={{ fontSize: 12, color: '#999', marginTop: 6 }}>
            可上传佐证材料、数据表格、图片等补充文件，单文件不超过50MB
          </div>
        </Form>
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
