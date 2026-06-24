"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

import { FuncionarioCard } from "./funcionario-card";

export function EquipePage() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [loading, setLoading] = useState(true);

  async function carregar() {
    try {
      const response = await api.get("/usuarios");

      setFuncionarios(response.data || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        Carregando equipe...
      </div>
    );
  }

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6 text-orange-500">
        Membros da Equipe
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {funcionarios.map((funcionario) => (
          <FuncionarioCard
            key={funcionario.usuarioId}
            funcionario={funcionario}
          />
        ))}
      </div>

    </div>
  );
}