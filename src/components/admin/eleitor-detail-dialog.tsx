import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Pencil, Trash2, User } from "lucide-react";
import type { Eleitor } from "@/lib/types";

function formatBRL(value: number | null) {
  if (value === null) return "Não informado";
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDate(value: string | null) {
  if (!value) return null;
  const d = new Date(`${value}T00:00:00`);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("pt-BR");
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
  onEdit,
  onDelete,
  deleting,
}: {
  eleitor: Eleitor | null;
  fotoUrl?: string | undefined;
  colaboradorName?: string | undefined;
  onOpenChange: (open: boolean) => void;
  /** When provided, shows an "Editar" button that calls this instead of just closing. */
  onEdit?: (eleitor: Eleitor) => void;
  /** When provided, shows a "Excluir" button with a confirmation step. */
  onDelete?: (eleitor: Eleitor) => void;
  deleting?: boolean;
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
              <Field label="CPF" value={eleitor.cpf} />
              <Field label="Título de eleitor" value={eleitor.titulo_eleitor} />
              <Field label="Zona eleitoral" value={eleitor.zona} />
              <Field label="Seção de voto" value={eleitor.secao_voto} />
              <Field label="WhatsApp" value={eleitor.whatsapp} />
              <Field label="Município" value={eleitor.municipio} />
              <Field label="Local de votação" value={eleitor.local_votacao} />
              <Field label="Valor recebido" value={formatBRL(eleitor.valor_recebido)} />
              <Field label="Data da reunião/visita" value={formatDate(eleitor.data_reuniao)} />
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

            {(onEdit || onDelete) && (
              <div className="flex gap-2 pt-1">
                {onEdit && (
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 gap-1.5"
                    onClick={() => onEdit(eleitor)}
                  >
                    <Pencil className="size-4" />
                    Editar
                  </Button>
                )}
                {onDelete && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1 gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        disabled={deleting}
                      >
                        <Trash2 className="size-4" />
                        Excluir
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir este cadastro?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Isso remove definitivamente o cadastro de {eleitor.nome_completo}. Essa
                          ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          onClick={() => onDelete(eleitor)}
                        >
                          Excluir definitivamente
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
