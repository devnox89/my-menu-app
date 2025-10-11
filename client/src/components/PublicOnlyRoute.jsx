import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PublicOnlyRoute = () => {
  const token = localStorage.getItem("token");

  // Se il token esiste, l'utente è loggato, quindi reindirizzalo alla dashboard.
  // Altrimenti, mostra la pagina richiesta (Login o Register) tramite l'Outlet.
  return token ? <Navigate to="/dashboard" /> : <Outlet />;
};

export default PublicOnlyRoute;
