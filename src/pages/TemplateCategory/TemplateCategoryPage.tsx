import React from "react";
import { AppstoreOutlined, BankOutlined, GoldOutlined, HomeOutlined } from "@ant-design/icons";
import { Card, Col, Row, Tag, Typography } from "antd";
import { useNavigate } from "react-router-dom";

import { categories } from "../FileTemplateManagement/templateConstants";
import "./TemplateCategoryPage.css";

const iconMap = {
  department: BankOutlined,
  town: HomeOutlined,
  soe: GoldOutlined,
  theme: AppstoreOutlined,
};

const themeMap = {
  department: {
    main: "#2f7ef7",
    top: "#3f8cff",
    bg: "linear-gradient(180deg, #f3f8ff 0%, #ffffff 68%)",
    tagBg: "#e6f4ff",
  },
  town: {
    main: "#3fa64a",
    top: "#54b560",
    bg: "linear-gradient(180deg, #f3fbf4 0%, #ffffff 68%)",
    tagBg: "#eef9ef",
  },
  soe: {
    main: "#d67b17",
    top: "#eb8f2a",
    bg: "linear-gradient(180deg, #fff7ef 0%, #ffffff 68%)",
    tagBg: "#fff2e8",
  },
  theme: {
    main: "#6f3cc2",
    top: "#8450d3",
    bg: "linear-gradient(180deg, #f8f3ff 0%, #ffffff 68%)",
    tagBg: "#f1e9ff",
  },
};

const TemplateCategoryPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="template-category-page">
      <div className="template-category-header">
        <Typography.Title level={5} className="template-category-title">
          文件模板管理
        </Typography.Title>
        <Typography.Paragraph className="template-category-desc">
          请选择工作模块，进入对应的表单模板列表进行管理。
        </Typography.Paragraph>
      </div>

      <Row gutter={[24, 24]} wrap={false} className="template-category-row">
        {categories.map((category) => {
          const Icon = iconMap[category.id];
          const theme = themeMap[category.id];

          return (
            <Col key={category.id} flex="0 0 465px" className="template-category-col">
              <Card
                hoverable
                className="template-category-card"
                bodyStyle={{ padding: 16 }}
                style={{
                  minHeight: 266,
                  background: theme.bg,
                }}
                onClick={() => navigate(`/template/${category.id}`)}
              >
                <div className="template-category-body">
                  <div className="template-category-content">
                    <div
                      className={`template-category-icon ${
                        category.id === "soe" ? "template-category-icon--soe" : ""
                      }`}
                      style={{ color: theme.main }}
                    >
                      <Icon />
                    </div>

                    <Typography.Title level={5} className="template-category-name">
                      {category.title}
                    </Typography.Title>

                    <Typography.Paragraph className="template-category-info">
                      {category.description}
                    </Typography.Paragraph>

                    <Tag
                      style={{
                        color: theme.main,
                        background: theme.tagBg,
                        borderColor: "transparent",
                        fontSize: 14,
                        paddingInline: 12,
                        lineHeight: "28px",
                      }}
                    >
                      共 {category.count} 个表单模板
                    </Tag>
                  </div>
                </div>

                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: 3,
                    background: theme.top,
                  }}
                />
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default TemplateCategoryPage;
