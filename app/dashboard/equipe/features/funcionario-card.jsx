"use client";

import Link from "next/link";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";
export function getAvatarUrl(path) {
  if (!path) return undefined;

  return `${process.env.NEXT_PUBLIC_API_URL}${
    path.startsWith("/") ? path : `/${path}`
  }`;
}

export function FuncionarioCard({
  funcionario,
}) {

  return (
    <Card>

      <CardContent className="p-6">

        <div className="flex flex-col items-center">

          <Avatar className="w-24 h-24">
            <AvatarImage
             src={getAvatarUrl(funcionario.avatar)}
            />
            <AvatarFallback>
              {funcionario.nome?.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <h2 className="mt-4 font-semibold">
            {funcionario.nome}
          </h2>

          <p className="text-muted-foreground">
            {funcionario.cargo}
          </p>

          <p className="text-sm">
            {funcionario.telefone}
          </p>

          <Link
            href={`/dashboard/equipe/${funcionario.usuarioId}`}
            className="w-full mt-4"
          >
            <Button className="w-full">
              Desempenho
            </Button>
          </Link>

        </div>

      </CardContent>

    </Card>
  );
}