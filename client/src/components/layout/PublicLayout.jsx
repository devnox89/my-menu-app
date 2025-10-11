import React from "react";
import { Outlet } from "react-router-dom";
import PublicNavbar from "./PublicNavbar";

const PublicLayout = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <PublicNavbar />
      <main>
        {/* Le pagine pubbliche (LandingPage, Login, etc.) verranno renderizzate qui */}
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;
