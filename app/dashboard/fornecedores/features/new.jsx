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

  const validarCnpj = async (cnpj) => {
    const cnpjLimpo = cnpj.replace(/\D/g, "");

    if (cnpjLimpo.length !== 14) {
      return false;
    }

    try {
      const response = await fetch(
        `https://brasilapi.com.br/api/cnpj/v1/${cnpjLimpo}`
      );

      if (!response.ok) {
        return false;
      }

      const data = await response.json();

      return !!data.cnpj;
    } catch (error) {
      console.error(error);
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

      contato: {
        telefone: "",
        email: "",
        cpf: "",
        cnpj: "",
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
      razaoSocial: item?.razaoSocial || "",
      nomeFantasia: item?.nomeFantasia || "",

      contato: {
        telefone: item?.contato?.telefone || "",
        email: item?.contato?.email || "",
        cpf: item?.contato?.cpf || "",
        cnpj: item?.contato?.cnpj || "",
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
      const cnpjValido = await validarCnpj(values.contato.cnpj);


      if (!cepValido) {
        toast.error("CEP inválido");
        setLoading(false);
        return;
      }

      if (!cnpjValido) {
        toast.error("CNPJ inválido");
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

      if (item?.fornecedorId) {
        await api.put(`/fornecedores/${item.fornecedorId}`, payload);
      } else {
        await api.post("/fornecedores", payload);
      }

      toast.success("Fornecedor salvo com sucesso!");

      onSuccess?.();
      onClose();

    } catch (error) {
        const mensagem = error?.response?.data;

        if (mensagem === "CNPJ já cadastrado.") {
          toast.error("Já existe um fornecedor cadastrado com este CNPJ.");
        } else {
          toast.error(mensagem || "Erro ao salvar fornecedor!");
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
            {item?.fornecedorId ? "Editar" : "Adicionar"} Fornecedor
          </DialogTitle>
          <DialogDescription>
            Preencha os dados do fornecedor abaixo.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-4 gap-4 h-full overflow-y-auto"
          >

            {/* Razão Social */}
            <FormField
              control={form.control}
              name="razaoSocial"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Razão Social</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Razão Social" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Nome Fantasia */}
            <FormField
              control={form.control}
              name="nomeFantasia"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Nome Fantasia</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nome Fantasia" />
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
              name="contato.cnpj"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>CNPJ</FormLabel>
                  <FormControl>
                    <IMaskInput
                      {...field}
                      onAccept={(value) => field.onChange(value.replace(/\D/g, ""))}
                      placeholder="CNPJ"
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
