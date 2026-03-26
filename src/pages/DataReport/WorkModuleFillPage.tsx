import React, { useMemo, useRef, useState } from "react";
import { Button, Input, message } from "antd";

import styles from "./WorkModuleFillPage.module.css";

type Step = { name: string; desc: string };
type CardItem = { id: string; title: string; detail: string };
type IndicatorRow = { id: string; name: string; values: string[] };
type TaskRow = { id: string; name: string; quarters: string[]; owner: string };

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

const yearHeaders = ["2021\u5e74", "2022\u5e74", "2023\u5e74", "2024\u5e74", "2025\u5e74", "2026\u76ee\u6807", "2030\u76ee\u6807"];
const quarterHeaders = ["\u7b2c\u4e00\u5b63\u5ea6", "\u7b2c\u4e8c\u5b63\u5ea6", "\u7b2c\u4e09\u5b63\u5ea6", "\u7b2c\u56db\u5b63\u5ea6"];

const rid = () => Math.random().toString(36).slice(2);
const newCard = (): CardItem => ({ id: rid(), title: "", detail: "" });
const newIndicator = (): IndicatorRow => ({ id: rid(), name: "", values: Array.from({ length: 7 }, () => "") });
const newTask = (): TaskRow => ({ id: rid(), name: "", quarters: Array.from({ length: 4 }, () => ""), owner: "" });

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
    <div className={styles.editorBody} contentEditable suppressContentEditableWarning />
    <div className={styles.editorFooter}>{"\u5efa\u8bae\u5b57\u6570\uff1a200-500\u5b57"}</div>
  </div>
);

const WorkModuleFillPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [saveTime, setSaveTime] = useState("--:--:--");
  const [bizCards, setBizCards] = useState<CardItem[]>([newCard()]);
  const [resultCards, setResultCards] = useState<CardItem[]>([newCard()]);
  const [problemCards, setProblemCards] = useState<CardItem[]>([newCard()]);
  const [indicatorRows, setIndicatorRows] = useState<IndicatorRow[]>([newIndicator()]);
  const [taskRows, setTaskRows] = useState<TaskRow[]>([newTask()]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const freqText = useMemo(() => (step >= 7 ? "\u6309\u5b63\u5ea6\u66f4\u65b0" : "\u4e0d\u5b9a\u671f\u66f4\u65b0"), [step]);

  const touch = () => {
    const d = new Date();
    const t = `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}:${d
      .getSeconds()
      .toString()
      .padStart(2, "0")}`;
    setSaveTime(t);
  };

  const updateCard = (
    setter: React.Dispatch<React.SetStateAction<CardItem[]>>,
    id: string,
    field: "title" | "detail",
    value: string,
  ) => setter((prev) => prev.map((it) => (it.id === id ? { ...it, [field]: value } : it)));

  const removeCard = (setter: React.Dispatch<React.SetStateAction<CardItem[]>>, id: string) =>
    setter((prev) => prev.filter((it) => it.id !== id));

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

        {step === 1 ? (
          <>
            <div className={styles.fieldBlock}>
              <label className={styles.label}>{"\uff08\u4e00\uff09\u804c\u80fd\u804c\u8d23 *"}</label>
              <RichEditor />
            </div>
            <div className={styles.fieldBlock}>
              <label className={styles.label}>{"\uff08\u4e8c\uff09\u7ec4\u7ec7\u67b6\u6784"}</label>
              <RichEditor />
            </div>
          </>
        ) : null}

        {step === 2 ? (
          <>
            <div className={styles.uploadArea} onClick={() => fileRef.current?.click()} role="presentation">
              <div className={styles.uploadIcon}>{"\u4e0a\u4f20"}</div>
              <div>{"\u70b9\u51fb\u6216\u62d6\u62fd\u6587\u4ef6\u5230\u6b64\u533a\u57df\u4e0a\u4f20"}</div>
              <div className={styles.uploadHint}>{"\u652f\u6301 JPG\u3001PNG\u3001PDF \u683c\u5f0f\uff0c\u6587\u4ef6\u5927\u5c0f\u4e0d\u8d85\u8fc7 10MB"}</div>
              <input
                ref={fileRef}
                type="file"
                className={styles.hiddenInput}
                accept="image/*,.pdf"
                onChange={(e) => {
                  setUploadedFiles(e.target.files ? Array.from(e.target.files) : []);
                  touch();
                }}
              />
            </div>
            {uploadedFiles.length > 0 ? (
              <div className={styles.uploadList}>
                {uploadedFiles.map((f) => (
                  <div key={f.name} className={styles.uploadItem}>
                    {f.name}
                  </div>
                ))}
              </div>
            ) : null}
          </>
        ) : null}

        {step === 3 ? (
          <div>
            <div className={styles.cardList}>
              {bizCards.map((card) => (
                <div key={card.id} className={styles.cardItem}>
                  <button className={styles.deleteBtn} type="button" onClick={() => removeCard(setBizCards, card.id)}>
                    X
                  </button>
                  <div className={styles.fieldBlock}>
                    <label className={styles.label}>{"\u4e1a\u52a1\u540d\u79f0"}</label>
                    <Input value={card.title} onChange={(e) => updateCard(setBizCards, card.id, "title", e.target.value)} />
                  </div>
                  <div className={styles.fieldBlock}>
                    <label className={styles.label}>{"\u8be6\u7ec6\u8bf4\u660e"}</label>
                    <Input.TextArea rows={4} value={card.detail} onChange={(e) => updateCard(setBizCards, card.id, "detail", e.target.value)} />
                  </div>
                </div>
              ))}
            </div>
            <button className={styles.addBtn} type="button" onClick={() => setBizCards((prev) => [...prev, newCard()])}>
              {"+ \u6dfb\u52a0\u4e1a\u52a1"}
            </button>
          </div>
        ) : null}

        {step === 4 ? <RichEditor /> : null}

        {step === 5 ? (
          <div>
            <div className={styles.cardList}>
              {resultCards.map((card) => (
                <div key={card.id} className={styles.cardItem}>
                  <button className={styles.deleteBtn} type="button" onClick={() => removeCard(setResultCards, card.id)}>
                    X
                  </button>
                  <div className={styles.fieldBlock}>
                    <label className={styles.label}>{"\u6210\u679c\u6807\u9898"}</label>
                    <Input value={card.title} onChange={(e) => updateCard(setResultCards, card.id, "title", e.target.value)} />
                  </div>
                  <div className={styles.fieldBlock}>
                    <label className={styles.label}>{"\u8be6\u7ec6\u8bf4\u660e"}</label>
                    <Input.TextArea rows={4} value={card.detail} onChange={(e) => updateCard(setResultCards, card.id, "detail", e.target.value)} />
                  </div>
                </div>
              ))}
            </div>
            <button className={styles.addBtn} type="button" onClick={() => setResultCards((prev) => [...prev, newCard()])}>
              {"+ \u6dfb\u52a0\u6210\u679c"}
            </button>
          </div>
        ) : null}

        {step === 6 ? (
          <div>
            <div className={styles.cardList}>
              {problemCards.map((card) => (
                <div key={card.id} className={styles.cardItem}>
                  <button className={styles.deleteBtn} type="button" onClick={() => removeCard(setProblemCards, card.id)}>
                    X
                  </button>
                  <div className={styles.fieldBlock}>
                    <label className={styles.label}>{"\u95ee\u9898\u6807\u9898"}</label>
                    <Input value={card.title} onChange={(e) => updateCard(setProblemCards, card.id, "title", e.target.value)} />
                  </div>
                  <div className={styles.fieldBlock}>
                    <label className={styles.label}>{"\u8be6\u7ec6\u8bf4\u660e"}</label>
                    <Input.TextArea rows={4} value={card.detail} onChange={(e) => updateCard(setProblemCards, card.id, "detail", e.target.value)} />
                  </div>
                </div>
              ))}
            </div>
            <button className={styles.addBtn} type="button" onClick={() => setProblemCards((prev) => [...prev, newCard()])}>
              {"+ \u6dfb\u52a0\u95ee\u9898"}
            </button>
          </div>
        ) : null}

        {step === 7 ? (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{"\u6307\u6807\u540d\u79f0"}</th>
                  {yearHeaders.map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {indicatorRows.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <Input value={row.name} onChange={(e) => setIndicatorRows((p) => p.map((x) => (x.id === row.id ? { ...x, name: e.target.value } : x)))} />
                    </td>
                    {row.values.map((v, i) => (
                      <td key={`${row.id}-${i}`}>
                        <Input
                          value={v}
                          onChange={(e) =>
                            setIndicatorRows((p) =>
                              p.map((x) =>
                                x.id === row.id ? { ...x, values: x.values.map((cv, ci) => (ci === i ? e.target.value : cv)) } : x,
                              ),
                            )
                          }
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <button className={styles.addBtn} type="button" onClick={() => setIndicatorRows((prev) => [...prev, newIndicator()])}>
              {"+ \u6dfb\u52a0\u6307\u6807"}
            </button>
          </div>
        ) : null}

        {step === 8 ? (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{"\u4efb\u52a1\u540d\u79f0"}</th>
                  {quarterHeaders.map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                  <th>{"\u8d23\u4efb\u4eba"}</th>
                </tr>
              </thead>
              <tbody>
                {taskRows.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <Input value={row.name} onChange={(e) => setTaskRows((p) => p.map((x) => (x.id === row.id ? { ...x, name: e.target.value } : x)))} />
                    </td>
                    {row.quarters.map((v, i) => (
                      <td key={`${row.id}-${i}`}>
                        <Input.TextArea
                          rows={2}
                          value={v}
                          onChange={(e) =>
                            setTaskRows((p) =>
                              p.map((x) =>
                                x.id === row.id ? { ...x, quarters: x.quarters.map((cv, ci) => (ci === i ? e.target.value : cv)) } : x,
                              ),
                            )
                          }
                        />
                      </td>
                    ))}
                    <td>
                      <Input value={row.owner} onChange={(e) => setTaskRows((p) => p.map((x) => (x.id === row.id ? { ...x, owner: e.target.value } : x)))} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className={styles.addBtn} type="button" onClick={() => setTaskRows((prev) => [...prev, newTask()])}>
              {"+ \u6dfb\u52a0\u4efb\u52a1"}
            </button>
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
          <Button onClick={() => message.success("\u8349\u7a3f\u5df2\u6682\u5b58")}>{"\u6682\u5b58\u8349\u7a3f"}</Button>
          <Button type="primary" onClick={() => message.success("\u63d0\u4ea4\u6210\u529f")}>{"\u63d0\u4ea4"}</Button>
        </div>
      </div>
    </div>
  );
};

export default WorkModuleFillPage;
