import React, { useMemo, useRef } from 'react';
import { Button, Dialog, ProgressBar, SpinLoading, Toast } from 'antd-mobile';
import { CheckCircleFill, CloseCircleFill, UploadOutline } from 'antd-mobile-icons';

import { aiParsedData, type ReportFormData } from './reportFillMockData';

type ParseStatus = 'idle' | 'uploading' | 'parsing' | 'success' | 'failed';

type UploadedFile = {
  name: string;
  size: string;
};

type FileUploadParserProps = {
  parseStatus: ParseStatus;
  uploadProgress: number;
  uploadedFile: UploadedFile | null;
  aiFilledCount: number;
  formData: ReportFormData;
  onStatusChange: (status: ParseStatus) => void;
  onUploadProgressChange: (progress: number) => void;
  onUploadedFileChange: (file: UploadedFile | null) => void;
  onAiFill: (payload: Partial<ReportFormData>, mode: 'overwrite' | 'fill-empty') => void;
  onClearAiFill: () => void;
};

const FileUploadParser: React.FC<FileUploadParserProps> = ({
  parseStatus,
  uploadProgress,
  uploadedFile,
  aiFilledCount,
  formData,
  onStatusChange,
  onUploadProgressChange,
  onUploadedFileChange,
  onAiFill,
  onClearAiFill,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const hasManualInput = useMemo(() => Object.values(formData).some((v) => String(v).trim()), [formData]);

  const openFileSelect = () => inputRef.current?.click();

  const handleStartParseFlow = async () => {
    const payload = aiParsedData as Partial<ReportFormData>;

    if (hasManualInput) {
      const action = await new Promise<'overwrite' | 'fill-empty' | 'cancel'>((resolve) => {
        Dialog.show({
          title: '检测到部分字段已填写',
          content: '是否用解析结果覆盖已填写的内容？',
          closeOnMaskClick: false,
          actions: [
            [
              { key: 'overwrite', text: '覆盖全部', bold: true, onClick: () => resolve('overwrite') },
              { key: 'fill-empty', text: '仅填充空白字段', onClick: () => resolve('fill-empty') },
            ],
            [{ key: 'cancel', text: '取消', onClick: () => resolve('cancel') }],
          ],
        });
      });

      if (action === 'cancel') {
        onStatusChange('idle');
        onUploadedFileChange(null);
        return;
      }

      onAiFill(payload, action);
    } else {
      onAiFill(payload, 'overwrite');
    }

    onStatusChange('success');
  };

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext || !['doc', 'docx', 'xls', 'xlsx'].includes(ext)) {
      Toast.show({ content: '仅支持 .doc .docx .xls .xlsx' });
      return;
    }

    const sizeText = `${(file.size / 1024 / 1024).toFixed(2)}MB`;
    onUploadedFileChange({ name: file.name, size: sizeText });
    onStatusChange('uploading');
    onUploadProgressChange(0);

    let p = 0;
    const timer = window.setInterval(() => {
      p += 20;
      onUploadProgressChange(Math.min(100, p));
      if (p >= 100) {
        window.clearInterval(timer);
        onStatusChange('parsing');
        window.setTimeout(async () => {
          const shouldFail = Math.random() < 0.12;
          if (shouldFail) {
            onStatusChange('failed');
            return;
          }
          await handleStartParseFlow();
        }, 3000);
      }
    }, 250);

    e.target.value = '';
  };

  const clearParsed = () => {
    onUploadedFileChange(null);
    onUploadProgressChange(0);
    onStatusChange('idle');
    onClearAiFill();
  };

  return (
    <div style={{ padding: '0 16px', marginBottom: 16 }}>
      <input
        ref={inputRef}
        type='file'
        style={{ display: 'none' }}
        accept='.doc,.docx,.xls,.xlsx'
        onChange={handleFileChange}
      />

      {parseStatus === 'idle' ? (
        <div
          onClick={openFileSelect}
          style={{
            border: '1px dashed #d9d9d9',
            borderRadius: 8,
            padding: 20,
            textAlign: 'center',
            background: '#fafafa',
            cursor: 'pointer',
          }}
        >
          <UploadOutline style={{ fontSize: 32, color: '#1890ff' }} />
          <div style={{ fontSize: 14, color: '#333', marginTop: 8 }}>上传文件，AI自动解析填充表单</div>
          <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>支持 .doc .docx .xls .xlsx 格式</div>
        </div>
      ) : null}

      {parseStatus === 'uploading' ? (
        <div style={{ background: '#fff', borderRadius: 8, padding: 12, border: '1px solid #f0f0f0' }}>
          <div style={{ fontSize: 13, color: '#333' }}>{uploadedFile?.name}</div>
          <div style={{ marginTop: 4, fontSize: 12, color: '#999' }}>{uploadedFile?.size}</div>
          <div style={{ marginTop: 10 }}>
            <ProgressBar percent={uploadProgress / 100} />
          </div>
          <div style={{ marginTop: 6, fontSize: 12, color: '#999' }}>正在上传...</div>
        </div>
      ) : null}

      {parseStatus === 'parsing' ? (
        <div style={{ background: '#fff', borderRadius: 8, padding: 16, border: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 8 }}>
          <SpinLoading color='primary' />
          <span style={{ fontSize: 14, color: '#333' }}>AI正在解析文件内容...</span>
        </div>
      ) : null}

      {parseStatus === 'success' ? (
        <div style={{ background: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 8, padding: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#389e0d' }}>
              <CheckCircleFill />
              <span style={{ fontSize: 14 }}>解析完成，已自动填充 {aiFilledCount} 个字段</span>
            </div>
            <Button size='mini' color='danger' fill='none' onClick={clearParsed}>删除</Button>
          </div>
          <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
            {uploadedFile?.name} · {uploadedFile?.size}
          </div>
        </div>
      ) : null}

      {parseStatus === 'failed' ? (
        <div style={{ background: '#fff2f0', border: '1px solid #ffccc7', borderRadius: 8, padding: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#cf1322', fontSize: 14 }}>
            <CloseCircleFill />
            解析失败，请检查文件格式或手动填写
          </div>
          <div style={{ marginTop: 10 }}>
            <Button color='danger' fill='outline' size='small' onClick={openFileSelect}>重新上传</Button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default FileUploadParser;
