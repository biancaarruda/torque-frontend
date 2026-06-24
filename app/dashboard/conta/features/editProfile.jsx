"use client";

import { useState, useEffect } from "react";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import api from "@/lib/api";
import { toast } from "sonner";

export function EditProfile({ user, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState(user?.avatar || "");

  const form = useForm({
    defaultValues: {
      Nome: user?.Nome || "",
      Telefone: user?.Telefone || "",
    },
  });

  useEffect(() => {
    if (!user) return;

    form.reset({
      Nome: user.Nome || "",
      Telefone: user.Telefone || "",
    });

    setPreview(user.avatar || "");
    setAvatarFile(null);
  }, [user, form]);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarFile(file);

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  };

  const onSubmit = async (values) => {
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("Nome", values.Nome);
      formData.append("Telefone", values.Telefone);

      if (avatarFile)
        formData.append("avatar", avatarFile);

      await api.put("/conta", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Perfil atualizado com sucesso!");

      if (onSuccess) onSuccess();

    } catch (error) {
      console.error(error);
      toast.error("Falha ao atualizar perfil");
    } finally {
      setLoading(false);
    }
  };

  const initial = user?.Nome?.charAt(0)?.toUpperCase() || "U";

  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Editar Perfil</SheetTitle>
      </SheetHeader>

      <div className="flex flex-col items-center gap-4 mb-4">
        <Avatar className="w-24 h-24">
          {preview ? (
            <AvatarImage src={preview} alt={user?.Nome || "Avatar"} />
          ) : (
            <AvatarFallback>{initial}</AvatarFallback>
          )}
        </Avatar>

        <label className="cursor-pointer">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
          <Button size="sm" asChild>
            <span>Trocar Foto</span>
          </Button>
        </label>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 px-6 py-4"
        >
          <FormField
            control={form.control}
            name="Nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Nome completo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="Telefone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input
                    placeholder="(00) 00000-0000"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />    

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </form>
      </Form>
    </SheetContent>
  );
}
