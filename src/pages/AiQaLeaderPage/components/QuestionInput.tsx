import React, { useState } from "react";
import { Button, Input, Modal } from "antd";
import type { TimeRange } from "../types";
import styles from "./QuestionInput.module.css";

interface QuestionInputProps {
  onAsk: (question: string, timeRange: TimeRange, customRange?: [string, string]) => void;
  loading: boolean;
}

const sensitivePatterns = [
  { pattern: /\d{17}[\dXx]/, message: "检测到身份证号" },
  { pattern: /1[3-9]\d{9}/, message: "检测到手机号" },
  { pattern: /(详细地址|家庭住址|居住地址)/, message: "检测到详细地址关键词" },
];

const QuestionInput: React.FC<QuestionInputProps> = ({ onAsk, loading }) => {
  const [question, setQuestion] = useState("");

  const recommendQuestions = [
    { id: 1, text: "本周数据质量红黄灯情况？" },
    { id: 2, text: "TOP异常指标有哪些？" },
    { id: 3, text: "各区县指标排名与变化？" },
    { id: 4, text: "异常增减的指标及原因？" },
    { id: 5, text: "数据共享调用量与成效？" },
    { id: 6, text: "跨部门共享堵点在哪？" },
    { id: 7, text: "数据上报任务完成率？" },
    { id: 8, text: "口径冲突待解决清单？" },
  ];

  const handleAsk = () => {
    const text = question.trim();
    if (!text) return;

    for (const item of sensitivePatterns) {
      if (item.pattern.test(text)) {
        Modal.warning({
          title: "敏感信息提示",
          content: `${item.message}，请勿输入涉密或个人敏感信息，建议改写问题。`,
        });
        return;
      }
    }

    onAsk(text, "7d");
  };

  return (
    <div className={styles.questionInputWrapper}>
      <Input.Search
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="请输入问题（示例：本季度各区县数据质量红黄灯？哪些指标异常？共享堵点在哪？）"
        enterButton="提问"
        size="large"
        onSearch={handleAsk}
        loading={loading}
        addonAfter={
          <Button onClick={() => setQuestion("")} type="text">
            清空
          </Button>
        }
      />

      <div className={styles.recommendSection}>
        <div className={styles.recommendTitle}>推荐问题</div>
        <div className={styles.recommendCards}>
          {recommendQuestions.map((q) => (
            <div key={q.id} className={styles.recommendCard} onClick={() => setQuestion(q.text)}>
              {q.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionInput;
