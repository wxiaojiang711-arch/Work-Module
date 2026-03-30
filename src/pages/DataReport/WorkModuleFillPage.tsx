import React, { useMemo, useRef, useState } from "react";
import { Button, Input, message } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";

import styles from "./WorkModuleFillPage.module.css";

type Step = { name: string; desc: string };
type CardItem = { id: string; title: string; detail: string };
type IndicatorRow = { id: string; type: string; name: string; values: string[]; ranks: string[] };
type TaskRow = { id: string; name: string; quarters: string[]; owner: string };
type BizLevel2 = { id: string; name: string };
type BizLevel1 = { id: string; name: string; children: BizLevel2[] };

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

const yearHeaders = ["2021\u5e74", "2022\u5e74", "2023\u5e74", "2024\u5e74", "2025\u5e74", "2026\u5e74\u76ee\u6807", "2030\u5e74\u76ee\u6807"];
const quarterHeaders = ["\u7b2c\u4e00\u5b63\u5ea6", "\u7b2c\u4e8c\u5b63\u5ea6", "\u7b2c\u4e09\u5b63\u5ea6", "\u7b2c\u56db\u5b63\u5ea6"];

const rid = () => Math.random().toString(36).slice(2);
const newCard = (): CardItem => ({ id: rid(), title: "", detail: "" });
const newLevel2 = (): BizLevel2 => ({ id: rid(), name: "" });
const newLevel1 = (): BizLevel1 => ({ id: rid(), name: "", children: [newLevel2(), newLevel2()] });
const newIndicator = (): IndicatorRow => ({
  id: rid(),
  type: "",
  name: "",
  values: Array.from({ length: 7 }, () => ""),
  ranks: Array.from({ length: 5 }, () => ""),
});
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
  const [bizTree, setBizTree] = useState<BizLevel1[]>([newLevel1()]);
  const [advantageCards, setAdvantageCards] = useState<CardItem[]>([newCard()]);
  const [resultCards, setResultCards] = useState<CardItem[]>([newCard()]);
  const [problemCards, setProblemCards] = useState<CardItem[]>([newCard()]);
  const [indicatorRows, setIndicatorRows] = useState<IndicatorRow[]>([newIndicator(), newIndicator()]);
  const [taskRows, setTaskRows] = useState<TaskRow[]>([newTask(), newTask()]);
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

  const updateLevel1Name = (id: string, value: string) => {
    setBizTree((prev) => prev.map((it) => (it.id === id ? { ...it, name: value } : it)));
  };

  const removeLevel1 = (id: string) => {
    setBizTree((prev) => (prev.length <= 1 ? prev : prev.filter((it) => it.id !== id)));
  };

  const addLevel1 = () => setBizTree((prev) => [...prev, newLevel1()]);

  const updateLevel2Name = (level1Id: string, level2Id: string, value: string) => {
    setBizTree((prev) =>
      prev.map((it) =>
        it.id === level1Id
          ? { ...it, children: it.children.map((child) => (child.id === level2Id ? { ...child, name: value } : child)) }
          : it,
      ),
    );
  };

  const addLevel2After = (level1Id: string, level2Id: string) => {
    setBizTree((prev) =>
      prev.map((it) => {
        if (it.id !== level1Id) return it;
        const idx = it.children.findIndex((child) => child.id === level2Id);
        if (idx === -1) return it;
        const nextChildren = [...it.children];
        nextChildren.splice(idx + 1, 0, newLevel2());
        return { ...it, children: nextChildren };
      }),
    );
  };

  const removeLevel2 = (level1Id: string, level2Id: string) => {
    setBizTree((prev) =>
      prev.map((it) =>
        it.id === level1Id && it.children.length > 1
          ? { ...it, children: it.children.filter((child) => child.id !== level2Id) }
          : it,
      ),
    );
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
            <div className={`${styles.richHint} ${styles.stepIntroHint}`}>
              从职能职责、组织架构两个层面撰写。包含部门内设科室下属单位、编制情况、人员构成等情况。
            </div>
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
            <div className={styles.richHint}>
              围绕贯彻落实上级部署及“16912”总体思路，结合本单位职能职责制定本单位工作体系架构图。
            </div>
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
            <div className={`${styles.richHint} ${styles.richHintTop}`}>
              <div>1. 一级业务请按职能领域划分，每个一级业务下需明确包含的二级业务（即具体工作事项），注意与工作体系架构图保持衔接；</div>
              <div>2. 每个一级业务填写内容应包含三部分：基本情况（需站在本行业本领域角度，简要介绍该业务的基本情况、基础数据，所涉数据尽量有横向、纵向对比，数据截至2026年2月，此处不谈工作做法）、2025年工作开展情况及成效（重点突出举措数据、成果）、2026年工作打算（计划目标、重点任务）；</div>
              <div>3. “2025年工作开展情况及成效”部分建议按照各个二级业务进行分点（使用123......进行分点），逐项简要说明；</div>
              <div>4. 每个一级业务总字数控制在500字以内，其中基本情况约100字，2025年工作约300字，2026年打算约100字。</div>
            </div>
            <div className={styles.orgTreeContainer}>
              <div className={styles.orgTreeLevel1}>
                {bizTree.map((level1) => (
                  <div key={level1.id} className={styles.orgTreeLevel1Item}>
                    <div className={styles.orgTreeLevel1Header}>
                      <span className={styles.orgTreeIcon}>{"\ud83d\udcc1"}</span>
                      <Input
                        className={styles.orgTreeInput}
                        placeholder={"\u4e00\u7ea7\u4e1a\u52a1"}
                        value={level1.name}
                        onChange={(e) => updateLevel1Name(level1.id, e.target.value)}
                      />
                      <div className={styles.orgTreeActions}>
                        <button
                          className={`${styles.orgTreeBtn} ${styles.delete}`}
                          type="button"
                          disabled={bizTree.length <= 1}
                          onClick={() => removeLevel1(level1.id)}
                        >
                          <DeleteOutlined />
                        </button>
                      </div>
                    </div>
                    <div className={styles.orgTreeLevel2}>
                      {level1.children.map((level2) => (
                        <div key={level2.id} className={styles.orgTreeLevel2Item}>
                          <span className={styles.orgTreeLevel2Icon}>{"\ud83d\udcc4"}</span>
                          <Input
                            className={styles.orgTreeInput}
                            placeholder={"\u4e8c\u7ea7\u4e1a\u52a1"}
                            value={level2.name}
                            onChange={(e) => updateLevel2Name(level1.id, level2.id, e.target.value)}
                          />
                          <div className={styles.orgTreeLevel2Actions}>
                            <button
                              className={`${styles.orgTreeLevel2Btn} ${styles.add}`}
                              type="button"
                              onClick={() => addLevel2After(level1.id, level2.id)}
                            >
                              <PlusOutlined />
                            </button>
                            <button
                              className={`${styles.orgTreeLevel2Btn} ${styles.delete}`}
                              type="button"
                              disabled={level1.children.length <= 1}
                              onClick={() => removeLevel2(level1.id, level2.id)}
                            >
                              <DeleteOutlined />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className={styles.fieldBlock} style={{ marginTop: 12 }}>
                      <label className={styles.label}>{"\u4e1a\u52a1\u8bf4\u660e"}</label>
                      <RichEditor />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button className={styles.addBtn} type="button" onClick={addLevel1}>
              {"+ \u6dfb\u52a0\u4e00\u7ea7\u4e1a\u52a1"}
            </button>
          </div>
        ) : null}

        {step === 4 ? (
          <div>
            <div className={styles.richHint}>
              主要写本单位本领域存在的客观优势，比如市场主体、平台载体、重大项目、在全市范围内处于领先或有先天优势的特色产业、资源等，包括但不限于在全国、双圈、全市中的排位或占比，列出5项左右亮点工作并做简要阐述，每项200字以内。
            </div>
            <div className={styles.cardList}>
              {advantageCards.map((card) => (
                <div key={card.id} className={styles.cardItem}>
                  <button className={styles.deleteBtn} type="button" onClick={() => removeCard(setAdvantageCards, card.id)}>
                    X
                  </button>
                  <div className={styles.fieldBlock}>
                    <label className={styles.label}>{"\u7279\u8272\u4f18\u52bf\u6807\u9898"}</label>
                    <Input value={card.title} onChange={(e) => updateCard(setAdvantageCards, card.id, "title", e.target.value)} />
                  </div>
                  <div className={styles.fieldBlock}>
                    <label className={styles.label}>{"\u8be6\u7ec6\u8bf4\u660e"}</label>
                    <Input.TextArea rows={4} value={card.detail} onChange={(e) => updateCard(setAdvantageCards, card.id, "detail", e.target.value)} />
                  </div>
                </div>
              ))}
            </div>
            <button className={styles.addBtn} type="button" onClick={() => setAdvantageCards((prev) => [...prev, newCard()])}>
              {"+ \u6dfb\u52a0\u7279\u8272\u4f18\u52bf"}
            </button>
          </div>
        ) : null}

        {step === 5 ? (
          <div>
            <div className={styles.richHint}>
              主要写本单位开展工作中打造的标志性成果，注重总结亮点成绩，说明全市排名、所获奖项、上级表扬、领导肯定等情况。列出5项左右标志性成果并做简要阐述，每项200字以内。
            </div>
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
            <div className={styles.richHint}>
              深入查找本行业本领域亟待解决的5个左右主要问题，要有数据和事例支撑，比如排位靠后、占比过低等，坚决杜绝空泛表述、避重就轻，问题要直切要害，重点聚焦流程机制堵点、工作推进偏差、服务效能短板等问题，严禁简单归结为客观条件限制或外部因素推诿(如人手短缺、基层配合不力等)，不写恳请支持事项，每项200字以内。
            </div>
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
            <div className={styles.richHint}>
              以表格的形式，呈现本部门本领域核心指标“十四五”期间情况及2026年、2030年目标。
            </div>
            <table className={styles.table}>
              <colgroup>
                <col className={styles.colType} />
                <col className={styles.colName} />
                <col className={styles.colYear} />
                <col className={styles.colYear} />
                <col className={styles.colYear} />
                <col className={styles.colYear} />
                <col className={styles.colYear} />
                <col className={styles.colTarget} />
                <col className={styles.colTarget} />
                <col className={styles.colOp} />
              </colgroup>
              <thead>
                <tr>
                  <th className={styles.centerCell}>{"\u6307\u6807\u7c7b\u578b"}</th>
                  <th className={styles.centerCell}>{"\u6307\u6807\u540d\u79f0"}</th>
                  {yearHeaders.map((h) =>
                    ["2021年", "2022年", "2023年", "2024年", "2025年"].includes(h) ? (
                      <th key={h} className={`${styles.splitCol} ${styles.yearHeaderShift}`}>
                        <div className={styles.yearHeader}>
                          <div>{h}</div>
                          <div className={`${styles.splitGrid} ${styles.yearHeaderDivider}`}>
                            <div className={`${styles.splitGridCol} ${styles.splitGridColHeader}`}>我区情况</div>
                            <div className={`${styles.splitGridCol} ${styles.splitGridColHeader}`}>全市排名</div>
                          </div>
                        </div>
                      </th>
                    ) : (
                      <th key={h} className={styles.centerCell}>{h}</th>
                    ),
                  )}
                  <th className={`${styles.centerCell} ${styles.opCol}`}>{"\u64cd\u4f5c"}</th>
                </tr>
              </thead>
              <tbody>
                {indicatorRows.map((row) => (
                  <tr key={row.id}>
                    <td className={styles.centerCell}>
                      <Input value={row.type} onChange={(e) => setIndicatorRows((p) => p.map((x) => (x.id === row.id ? { ...x, type: e.target.value } : x)))} />
                    </td>
                    <td className={styles.centerCell}>
                      <Input value={row.name} onChange={(e) => setIndicatorRows((p) => p.map((x) => (x.id === row.id ? { ...x, name: e.target.value } : x)))} />
                    </td>
                    {row.values.map((v, i) => (
                      <td key={`${row.id}-${i}`} className={i <= 4 ? styles.splitCol : styles.centerCell}>
                        {i <= 4 ? (
                          <div className={styles.splitGrid}>
                            <div className={styles.splitGridCol}>
                              <Input
                                value={v}
                                onChange={(e) =>
                                  setIndicatorRows((p) =>
                                    p.map((x) =>
                                      x.id === row.id
                                        ? { ...x, values: x.values.map((cv, ci) => (ci === i ? e.target.value : cv)) }
                                        : x,
                                    ),
                                  )
                                }
                              />
                            </div>
                            <div className={styles.splitGridCol}>
                              <Input
                                value={row.ranks[i]}
                                onChange={(e) =>
                                  setIndicatorRows((p) =>
                                    p.map((x) =>
                                      x.id === row.id ? { ...x, ranks: x.ranks.map((rv, ri) => (ri === i ? e.target.value : rv)) } : x,
                                    ),
                                  )
                                }
                              />
                            </div>
                          </div>
                        ) : (
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
                        )}
                      </td>
                    ))}
                    <td className={`${styles.centerCell} ${styles.opCol}`}>
                      <button
                        className={styles.tableDeleteBtn}
                        type="button"
                        onClick={() => setIndicatorRows((prev) => (prev.length <= 1 ? prev : prev.filter((x) => x.id !== row.id)))}
                        disabled={indicatorRows.length <= 1}
                      >
                        <DeleteOutlined />
                      </button>
                    </td>
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
            <div className={styles.richHint}>
              结合核心业务“2026年工作打算”，以表格形式分条提出本部门本领域重点工作每季度目标任务，文字表述言简意赅，突出举措和目标数据。
            </div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{"\u4efb\u52a1\u540d\u79f0"}</th>
                  {quarterHeaders.map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                  <th>{"\u8d23\u4efb\u4eba"}</th>
                  <th className={`${styles.centerCell} ${styles.opCol}`}>{"\u64cd\u4f5c"}</th>
                </tr>
              </thead>
              <tbody>
                {taskRows.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <Input.TextArea
                        rows={3}
                        value={row.name}
                        onChange={(e) => setTaskRows((p) => p.map((x) => (x.id === row.id ? { ...x, name: e.target.value } : x)))}
                      />
                    </td>
                    {row.quarters.map((v, i) => (
                      <td key={`${row.id}-${i}`}>
                        <Input.TextArea
                          rows={3}
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
                      <Input.TextArea
                        rows={3}
                        value={row.owner}
                        onChange={(e) => setTaskRows((p) => p.map((x) => (x.id === row.id ? { ...x, owner: e.target.value } : x)))}
                      />
                    </td>
                    <td className={`${styles.centerCell} ${styles.opCol}`}>
                      <button
                        className={styles.tableDeleteBtn}
                        type="button"
                        onClick={() => setTaskRows((prev) => (prev.length <= 1 ? prev : prev.filter((x) => x.id !== row.id)))}
                        disabled={taskRows.length <= 1}
                      >
                        <DeleteOutlined />
                      </button>
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
