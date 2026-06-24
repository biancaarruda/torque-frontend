"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/api";

import { PerfilMecanico } from "../features/perfil-mecanico";
import { PerfilAtendente } from "../features/perfil-atendente";
import { PerfilGerente } from "../features/perfil-gerente";

export default function Page() {
  const { id } = useParams();

  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    if (!id) return;

    async function carregar() {
      const res = await api.get(`/usuarios/${id}`);
      setUsuario(res.data);
    }

    carregar();
  }, [id]);

  if (!usuario) return <div>Carregando...</div>;

  if (usuario.cargo.includes("Mec")) {
    return <PerfilMecanico usuario={usuario} />;
  }

  if (usuario.cargo === "Atendente") {
    return <PerfilAtendente usuario={usuario} />;
  }

  if (usuario.cargo === "Gerente") {
    return <PerfilGerente usuario={usuario} />;
  }

  return null;
}