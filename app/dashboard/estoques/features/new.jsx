"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";

import { Loader2 } from "lucide-react";
import api from "@/lib/api";

// ================= SCHEMA =================
const formSchema = z.object({
  nomePeca: z.string().min(1, "Nome da peça é obrigatório"),
  codigoReferenciaPeca: z.string().optional(),
  quantidadeDisponivelPeca: z.preprocess(
    (val) => (val === "" ? null : Number(val)),
    z.number().min(0).optional()
  ),
  precoUnitarioPeca: z.preprocess(
    (val) =>
      val === "" || val === null
        ? null
        : parseFloat(val.toString().replace(",", ".")),
    z.number().min(0, "Preço deve ser maior ou igual a zero").optional()
  ),
  fornecedorId: z.number(),
});

export const New = ({ item = null, onSuccess, isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [fornecedores, setFornecedores] = useState([]);
  const [fornecedoresLoading, setFornecedoresLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nomePeca: "",
      codigoReferenciaPeca: "",
      quantidadeDisponivelPeca: "",
      precoUnitarioPeca: "",
      fornecedorId: 0,
    },
  });
  

  useEffect(() => {

    const fetchFornecedores = async () => {
      setFornecedoresLoading(true);

      try {
        const res = await api.get("/fornecedores");
        setFornecedores(res.data || []);
      } catch {
        toast.error("Falha ao carregar fornecedores");
      } finally {
        setFornecedoresLoading(false);
      }
    };

    if (isOpen) fetchFornecedores();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    form.reset({
      nomePeca: item?.nomePeca || "",
      codigoReferenciaPeca: item?.codigoReferenciaPeca || "",
      quantidadeDisponivelPeca: item?.quantidadeDisponivelPeca ?? "",
      precoUnitarioPeca: item?.precoUnitarioPeca ?? "",
      //fornecedorId: item?.fornecedorId?.toString() || "" ,
      fornecedorId: item?.fornecedor?.fornecedorId ?? 0,
    });
  }, [item, isOpen, form]);

  const onSubmit = async (values) => {
    values.fornecedorId = Number(values.fornecedorId);
    setLoading(true);
    try {
      if (item?.estoqueId) {
        await api.put(
          `/estoques/${item.estoqueId}`,
          values
        );
        toast.success("Estoque atualizado com sucesso!");
      } else {
        await api.post("/estoques", values);
        toast.success("Estoque criado com sucesso!");
      }

      onSuccess?.();
      onClose?.();
    } catch {
      toast.error("Algo deu errado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose?.(); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {item ? "Editar Estoque" : "Adicionar Estoque"}
          </DialogTitle>
          <DialogDescription>
            Preencha os dados do item de estoque abaixo.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* Nome */}
            <FormField
              control={form.control}
              name="nomePeca"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Peça</FormLabel>
                  <FormControl>
                    <Input placeholder="Filtro de óleo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Código */}
            <FormField
              control={form.control}
              name="codigoReferenciaPeca"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código da Peça</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="PH6607"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Quantidade */}
            <FormField
              control={form.control}
              name="quantidadeDisponivelPeca"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantidade Disponível</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Preço */}
            <FormField
              control={form.control}
              name="precoUnitarioPeca"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço por Unidade</FormLabel>
                  <FormControl>
                    <Input placeholder="30.99" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fornecedorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fornecedor</FormLabel>
                  <Select
                    value={String(field.value)}
                    onValueChange={(v) =>
                      field.onChange(Number(v))
                    }>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {fornecedores.map(f => (
                        <SelectItem
                          key={f.fornecedorId}
                          value={String(f.fornecedorId)}
                        >
                          {f.nomeFantasia}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )} />

            <div className="col-span-2 flex justify-end mt-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
