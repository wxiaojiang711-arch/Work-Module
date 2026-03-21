import React, { useEffect, useMemo, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { ActionSheet, Button, Dialog, NavBar, ProgressBar, Toast } from 'antd-mobile';
import { LeftOutline, MoreOutline } from 'antd-mobile-icons';
import { useNavigate, useParams } from 'react-router-dom';

import FileUploadParser from './FileUploadParser';
import ReportForm from './ReportForm';
import TaskInfoCard from './TaskInfoCard';
import {
  buildInitialFormData,
  formFieldsConfig,
  getDraftKey,
  periodLabelMap,
  taskInfo,
  type FormFieldKey,
  type ReportFormData,
} from './reportFillMockData';

type ParseStatus = 'idle' | 'uploading' | 'parsing' | 'success' | 'failed';

type UploadedFile = {
  name: string;
  size: string;
};

type AttachFile = {
  id: string;
  name: string;
  size: string;
};

const DataReportFillPage: React.FC = () => {
  const navigate = useNavigate();
  const { taskId = taskInfo.id } = useParams<{ taskId: string }>();

  const [formData, setFormData] = useState<ReportFormData>(buildInitialFormData());
  const [savedSnapshot, setSavedSnapshot] = useState<string>(JSON.stringify(buildInitialFormData()));
  const [aiFilledKeys, setAiFilledKeys] = useState<Set<FormFieldKey>>(new Set());
  const [invalidKeys, setInvalidKeys] = useState<Set<FormFieldKey>>(new Set());
  const [parseStatus, setParseStatus] = useState<ParseStatus>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [attachFiles, setAttachFiles] = useState<AttachFile[]>([]);

  const fieldRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const requiredFields = useMemo(() => formFieldsConfig.filter((f) => f.required), []);

  const completedRequired = useMemo(
    () => requiredFields.filter((f) => (formData[f.key] || '').trim()).length,
    [formData, requiredFields]
  );

  const progressPercent = Math.round((completedRequired / requiredFields.length) * 100);
  const draftKey = getDraftKey(taskId);

  useEffect(() => {
    const cached = localStorage.getItem(draftKey);
    if (!cached) return;
    try {
      const parsed = JSON.parse(cached) as { formData: ReportFormData; attachFiles: AttachFile[] };
      if (parsed?.formData) {
        setFormData(parsed.formData);
        setAttachFiles(parsed.attachFiles || []);
        setSavedSnapshot(JSON.stringify(parsed.formData));
        Toast.show({ content: '已恢复上次保存的草稿' });
      }
    } catch {
      localStorage.removeItem(draftKey);
    }
  }, [draftKey]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      localStorage.setItem(draftKey, JSON.stringify({ formData, attachFiles }));
    }, 30000);
    return () => window.clearInterval(timer);
  }, [draftKey, formData, attachFiles]);

  const saveDraft = (showToast = true) => {
    localStorage.setItem(draftKey, JSON.stringify({ formData, attachFiles }));
    setSavedSnapshot(JSON.stringify(formData));
    if (showToast) Toast.show({ content: '草稿已保存' });
  };

  const hasUnsavedChanges = useMemo(() => JSON.stringify(formData) !== savedSnapshot, [formData, savedSnapshot]);

  const handleBack = async () => {
    if (!hasUnsavedChanges) {
      navigate('/m/data-report');
      return;
    }

    const choice = await new Promise<'save' | 'leave' | 'cancel'>((resolve) => {
      Dialog.show({
        title: '当前有未保存的修改',
        content: '离开后未保存的内容将丢失',
        closeOnMaskClick: false,
        actions: [
          [
            { key: 'save', text: '保存草稿并离开', bold: true, onClick: () => resolve('save') },
            { key: 'leave', text: '直接离开', danger: true, onClick: () => resolve('leave') },
          ],
          [{ key: 'cancel', text: '取消', onClick: () => resolve('cancel') }],
        ],
      });
    });

    if (choice === 'save') {
      saveDraft(false);
      navigate('/m/data-report');
    }
    if (choice === 'leave') navigate('/m/data-report');
  };

  const clearForm = async () => {
    const ok = await Dialog.confirm({
      content: '确认清空所有已填写的内容？',
      confirmText: '清空',
      cancelText: '取消',
    });
    if (!ok) return;

    setFormData(buildInitialFormData());
    setAiFilledKeys(new Set());
    setInvalidKeys(new Set());
    setAttachFiles([]);
    setParseStatus('idle');
    setUploadedFile(null);
    setUploadProgress(0);
  };

  const openActions = () => {
    ActionSheet.show({
      actions: [
        { key: 'instruction', text: '查看填报说明' },
        { key: 'template', text: '下载附件模板' },
        { key: 'clear', text: '清空表单', danger: true },
      ],
      cancelText: '取消',
      onAction: async (action) => {
        if (action.key === 'instruction') {
          Dialog.alert({ title: '填报说明', content: taskInfo.description });
        }
        if (action.key === 'template') {
          Toast.show({ content: '模板下载功能开发中' });
        }
        if (action.key === 'clear') {
          await clearForm();
        }
      },
    });
  };

  const handleAiFill = (payload: Partial<ReportFormData>, mode: 'overwrite' | 'fill-empty') => {
    setFormData((prev) => {
      const next = { ...prev };
      const aiKeys = new Set<FormFieldKey>();
      (Object.keys(payload) as FormFieldKey[]).forEach((k) => {
        const incoming = String(payload[k] ?? '');
        if (mode === 'overwrite') {
          next[k] = incoming;
          aiKeys.add(k);
          return;
        }
        if (!String(prev[k] ?? '').trim()) {
          next[k] = incoming;
          aiKeys.add(k);
        }
      });
      setAiFilledKeys((old) => new Set([...Array.from(old), ...Array.from(aiKeys)]));
      return next;
    });
  };

  const validateRequired = (): FormFieldKey[] => {
    const missing = requiredFields
      .map((f) => f.key)
      .filter((key) => !String(formData[key] || '').trim()) as FormFieldKey[];
    return missing;
  };

  const submit = async () => {
    const missing = validateRequired();
    if (missing.length) {
      const set = new Set<FormFieldKey>(missing);
      setInvalidKeys(set);
      Toast.show({ content: '请填写所有必填项' });
      const first = missing[0];
      fieldRefs.current[first]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setInvalidKeys(new Set());
    const ok = await Dialog.confirm({
      content: '确认提交上报？提交后在审核前可撤回修改。',
      confirmText: '确认提交',
      cancelText: '取消',
    });
    if (!ok) return;

    Toast.show({ content: '提交成功' });
    window.setTimeout(() => navigate('/m/data-report'), 1000);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', paddingBottom: 84 }}>
      <div style={{ height: 44, borderBottom: '1px solid #f0f0f0', background: '#fff' }}>
        <NavBar backArrow={<LeftOutline />} onBack={handleBack} right={<MoreOutline onClick={openActions} />}>数据上报</NavBar>
      </div>

      <TaskInfoCard taskInfo={taskInfo} />

      <div style={{ padding: '0 16px', marginBottom: 12 }}>
        <div style={{ fontSize: 13, color: progressPercent === 100 ? '#52c41a' : '#999', marginBottom: 8 }}>
          {progressPercent === 100
            ? '✅ 已填写完毕，可提交'
            : `填报进度：${completedRequired}/${requiredFields.length}（${progressPercent}%）`}
        </div>
        <ProgressBar percent={progressPercent / 100} style={{ '--fill-color': progressPercent === 100 ? '#52c41a' : '#1890ff' }} />
      </div>

      <FileUploadParser
        parseStatus={parseStatus}
        uploadProgress={uploadProgress}
        uploadedFile={uploadedFile}
        aiFilledCount={aiFilledKeys.size}
        formData={formData}
        onStatusChange={setParseStatus}
        onUploadProgressChange={setUploadProgress}
        onUploadedFileChange={setUploadedFile}
        onAiFill={handleAiFill}
        onClearAiFill={() => setAiFilledKeys(new Set())}
      />

      <ReportForm
        formData={formData}
        aiFilledKeys={aiFilledKeys}
        invalidKeys={invalidKeys}
        fieldRefs={fieldRefs}
        onFieldChange={(key, value) => {
          setFormData((prev) => ({ ...prev, [key]: value }));
          setInvalidKeys((prev) => {
            if (!prev.has(key)) return prev;
            const next = new Set(prev);
            next.delete(key);
            return next;
          });
        }}
        attachFiles={attachFiles}
        onAddAttachFiles={(files) => setAttachFiles((prev) => [...prev, ...files])}
        onDeleteAttachFile={(id) => setAttachFiles((prev) => prev.filter((f) => f.id !== id))}
      />

      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#fff',
          borderTop: '1px solid #f0f0f0',
          padding: '12px 16px',
          display: 'flex',
          gap: 12,
          zIndex: 100,
        }}
      >
        <Button style={{ flex: 1, borderRadius: 8, height: 44 }} onClick={() => saveDraft(true)}>暂存草稿</Button>
        <Button color='primary' style={{ flex: 2, borderRadius: 8, height: 44 }} onClick={() => void submit()}>提交上报</Button>
      </div>
    </div>
  );
};

export default DataReportFillPage;
