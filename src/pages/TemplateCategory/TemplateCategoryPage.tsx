import React, { useState } from "react";
import { Suspense } from "react";
import { AppstoreOutlined, BankOutlined, FileSearchOutlined } from "@ant-design/icons";
import { Card, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";

import "./TemplateCategoryPage.css";

const FormListPage = React.lazy(() => import("../FormList"));
const OrganizationListPage = React.lazy(() => import("../FormList/OrganizationListPage"));

type TabType = "decision" | "department" | "theme";

const TemplateCategoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("decision");

  const tabs: Array<{ key: TabType; label: string; desc: string; icon: React.ReactNode; color: string; bgColor: string }> = [
    { key: "decision", label: "决策库", desc: "管理各类决策相关文件", icon: <FileSearchOutlined />, color: "#13c2c2", bgColor: "#e6fffb" },
    { key: "department", label: "单位库", desc: "管理各类单位相关文件", icon: <BankOutlined />, color: "#2f7ef7", bgColor: "#f3f8ff" },
    { key: "theme", label: "主题库", desc: "管理各类主题相关文件", icon: <AppstoreOutlined />, color: "#6f3cc2", bgColor: "#f8f3ff" },
  ];

  return (
    <div className="template-category-page">
      <Row gutter={[16, 16]} className="template-category-cards">
        {tabs.map((tab) => (
          <Col key={tab.key} xs={24} sm={12} md={8} lg={8} xl={8}>
            <Card
              hoverable
              className={`template-category-card ${activeTab === tab.key ? "template-category-card-active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
              style={
                activeTab === tab.key
                  ? {
                      background:
                        tab.key === "decision"
                          ? "linear-gradient(180deg, #e6fffb 0%, #ffffff 100%)"
                          : tab.key === "department"
                            ? "linear-gradient(180deg, #e6f7ff 0%, #ffffff 100%)"
                            : "linear-gradient(180deg, #f9f0ff 0%, #ffffff 100%)",
                      borderBottom: `3px solid ${tab.color}`,
                    }
                  : { background: "white", borderBottom: "1px solid #f0f0f0" }
              }
            >
              <div className="template-category-card-icon" style={{ background: tab.bgColor, color: tab.color }}>
                {tab.icon}
              </div>
              <div className="template-category-card-title">{tab.label}</div>
              <div className="template-category-card-desc">{tab.desc}</div>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="template-category-content-wrapper">
        <Suspense fallback={null}>
          {activeTab === "department" ? (
            <OrganizationListPage />
          ) : (
            <FormListPage categoryId={activeTab} hideHeader={true} />
          )}
        </Suspense>
      </div>
    </div>
  );
};

export default TemplateCategoryPage;
