"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import api from "@/lib/api";
import Pagamento  from "./pagamento";

const statusOptions = [
  "Confirmado",
  "Pendente",
  "Concluido",
  "Cancelado",
];

export const New = ({ item = null, onSuccess, isOpen }) => {
  const [loading, setLoading] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [veiculos, setVeiculos] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [mostrarPagamento, setMostrarPagamento] = useState(false);
const [ordemCriada, setOrdemCriada] = useState(null);
  const [querConcluir, setQuerConcluir] = useState(false);
  const [temPagamento, setTemPagamento] =
  useState(false);
  const ordemAtual =
  ordemCriada || item;
  

  const bloqueado = temPagamento;
const criarPagamento = async (tipoPagamento, parcelas) => {
  try {

    console.log({
      ordemServicoId: ordemAtual?.ordemServicoId,
      tipoPagamento,
      parcelas,
    });

    await api.post("/pagamentos", {
  ordemServicoId:
    ordemAtual?.ordemServicoId,
  tipoPagamento,
  parcelas : tipoPagamento === "CartaoParcelado" ? parcelas : null,
});

    toast.success("Cobrança gerada com sucesso!");
    setTemPagamento(true);
    
    setMostrarPagamento(false);
    onSuccess?.();
    setQuerConcluir(false);

  } catch (err) {

    console.log(
    "ERRO PAGAMENTO:",
    err?.response?.data
  );

    toast.error("Erro ao gerar cobrança");

  }
};

  const form = useForm({
    //resolver: zodResolver(formSchema),
    defaultValues: {
      nomeServico: "",
      observacao: "",
      valorTotalOrdem: "",
      dataAbertura: "",
      dataPrevisaoConclusao: "",
      statusOrdem: "",
      clienteId: undefined, //0,
      veiculoId: undefined, //0,
      funcionarioId:0,

    },
  });

  const statusAtual = form.watch("statusOrdem");

const podeGerarPagamento =
  !temPagamento &&
  (
    item?.statusOrdem === "Concluido" ||
    statusAtual === "Concluido"
  );

  useEffect(() => {
  if (!isOpen) return;

  async function carregarDados() {
    try {

      if (item?.ordemServicoId) {
        const pagamentoRes = await api.get(
          `/ordem-servicos/${item.ordemServicoId}/tem-pagamento`
        );

        setTemPagamento(
          pagamentoRes.data.temPagamento
        );
      } else {
        setTemPagamento(false);
      }

      const clientesRes =
        await api.get("/clientes");

      const funcionariosRes =
        await api.get("/funcionarios");

      setClientes(clientesRes.data || []);
      setFuncionarios(funcionariosRes.data || []);

      if (!item) {
      
              form.reset({
                nomeServico: "",
                observacao: "",
                valorTotalOrdem: "",
                dataAbertura: "",
                dataPrevisaoConclusao: "",
                statusOrdem: "",
                clienteId: 0,
                veiculoId: 0,
                funcionarioId: 0,
              });
      
              setTimeout(() => {}, 500);
      
              setVeiculos([]);
      
              return;
            }
      
            let veiculosCliente = [];
      
            if (item.cliente?.clienteId) {
      
              const veiculosRes = await api.get(
                `/veiculos/cliente/${item.cliente.clienteId}`
              );
      
              veiculosCliente = veiculosRes.data || [];
            }
      
            setVeiculos(veiculosCliente);
      
            setTimeout(() => {
              form.setValue("veiculoId",item.veiculo?.veiculoId ?? 0);}, 0);
      
            form.reset({
              nomeServico: item.nomeServico || "",
              observacao: item.observacao || "",
              valorTotalOrdem: item.valorTotalOrdem || "",
              statusOrdem: item.statusOrdem || "",
              dataAbertura:
                item.dataAbertura?.slice(0, 16) || "",
              dataPrevisaoConclusao:
                item.dataPrevisaoConclusao?.slice(0, 16) || "",
              clienteId: item.cliente?.clienteId ?? 0,
              veiculoId: item.veiculo?.veiculoId ?? 0,
              funcionarioId:
                item.funcionario?.funcionarioId ?? 0,
            });

    } catch {
      toast.error("Erro ao carregar dados");
    }
  }

  carregarDados();
}, [isOpen, item]);
  const onSubmit = async (values) => {
  setLoading(true);

  try {
    const vaiConcluir = values.statusOrdem === "Concluido";

    const payload = {
      nomeServico: values.nomeServico,
      observacao: values.observacao,
      valorTotalOrdem: Number(values.valorTotalOrdem),
      statusOrdem: values.statusOrdem,
      clienteId: values.clienteId,
      veiculoId: values.veiculoId,
      funcionarioId: values.funcionarioId,
      dataAbertura: values.dataAbertura
        ? new Date(values.dataAbertura).toISOString()
        : null,
      dataPrevisaoConclusao: values.dataPrevisaoConclusao
        ? new Date(values.dataPrevisaoConclusao).toISOString()
        : null,
    };
    const response = item?.ordemServicoId
  ? await api.put(`/ordem-servicos/${item.ordemServicoId}`, payload)
  : await api.post(`/ordem-servicos`, payload);

const ordemCriadaLocal = response.data;

console.log("ORDEM SALVA:", ordemCriadaLocal);

setOrdemCriada(ordemCriadaLocal);

if (vaiConcluir) {
  setMostrarPagamento(true);
  return;
}

onSuccess?.();

  } catch (err) {
  console.log("ERRO COMPLETO:", err?.response?.data);
  console.log("STATUS:", err?.response?.status);
  toast.error("Erro ao salvar!");
} finally {
    setLoading(false);
  }
};

  return (
    <DialogContent key={item?.ordemServicoId} className="w-[900px] max-w-full">
      <DialogHeader>
        <DialogTitle>
          {item?.ordemServicoId ? "Editar" : "Nova"} Ordem de Serviço
        </DialogTitle>
        <DialogDescription>
          Preencha as informações da ordem de serviço.
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-4 px-6 py-4"
        >
          <FormField
            control={form.control}
            name="nomeServico"
            render={({ field }) => (
              <FormItem className="col-span-4">
                <FormLabel>Nome do Serviço</FormLabel>
                <FormControl>
                  <Input disabled={bloqueado} placeholder="Troca de óleo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dataAbertura"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Data Abertura</FormLabel>
                <FormControl>
                  <Input disabled={bloqueado} type="datetime-local" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dataPrevisaoConclusao"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Previsão Conclusão</FormLabel>
                <FormControl>
                  <Input disabled={bloqueado} type="datetime-local" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="clienteId"
            render={({ field }) => (
              <FormItem className="col-span-4">
                <FormLabel>Cliente</FormLabel>
                <Select disabled={bloqueado}
                  value={field.value ? String(field.value) : ""}
                    onValueChange={async (v) => {
                      const novoClienteId = Number(v);

                      field.onChange(novoClienteId);

                      form.setValue("veiculoId", 0);

                      try {
                        const response = await api.get(
                          `/veiculos/cliente/${novoClienteId}`
                        );

                        setVeiculos(response.data || []);
                      } catch {
                        toast.error("Erro ao carregar veículos");
                      }
                    }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientes.map(c => (
                      <SelectItem
                        key={c.clienteId}
                        value={String(c.clienteId)}
                      >
                        {c.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )} />

            

          <FormField
            control={form.control}
            name="veiculoId"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Veículo</FormLabel>
                <Select disabled={bloqueado}
                  value={field.value ? String(field.value) : ""}
                    onValueChange={(v) =>
                      field.onChange(Number(v))
                    }>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {veiculos.map(v => (
                      <SelectItem
                        key={v.veiculoId}
                        value={String(v.veiculoId)}
                      >
                        {v.marca} - {v.placa}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )} />


          <FormField
            control={form.control}
            name="funcionarioId"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Funcionario</FormLabel>
                <Select
                disabled={bloqueado}
                  value={String(field.value)}
                  onValueChange={(v) =>
                    field.onChange(Number(v))
                  }>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {funcionarios.filter(f => f.cargo === "Mecanico").map(f => (
                      <SelectItem
                        key={f.funcionarioId}
                        value={String(f.funcionarioId)}
                      >
                        {f.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )} />

          

          <FormField
            control={form.control}
            name="valorTotalOrdem"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Valor Total</FormLabel>
                <FormControl>
                  <Input disabled={bloqueado} type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="statusOrdem"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Status</FormLabel>
                <Select disabled={bloqueado} onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="observacao"
            render={({ field }) => (
              <FormItem className="col-span-4">
                <FormLabel>Observações</FormLabel>
                <FormControl>
                  <Textarea
                    disabled={bloqueado}
                    placeholder="Deixe seu texto aqui..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="col-span-2 flex justify-end gap-2 mt-4">

  {!temPagamento && (
    <Button
      type="submit"
      disabled={loading}
    >
      {loading ? "Salvando..." : "Salvar"}
    </Button>
  )}

</div>
        </form>
      </Form>
      {mostrarPagamento && (
  <Pagamento
    ordem={ordemCriada || item}
    onPagar={criarPagamento}
    onClose={() =>
      setMostrarPagamento(false)
    }
  />
)}
    </DialogContent>
  );
};
