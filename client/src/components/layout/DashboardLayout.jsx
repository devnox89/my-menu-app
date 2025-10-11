import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import api from "../../api/axiosConfig";
import { toast } from "react-hot-toast";

const DashboardLayout = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/auth/me")
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => toast.error("Impossibile caricare i dati utente."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Caricamento...</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Sidebar user={user} />
      <main className="ml-64">
        <div className="p-8">
          {/* Fornisce 'user' e 'setUser' a tutti i componenti figli */}
          <Outlet context={{ user, setUser }} />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
