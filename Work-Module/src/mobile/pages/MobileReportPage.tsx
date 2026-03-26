import React, { useEffect, useMemo, useRef, useState } from 'react';
import dayjs from 'dayjs';
import {
  Button,
  Card,
  Collapse,
  Dialog,
  DotLoading,
  NavBar,
  ProgressBar,
  Tag,
  TextArea,
  Toast,
} from 'antd-mobile';
import { LeftOutline } from 'antd-mobile-icons';

import { reportContent, reportList, type ReportItem } from '../../pages/SmartReport/smartReportMockData';

type PageMode = 'home' | 'generating' | 'detail';

const trendColor = (trend: 'up' | 'down' | 'flat') => (trend === 'down' ? '#ff4d4f' : trend === 'up' ? '#52c41a' : '#999');
const trendSymbol = (trend: 'up' | 'down' | 'flat') => (trend === 'down' ? '↓' : trend === 'up' ? '↑' : '-');

const sectionTitleStyle: React.CSSProperties = {
  fontSize: 17,
  fontWeight: 700,
  color: '#222',
  marginTop: 20,
  marginBottom: 10,
};

const inlineSourceStyle: React.CSSProperties = {
  color: '#bfbfbf',
  fontSize: 12,
  marginLeft: 4,
};

const riskConfig: Record<string, { label: string; color: string }> = {
  error: { label: '高风险', color: '#ff4d4f' },
  warning: { label: '中风险', color: '#fa8c16' },
  info: { label: '低风险', color: '#1890ff' },
};

const rankColorMap: Record<number, string> = {
  1: '#ffd700',
  2: '#c0c0c0',
  3: '#cd7f32',
};

