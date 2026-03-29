import React, { useEffect, useState } from "react";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  FileSearchOutlined,
  ScheduleOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { Button, DatePicker, Select, Space, Spin, Tag, Tooltip } from "antd";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

import styles from "./DashboardPage.module.css";

const { RangePicker } = DatePicker;

type RankingPeriod = "week" | "month" | "quarter" | "year" | "custom";

interface ReportStats {
  pending: number;
  submittedMonth: number;
  submittedQuarter: number;
  overdue: number;
}

interface TodoReview {
  id: string;
  taskName: string;
  orgName: string;
  submitTime: string;
}

interface TodoFill {
  id: string;
  taskName: string;
  urgency: "普通" | "紧急" | "特急";
  deadline: string;
}

interface TodoRejected {
  id: string;
  taskName: string;
  reason: string;
  rejectTime: string;
}

interface TodoPayload {
  review: TodoReview[];
  fill: TodoFill[];
  rejected: TodoRejected[];
}

interface UnitRankItem {
  rank: number;
  kbName: string;
  fileCount: number;
  totalCalls: number;
}

interface FileRankItem {
  rank: number;
  fileName: string;
  unitName: string;
  totalCalls: number;
}

interface RankingPayload {
  unitTop: UnitRankItem[];
  fileTop: FileRankItem[];
}

const MOCK_REPORT_STATS: ReportStats = {
  pending: 8,
  submittedMonth: 26,
  submittedQuarter: 73,
  overdue: 3,
};

const MOCK_TODOS: TodoPayload = {
  review: [
    { id: "rv-001", taskName: "2026年一季度经济运行分析", orgName: "区发改委", submitTime: "2026-03-26 15:20" },
    { id: "rv-002", taskName: "重点项目推进月报", orgName: "区住建委", submitTime: "2026-03-26 11:00" },
    { id: "rv-003", taskName: "营商环境优化情况", orgName: "区政务服务中心", submitTime: "2026-03-25 18:09" },
    { id: "rv-004", taskName: "文旅活动数据上报", orgName: "区文旅委", submitTime: "2026-03-24 14:30" },
  ],
  fill: [
    { id: "task-001", taskName: "一季度工作总结填报", urgency: "紧急", deadline: "2026-03-30 18:00" },
    { id: "task-002", taskName: "重点项目推进情况", urgency: "普通", deadline: "2026-04-05 18:00" },
    { id: "task-003", taskName: "核心指标数据表", urgency: "特急", deadline: "2026-03-28 12:00" },
    { id: "task-004", taskName: "民生实事任务清单", urgency: "普通", deadline: "2026-04-12 18:00" },
  ],
  rejected: [
    { id: "task-011", taskName: "教育高质量发展专项", reason: "数据口径不一致，请补充分项说明并核对同比值。", rejectTime: "2026-03-26 09:15" },
    { id: "task-012", taskName: "生态环保考核支撑材料", reason: "附件缺失，请补齐佐证材料后重新提交。", rejectTime: "2026-03-25 17:04" },
    { id: "task-013", taskName: "交通治堵工作月报", reason: "重点项目进展描述不完整，请细化到项目节点。", rejectTime: "2026-03-24 11:50" },
  ],
};

const MOCK_RANKING: RankingPayload = {
  unitTop: [
    { rank: 1, kbName: "区发改委知识库", fileCount: 325, totalCalls: 345 },
    { rank: 2, kbName: "区住建委知识库", fileCount: 301, totalCalls: 321 },
    { rank: 3, kbName: "区文旅委知识库", fileCount: 269, totalCalls: 288 },
    { rank: 4, kbName: "区交通局知识库", fileCount: 232, totalCalls: 251 },
    { rank: 5, kbName: "区市场监督管理局知识库", fileCount: 217, totalCalls: 236 },
  ],
  fileTop: [
    { rank: 1, fileName: "2026年营商环境政策指引（最新版）", unitName: "区发改委", totalCalls: 98 },
    { rank: 2, fileName: "重点项目全生命周期管理规范", unitName: "区住建委", totalCalls: 91 },
    { rank: 3, fileName: "文化旅游活动保障工作手册", unitName: "区文旅委", totalCalls: 88 },
    { rank: 4, fileName: "交通枢纽运行监测周报模板", unitName: "区交通局", totalCalls: 76 },
    { rank: 5, fileName: "重大事项协调会商纪要（模板）", unitName: "区委办公室", totalCalls: 75 },
    { rank: 6, fileName: "企业走访服务台账样例", unitName: "区经信委", totalCalls: 67 },
    { rank: 7, fileName: "季度重点任务分解与督导机制", unitName: "区政府办", totalCalls: 61 },
    { rank: 8, fileName: "公共服务事项标准化清单", unitName: "区政务服务中心", totalCalls: 60 },
    { rank: 9, fileName: "基层治理数据共享规范", unitName: "区大数据局", totalCalls: 58 },
    { rank: 10, fileName: "人才政策申报常见问题库", unitName: "区人社局", totalCalls: 54 },
  ],
};

