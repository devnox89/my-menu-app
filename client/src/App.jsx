import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Layouts
import PublicLayout from "./components/layout/PublicLayout";
import DashboardLayout from "./components/layout/DashboardLayout";

// Componenti di Protezione Rotte
import PrivateRoute from "./components/PrivateRoute";
import PublicOnlyRoute from "./components/PublicOnlyRoute";

// Pagine
import LandingPage from "./components/LandingPage";
import PublicMenu from "./components/PublicMenu";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import MenuManager from "./components/MenuManager";
import AccountManager from "./components/AccountManager";

function App() {
  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        {/* Gruppo di Rotte Pubbliche con Navbar */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />

          {/* SPOSTIAMO QUI DENTRO LE ROTTE DI AUTENTICAZIONE */}
          {/* Verranno mostrate solo agli utenti non loggati, ma ora avranno la navbar pubblica */}
          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
        </Route>

        {/* Rotta del menù pubblico (senza navbar) */}
        <Route path="/menu/:slug" element={<PublicMenu />} />

        {/* Gruppo di Rotte Protette della Dashboard */}
        <Route
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/manage" element={<MenuManager />} />
          <Route path="/dashboard/account" element={<AccountManager />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
