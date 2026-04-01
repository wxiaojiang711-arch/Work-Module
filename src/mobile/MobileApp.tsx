import React from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import BottomTabBar from './components/BottomTabBar';
import AIHomePage from './pages/AIHomePage';
import AdvancedSearchPage from './pages/AdvancedSearchPage';
import DataReportFillPage from './pages/DataReportFillPage';
import DataReportTaskListPage from './pages/DataReportTaskListPage';
import FilePreviewPage from './pages/FilePreviewPage';
import MobileKnowledgeBaseDetailPage from './pages/MobileKnowledgeBaseDetailPage';
import MobileKnowledgeBasePage from './pages/MobileKnowledgeBasePage';
import MobileProfilePage from './pages/MobileProfilePage';
import MobileReportPage from './pages/MobileReportPage';

const MobileApp: React.FC = () => {
  const { pathname } = useLocation();
  const hideTabBar = pathname.startsWith('/m/report-fill/') || pathname.startsWith('/m/data-report-fill/');

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Routes>
        <Route path="/m/home" element={<AIHomePage />} />
        <Route path="/m/search" element={<AdvancedSearchPage />} />
        <Route path="/m/preview/:fileId" element={<FilePreviewPage />} />

        <Route path="/m/report" element={<MobileReportPage />} />
        <Route path="/m/report/detail/:reportId" element={<MobileReportPage />} />

        <Route path="/m/kb" element={<MobileKnowledgeBasePage />} />
        <Route path="/m/kb/:kbId" element={<MobileKnowledgeBaseDetailPage />} />

        <Route path="/m/data-report" element={<DataReportTaskListPage />} />
        <Route path="/m/data-report-fill/:taskId" element={<DataReportFillPage />} />
        <Route path="/m/report-fill/:taskId" element={<DataReportFillPage />} />

        <Route path="/m/profile" element={<MobileProfilePage />} />
        <Route path="/m" element={<Navigate to="/m/home" replace />} />
      </Routes>
      {!hideTabBar ? <BottomTabBar /> : null}
    </div>
  );
};

export default MobileApp;
