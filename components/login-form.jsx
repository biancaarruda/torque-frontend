"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    nomeUsuario: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/auth/login", {
        nomeUsuario: formData.nomeUsuario,
        senha: formData.password,
      });

      localStorage.setItem("token", response.data.token);

      if (response.data.primeiroAcesso) {
        toast.info("Primeiro acesso! Altere sua senha.");
        router.push("/dashboard/conta/alterar-senha");
        return;
      }

      toast.success("Logado com sucesso!");

      
      router.push("/dashboard");

    } catch (error) {
      toast.error("Credenciais inválidas");
    }

    setLoading(false);
  };


  return (
    <Card className="overflow-hidden p-0 w-medium">
      <CardContent className="grid p-0 md:grid-cols-2">
        <div className="p-6 md:p-8">
          <CardHeader className="text-center p-0 mb-6">
            <CardTitle className="text-xl">Conecte-se</CardTitle>
            <CardDescription>
              Entre com suas credenciais para acessar sua conta.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleLogin} className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="nomeUsuario">Nome de usuário</Label>
              <Input
                id="nomeUsuario"
                name="nomeUsuario"
                value={formData.nomeUsuario}
                onChange={handleChange}
                placeholder="nome_usuário"
                required
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                type="password"
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Carregando..." : "Entrar"}
            </Button>
          </form>
        </div>

        <div className="bg-muted relative hidden md:block">
          <img
            src="/foto-login.png"
            alt="Imagem do login"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </CardContent>
    </Card>
  );
}