"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Pagamento({
  ordem,
  onPagar,
  onClose,
}) {
  const [tipoPagamento, setTipoPagamento] = useState("Pix");

  const [parcelas, setParcelas] =
    useState(1);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Pagamento da Ordem de Serviço
          </DialogTitle>
          <DialogDescription>
      Escolha a forma de pagamento para gerar a cobrança.
    </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">

          <div>
            <strong>Serviço:</strong>{" "}
            {ordem?.nomeServico}
          </div>

          <div>
            <strong>Valor:</strong>{" "}
            R$ {ordem?.valorTotalOrdem}
          </div>

          <div>
            <label className="block mb-2">
              Forma de Pagamento
            </label>

            <select
  className="w-full border rounded p-2"
  value={tipoPagamento}
  onChange={(e) => setTipoPagamento(e.target.value)}
>
  <option value="Pix">PIX</option>
<option value="Cartao">Cartão</option>
<option value="CartaoParcelado">Parcelado</option>
</select>
          </div>

          {tipoPagamento ===
            "CartaoParcelado" && (
            <div>
              <label className="block mb-2">
                Parcelas
              </label>

              <select
                className="w-full border rounded p-2"
                value={parcelas}
                onChange={(e) =>
                  setParcelas(
                    Number(e.target.value)
                  )
                }
              >
                {[...Array(12)].map((_, i) => (
                  <option
                    key={i + 1}
                    value={i + 1}
                  >
                    {i + 1}x
                  </option>
                ))}
              </select>
            </div>
          )}

          <Button
            className="w-full"
            onClick={() =>{
                if (!ordem?.ordemServicoId) return;
                    onPagar(
                    tipoPagamento,
                    parcelas
                )
                }
            }
          >
            Gerar Cobrança
          </Button>

        </div>
      </DialogContent>
    </Dialog>
  );
}