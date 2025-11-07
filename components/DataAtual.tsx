"use client";

import { useEffect, useState } from "react";

export default function DataAtual() {
  const [data, setData] = useState("");

  useEffect(() => {
    const atualizarData = () => {
      setData(new Date().toLocaleString("pt-BR"));
    };

    atualizarData(); // atualiza ao montar
    const intervalo = setInterval(atualizarData, 1000); // atualiza a cada 1s

    return () => clearInterval(intervalo); // limpa o intervalo ao desmontar
  }, []);

  return (
    <div className="text-xs text-neutral-500">
      {data}
    </div>
  );
}
