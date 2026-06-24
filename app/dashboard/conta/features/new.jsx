"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import api from "@/lib/api";

const formSchema = z.object({
  Nome: z.string().min(2, "Nome é obrigatório"),
  NomeUsuario: z.string().min(2, "Nome de usuário é obrigatório"),
  Funcao: z.string().min(1, "Função é obrigatória"),
});


export const ContaUsuario = ({
  item = null,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Nome: "",
      cargo: "",
      Telefone: "",
    },
  });

  useEffect(() => {
    if (!isOpen) return;

    form.reset({
      Nome: item?.Nome || "",
      NomeUsuario: item?.NomeUsuario || "",
      Funcao: item?.Funcao || "",
      Telefone: item?.Telefone || "",
    });
  }, [item, isOpen]);

  const onSubmit = async (values) => {
    setLoading(true);

    try {
      await api.put("/conta", values);

      toast.success("Dados atualizados com sucesso!");

      onSuccess?.();
      onClose?.();
    } catch {
      toast.error("Erro ao atualizar dados");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SheetContent className="w-[420px] sm:w-[500px]">
      <SheetHeader>
        <SheetTitle>Minha conta</SheetTitle>
      </SheetHeader>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5 px-4 py-4"
        >
          <FormField
            control={form.control}
            name="Nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Seu nome completo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="NomeUsuario"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome de Usuário</FormLabel>
                <FormControl>
                  <Input placeholder="nome_usuário" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="Funcao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Função</FormLabel>
                <FormControl>
                  <Input disabled {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Salvando..." : "Salvar alterações"}
          </Button>
        </form>
      </Form>
    </SheetContent>
  );
};
