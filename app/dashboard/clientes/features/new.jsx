"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IMaskInput } from "react-imask";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import api from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export function New({ item = null, isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);

  const validarCep = async (cep) => {
    const cepLimpo = cep.replace(/\D/g, "");

    if (cepLimpo.length !== 8) {
      return false;
    }

    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${cepLimpo}/json/`
      );

      const data = await response.json();

      return !data.erro;
    } catch {
      return false;
    }
  };


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
      contato: {
        telefone: "",
        email: "",
        cpf: "",
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
      contato: {
        telefone: item?.contato?.telefone || "",
        email: item?.contato?.email || "",
        cpf: item?.contato?.cpf || "",
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

    try {

      const cepValido = await validarCep(values.endereco.cep);

      if (!cepValido) {
        toast.error("CEP inválido");
        setLoading(false);
        return;
      }

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

      if (item?.clienteId) {
        await api.put(`/clientes/${item.clienteId}`, payload);
      } else {
        await api.post("/clientes", payload);
      }

      toast.success("Cliente salvo com sucesso!");

      onSuccess?.();
      onClose();

    } catch (error) {
        const mensagem = error?.response?.data;

        if (mensagem === "CPF já cadastrado.") {
          toast.error("Já existe um cliente cadastrado com este CPF.");
        } else {
          toast.error(mensagem || "Erro ao salvar cliente!");
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
            {item?.clienteId ? "Editar" : "Adicionar"} Cliente
          </DialogTitle>
          <DialogDescription>
            Preencha os dados do cliente abaixo.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-4 gap-4 h-full overflow-y-auto"
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
                    <Input
                      type="email"
                      {...field}
                      placeholder="nome@dominio.com"
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
                      mask="(00) 0 0000-0000"
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
              name="endereco.cep"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>CEP</FormLabel>
                  <FormControl>
                    <IMaskInput
                      mask="00000-000"
                      {...field}
                      onAccept={(value) => {
                        const cep = value.replace(/\D/g, "");
                        field.onChange(cep);
                        if (cep.length === 8 && !item?.clienteId) {
                          validarCep(cep);
                        }
                      }}
                      placeholder="CEP"
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground outline-none focus:ring-2 focus:ring-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
