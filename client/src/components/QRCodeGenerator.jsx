import React from "react";
import { QRCodeSVG } from "qrcode.react";

const QRCodeGenerator = ({ url, id }) => {
  // Aggiunto 'id' come prop
  return (
    <div style={{ background: "white", padding: "16px", display: "inline-block", border: "1px solid #ccc" }}>
      <h3 className="text-xl font-bold mb-2 text-center">Scansiona per il Menù</h3>
      <QRCodeSVG
        id={id} // <-- Assegna l'id all'elemento SVG
        value={url}
        size={256} // Aumentiamo la dimensione per una qualità di stampa migliore
        level={"H"} // Aumenta il livello di correzione errori, utile per la stampa
        includeMargin={true}
      />
    </div>
  );
};

export default QRCodeGenerator;
