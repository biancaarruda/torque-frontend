"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IMaskInput } from "react-imask";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import api from "@/lib/api";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";



import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export function New({ item = null, isOpen, onClose, onSuccess }) {
  const cargos = [
    { value: 1, label: "Administrador" },
    { value: 2, label: "Atendente" },
    { value: 3, label: "Gerente" },
    { value: 4, label: "Mecânico" }
  ];
  const cargoMap = {
    Administrador: "1",
    Atendente: "2",
    Gerente: "3",
    Mecanico: "4",
    
  };

  const [loading, setLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      nome: "",
      nomeUsuario: "",
      cargo: "",
      telefone: "",
    },
  });
  const cargoValue = form.watch("cargo");

  useEffect(() => {
    if (!isOpen) return;

    form.reset({
      nome: item?.nome || "",
      nomeUsuario: item?.nomeUsuario || "",
      cargo: item?.cargo ? cargoMap[item.cargo] || String(item.cargo) : "",
      telefone: item?.telefone || "",
      
    });
    
  
  }, [item, isOpen]);

  async function onSubmit(values) {
    setLoading(true);

    try {
      const payload = {
        ...values,
        cargo: Number(values.cargo)
      };

      if (item?.usuarioId) {
        await api.put(`/usuarios/${item.usuarioId}`, payload);
      } else {
        await api.post("/usuarios", payload);
      }

      toast.success("Usuário salvo com sucesso!");
      onSuccess?.();
      onClose();
    } catch (error) {
      console.log(error.response?.data);
      toast.error("Erro ao salvar usuário!");
    } finally {
      setLoading(false);
    }
}


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[600px] p-6">
        <DialogHeader>
          <DialogTitle>
            {item?.usuarioId ? "Editar" : "Adicionar"} Usuário
          </DialogTitle>
          <DialogDescription>
            Preencha os dados do membro da equipe.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-4"
          >


            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem className="col-span-4">
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nome do usuário" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nomeUsuario"
              render={({ field }) => (
                <FormItem className="col-span-4">
                  <FormLabel>Nome de Usuário</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="nome_sobrenome" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {["telefone"].map((key) => (
              <FormField
                key={key}
                control={form.control}
                name={key}
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>{key === "telefone" ? "Telefone" : key}</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder={
                          key === "telefone"
                            ? "Ex: 67XXXXXXXX"
                            : ""
                        }
                        {...field}
                      />
                      
                    </FormControl>
                  </FormItem>
                )}
              />
            ))}

            <FormField
              control={form.control}
              name="cargo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cargo</FormLabel>
                  <Select
                  
                    onValueChange={field.onChange}
                    value={cargoValue || ""}
                  >

                    <SelectTrigger>
                      <SelectValue placeholder="Selecione cargo" />
                    </SelectTrigger>
                    <SelectContent>
                      {cargos
                        .filter((c) => c.value !== 1 || cargoValue === "1")
                        .map((c) => (
                        <SelectItem key={c.value} value={String(c.value)}>
                          {c.label}
                        </SelectItem>

                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="col-span-2 flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
