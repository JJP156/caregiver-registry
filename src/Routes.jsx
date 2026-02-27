import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
import AuthenticationLogin from "pages/authentication-login";
import CaregiverRegistrationForm from "pages/caregiver-registration-form";
import CaregiverProfileDetailView from "pages/caregiver-profile-detail-view";
import DocumentVerificationQueue from "pages/document-verification-queue";
import CaregiverManagementDashboard from "pages/caregiver-management-dashboard";
import PublicCaregiverSearch from "pages/public-caregiver-search";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<CaregiverManagementDashboard />} />
        <Route path="/public-caregiver-search" element={<PublicCaregiverSearch />} />
        <Route path="/authentication-login" element={<AuthenticationLogin />} />
        <Route path="/caregiver-registration-form" element={<CaregiverRegistrationForm />} />
        <Route path="/caregiver-profile-detail-view" element={<CaregiverProfileDetailView />} />
        <Route path="/document-verification-queue" element={<DocumentVerificationQueue />} />
        <Route path="/caregiver-management-dashboard" element={<CaregiverManagementDashboard />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;