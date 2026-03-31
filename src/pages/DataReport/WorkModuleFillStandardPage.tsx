import React, { useMemo, useRef, useState } from "react";
import { Button, Input, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

import styles from "./WorkModuleFillPage.module.css";
import reportStyles from "./DataReport.module.css";

type Step = { name: string; desc: string };

const steps: Step[] = [
  { name: "\u90e8\u95e8\u7b80\u4ecb", desc: "\u804c\u80fd\u804c\u8d23\u3001\u7ec4\u7ec7\u67b6\u6784" },
  { name: "\u5de5\u4f5c\u4f53\u7cfb\u67b6\u6784\u56fe", desc: "\u4e0a\u4f20\u4f53\u7cfb\u67b6\u6784\u56fe\u7247" },
  { name: "\u6838\u5fc3\u4e1a\u52a1", desc: "\u4e1a\u52a1\u6811\u68b3\u7406" },
  { name: "\u7279\u8272\u4f18\u52bf", desc: "\u4eae\u70b9\u7279\u8272\u5c55\u793a" },
  { name: "\u6807\u5fd7\u6027\u6210\u679c\u6253\u9020\u60c5\u51b5", desc: "\u91cd\u70b9\u6210\u679c\u4e0e\u8fdb\u5c55" },
  { name: "\u5b58\u5728\u7684\u4e3b\u8981\u95ee\u9898", desc: "\u95ee\u9898\u6e05\u5355\u4e0e\u5206\u6790" },
  { name: "\u4e3b\u8981\u6307\u6807\u6570\u636e\u8868", desc: "\u5173\u952e\u6307\u6807\u7edf\u8ba1" },
  { name: "\u5b63\u5ea6\u4e3b\u8981\u76ee\u6807\u4efb\u52a1\u5206\u89e3\u8868", desc: "\u4efb\u52a1\u5206\u89e3\u4e0e\u8d23\u4efb" },
];

const stepHints: Record<number, string> = {
  1: "\u4ece\u804c\u80fd\u804c\u8d23\u3001\u7ec4\u7ec7\u67b6\u6784\u4e24\u4e2a\u5c42\u9762\u64b0\u5199\u3002\u5305\u542b\u90e8\u95e8\u5185\u8bbe\u79d1\u5ba4\u4e0b\u5c5e\u5355\u4f4d\u3001\u7f16\u5236\u60c5\u51b5\u3001\u4eba\u5458\u6784\u6210\u7b49\u60c5\u51b5\u3002",
  2: "\u56f4\u7ed5\u8d2f\u5f7b\u843d\u5b9e\u4e0a\u7ea7\u90e8\u7f72\u53ca\u201c16912\u201d\u603b\u4f53\u601d\u8def\uff0c\u7ed3\u5408\u672c\u5355\u4f4d\u804c\u80fd\u804c\u8d23\u5236\u5b9a\u672c\u5355\u4f4d\u5de5\u4f5c\u4f53\u7cfb\u67b6\u6784\u56fe\u3002",
  3: "\u4e00\u7ea7\u4e1a\u52a1\u8bf7\u6309\u804c\u80fd\u9886\u57df\u5212\u5206\uff0c\u6bcf\u4e2a\u4e00\u7ea7\u4e1a\u52a1\u4e0b\u9700\u660e\u786e\u5305\u542b\u7684\u4e8c\u7ea7\u4e1a\u52a1\uff08\u5373\u5177\u4f53\u5de5\u4f5c\u4e8b\u9879\uff09\u3002",
  4: "\u4e3b\u8981\u5199\u672c\u5355\u4f4d\u672c\u9886\u57df\u5b58\u5728\u7684\u5ba2\u89c2\u4f18\u52bf\uff0c\u6bd4\u5982\u5e02\u573a\u4e3b\u4f53\u3001\u5e73\u53f0\u8f7d\u4f53\u3001\u91cd\u5927\u9879\u76ee\u3001\u5728\u5168\u5e02\u8303\u56f4\u5185\u5904\u4e8e\u9886\u5148\u6216\u6709\u5148\u5929\u4f18\u52bf\u7684\u7279\u8272\u4ea7\u4e1a\u3001\u8d44\u6e90\u7b49\uff0c\u5217\u51fa5\u9879\u5de6\u53f3\u4eae\u70b9\u5de5\u4f5c\u5e76\u505a\u7b80\u8981\u9610\u8ff0\uff0c\u6bcf\u9879200\u5b57\u4ee5\u5185\u3002",
  5: "\u4e3b\u8981\u5199\u672c\u5355\u4f4d\u5f00\u5c55\u5de5\u4f5c\u4e2d\u6253\u9020\u7684\u6807\u5fd7\u6027\u6210\u679c\uff0c\u6ce8\u91cd\u603b\u7ed3\u4eae\u70b9\u6210\u7ee9\uff0c\u8bf4\u660e\u5168\u5e02\u6392\u540d\u3001\u6240\u83b7\u5956\u9879\u3001\u4e0a\u7ea7\u8868\u626c\u3001\u9886\u5bfc\u80af\u5b9a\u7b49\u60c5\u51b5\u3002\u5217\u51fa5\u9879\u5de6\u53f3\u6807\u5fd7\u6027\u6210\u679c\u5e76\u505a\u7b80\u8981\u9610\u8ff0\uff0c\u6bcf\u9879200\u5b57\u4ee5\u5185\u3002",
  6: "\u6df1\u5165\u67e5\u627e\u672c\u884c\u4e1a\u672c\u9886\u57df\u4e9f\u5f85\u89e3\u51b3\u76845\u4e2a\u5de6\u53f3\u4e3b\u8981\u95ee\u9898\uff0c\u8981\u6709\u6570\u636e\u548c\u4e8b\u4f8b\u652f\u6491\uff0c\u6bd4\u5982\u6392\u4f4d\u9760\u540e\u3001\u5360\u6bd4\u8fc7\u4f4e\u7b49\uff0c\u575a\u51b3\u675c\u7edd\u7a7a\u6cdb\u8868\u8ff0\u3001\u907f\u91cd\u5c31\u8f7b\uff0c\u95ee\u9898\u8981\u76f4\u5207\u8981\u5bb3\uff0c\u91cd\u70b9\u805a\u7126\u6d41\u7a0b\u673a\u5236\u5821\u70b9\u3001\u5de5\u4f5c\u63a8\u8fdb\u504f\u5dee\u3001\u670d\u52a1\u6548\u80fd\u77ed\u677f\u7b49\u95ee\u9898\uff0c\u4e25\u7981\u7b80\u5355\u5f52\u7ed3\u4e3a\u5ba2\u89c2\u6761\u4ef6\u9650\u5236\u6216\u5916\u90e8\u56e0\u7d20\u63a8\u8bff\u3002",
  7: "\u4ee5\u8868\u683c\u7684\u5f62\u5f0f\uff0c\u5448\u73b0\u672c\u90e8\u95e8\u672c\u9886\u57df\u6838\u5fc3\u6307\u6807\u201c\u5341\u56db\u4e94\u201d\u671f\u95f4\u60c5\u51b5\u53ca2026\u5e74\u30012030\u5e74\u76ee\u6807\u3002",
  8: "\u7ed3\u5408\u6838\u5fc3\u4e1a\u52a1\u201c2026\u5e74\u5de5\u4f5c\u6253\u7b97\u201d\uff0c\u4ee5\u8868\u683c\u5f62\u5f0f\u5206\u6761\u63d0\u51fa\u672c\u90e8\u95e8\u672c\u9886\u57df\u91cd\u70b9\u5de5\u4f5c\u6bcf\u5b63\u5ea6\u76ee\u6807\u4efb\u52a1\uff0c\u6587\u5b57\u8868\u8ff0\u8a00\u7b80\u610f\u8d45\uff0c\u7a81\u51fa\u4e3e\u63aa\u548c\u76ee\u6807\u6570\u636e\u3002",
};

const RichEditor: React.FC = () => (
  <div className={styles.richEditor}>
    <div className={styles.editorToolbar}>
      <button className={styles.editorBtn} type="button">
        <b>B</b>
      </button>
      <button className={styles.editorBtn} type="button">
        <i>I</i>
      </button>
      <button className={styles.editorBtn} type="button">
        <u>U</u>
      </button>
      <button className={styles.editorBtn} type="button">UL</button>
      <button className={styles.editorBtn} type="button">OL</button>
    </div>
    <div className={styles.editorBody} style={{ minHeight: 320 }} contentEditable suppressContentEditableWarning />
    <div className={styles.editorFooter}>{"\u5efa\u8bae\u5b57\u6570\uff1a200-500\u5b57"}</div>
  </div>
);

const WorkModuleFillStandardPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [saveTime, setSaveTime] = useState("--:--:--");
  const [fileList, setFileList] = useState<any[]>([]);
  const [indicatorPairs, setIndicatorPairs] = useState<Array<{ id: string; key: string; value: string }>>([
    { id: "kv-01", key: "\u89c4\u4e0a\u5de5\u4e1a\u4ea7\u503c\uff08\u4ebf\u5143\uff09", value: "1250" },
    { id: "kv-02", key: "\u89c4\u4e0a\u5de5\u4e1a\u4ea7\u503c\u589e\u901f\uff08%\uff09", value: "8.5" },
    { id: "kv-03", key: "\u89c4\u4e0a\u5de5\u4e1a\u589e\u52a0\u503c\u589e\u901f\uff08%\uff09", value: "7.2" },
    { id: "kv-04", key: "\u5de5\u4e1a\u6295\u8d44\uff08\u4ebf\u5143\uff09", value: "320" },
    { id: "kv-05", key: "\u5de5\u4e1a\u6295\u8d44\u589e\u901f\uff08%\uff09", value: "6.1" },
    { id: "kv-06", key: "\u5236\u9020\u4e1a\u4ea9\u5747\u7a0e\u6536\u589e\u901f\uff08%\uff09", value: "5.4" },
    { id: "kv-07", key: "\u5236\u9020\u4e1a\u6295\u8d44\uff08\u4ebf\u5143\uff09", value: "210" },
    { id: "kv-08", key: "\u5236\u9020\u4e1a\u6295\u8d44\u589e\u901f\uff08%\uff09", value: "4.8" },
    { id: "kv-09", key: "\u9ad8\u6280\u672f\u5236\u9020\u4e1a\u4ea7\u503c\u5360\u6bd4\uff08%\uff09", value: "32.6" },
    { id: "kv-10", key: "\u4f01\u4e1a\u6280\u672f\u6539\u9020\u6295\u8d44\uff08\u4ebf\u5143\uff09", value: "95" },
    { id: "kv-11", key: "\u5de5\u4e1a\u7528\u7535\u91cf\uff08\u4ebf\u5343\u74e6\u65f6\uff09", value: "58" },
    { id: "kv-12", key: "\u5de5\u4e1a\u7528\u7535\u91cf\u589e\u901f\uff08%\uff09", value: "3.9" },
    { id: "kv-13", key: "\u65b0\u589e\u89c4\u4e0a\u5de5\u4e1a\u4f01\u4e1a\u6570\uff08\u5bb6\uff09", value: "42" },
    { id: "kv-14", key: "\u5355\u4f4d\u80fd\u8017\u4e0b\u964d\uff08%\uff09", value: "2.1" },
    { id: "kv-15", key: "\u5de5\u4e1a\u56fa\u5b9a\u8d44\u4ea7\u6295\u8d44\u589e\u901f\uff08%\uff09", value: "5.9" },
    { id: "kv-16", key: "\u6218\u7565\u6027\u65b0\u5174\u4ea7\u4e1a\u4ea7\u503c\uff08\u4ebf\u5143\uff09", value: "180" },
    { id: "kv-17", key: "\u4e13\u7cbe\u7279\u65b0\u4f01\u4e1a\u6570\uff08\u5bb6\uff09", value: "65" },
    { id: "kv-18", key: "\u9ad8\u65b0\u6280\u672f\u4f01\u4e1a\u6570\uff08\u5bb6\uff09", value: "120" },
    { id: "kv-19", key: "\u79d1\u6280\u578b\u4e2d\u5c0f\u4f01\u4e1a\u6570\uff08\u5bb6\uff09", value: "260" },
    { id: "kv-20", key: "\u5de5\u4e1a\u589e\u503c\u589e\u901f\uff08%\uff09", value: "6.7" },
  ]);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const freqText = useMemo(() => (step >= 7 ? "\u6309\u5b63\u5ea6\u66f4\u65b0" : "\u4e0d\u5b9a\u671f\u66f4\u65b0"), [step]);
  const hintText = stepHints[step];

  const touch = () => {
    const d = new Date();
    const t = `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}:${d
      .getSeconds()
      .toString()
      .padStart(2, "0")}`;
    setSaveTime(t);
  };

  const goPrev = () => {
    setStep((prev) => {
      const next = Math.max(1, prev - 1);
      if (next !== prev) touch();
      return next;
    });
  };

  const goNext = () => {
    setStep((prev) => {
      const next = Math.min(steps.length, prev + 1);
      if (next !== prev) touch();
      return next;
    });
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>{"\u6a21\u5757\u5f55\u5165"}</h1>
        <p className={styles.subtitle}>{"\u5f15\u5bfc\u5f0f\u586b\u5199\u5de5\u4f5c\u6a21\u5757\u5185\u5bb9"}</p>
      </div>

      <div className={reportStyles.tabUploadEntry}>
        <div className={reportStyles.tabUploadHeader}>
          <span className={reportStyles.tabUploadTitle}>{"\u9644\u4ef6\u4e0a\u62a5\uff08\u4e0e\u5728\u7ebf\u586b\u62a5\u4e8c\u9009\u4e00\uff09"}</span>
          <span className={reportStyles.tabUploadHint}>{"\u4e00\u952e\u4e0a\u4f20\u9644\u4ef6\uff0cAI\u81ea\u52a8\u89e3\u6790"}</span>
        </div>
        <Upload
          multiple
          beforeUpload={() => false}
          fileList={fileList}
          onChange={({ fileList: next }) => setFileList(next)}
        >
          <Button icon={<UploadOutlined />}>{"\u4e0a\u4f20\u9644\u4ef6"}</Button>
        </Upload>
        <input ref={fileRef} type="file" style={{ display: "none" }} />
      </div>

      <div className={styles.stepsWrap}>
        {steps.map((s, idx) => {
          const no = idx + 1;
          const cls = no === step ? `${styles.stepItem} ${styles.stepCurrent}` : no < step ? `${styles.stepItem} ${styles.stepDone}` : styles.stepItem;
          return (
            <React.Fragment key={s.name}>
              {idx > 0 ? <div className={no <= step ? `${styles.stepLine} ${styles.stepLineDone}` : styles.stepLine} /> : null}
              <button
                className={cls}
                type="button"
                onClick={() => {
                  setStep(no);
                  touch();
                }}
              >
                <span className={styles.stepNum}>{no}</span>
                <span className={styles.stepInfo}>
                  <span className={styles.stepName}>{s.name}</span>
                  <span className={styles.stepDesc}>{s.desc}</span>
                </span>
              </button>
            </React.Fragment>
          );
        })}
      </div>

      <div className={styles.formBox}>
        <div className={styles.formHeader}>
          <div className={styles.formTitleRow}>
            <span className={styles.formTitle}>
              {step}. {steps[step - 1].name}
            </span>
            <span className={styles.freqTag}>{freqText}</span>
          </div>
          <div className={styles.autoSaveText}>{"\u81ea\u52a8\u4fdd\u5b58\u4e8e "}{saveTime}</div>
        </div>

        {hintText ? <div className={styles.richHint}>{hintText}</div> : null}
        <RichEditor />
        {step === 7 ? (
          <div style={{ marginTop: 16 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ border: "1px solid #e8e8e8", background: "#fafafa", padding: 8, textAlign: "left" }}>
                    {"\u6307\u6807\u540d\u79f0"}
                  </th>
                  <th style={{ border: "1px solid #e8e8e8", background: "#fafafa", padding: 8, textAlign: "left" }}>
                    {"\u6307\u6807\u503c"}
                  </th>
                  <th style={{ border: "1px solid #e8e8e8", background: "#fafafa", padding: 8, textAlign: "left" }}>
                    {"\u6307\u6807\u540d\u79f0"}
                  </th>
                  <th style={{ border: "1px solid #e8e8e8", background: "#fafafa", padding: 8, textAlign: "left" }}>
                    {"\u6307\u6807\u503c"}
                  </th>
                  <th style={{ border: "1px solid #e8e8e8", background: "#fafafa", padding: 8, textAlign: "left" }}>
                    {"\u6307\u6807\u540d\u79f0"}
                  </th>
                  <th style={{ border: "1px solid #e8e8e8", background: "#fafafa", padding: 8, textAlign: "left" }}>
                    {"\u6307\u6807\u503c"}
                  </th>
                  <th style={{ border: "1px solid #e8e8e8", background: "#fafafa", padding: 8, textAlign: "left" }}>
                    {"\u6307\u6807\u540d\u79f0"}
                  </th>
                  <th style={{ border: "1px solid #e8e8e8", background: "#fafafa", padding: 8, textAlign: "left" }}>
                    {"\u6307\u6807\u503c"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 5 }).map((_, rowIndex) => {
                  const first = indicatorPairs[rowIndex * 4];
                  const second = indicatorPairs[rowIndex * 4 + 1];
                  const third = indicatorPairs[rowIndex * 4 + 2];
                  const fourth = indicatorPairs[rowIndex * 4 + 3];
                  return (
                    <tr key={`row-${rowIndex}`}>
                      <td style={{ border: "1px solid #e8e8e8", padding: 8 }}>
                        {first ? (
                          <Input
                            value={first.key}
                            onChange={(e) =>
                              setIndicatorPairs((prev) =>
                                prev.map((p) => (p.id === first.id ? { ...p, key: e.target.value } : p)),
                              )
                            }
                            placeholder="\u6307\u6807\u540d\u79f0"
                          />
                        ) : null}
                      </td>
                      <td style={{ border: "1px solid #e8e8e8", padding: 8 }}>
                        {first ? (
                          <Input
                            value={first.value}
                            onChange={(e) =>
                              setIndicatorPairs((prev) =>
                                prev.map((p) => (p.id === first.id ? { ...p, value: e.target.value } : p)),
                              )
                            }
                          />
                        ) : null}
                      </td>
                      <td style={{ border: "1px solid #e8e8e8", padding: 8 }}>
                        {second ? (
                          <Input
                            value={second.key}
                            onChange={(e) =>
                              setIndicatorPairs((prev) =>
                                prev.map((p) => (p.id === second.id ? { ...p, key: e.target.value } : p)),
                              )
                            }
                            placeholder="\u6307\u6807\u540d\u79f0"
                          />
                        ) : null}
                      </td>
                      <td style={{ border: "1px solid #e8e8e8", padding: 8 }}>
                        {second ? (
                          <Input
                            value={second.value}
                            onChange={(e) =>
                              setIndicatorPairs((prev) =>
                                prev.map((p) => (p.id === second.id ? { ...p, value: e.target.value } : p)),
                              )
                            }
                          />
                        ) : null}
                      </td>
                      <td style={{ border: "1px solid #e8e8e8", padding: 8 }}>
                        {third ? (
                          <Input
                            value={third.key}
                            onChange={(e) =>
                              setIndicatorPairs((prev) =>
                                prev.map((p) => (p.id === third.id ? { ...p, key: e.target.value } : p)),
                              )
                            }
                            placeholder="\u6307\u6807\u540d\u79f0"
                          />
                        ) : null}
                      </td>
                      <td style={{ border: "1px solid #e8e8e8", padding: 8 }}>
                        {third ? (
                          <Input
                            value={third.value}
                            onChange={(e) =>
                              setIndicatorPairs((prev) =>
                                prev.map((p) => (p.id === third.id ? { ...p, value: e.target.value } : p)),
                              )
                            }
                          />
                        ) : null}
                      </td>
                      <td style={{ border: "1px solid #e8e8e8", padding: 8 }}>
                        {fourth ? (
                          <Input
                            value={fourth.key}
                            onChange={(e) =>
                              setIndicatorPairs((prev) =>
                                prev.map((p) => (p.id === fourth.id ? { ...p, key: e.target.value } : p)),
                              )
                            }
                            placeholder="\u6307\u6807\u540d\u79f0"
                          />
                        ) : null}
                      </td>
                      <td style={{ border: "1px solid #e8e8e8", padding: 8 }}>
                        {fourth ? (
                          <Input
                            value={fourth.value}
                            onChange={(e) =>
                              setIndicatorPairs((prev) =>
                                prev.map((p) => (p.id === fourth.id ? { ...p, value: e.target.value } : p)),
                              )
                            }
                          />
                        ) : null}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>

      <div className={styles.footer}>
        <div className={styles.footerLeft}>
          <Button onClick={goPrev} disabled={step === 1}>
            {"\u4e0a\u4e00\u6b65"}
          </Button>
          <Button onClick={goNext} disabled={step === steps.length}>
            {"\u4e0b\u4e00\u6b65"}
          </Button>
        </div>
        <div className={styles.footerRight}>
          <Button>{"\u6682\u5b58\u8349\u7a3f"}</Button>
          <Button type="primary">{"\u63d0\u4ea4"}</Button>
        </div>
      </div>
    </div>
  );
};

export default WorkModuleFillStandardPage;
