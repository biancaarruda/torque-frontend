"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IMaskInput } from "react-imask";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { ChevronsUpDown, Check } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export function New({ item = null, isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);

  const estados = {
    ac: "AC", al: "AL", ap: "AP", am: "AM", ba: "BA", ce: "CE", df: "DF", es: "ES",
    go: "GO", ma: "MA", mt: "MT", ms: "MS", mg: "MG", pa: "PA", pb: "PB", pr: "PR",
    pe: "PE", pi: "PI", rj: "RJ", rn: "RN", rs: "RS", ro: "RO", rr: "RR", sc: "SC",
    sp: "SP", se: "SE", to: "TO",
  };

  const estadosArray = Object.entries(estados).map(([value, label]) => ({
    value,
    label,
  }));

  const form = useForm({
    defaultValues: {
      nome: "",
      cargo: "",
      contato: {
        telefone: "",
        email: "",
        cpf: "",
        rg: "",
      },
      endereco: {
        rua: "",
        numero: "",
        bairro: "",
        cidade: "",
        estado: "",
        cep: "",
      },
    },
  });

  useEffect(() => {
    if (!isOpen) return;

    form.reset({
      nome: item?.nome || "",
      cargo: item?.cargo || "",
      contato: {
        telefone: item?.contato?.telefone || "",
        email: item?.contato?.email || "",
        cpf: item?.contato?.cpf || "",
        rg: item?.contato?.rg || "",
      },
      endereco: {
        rua: item?.endereco?.rua || "",
        numero: item?.endereco?.numero || "",
        bairro: item?.endereco?.bairro || "",
        cidade: item?.endereco?.cidade || "",
        estado: item?.endereco?.estado || "",
        cep: item?.endereco?.cep || "",
      },
    });
  }, [item, isOpen]);

  async function onSubmit(values) {
    setLoading(true);

    if (!values.endereco.estado) {
      toast.error("Selecione um estado");
      setLoading(false);
      return;
    }

    const payload = {
      ...values,
      endereco: {
        ...values.endereco,
        estado: values.endereco.estado
      }
    };

    try {
      if (item?.funcionarioId) {
        await api.put(
          `/funcionarios/${item.funcionarioId}`,
          payload
        );
      } else {
        await api.post("/funcionarios", payload);
      }

      toast.success("Funcionário salvo com sucesso!");
      onSuccess?.();
      onClose();
    } catch (error) {
        const mensagem = error?.response?.data;

        if (mensagem === "CPF já cadastrado.") {
          toast.error("Já existe um funcionário cadastrado com este CPF.");
        } else {
          toast.error(mensagem || "Erro ao salvar funcionário!");
        }
      } finally {
      setLoading(false); 
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-[1400px] h-[95vh] p-6">
        <DialogHeader>
          <DialogTitle>
            {item?.funcionarioId ? "Editar" : "Adicionar"} Funcionário
          </DialogTitle>
          <DialogDescription>
            Preencha os dados do funcionário.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-4 gap-4 overflow-y-auto"
          >

            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem className="col-span-4">
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nome do cliente" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contato.email"
              render={({ field }) => (
                <FormItem className="col-span-4">
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <IMaskInput
                      {...field}
                      onAccept={(value) => field.onChange(value.replace(/\D/g, ""))}
                      placeholder="nome@domínio.com"
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground outline-none focus:ring-2 focus:ring-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contato.telefone"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <IMaskInput
                      mask="000000000000"
                      {...field}
                      onAccept={(value) => field.onChange(value.replace(/\D/g, ""))}
                      placeholder="(99) 9 9999-9999"
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground outline-none focus:ring-2 focus:ring-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contato.rg"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Rg</FormLabel>
                  <FormControl>
                    <IMaskInput
                      {...field}
                      onAccept={(value) => field.onChange(value.replace(/\D/g, ""))}
                      placeholder="RG"
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground outline-none focus:ring-2 focus:ring-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contato.cpf"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>CPF</FormLabel>
                  <FormControl>
                    <IMaskInput
                      mask="000.000.000-00"
                      {...field}
                      onAccept={(value) => field.onChange(value.replace(/\D/g, ""))}
                      placeholder="CPF"
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground outline-none focus:ring-2 focus:ring-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            {/* Endereço */}
            {["rua", "numero", "bairro", "cidade"].map((key) => (
              <FormField
                key={key}
                control={form.control}
                name={`endereco.${key}`}
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={key} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <FormField
              control={form.control}
              name="endereco.estado"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Estado</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? estadosArray.find(
                              (e) => e.value === field.value
                            )?.label
                            : "Selecione estado"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>

                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Procure estado..." />
                        <CommandList>
                          <CommandEmpty>
                            Estado não encontrado.
                          </CommandEmpty>
                          <CommandGroup>
                            {estadosArray.map((estado) => (
                              <CommandItem
                                key={estado.value}
                                value={estado.value}
                                onSelect={() =>
                                  form.setValue(
                                    "endereco.estado",
                                    estado.value
                                  )
                                }
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    estado.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {estado.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="col-span-4 flex justify-end">
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
