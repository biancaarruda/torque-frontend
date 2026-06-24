import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const formatDate = (value) => {
  if (!value) return "-";

  try {
    return format(new Date(value), "dd/MM/yyyy HH:mm", {
      locale: ptBR,
    });
  } catch {
    return value;
  }
};