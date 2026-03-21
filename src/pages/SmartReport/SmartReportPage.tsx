import React, { useEffect, useMemo, useRef, useState } from "react";
import { Alert, Button, message } from "antd";
import { FileTextOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

import ReportListPanel from "./components/ReportListPanel";
import ReportGenerating from "./components/ReportGenerating";
import ReportContent from "./components/ReportContent";
import {
  generatingSteps,
  knowledgeBaseOptions,
  reportContent,
  reportList,
  type ReportItem,
} from "./smartReportMockData";

type RightView = "empty" | "generating" | "content" | "failed";

const SmartReportPage: React.FC = () => {
  const [reports, setReports] = useState<ReportItem[]>(reportList);
  const [topic, setTopic] = useState("");
  const [selectedKbIds, setSelectedKbIds] = useState<string[]>([]);
  const [activeReportId, setActiveReportId] = useState("");
  const [view, setView] = useState<RightView>("empty");
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const timerRef = useRef<number | null>(null);
  const generatingIdRef = useRef<string | null>(null);

  const activeReport = useMemo(() => reports.find((r) => r.id === activeReportId) ?? null, [reports, activeReportId]);

  const metrics = useMemo(
    () => [
      { name: "数据获取", value: Math.min(100, progress + 5), color: "#52c41a" },
      { name: "深度研究", value: Math.min(100, Math.max(8, progress - 8)), color: "#1890ff" },
      { name: "工具调用", value: Math.min(100, Math.max(6, progress - 15)), color: "#faad14" },
      { name: "综合生成", value: Math.min(100, Math.max(4, progress - 24)), color: "#13c2c2" },
      { name: "质量评估", value: Math.min(100, Math.max(2, progress - 34)), color: "#722ed1" },
    ],
    [progress],
  );

  const clearTimer = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const completeGenerate = (id: string, sec: number) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "completed",
              generatedAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
              relativeTime: "刚刚",
              duration: `0分${Math.max(1, sec)}秒`,
              title: `${(r.topic || "智能报告").slice(0, 20)}${r.topic.length > 20 ? "..." : ""}`,
            }
          : r,
      ),
    );

    if (activeReportId === id) {
      setView("content");
    }
    message.success("报告生成完成");
  };

  const startGenerating = (id: string, fromRefresh = false) => {
    clearTimer();
    generatingIdRef.current = id;

    if (!fromRefresh) {
      setProgress(0);
      setElapsed(0);
      setCurrentStep(1);
    }

    timerRef.current = window.setInterval(() => {
      setElapsed((v) => v + 2);
      setCurrentStep((s) => Math.min(generatingSteps.length, s + 1));
      setProgress((p) => {
        const next = Math.min(100, p + 10);
        if (next >= 100) {
          clearTimer();
          completeGenerate(id, elapsed + 2);
        }
        return next;
      });
    }, 2000);
  };

  useEffect(() => {
    return () => clearTimer();
  }, []);

  const handleGenerate = () => {
    const t = topic.trim();
    if (!t) return;

    const id = `report-${Date.now()}`;
    const item: ReportItem = {
      id,
      title: t.length > 22 ? `${t.slice(0, 22)}...` : t,
      topic: t,
      status: "generating",
      generatedAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      relativeTime: "刚刚",
      duration: null,
      knowledgeBases: knowledgeBaseOptions.filter((k) => selectedKbIds.includes(String(k.value))).map((k) => String(k.label)),
    };

    setReports((prev) => [item, ...prev]);
    setActiveReportId(id);
    setView("generating");
    startGenerating(id);
  };

  const handleSelectReport = (id: string) => {
    setActiveReportId(id);
    const r = reports.find((x) => x.id === id);
    if (!r) {
      setView("empty");
      return;
    }
    if (r.status === "completed") setView("content");
    else if (r.status === "generating") {
      setView("generating");
      if (generatingIdRef.current !== id && progress === 0) {
        startGenerating(id);
      }
    } else setView("failed");
  };

  const handleDeleteReport = (id: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
    if (id === activeReportId) {
      setActiveReportId("");
      setView("empty");
    }
    if (generatingIdRef.current === id) {
      clearTimer();
      generatingIdRef.current = null;
    }
    message.success("已删除报告");
  };

  const handleClearAll = () => {
    setReports([]);
    setActiveReportId("");
    setView("empty");
    clearTimer();
    generatingIdRef.current = null;
    message.success("已清空历史报告");
  };

  const handleRegenerate = () => {
    if (!activeReport) return;
    setReports((prev) => prev.map((r) => (r.id === activeReport.id ? { ...r, status: "generating", duration: null } : r)));
    setView("generating");
    startGenerating(activeReport.id);
  };

  const handleRefreshGenerating = () => {
    if (!activeReport) return;
    setProgress(100);
    setCurrentStep(10);
    setElapsed((v) => (v > 0 ? v : 20));
    clearTimer();
    completeGenerate(activeReport.id, Math.max(20, elapsed));
  };

  const isCreating = view === "generating" && activeReport?.status === "generating";

  return (
    <div style={{ display: "flex", height: "calc(100vh - 56px)", overflow: "hidden", background: "#f5f5f5" }}>
      <ReportListPanel
        topic={topic}
        selectedKbIds={selectedKbIds}
        kbOptions={knowledgeBaseOptions as Array<{ label: string; value: string }>}
        reports={reports}
        activeReportId={activeReportId}
        creating={isCreating}
        onTopicChange={setTopic}
        onKbChange={setSelectedKbIds}
        onGenerate={handleGenerate}
        onClearAll={handleClearAll}
        onSelectReport={handleSelectReport}
        onDeleteReport={handleDeleteReport}
        onExportReport={() => message.info("功能开发中，敬请期待")}
      />

      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {(view === "empty" || !activeReport) && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <FileTextOutlined style={{ fontSize: 64, color: "#d9d9d9" }} />
            <div style={{ marginTop: 12, fontSize: 14, color: "#bfbfbf" }}>请在左侧输入报告主题生成报告，或选择历史报告查看</div>
          </div>
        )}

        {view === "generating" && activeReport && (
          <ReportGenerating
            topic={activeReport.topic}
            progress={progress}
            elapsed={elapsed}
            currentStep={currentStep}
            metrics={metrics}
            onRefresh={handleRefreshGenerating}
            onClose={() => setView("empty")}
          />
        )}

        {view === "content" && activeReport && <ReportContent report={activeReport} content={reportContent} onRegenerate={handleRegenerate} />}

        {view === "failed" && activeReport && (
          <div style={{ padding: 24 }}>
            <Alert
              type="error"
              showIcon
              message="报告生成失败"
              description="该报告在生成过程中发生异常，请点击“重新生成”再次尝试。"
              action={<Button onClick={handleRegenerate}>重新生成</Button>}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartReportPage;
