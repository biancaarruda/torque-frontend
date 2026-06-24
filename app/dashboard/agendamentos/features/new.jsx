"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import api from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";


const formSchema = z.object({

  servicoDesejado: z.string().min(1),
  dataHoraAgendamento: z.coerce.date(),
  statusAgendamento: z.string().min(1),
  clienteId: z.number({
  required_error: "Selecione um cliente",
}).min(1, "Selecione um cliente"),

veiculoId: z.number({
  required_error: "Selecione um veículo",
}).min(1, "Selecione um veículo"),
});

export const New = ({ item = null, onSuccess, isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [veiculos, setVeiculos] = useState([]);

  const form = useForm({

    resolver: zodResolver(formSchema),
    defaultValues: {
      servicoDesejado: "",
      dataHoraAgendamento: new Date(),
      statusAgendamento: "",
      clienteId: undefined,//0,
      veiculoId: undefined,//0,
    },

  });

  useEffect(() => {

  if (!isOpen) return;

  async function carregarDados() {
    try {

      const clientesRes = await api.get("/clientes");

      setClientes(clientesRes.data || []);

      if (!item) {

        form.reset({
          servicoDesejado: "",
          dataHoraAgendamento: new Date(),
          statusAgendamento: "",
          clienteId: 0,
          veiculoId: 0,
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
        servicoDesejado: item.servicoDesejado ?? "",
        dataHoraAgendamento: item.dataHoraAgendamento
          ? new Date(item.dataHoraAgendamento)
          : new Date(),
        statusAgendamento: item.statusAgendamento ?? "",
        clienteId: item.cliente?.clienteId ?? 0,
        veiculoId: item.veiculo?.veiculoId ?? 0,
        
      });

    } catch {

      toast.error("Erro ao carregar dados");

    }
  }

  carregarDados();

}, [isOpen, item, form]);


  const onSubmit = async (values) => {

    setLoading(true);

    try {
      const payload = {
        servicoDesejado: values.servicoDesejado,
        dataHoraAgendamento: values.dataHoraAgendamento.toISOString(),
        statusAgendamento: values.statusAgendamento,
        clienteId: values.clienteId,
        veiculoId: values.veiculoId,
      };
      if (item?.agendamentoId) {
        await api.put(
          `/agendamentos/${item.agendamentoId}`,
          payload
        );
        toast.success("Atualizado com sucesso!");
      }
      else {
        await api.post("/agendamentos",payload);
        toast.success("Criado com sucesso!");
      }
      onSuccess?.();
      onClose?.();
    }
    catch {
      toast.error("Erro ao salvar!");
    }
    finally {
      setLoading(false);
    }
  };


  function formatDate(date) {
    const pad = (n) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }
  return (

    <Dialog open={isOpen} onOpenChange={onClose}>

      <DialogContent key={item?.agendamentoId} className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {item?.agendamentoId ? "Editar" : "Adicionar"} Agendamento
          </DialogTitle>
          <DialogDescription>
            Preencha os dados do agendamento abaixo.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >

            <FormField
              control={form.control}
              name="servicoDesejado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Serviço</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

            <FormField
              control={form.control}
              name="statusAgendamento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pendente">
                        Pendente
                      </SelectItem>
                      <SelectItem value="Confirmado">
                        Confirmado
                      </SelectItem>
                      <SelectItem value="Concluido">
                        Concluído
                      </SelectItem>
                      <SelectItem value="Cancelado">
                        Cancelado
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

            <FormField
              control={form.control}
              name="dataHoraAgendamento"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Data</FormLabel>
                  <Input
                    type="datetime-local"
                    value={formatDate(field.value)}
                    onChange={(e) =>
                      field.onChange(new Date(e.target.value))
                    }
                  />
                  <FormMessage />
                </FormItem>
              )} />

            <FormField
              control={form.control}
              name="clienteId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
                  <Select
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
                <FormItem>
                  <FormLabel>Veículo</FormLabel>
                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(v) =>
                      field.onChange(Number(v))
                    }
                  >
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

              

            <DialogFooter>
              <Button
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "Salvando..."
                  : "Salvar"}
              </Button>
            </DialogFooter>

          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
