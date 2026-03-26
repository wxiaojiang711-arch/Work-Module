import React, { useState } from 'react';
import { ErrorBlock, ImageViewer, NavBar, Tag, Toast } from 'antd-mobile';
import { DownlandOutline } from 'antd-mobile-icons';
import { useNavigate, useParams } from 'react-router-dom';

import { filePreviewData, kbTypeMeta } from '../mobileMockData';

const FilePreviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { fileId } = useParams<{ fileId: string }>();
  const file = fileId ? filePreviewData[fileId] : null;
  const [imageVisible, setImageVisible] = useState(false);

  if (!file) {
    return (
      <div style={{ minHeight: '100vh', background: '#f5f5f5', paddingBottom: 50 }}>
        <NavBar onBack={() => navigate(-1)}>文件预览</NavBar>
        <div style={{ marginTop: 24 }}>
          <ErrorBlock status="empty" description="未找到该文件" />
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f5f5f5',
        paddingBottom: 50,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
      }}
    >
      <NavBar
        onBack={() => navigate(-1)}
        right={
          <span
            style={{ display: 'inline-flex', cursor: 'pointer' }}
            onClick={() => Toast.show({ content: '下载功能开发中，敬请期待' })}
          >
            <DownlandOutline />
          </span>
        }
      >
        <div style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.fileName}</div>
      </NavBar>

      <div style={{ padding: 16, background: '#fff' }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: '#333', marginBottom: 10 }}>{file.fileName}</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          <Tag color={file.kbType === 'theme' ? 'purple' : 'success'} fill="outline">
            {kbTypeMeta[file.kbType].label}
          </Tag>
          <Tag color="primary" fill="outline">
            {file.orgName}
          </Tag>
        </div>

        <div style={{ fontSize: 13, color: '#666', lineHeight: 1.9 }}>
          <div>数据来源单位：{file.orgName}</div>
          <div>负责人：{file.owner}</div>
          <div>上报时间：{file.reportTime}</div>
          <div>更新频率：{file.updateFrequency}</div>
          <div>文件大小：{file.fileSize}</div>
        </div>
      </div>

      <div style={{ padding: 16, marginTop: 8, background: '#fff' }}>
        {file.content.type === 'text' ? (
          <div style={{ whiteSpace: 'pre-wrap', fontSize: 14, lineHeight: 1.8, color: '#333' }}>{file.content.text}</div>
        ) : null}

        {file.content.type === 'table' ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ minWidth: 560, width: '100%', borderCollapse: 'collapse', fontSize: 13, color: '#333' }}>
              <thead>
                <tr>
                  {file.content.headers.map((h) => (
                    <th key={h} style={{ border: '1px solid #f0f0f0', background: '#fafafa', padding: 8, textAlign: 'left' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {file.content.rows.map((row, idx) => (
                  <tr key={idx}>
                    {row.map((cell, ci) => (
                      <td key={`${idx}-${ci}`} style={{ border: '1px solid #f0f0f0', padding: 8 }}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        {file.content.type === 'image' ? (
          <>
            <img
              src={file.content.url}
              alt={file.fileName}
              onClick={() => setImageVisible(true)}
              style={{ width: '100%', borderRadius: 8, cursor: 'zoom-in' }}
            />
            <ImageViewer image={file.content.url} visible={imageVisible} onClose={() => setImageVisible(false)} />
          </>
        ) : null}

        <div style={{ marginTop: 12, fontSize: 12, color: '#999' }}>如需查看完整文件，请在PC端下载原文件</div>
      </div>
    </div>
  );
};

export default FilePreviewPage;

