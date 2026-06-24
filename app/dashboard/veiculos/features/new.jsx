"use client";

import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import api from "@/lib/api";

export const New = ({ item = null, onSuccess, isOpen }) => {
  const [loading, setLoading] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [clientesLoading, setClientesLoading] = useState(false);

  const tipos = [
    { label: "Carro", value: "Carro" },
    { label: "Caminhoneta", value: "Caminhoneta" },
    { label: "Moto", value: "Moto" },
  ];

  const form = useForm({
    defaultValues: {
      marca: "",
      tipoVeiculo: "",
      modelo: "",
      anoVeiculo: "",
      placa: "",
      clienteId: "",
    },
  });

  useEffect(() => {
    if (!isOpen) return;

    const fetchClientes = async () => {
      setClientesLoading(true);
      try {
        const res = await api.get("/clientes");
        setClientes(res.data);

        if (item) {
          form.reset({
            marca: item.marca || "",
            tipoVeiculo: item.tipoVeiculo || "",
            modelo: item.modelo || "",
            anoVeiculo: item.anoVeiculo || "",
            placa: item.placa || "",
            clienteId: item.cliente?.clienteId?.toString() || "",
          });
        } else {
          form.reset({
            marca: "",
            tipoVeiculo: "",
            modelo: "",
            anoVeiculo: "",
            placa: "",
            clienteId: "",
          });
        }

      } catch {
        toast.error("Falha ao carregar clientes");
      } finally {
        setClientesLoading(false);
      }
    };

    fetchClientes();
  }, [isOpen, item]);

  const onSubmit = async (values) => {
    setLoading(true);

    try {
      const payload = {
        marca: values.marca,
        modelo: values.modelo,
        anoVeiculo: Number(values.anoVeiculo),
        placa: values.placa,
        tipoVeiculo: values.tipoVeiculo,
        clienteId: Number(values.clienteId),
      };

      if (item?.veiculoId) {
        await api.put(`/veiculos/${item.veiculoId}`, payload);
        toast.success("Veículo atualizado com sucesso!");
      } else {
        await api.post("/veiculos", payload);
        toast.success("Veículo criado com sucesso!");
      }

      onSuccess?.();
    } catch {
      toast.error("Algo deu errado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogContent className="w-[800px] max-w-full">
      <DialogHeader>
        <DialogTitle>
          {item?.veiculoId ? "Editar" : "Adicionar"} Veículo
        </DialogTitle>
        <DialogDescription>
          Preencha os dados do veículo.
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-4 px-6 py-4"
        >
          <FormField
            control={form.control}
            name="marca"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marca</FormLabel>
                <FormControl>
                  <Input placeholder="Toyota" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tipoVeiculo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {tipos.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
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
            name="modelo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Modelo</FormLabel>
                <FormControl>
                  <Input placeholder="Corolla Cross" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="anoVeiculo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ano</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="2024" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="placa"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Placa</FormLabel>
                <FormControl>
                  <Input placeholder="ABC-1234" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="clienteId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cliente</FormLabel>

                {clientesLoading ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="animate-spin w-4 h-4" />
                    Carregando clientes...
                  </div>
                ) : (
                  <Select
                    key={field.value}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um cliente" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {clientes.map((cliente) => (
                        <SelectItem
                          key={cliente.clienteId}
                          value={cliente.clienteId.toString()}
                        >
                          {cliente.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>

                  </Select>
                )}

                <FormMessage />
              </FormItem>
            )}
          />

          <div className="col-span-2 flex justify-end mt-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
};