const fetchReportStats = async () => MOCK_REPORT_STATS;
const fetchTodos = async () => MOCK_TODOS;
const fetchRanking = async (_period: RankingPeriod) => MOCK_RANKING;

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [reportStats, setReportStats] = useState<ReportStats>(MOCK_REPORT_STATS);
  const [todos, setTodos] = useState<TodoPayload>(MOCK_TODOS);
  const [ranking, setRanking] = useState<RankingPayload>(MOCK_RANKING);
  const [rankingLoading, setRankingLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [rankingPeriod, setRankingPeriod] = useState<RankingPeriod>("month");
  const [expandReview, setExpandReview] = useState(false);
  const [expandFill, setExpandFill] = useState(false);
  const [expandRejected, setExpandRejected] = useState(false);

  const loadAll = async (silent = false) => {
    if (!silent) setInitialLoading(true);
    try {
      const [report, todoData, rankingData] = await Promise.all([fetchReportStats(), fetchTodos(), fetchRanking(rankingPeriod)]);
      setReportStats(report);
      setTodos(todoData);
      setRanking(rankingData);
    } finally {
      if (!silent) setInitialLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => loadAll(true), 5 * 60 * 1000);
    return () => window.clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rankingPeriod]);

  const refreshRanking = async (period: RankingPeriod) => {
    setRankingLoading(true);
    try {
      setRanking(await fetchRanking(period));
    } finally {
      setRankingLoading(false);
    }
  };

  const reportCards = [
    { key: "pending", title: "待上报任务", value: reportStats.pending, unit: "个", color: "#2b5cd6", bg: "linear-gradient(180deg, #fbfdff 0%, #f4f8ff 100%)", icon: <ClockCircleOutlined />, path: "/report?status=pending" },
    { key: "month", title: "本月已上报任务", value: reportStats.submittedMonth, unit: "个", color: "#52c41a", bg: "linear-gradient(180deg, #fbfffb 0%, #f4fff5 100%)", icon: <CheckCircleOutlined />, path: "/report?status=submitted&period=month" },
    { key: "quarter", title: "本季度已上报任务", value: reportStats.submittedQuarter, unit: "个", color: "#722ed1", bg: "linear-gradient(180deg, #fcfbff 0%, #f8f5ff 100%)", icon: <ScheduleOutlined />, path: "/report?status=submitted&period=quarter" },
    { key: "overdue", title: "逾期未报任务", value: reportStats.overdue, unit: "个", color: "#f5222d", bg: "linear-gradient(180deg, #fffdfd 0%, #fff5f5 100%)", icon: <ExclamationCircleOutlined />, path: "/report?status=overdue" },
    { key: "review", title: "待审核数据", value: todos.review.length, unit: "条", color: "#1677ff", bg: "linear-gradient(180deg, #fbfdff 0%, #eef5ff 100%)", icon: <FileSearchOutlined />, path: "/report" },
    { key: "rejected", title: "已退回数据", value: todos.rejected.length, unit: "条", color: "#fa541c", bg: "linear-gradient(180deg, #fffdf9 0%, #fff4ec 100%)", icon: <StopOutlined />, path: "/report" },
  ];

  const renderRankBadge = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return rank;
  };

  if (initialLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.loadingWrap}><Spin /></div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.reportTodoRow}>
        <section className={styles.block}>
          <div className={styles.blockTitle}>数据上报情况</div>
          <div className={styles.reportGrid}>
            {reportCards.map((item) => (
              <div key={item.key} className={styles.reportCard} style={{ background: item.bg }} onClick={() => navigate(item.path)} role="button" tabIndex={0}>
                <div style={{ color: item.color, fontSize: 34 }}>{item.icon}</div>
                <div className={styles.reportTitle}>{item.title}</div>
                <div className={styles.reportValue}>{item.value}<span className={styles.reportValueUnit}>{item.unit}</span></div>
              </div>
            ))}
          </div>
        </section>

        <section className={`${styles.block} ${styles.todoBlock}`}>
          <div className={styles.blockTitle}>我的待办事项</div>
          <div className={styles.todoContent}>
            <div className={styles.todoGroup}>
              <div className={styles.todoGroupTitle}>待我审核的数据：{todos.review.length}条</div>
              {(expandReview ? todos.review : todos.review.slice(0, 3)).map((item) => (
                <div key={item.id} className={styles.todoItem}>
                  <div className={styles.todoRow}>
                    <span className={styles.todoTaskName}>{item.taskName}</span>
                    <Button type="primary" size="small" onClick={() => navigate("/report")}>去审核</Button>
                  </div>
                  <div className={styles.todoMeta}>上报单位：{item.orgName}　上报时间：{item.submitTime}</div>
                </div>
              ))}
              {todos.review.length > 3 ? <button type="button" className={styles.expandBtn} onClick={() => setExpandReview((v) => !v)}>{expandReview ? "收起" : "展开全部"}</button> : null}
            </div>

            <div className={styles.todoGroup}>
              <div className={styles.todoGroupTitle}>待我填报的任务：{todos.fill.length}条</div>
              {(expandFill ? todos.fill : todos.fill.slice(0, 3)).map((item) => (
                <div key={item.id} className={styles.todoItem}>
                  <div className={styles.todoRow}>
                    <span className={styles.todoTaskName}>{item.taskName}</span>
                    <Tag color={item.urgency === "普通" ? "default" : item.urgency === "紧急" ? "warning" : "error"}>{item.urgency}</Tag>
                    <Button type="primary" size="small" onClick={() => navigate(`/report/fill/${item.id}`)}>去填报</Button>
                  </div>
                  <div className={dayjs(item.deadline).isBefore(dayjs()) ? styles.todoDeadlineOverdue : styles.todoMeta}>截止时间：{item.deadline}</div>
                </div>
              ))}
              {todos.fill.length > 3 ? <button type="button" className={styles.expandBtn} onClick={() => setExpandFill((v) => !v)}>{expandFill ? "收起" : "展开全部"}</button> : null}
            </div>

            <div className={styles.todoGroup}>
              <div className={styles.todoGroupTitle}>我收到的退回数据：{todos.rejected.length}条</div>
              {(expandRejected ? todos.rejected : todos.rejected.slice(0, 3)).map((item) => (
                <div key={item.id} className={styles.todoItem}>
                  <div className={styles.todoRow}>
                    <span className={styles.todoTaskName}>{item.taskName}</span>
                    <Button type="primary" size="small" onClick={() => navigate(`/report/fill/${item.id}`)}>重新填报</Button>
                  </div>
                  <div className={styles.todoMeta}>
                    <Tooltip title={item.reason}><span className={styles.ellipsisText}>退回原因：{item.reason}</span></Tooltip>
                    <span>退回时间：{item.rejectTime}</span>
                  </div>
                </div>
              ))}
              {todos.rejected.length > 3 ? <button type="button" className={styles.expandBtn} onClick={() => setExpandRejected((v) => !v)}>{expandRejected ? "收起" : "展开全部"}</button> : null}
            </div>
          </div>
        </section>
      </div>

      <section className={styles.block}>
        <div className={styles.blockHead}>
          <div className={styles.blockTitle} style={{ marginBottom: 0 }}>知识库调阅排行榜</div>
          <Space>
            <Select
              value={rankingPeriod}
              style={{ width: 150 }}
              options={[
                { label: "本周", value: "week" },
                { label: "本月", value: "month" },
                { label: "本季度", value: "quarter" },
                { label: "本年", value: "year" },
                { label: "自定义", value: "custom" },
              ]}
              onChange={(value) => {
                const next = value as RankingPeriod;
                setRankingPeriod(next);
                refreshRanking(next);
              }}
            />
            {rankingPeriod === "custom" ? <RangePicker onChange={() => refreshRanking("custom")} /> : null}
          </Space>
        </div>

        <div className={styles.rankRow}>
          <div className={styles.rankTableWrap}>
            <div className={styles.rankSubTitle}>知识库调用排行（Top 5）</div>
            <table className={styles.rankTable}>
              <thead>
                <tr>
                  <th>排名</th>
                  <th>知识库名称</th>
                  <th>文件数量</th>
                  <th>调用次数</th>
                </tr>
              </thead>
              <tbody>
                {ranking.unitTop.map((row) => (
                  <tr key={row.rank} className={row.rank <= 3 ? styles[`rankTop${row.rank}` as keyof typeof styles] : ""}>
                    <td>{renderRankBadge(row.rank)}</td>
                    <td><button type="button" className={styles.linkBtn} onClick={() => navigate("/knowledge/base-management")}>{row.kbName}</button></td>
                    <td className={styles.boldText}>{row.fileCount}</td>
                    <td className={styles.boldText}>{row.totalCalls}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.rankTableWrap}>
            <div className={styles.rankSubTitle}>具体文件调用排行（Top 10）</div>
            <div className={styles.scrollTable}>
              <table className={styles.rankTable}>
                <thead>
                  <tr>
                    <th>排名</th>
                    <th>文件名称</th>
                    <th>所属单位</th>
                    <th>调用次数</th>
                  </tr>
                </thead>
                <tbody>
                  {ranking.fileTop.map((row) => (
                    <tr key={row.rank} className={row.rank <= 3 ? styles[`rankTop${row.rank}` as keyof typeof styles] : ""}>
                      <td>{renderRankBadge(row.rank)}</td>
                      <td>
                        <Tooltip title={row.fileName}>
                          <button type="button" className={styles.linkBtnEllipsis} onClick={() => navigate("/knowledge/base-management")}>{row.fileName}</button>
                        </Tooltip>
                      </td>
                      <td><button type="button" className={styles.linkBtn} onClick={() => navigate("/knowledge/base-management")}>{row.unitName}</button></td>
                      <td className={styles.boldText}>{row.totalCalls}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {rankingLoading ? <div className={styles.rankingLoading}><Spin size="small" /></div> : null}
      </section>
    </div>
  );
};

export default DashboardPage;

