"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Page() {
  const [avatarFile, setAvatarFile] = useState(null);
  const [form, setForm] = useState({
    nome: "",
    telefone: "",
    avatar: "",
  });

  useEffect(() => {
    async function carregar() {
      try {
        const { data } = await api.get("/conta");
        setForm(data);
      } catch {
        toast.error("Erro ao carregar conta");
      }
    }

    carregar();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const salvar = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("Nome", form.nome);
      formData.append("Telefone", form.telefone);

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      await api.put("/conta", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Dados atualizados com sucesso!");

      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch {
      toast.error("Erro ao salvar");
    }

  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Minha Conta</h1>

      <form onSubmit={salvar} className="space-y-4">
        <div className="flex flex-col items-center gap-2">
          <img
            src={
              form.avatar
                ? `${process.env.NEXT_PUBLIC_API_URL}${form.avatar}`
                : `https://ui-avatars.com/api/?name=${form.nome}`
            }
            className="w-24 h-24 rounded-full object-cover"
          />

          <input
            id="avatar"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setAvatarFile(e.target.files?.[0])}
          />

          {avatarFile && (
            <p className="text-sm text-muted-foreground">
              {avatarFile.name}
            </p>
          )}

          <label
            htmlFor="avatar"
            className=" inline-flex items-center justify-center rounded-md border px-4 py-2 
            cursor-pointer hover:bg-accent"
          >
            Escolher imagem
          </label>
        </div>

        <Input
          name="nome"
          value={form.nome}
          onChange={handleChange}
          placeholder="Nome"
        />

        <Input
          name="telefone"
          value={form.telefone}
          onChange={handleChange}
          placeholder="Telefone"
        />

        <Button type="submit">Salvar Alterações</Button>
      </form>
    </div>
  );
}