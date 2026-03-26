import React, { useState } from "react";
import { Tabs } from "antd";

import FormListPage from "./FormListPage";

const OrganizationListPage: React.FC = () => {
  const [activeKey, setActiveKey] = useState("department");

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ paddingLeft: "20px", paddingRight: "20px" }}>
        <Tabs
          activeKey={activeKey}
          onChange={setActiveKey}
          style={{ marginBottom: 0 }}
          items={[
            { key: "department", label: "部门" },
            { key: "town", label: "镇街" },
            { key: "soe", label: "国企" },
          ]}
        />
      </div>
      <div style={{ flex: 1, overflow: "hidden", marginTop: "-16px" }}>
        {activeKey === "department" && <FormListPage categoryId="department" hideHeader />}
        {activeKey === "town" && <FormListPage categoryId="town" hideHeader />}
        {activeKey === "soe" && <FormListPage categoryId="soe" hideHeader />}
      </div>
    </div>
  );
};

export default OrganizationListPage;
