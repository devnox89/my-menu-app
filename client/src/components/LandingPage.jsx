import React from "react";
import { Link } from "react-router-dom";
// Potresti voler usare delle icone, ad esempio da react-icons
// npm install react-icons
import { FiSmartphone, FiEdit3, FiGrid } from "react-icons/fi";

const FeatureCard = ({ icon, title, children }) => (
  <div className="p-6 rounded-lg shadow-lg text-center text-amber-500 bg-gray-600">
    <div className="flex justify-center mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-amber-400">{children}</p>
  </div>
);

const LandingPage = () => {
  return (
    <div className="container mx-auto">
      {/* Hero Section */}
      <section className="text-center py-20 px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-gray-800">Il tuo Menù Digitale, in un Flash.</h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Crea, personalizza e condividi il tuo menù con un QR Code unico. Attrai più clienti, semplifica gli ordini e aggiorna i tuoi piatti in tempo reale.
        </p>
        <Link to="/register" className="bg-yellow-500 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-yellow-600 transition-transform duration-300 transform hover:scale-105">
          Crea il tuo Menù Gratis
        </Link>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-100 rounded-lg">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">Tutto ciò di cui hai bisogno</h2>
          <p className="text-gray-600">Semplice per te, innovativo per i tuoi clienti.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard icon={<FiSmartphone size={40} className="text-yellow-500" />} title="QR Code Unico">
            Ogni ristorante ottiene un QR Code esclusivo da stampare e mostrare ai tavoli per un accesso istantaneo al menù.
          </FeatureCard>
          <FeatureCard icon={<FiEdit3 size={40} className="text-yellow-500" />} title="Modifiche in Tempo Reale">
            Hai finito un piatto? Cambiato un prezzo? Aggiorna il tuo menù dal pannello di controllo e le modifiche saranno subito online.
          </FeatureCard>
          <FeatureCard icon={<FiGrid size={40} className="text-yellow-500" />} title="Semplice e Intuitivo">
            Nessuna complicazione tecnica. Un pannello di controllo pulito e facile da usare per gestire i tuoi piatti, le categorie e le immagini.
          </FeatureCard>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
