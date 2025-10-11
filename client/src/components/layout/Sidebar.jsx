import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FiGrid, FiEdit3, FiSettings, FiLogOut } from "react-icons/fi";

const Sidebar = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("storage"));
    toast.success("Logout effettuato con successo!");
    navigate("/login");
  };

  const linkClasses = "flex items-center px-4 py-3 text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 rounded-md transition-colors duration-200";
  const activeLinkClasses = "bg-yellow-500 text-white font-bold hover:bg-yellow-500 hover:text-white";

  return (
    <aside className="h-screen w-64 bg-white shadow-xl fixed top-0 left-0 flex flex-col p-4 z-10">
      <div className="text-xl font-bold text-gray-800 mb-10 text-center py-4 truncate" title={user ? user.restaurantName : "Dishcovery"}>
        {user ? user.restaurantName : "Dishcovery"}
      </div>
      <nav className="flex-grow space-y-2">
        {/* --- NUOVA LOGICA CONDIZIONALE --- */}
        {/* Mostra questi link solo se l'utente ha un abbonamento attivo */}
        {user && user.subscriptionStatus === "active" && (
          <>
            <NavLink to="/dashboard" end className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ""}`}>
              <FiGrid className="mr-3" />
              Anteprima Menù
            </NavLink>
            <NavLink to="/dashboard/manage" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ""}`}>
              <FiEdit3 className="mr-3" />
              Gestione Piatti
            </NavLink>
          </>
        )}

        {/* Il link all'Account è sempre visibile */}
        <NavLink to="/dashboard/account" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ""}`}>
          <FiSettings className="mr-3" />
          Account
        </NavLink>
      </nav>
      <div className="mt-auto">
        <button onClick={handleLogout} className={`${linkClasses} w-full`}>
          <FiLogOut className="mr-3" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
