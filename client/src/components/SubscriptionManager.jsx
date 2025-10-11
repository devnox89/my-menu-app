import React from "react";
import api from "../api/axiosConfig";
import { toast } from "react-hot-toast";

const SubscriptionManager = ({ user }) => {
  const handleSubscribe = async () => {
    try {
      const { data } = await api.post("/payments/create-checkout-session");
      window.location.href = data.url;
    } catch (error) {
      toast.error("Impossibile avviare il processo di abbonamento.");
    }
  };

  // ## NUOVA FUNZIONE: GESTISCI ABBONAMENTO ##
  const handleManageSubscription = async () => {
    try {
      const { data } = await api.post("/payments/create-portal-session");
      window.location.href = data.url;
    } catch (error) {
      toast.error("Impossibile accedere alla gestione dell'abbonamento.");
    }
  };

  if (!user) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Il tuo Abbonamento</h2>
      {user.subscriptionStatus === "active" ? (
        <div>
          <p className="text-green-600 font-semibold">Stato: Attivo</p>
          <p className="text-gray-500 my-4">Il tuo menù è pubblico e il QR Code è attivo. Clicca qui sotto per gestire i tuoi dati di fatturazione o disdire.</p>
          <button onClick={handleManageSubscription} className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600">
            Gestisci Abbonamento
          </button>
        </div>
      ) : (
        <div>
          <p className="text-red-600 font-semibold">Stato: Inattivo</p>
          <p className="text-gray-500 my-4">Abbonati per rendere pubblico il tuo menù e attivare il QR Code.</p>
          <button onClick={handleSubscribe} className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600">
            Abbonati Ora
          </button>
        </div>
      )}
    </div>
  );
};

export default SubscriptionManager;