const MobileReportPage: React.FC = () => {
  const [mode, setMode] = useState<PageMode>('home');
  const [command, setCommand] = useState('');
  const [reports, setReports] = useState<ReportItem[]>(
    [...reportList].sort((a, b) => dayjs(b.generatedAt).valueOf() - dayjs(a.generatedAt).valueOf())
  );
  const [activeReportId, setActiveReportId] = useState<string>(reportList[0]?.id ?? '');
  const [genProgress, setGenProgress] = useState(0);
  const [genLineIndex, setGenLineIndex] = useState(0);

  const timerRef = useRef<number | null>(null);

  const activeReport = useMemo(() => reports.find((r) => r.id === activeReportId) ?? null, [reports, activeReportId]);

  const generatingLines = [
    '正在解析指令与报告主题...',
    '正在检索知识库与系统数据...',
    '正在执行多维分析与交叉校验...',
    '正在组织报告结构并生成内容...',
    '正在完成质量检查与版式优化...',
  ];

  const overviewMetrics = [
    { title: '任务完成总数', value: '128项', trend: 'up' as const, trendValue: '12.3%', source: '采集任务系统-任务完成统计' },
    { title: '按时完成率', value: '89.2%', trend: 'up' as const, trendValue: '3.1%', source: '采集任务系统-按时完成率统计' },
    { title: '参与部门数', value: '15个', trend: 'flat' as const, trendValue: '-', source: '组织机构管理-活跃单位统计' },
    { title: '数据上报完成率', value: '92.5%', trend: 'down' as const, trendValue: '1.2%', source: '数据上报模块-上报完成率统计' },
    { title: '重点项目推进数', value: '8个', trend: 'up' as const, trendValue: '2个', source: '主题库-重点项目专题库' },
    { title: '待解决问题数', value: '5个', trend: 'up' as const, trendValue: '2个', source: '本报告第五章-问题与风险提示汇总' },
  ];

  const sortedRanking = [...reportContent.unitRanking].sort((a, b) => a.rank - b.rank);

  const clearTimer = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => () => clearTimer(), []);

  const startGenerate = () => {
    const text = command.trim();
    if (!text) return;

    const id = `mobile-report-${Date.now()}`;
    const newReport: ReportItem = {
      id,
      title: text.length > 24 ? `${text.slice(0, 24)}...` : text,
      topic: text,
      status: 'generating',
      generatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      relativeTime: '刚刚',
      duration: null,
      knowledgeBases: ['区大数据局知识库', '区发改委知识库', '智慧城市专题库'],
    };

    setReports((prev) => [newReport, ...prev]);
    setActiveReportId(id);
    setMode('generating');
    setCommand('');
    setGenProgress(0);
    setGenLineIndex(0);

    let tick = 0;
    timerRef.current = window.setInterval(() => {
      tick += 1;
      setGenProgress(Math.min(100, tick * 16));
      setGenLineIndex((prev) => Math.min(prev + 1, generatingLines.length - 1));

      if (tick >= 7) {
        clearTimer();
        setReports((prev) =>
          prev.map((item) =>
            item.id === id
              ? {
                  ...item,
                  status: 'completed',
                  title: '全区各部门2024年3月工作情况总结报告',
                  relativeTime: '刚刚',
                  duration: '0分14秒',
                }
              : item
          )
        );
        setMode('detail');
      }
    }, 800);
  };

  const enterDetail = (id: string) => {
    setActiveReportId(id);
    const hit = reports.find((r) => r.id === id);
    if (!hit) return;

    if (hit.status === 'generating') {
      setMode('generating');
      Toast.show({ content: '该报告仍在生成中' });
      return;
    }

    setMode('detail');
  };

  const deleteReport = async (id: string) => {
    const ok = await Dialog.confirm({
      content: '确认删除此报告？删除后不可恢复。',
      confirmText: '删除',
      cancelText: '取消',
    });
    if (!ok) return;

    setReports((prev) => prev.filter((item) => item.id !== id));
    if (activeReportId === id) {
      setActiveReportId('');
      setMode('home');
    }
    Toast.show({ content: '已删除' });
  };

  const regenerate = async () => {
    const ok = await Dialog.confirm({
      content: '确认重新生成此报告？原报告内容将被覆盖。',
      confirmText: '确认',
      cancelText: '取消',
    });
    if (!ok || !activeReport) return;

    setReports((prev) =>
      prev.map((item) => (item.id === activeReport.id ? { ...item, status: 'generating', duration: null } : item))
    );
    setCommand(activeReport.topic);
    setMode('home');
    Toast.show({ content: '请点击发送重新生成' });
  };

  if (mode === 'detail' && activeReport) {
    return (
      <div style={{ minHeight: '100vh', background: '#f5f5f5', paddingBottom: 62 }}>
        <NavBar backArrow={<LeftOutline />} onBack={() => setMode('home')}>
          智能报告详情
        </NavBar>

        <div style={{ padding: 12 }}>
          <Card style={{ borderRadius: 10 }}>
            <div style={{ fontSize: 20, fontWeight: 700, textAlign: 'center', color: '#222', marginBottom: 8 }}>{reportContent.title}</div>
            <div style={{ textAlign: 'center', color: '#999', fontSize: 12, lineHeight: 1.8 }}>
              <div>生成时间：{reportContent.generatedAt}</div>
              <div>数据周期：{reportContent.dataRange}</div>
              <div>基于{reportContent.sourceCount}的数据分析生成</div>
            </div>

            <div style={sectionTitleStyle}>一、报告概要</div>
            <div style={{ background: '#f0f7ff', borderRadius: 10, padding: 12, lineHeight: 1.9, color: '#333', fontSize: 14 }}>
              <p style={{ margin: 0, marginBottom: 10 }}>
                2024年3月，全区15个部门、6个镇街、5个国企围绕区委区政府年度重点工作部署，扎实推进各项任务。截至3月20日，全区共完成工作任务128项
                <small style={inlineSourceStyle}>(来源：采集任务系统-任务完成统计)</small>
                ，按时完成率89.2%
                <small style={inlineSourceStyle}>(来源：采集任务系统-任务完成统计)</small>
                ，较上月提升3.1个百分点；数据上报完成率92.5%
                <small style={inlineSourceStyle}>(来源：数据上报模块-上报完成率统计)</small>
                ，较上月下降1.2个百分点。
              </p>
              <p style={{ margin: 0, marginBottom: 10 }}>
                本月工作呈现以下特点：一是数字政府建设加速推进，智慧城市一期项目政务云迁移率达85%
                <small style={inlineSourceStyle}>(来源：区大数据局知识库-智慧城市一期项目月报)</small>
                ，超额完成阶段目标；二是经济运行总体平稳，第一季度GDP预计同比增长6.2%
                <small style={inlineSourceStyle}>(来源：区发改委知识库-2024年Q1经济运行分析)</small>
                ；三是民生领域持续发力，区级医共体信息化建设稳步推进。
              </p>
              <p style={{ margin: 0 }}>
                但同时也存在部分单位数据上报不及时、个别重点项目推进滞后、跨部门协同效率有待提升等问题，需在下一阶段重点关注和改进。综合评估，全区3月份工作完成质量整体良好，但距离年度目标仍有差距，建议各单位进一步压实责任、加快进度。
              </p>
            </div>

            <div style={sectionTitleStyle}>二、数据总览</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8 }}>
              {overviewMetrics.map((item) => (
                <div key={item.title} style={{ border: '1px solid #f0f0f0', borderRadius: 10, padding: 8, background: '#fff', minWidth: 0, width: '100%', justifySelf: 'center' }}>
                  <div style={{ fontSize: 12, color: '#666' }}>{item.title}</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#222', marginTop: 4 }}>{item.value}</div>
                  <div style={{ fontSize: 12, marginTop: 4, color: trendColor(item.trend) }}>
                    {trendSymbol(item.trend)} {item.trend === 'flat' ? '持平' : item.trendValue}
                  </div>
                  <div
                    style={{
                      marginTop: 8,
                      fontSize: 11,
                      color: '#999',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                    onClick={() => Toast.show({ content: `来源：${item.source}` })}
                  >
                    来源：{item.source}
                  </div>
                </div>
              ))}
            </div>

            <div style={sectionTitleStyle}>三、各单位工作完成情况</div>
            <div style={{ border: '1px solid #f0f0f0', borderRadius: 10, padding: 10, background: '#fff' }}>
              {sortedRanking.map((item) => (
                <div key={item.rank} style={{ marginBottom: item.rank === sortedRanking.length ? 0 : 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {item.rank <= 3 ? (
                        <span
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            background: rankColorMap[item.rank],
                            color: '#fff',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 11,
                            fontWeight: 700,
                          }}
                        >
                          {item.rank}
                        </span>
                      ) : (
                        <span style={{ fontSize: 11, color: '#999', width: 20, textAlign: 'center' }}>{item.rank}</span>
                      )}
                      <span style={{ fontSize: 13, color: '#333', fontWeight: 500 }}>{item.name}</span>
                    </div>
                    <span style={{ fontSize: 12, color: '#333' }}>{item.completionRate}%</span>
                  </div>
                  <div style={{ height: 10, background: '#f3f3f3', borderRadius: 999 }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${item.completionRate}%`,
                        borderRadius: 999,
                        background: item.completionRate < 60 ? '#ff4d4f' : '#1890ff',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', fontSize: 11, color: '#999', marginTop: 8 }}>
              数据来源：采集任务系统-各单位任务完成统计、数据上报模块-各单位上报及时率统计
            </div>

            <Collapse defaultActiveKey={['department']} style={{ marginTop: 10 }}>
              <Collapse.Panel key='department' title='委办部门分析'>
                <div style={{ fontSize: 14, lineHeight: 1.9, color: '#333' }}>
                  本月10个委办部门共承担工作任务86项，完成78项，整体完成率90.7%
                  <small style={inlineSourceStyle}>(来源：采集任务系统-部门维度统计)</small>。区大数据局和区发改委表现突出，区教育局和区卫健委任务完成率下降，需重点关注区市场监管局，完成率仅55.3%
                  <small style={inlineSourceStyle}>(来源：采集任务系统-区市场监管局任务明细)</small>，为全区最低。
                </div>
              </Collapse.Panel>
              <Collapse.Panel key='town' title='镇街分析'>
                <div style={{ fontSize: 14, lineHeight: 1.9, color: '#333' }}>
                  本月6个镇街共承担工作任务32项，完成28项，整体完成率87.5%
                  <small style={inlineSourceStyle}>(来源：采集任务系统-镇街维度统计)</small>。新塘镇保持92.3%的高完成率
                  <small style={inlineSourceStyle}>(来源：采集任务系统-新塘镇任务明细)</small>，永宁街道和荔湖街道略低，朱村街道暂未纳入。
                </div>
              </Collapse.Panel>
              <Collapse.Panel key='soe' title='国企分析'>
                <div style={{ fontSize: 14, lineHeight: 1.9, color: '#333' }}>
                  本月5个区属国企共承担工作任务10项，完成8项，整体完成率80.0%
                  <small style={inlineSourceStyle}>(来源：采集任务系统-国企维度统计)</small>。区城投集团完成率82.0%，区水投集团本月未产生新增任务。
                </div>
              </Collapse.Panel>
            </Collapse>

            <div style={sectionTitleStyle}>四、重点工作进展</div>
            {reportContent.keyProjects.map((item) => {
              const statusMeta =
                item.status === 'green'
                  ? { text: '进展顺利', color: '#52c41a' }
                  : item.status === 'blue'
                    ? { text: '正常推进', color: '#1890ff' }
                    : { text: '存在风险', color: '#ff4d4f' };

              return (
                <div key={item.name} style={{ border: '1px solid #f0f0f0', borderRadius: 10, padding: 10, marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 8 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: '#333' }}>
                      {item.name}（{item.unit}）
                    </div>
                    <Tag color={statusMeta.color}>{statusMeta.text}</Tag>
                  </div>
                  <div style={{ marginTop: 8, fontSize: 14, color: '#333', lineHeight: 1.9 }}>{item.description}</div>
                </div>
              );
            })}

            <div style={sectionTitleStyle}>五、问题与风险提示</div>
            {reportContent.risks.map((item) => {
              const meta = riskConfig[item.level];
              return (
                <div
                  key={item.title}
                  style={{
                    borderRadius: 10,
                    border: '1px solid #f0f0f0',
                    borderLeft: `4px solid ${meta.color}`,
                    background: '#fff',
                    padding: 10,
                    marginBottom: 10,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Tag color={meta.color}>{meta.label}</Tag>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#333' }}>{item.title}</span>
                  </div>
                  <div style={{ fontSize: 14, color: '#333', lineHeight: 1.8, marginTop: 8 }}>
                    <strong>问题描述：</strong>{item.description}
                  </div>
                  <div style={{ fontSize: 14, color: '#333', lineHeight: 1.8, marginTop: 8 }}>
                    <strong>建议措施：</strong>{item.suggestions}
                  </div>
                </div>
              );
            })}

            <div style={sectionTitleStyle}>六、建议与下一步计划</div>
            <ol style={{ margin: 0, paddingLeft: 18 }}>
              {reportContent.suggestions.map((item) => (
                <li key={item.title} style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#333' }}>{item.title}</div>
                  <div style={{ marginTop: 6, fontSize: 14, color: '#333', lineHeight: 1.85 }}>{item.content}</div>
                  <div style={{ marginTop: 4, fontSize: 12, color: '#999' }}>建议责任单位：{item.target}</div>
                </li>
              ))}
            </ol>

            <div style={{ marginTop: 14 }}>
              <Button
                color='primary'
                block
                onClick={() => {
                  Toast.show({ content: '功能开发中，敬请期待' });
                }}
              >
                下载PDF报告
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (mode === 'generating') {
    return (
      <div style={{ minHeight: '100vh', background: '#f5f5f5', paddingBottom: 62 }}>
        <NavBar backArrow={<LeftOutline />} onBack={() => setMode('home')}>
          生成中
        </NavBar>
        <div style={{ padding: 12 }}>
          <Card style={{ borderRadius: 10 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#222' }}>正在生成智能报告...</div>
            <div style={{ marginTop: 8, fontSize: 13, color: '#999' }}>请稍候，系统正在进行多源数据分析与内容生成。</div>

            <div style={{ marginTop: 12, padding: 10, borderRadius: 8, background: '#f7faff' }}>
              <ProgressBar percent={genProgress / 100} text={() => `${genProgress}%`} />
            </div>

            <div style={{ marginTop: 12, borderRadius: 8, background: '#1e1e1e', color: '#d4d4d4', padding: 12 }}>
              {generatingLines.slice(0, genLineIndex + 1).map((line, idx) => (
                <div key={idx} style={{ fontFamily: "'Courier New', monospace", fontSize: 13, marginBottom: 6 }}>
                  {idx < genLineIndex ? <span style={{ color: '#3fb950' }}>✓ </span> : <DotLoading color='primary' />} {line}
                </div>
              ))}
            </div>

            <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                color='primary'
                onClick={() => {
                  clearTimer();
                  setGenProgress(100);
                  setMode('detail');
                  setReports((prev) =>
                    prev.map((item) => (item.id === activeReportId ? { ...item, status: 'completed', relativeTime: '刚刚' } : item))
                  );
                }}
              >
                立即完成
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', paddingBottom: 62 }}>
      <NavBar back={null}>智能报告</NavBar>

      <div style={{ padding: 12, paddingBottom: 140 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#222', marginBottom: 10 }}>历史报告</div>

        {reports.map((item) => (
          <Card key={item.id} style={{ borderRadius: 10, marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
              <div style={{ flex: 1, minWidth: 0 }} onClick={() => enterDetail(item.id)}>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: '#333',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.title}
                </div>
                <div style={{ marginTop: 6, fontSize: 12, color: '#999' }}>{item.generatedAt}</div>
                <div style={{ marginTop: 6 }}>
                  <Tag color={item.status === 'completed' ? '#52c41a' : item.status === 'failed' ? '#ff4d4f' : '#1890ff'}>
                    {item.status === 'completed' ? '已完成' : item.status === 'failed' ? '生成失败' : '生成中'}
                  </Tag>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'start', gap: 8 }}>
                <Button size='mini' onClick={() => { Toast.show({ content: '功能开发中，敬请期待' }); }}>
                  导出
                </Button>
                <Button size='mini' color='danger' fill='outline' onClick={() => void deleteReport(item.id)}>
                  删除
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 50,
          background: '#fff',
          borderTop: '1px solid #f0f0f0',
          padding: 10,
          display: 'flex',
          alignItems: 'flex-end',
          gap: 8,
          zIndex: 20,
        }}
      >
        <div
          style={{
            flex: 1,
            borderRadius: 20,
            background: '#f6f6f6',
            padding: '6px 10px',
            border: '1px solid #f0f0f0',
          }}
        >
          <TextArea
            value={command}
            onChange={setCommand}
            autoSize={{ minRows: 1, maxRows: 4 }}
            placeholder='输入指令，例如：请生成全区3月工作总结报告'
            style={{ '--font-size': '14px', '--placeholder-color': '#999', background: 'transparent' }}
          />
        </div>
        <Button
          color='primary'
          disabled={!command.trim()}
          onClick={startGenerate}
          style={{ height: 38, borderRadius: 19, padding: '0 14px' }}
        >
          发送
        </Button>
      </div>
    </div>
  );
};

export default MobileReportPage;




