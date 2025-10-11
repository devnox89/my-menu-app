import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import ProfileEditor from "./ProfileEditor";
import ThemeEditor from "./ThemeEditor";

const AccountManager = () => {
  const { user, setUser } = useOutletContext();
  const [activeTab, setActiveTab] = useState("profile");

  console.log("%cACCOUNT MANAGER: Ricevuto utente dal context:", "color: green;", user);

  if (!user) {
    return <div>Caricamento dati account...</div>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Account e Impostazioni</h1>

      <div className="border-b">
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveTab("profile")}
            className={`py-2 px-4 font-semibold ${activeTab === "profile" ? "border-b-2 border-primary text-primary" : "text-gray-500 hover:text-gray-700"}`}
          >
            Profilo e QR Code
          </button>
          <button onClick={() => setActiveTab("theme")} className={`py-2 px-4 font-semibold ${activeTab === "theme" ? "border-b-2 border-primary text-primary" : "text-gray-500 hover:text-gray-700"}`}>
            Personalizza Menù
          </button>
        </nav>
      </div>

      <div>
        {activeTab === "profile" && <ProfileEditor user={user} setUser={setUser} />}
        {activeTab === "theme" && <ThemeEditor user={user} setUser={setUser} />}
      </div>
    </div>
  );
};

export default AccountManager;
