"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import { toast } from "sonner";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { SwitchDemo } from "./features/switchDemo";

export default function Page() {
  const [loading, setLoading] = useState(false);

  const [config, setConfig] = useState({
    notificacoes: {
      ordemServico: false,
      estoqueBaixo: false,
      whatsapp: false,
    }
  });

  const fetchConfig = useCallback(async () => {
    try {
      setLoading(true);

      const res = await api.get(
  "/funcionarios/minhas-notificacoes"
);

const data = res.data;

setConfig((prev) =>({
  ...prev,
  notificacoes: {
    ordemServico: res.data.notificacaoOrdemServico,
    estoqueBaixo: res.data.notificacaoEstoqueBaixo,
    whatsapp: res.data.notificacaoWhatsapp,
  },

  estoque: {
    minimo: data.estoqueMinimo ?? 0,
    reposicao: data.estoqueReposicao ?? 0,
    critico: data.estoqueCritico ?? 0,
  },
}));

    } catch (error) {
  console.log(error);
  console.log(error?.response);
  console.log(error?.response?.data);

  toast.error("Falha ao carregar configurações");
} finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  const handleSwitch = (key) => {
    setConfig((prev) => ({
      ...prev,
      notificacoes: {
        ...prev.notificacoes,
        [key]: !prev.notificacoes[key],
      },
    }));
  };

  const handleEstoqueChange = (key, value) => {
    setConfig((prev) => ({
      ...prev,
      estoque: {
        ...prev.estoque,
        [key]: value,
      },
    }));
  };

  const handleSave = async () => {
  const possuiNotificacaoAtiva =
    config.notificacoes.ordemServico ||
    config.notificacoes.estoqueBaixo;

  if (
    possuiNotificacaoAtiva &&
    !config.notificacoes.whatsapp
  ) {
    toast.warning(
      "Você ativou notificações, mas não selecionou nenhum canal de envio (WhatsApp)."
    );
    return;
  }

  try {
    setLoading(true);

    await api.put(
      "/funcionarios/minhas-notificacoes",
      {

        notificacaoOrdemServico:
          config.notificacoes.ordemServico,

        notificacaoEstoqueBaixo:
          config.notificacoes.estoqueBaixo,

        notificacaoWhatsapp:
          config.notificacoes.whatsapp,
      }
    );

    toast.success(
      "Configurações salvas com sucesso!"
    );
  } catch (error) {
    console.log(error);
    console.log(error?.response);
    console.log(error?.response?.data);

    toast.error(
      "Erro ao salvar configurações"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 gap-6 py-4 px-6">
      <Card>
        <CardHeader>
          <CardTitle>Notificações</CardTitle>
          <CardDescription>Configure alertas do sistema</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <h4 className="font-medium">Notificações no sistema</h4>

          

          <SwitchDemo
            id="ordemServico"
            label="Ordens de serviço"
            checked={config.notificacoes.ordemServico}
            onCheckedChange={() => handleSwitch("ordemServico")}
          />

          <SwitchDemo
            id="estoqueBaixo"
            label="Avisos de estoque baixo"
            checked={config.notificacoes.estoqueBaixo}
            onCheckedChange={() => handleSwitch("estoqueBaixo")}
          />

          <h4 className="font-medium mt-4">Canal de notificação</h4>

          <SwitchDemo
            id="whatsapp"
            label="WhatsApp"
            checked={config.notificacoes.whatsapp}
            onCheckedChange={() => handleSwitch("whatsapp")}
          />

          
        </CardContent>

        <div className="col-span-2 flex justify-center mt-6">
        <Button
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
      </Card>

      

    </div>
  );
}
