import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { uploadFotoEleitor } from "@/lib/storage";
import { eleitorSchema, type EleitorSchema } from "@/lib/validation";
import { MUNICIPIOS_ACRE } from "@/lib/municipios";
import { formatCPF } from "@/lib/validators";

export function EleitorForm({ onCreated }: { onCreated: () => void }) {
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [foto, setFoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EleitorSchema>({ resolver: zodResolver(eleitorSchema) });

  const cpfField = register("cpf");

  function handleFotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setFoto(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  }

  async function onSubmit(values: EleitorSchema) {
    if (!user) return;
    setSubmitting(true);
    try {
      let foto_path: string | null = null;
      if (foto) {
        foto_path = await uploadFotoEleitor(user.id, foto);
      }

      const { error } = await supabase.from("eleitores").insert({
        colaborador_id: user.id,
        nome_completo: values.nome_completo,
        cpf: values.cpf,
        titulo_eleitor: values.titulo_eleitor || null,
        zona: values.zona || null,
        whatsapp: values.whatsapp || null,
        endereco: values.endereco || null,
        municipio: values.municipio || null,
        local_votacao: values.local_votacao || null,
        secao_voto: values.secao_voto || null,
        valor_recebido: values.valor_recebido ? Number(values.valor_recebido) : null,
        observacoes: values.observacoes || null,
        foto_path,
      });

      if (error) throw error;

      toast.success("Eleitor cadastrado com sucesso");
      reset({
        nome_completo: "",
        cpf: "",
        titulo_eleitor: "",
        zona: "",
        whatsapp: "",
        endereco: "",
        municipio: "",
        local_votacao: "",
        secao_voto: "",
        valor_recebido: "",
        observacoes: "",
      });
      setFoto(null);
      setPreview(null);
      onCreated();
    } catch (err) {
      toast.error("Não foi possível salvar o cadastro", {
        description: err instanceof Error ? err.message : undefined,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="grid gap-5 sm:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex items-center gap-4 sm:col-span-2">
        <Avatar className="size-16 border">
          <AvatarImage src={preview ?? undefined} />
          <AvatarFallback>
            <ImagePlus className="size-5 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="foto">Foto do eleitor</Label>
          <Input id="foto" type="file" accept="image/*" onChange={handleFotoChange} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5 sm:col-span-2">
        <Label htmlFor="nome_completo">Nome completo</Label>
        <Input id="nome_completo" {...register("nome_completo")} />
        {errors.nome_completo && (
          <p className="text-xs text-destructive">{errors.nome_completo.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="cpf">CPF</Label>
        <Input
          id="cpf"
          inputMode="numeric"
          placeholder="000.000.000-00"
          {...cpfField}
          onChange={(e) => {
            e.target.value = formatCPF(e.target.value);
            cpfField.onChange(e);
          }}
        />
        {errors.cpf && <p className="text-xs text-destructive">{errors.cpf.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="whatsapp">WhatsApp para contato</Label>
        <Input id="whatsapp" placeholder="(68) 90000-0000" {...register("whatsapp")} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="titulo_eleitor">Título de eleitor</Label>
        <Input id="titulo_eleitor" placeholder="0000 0000 0000" {...register("titulo_eleitor")} />
        {errors.titulo_eleitor && (
          <p className="text-xs text-destructive">{errors.titulo_eleitor.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="zona">Zona eleitoral</Label>
        <Input id="zona" {...register("zona")} />
      </div>

      <div className="flex flex-col gap-1.5 sm:col-span-2">
        <Label htmlFor="endereco">Endereço</Label>
        <Input id="endereco" {...register("endereco")} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Município</Label>
        <Controller
          control={control}
          name="municipio"
          render={({ field }) => (
            <Select value={field.value ?? ""} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o município" />
              </SelectTrigger>
              <SelectContent>
                {MUNICIPIOS_ACRE.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="local_votacao">Local onde vota</Label>
        <Input id="local_votacao" {...register("local_votacao")} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="secao_voto">Seção de voto</Label>
        <Input id="secao_voto" {...register("secao_voto")} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="valor_recebido">Valor recebido (doação/pagamento)</Label>
        <Input
          id="valor_recebido"
          type="number"
          step="0.01"
          placeholder="0,00"
          {...register("valor_recebido")}
        />
      </div>

      <div className="flex flex-col gap-1.5 sm:col-span-2">
        <Label htmlFor="observacoes">Anotações</Label>
        <Textarea id="observacoes" rows={3} {...register("observacoes")} />
      </div>

      <Button type="submit" className="sm:col-span-2" disabled={submitting}>
        {submitting ? "Salvando..." : "Salvar cadastro"}
      </Button>
    </form>
  );
}
