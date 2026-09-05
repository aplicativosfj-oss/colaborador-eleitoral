import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { User } from "lucide-react";
import type { Eleitor } from "@/lib/types";

function formatBRL(value: number | null) {
  if (value === null) return "Não informado";
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function Field({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm text-foreground">{value || "Não informado"}</p>
    </div>
  );
}

export function EleitorDetailDialog({
  eleitor,
  fotoUrl,
  colaboradorName,
  onOpenChange,
}: {
  eleitor: Eleitor | null;
  fotoUrl?: string | undefined;
  colaboradorName?: string | undefined;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={!!eleitor} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        {eleitor && (
          <>
            <DialogHeader className="items-center text-center sm:items-start sm:text-left">
              <div className="flex items-center gap-4">
                <Avatar className="size-16 border">
                  <AvatarImage src={fotoUrl} className="object-cover" />
                  <AvatarFallback>
                    <User className="size-6 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <DialogTitle>{eleitor.nome_completo}</DialogTitle>
                  {colaboradorName && (
                    <DialogDescription>Cadastrado por {colaboradorName}</DialogDescription>
                  )}
                </div>
              </div>
            </DialogHeader>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Título de eleitor" value={eleitor.titulo_eleitor} />
              <Field label="WhatsApp" value={eleitor.whatsapp} />
              <Field label="Município" value={eleitor.municipio} />
              <Field label="Local de votação" value={eleitor.local_votacao} />
              <Field label="Seção de voto" value={eleitor.secao_voto} />
              <Field label="Valor recebido" value={formatBRL(eleitor.valor_recebido)} />
              <Field label="Endereço" value={eleitor.endereco} />
              <Field
                label="Cadastrado em"
                value={new Date(eleitor.created_at).toLocaleDateString("pt-BR")}
              />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Anotações
              </p>
              <p className="mt-1 text-sm leading-relaxed text-foreground">
                {eleitor.observacoes || "Nenhuma anotação registrada."}
              </p>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
