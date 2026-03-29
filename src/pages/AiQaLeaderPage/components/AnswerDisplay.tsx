import React from "react";
import { Empty, Skeleton } from "antd";
import type { QaAnswer } from "../types";
import styles from "./AnswerDisplay.module.css";

interface AnswerDisplayProps {
  answer: QaAnswer | null;
  loading: boolean;
}

const AnswerDisplay: React.FC<AnswerDisplayProps> = ({ answer, loading }) => {
  if (loading) {
    return (
      <div className={styles.answerArea}>
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  if (!answer) {
    return (
      <div className={styles.answerArea}>
        <div className={styles.emptyWrapper}>
          <Empty description="请输入问题或点击推荐问题开始" />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.answerArea}>
      <div className={styles.summaryText}>
        {answer.summary.map((item, index) => `${index + 1}. ${item}`).join("\n")}
      </div>
    </div>
  );
};

export default AnswerDisplay;
