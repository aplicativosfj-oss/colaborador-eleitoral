import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle2, ShieldAlert } from "lucide-react";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CampaignMark } from "@/components/site/campaign-mark";
import { supabase } from "@/lib/supabase";
import { apoioPublicoSchema } from "@/lib/validation";
import { MUNICIPIOS_ACRE } from "@/lib/municipios";
import { formatCPF, formatPhoneBR, formatSecaoEleitoral } from "@/lib/validators";
import type { z } from "zod";

export const Route = createFileRoute("/apoio/$colaboradorId")({
  component: ApoioPublicoPage,
  head: () => ({
    meta: [
      { title: "Quero apoiar | Pedro Abreu 2026" },
      {
        name: "description",
        content: "Cadastre seu apoio à candidatura do Pastor Pedro Abreu a Deputado Estadual do Acre.",
      },
    ],
  }),
});

type ApoioValues = z.infer<typeof apoioPublicoSchema>;

const SUPABASE_URL = import.meta.env["VITE_SUPABASE_URL"];
const SUPABASE_KEY = import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"];

function ApoioPublicoPage() {
  const { colaboradorId } = Route.useParams();
  const [nomeColaborador, setNomeColaborador] = useState<string | null | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ApoioValues>({ resolver: zodResolver(apoioPublicoSchema) });

  const cpfField = register("cpf");
  const whatsappField = register("whatsapp");
  const secaoField = register("secao_voto");

  useEffect(() => {
    let active = true;
    supabase
      .rpc("nome_colaborador", { p_id: colaboradorId })
      .then(({ data }) => {
        if (active) setNomeColaborador((data as string | null) ?? null);
      });
    return () => {
      active = false;
    };
  }, [colaboradorId]);

  async function onSubmit(values: ApoioValues) {
    setSubmitting(true);

    // Um visitante anônimo pode inserir (política eleitores_insert_publico),
    // mas não pode ler o cadastro de volta (só o próprio colaborador e o
    // admin/candidato podem ver a lista). O client do supabase-js pede a
    // linha de volta por padrão quando nada é dito ao contrário, e como o
    // anônimo não tem permissão de leitura, isso faz o insert inteiro
    // falhar por RLS. Por isso aqui pedimos explicitamente "não devolva a
    // linha" (`Prefer: return=minimal`).
    const res = await fetch(`${SUPABASE_URL}/rest/v1/eleitores`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        colaborador_id: colaboradorId,
        nome_completo: values.nome_completo,
        cpf: values.cpf,
        titulo_eleitor: values.titulo_eleitor || null,
        zona: values.zona || null,
        whatsapp: values.whatsapp || null,
        endereco: values.endereco || null,
        municipio: values.municipio || null,
        local_votacao: values.local_votacao || null,
        secao_voto: values.secao_voto || null,
        observacoes: values.observacoes || null,
      }),
    });
    setSubmitting(false);

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      if (body?.code === "23505") {
        toast.error("CPF já cadastrado", { description: "Esse CPF já enviou um cadastro antes." });
      } else {
        toast.error("Não foi possível enviar seu cadastro", { description: body?.message });
      }
      return;
    }

    setDone(true);
  }

  return (
    <div className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-4 py-6">
      <img
        src="/pastor.jpg"
        alt=""
        className="absolute inset-0 size-full object-cover object-left-top"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, var(--brand-navy) 0%, oklch(0.24 0.09 264 / 0.92) 45%, var(--brand-green) 100%)",
          opacity: 0.93,
        }}
      />

      <div className="relative flex w-full max-w-md flex-col" style={{ maxHeight: "100dvh" }}>
        <Link
          to="/"
          className="mb-2 flex items-center gap-1.5 text-sm font-medium text-white/85 transition-colors hover:text-white"
        >
          <ArrowLeft className="size-4" />
          Página inicial
        </Link>

        <Card className="flex max-h-[calc(100dvh-3rem)] flex-col overflow-hidden rounded-2xl border-white/10 bg-card/95 shadow-xl backdrop-blur">
          <CardHeader className="items-center gap-0.5 py-4 text-center">
            <CampaignMark className="text-brand-navy dark:text-foreground" />
            <CardTitle className="mt-2 text-lg">Quero apoiar a candidatura</CardTitle>
            {nomeColaborador === undefined && (
              <CardDescription className="text-xs">Carregando...</CardDescription>
            )}
            {nomeColaborador === null && (
              <CardDescription className="flex items-center gap-1.5 text-xs text-destructive">
                <ShieldAlert className="size-4" />
                Link inválido ou expirado.
              </CardDescription>
            )}
            {nomeColaborador && (
              <CardDescription className="text-xs">
                Você está se cadastrando através de <strong>{nomeColaborador}</strong>.
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="overflow-y-auto pt-0">
          {done ? (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <CheckCircle2 className="size-10 text-primary" />
              <p className="font-medium text-foreground">Cadastro enviado!</p>
              <p className="text-sm text-muted-foreground">
                Obrigado por apoiar a campanha do Pastor Pedro Abreu. Seus dados já chegaram para{" "}
                {nomeColaborador}.
              </p>
            </div>
          ) : nomeColaborador === null ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Peça um link novo para quem te convidou a apoiar a campanha.
            </p>
          ) : (
            <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-1">
                <Label htmlFor="nome_completo">Nome completo</Label>
                <Input id="nome_completo" autoComplete="name" {...register("nome_completo")} />
                {errors.nome_completo && (
                  <p className="text-xs text-destructive">{errors.nome_completo.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
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
                <div className="flex flex-col gap-1">
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    inputMode="numeric"
                    placeholder="(68) 9...."
                    {...whatsappField}
                    onChange={(e) => {
                      e.target.value = formatPhoneBR(e.target.value);
                      whatsappField.onChange(e);
                    }}
                  />
                  {errors.whatsapp && (
                    <p className="text-xs text-destructive">{errors.whatsapp.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <Label>Município</Label>
                  <Controller
                    control={control}
                    name="municipio"
                    render={({ field }) => (
                      <Select value={field.value ?? ""} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
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
                <div className="flex flex-col gap-1">
                  <Label htmlFor="local_votacao">Local onde vota</Label>
                  <Input id="local_votacao" {...register("local_votacao")} />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <Label htmlFor="endereco">Endereço</Label>
                <Input id="endereco" {...register("endereco")} />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="titulo_eleitor">Título</Label>
                  <Input id="titulo_eleitor" placeholder="0000 0000 0000" {...register("titulo_eleitor")} />
                  {errors.titulo_eleitor && (
                    <p className="text-xs text-destructive">{errors.titulo_eleitor.message}</p>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <Label htmlFor="zona">Zona</Label>
                  <Input id="zona" {...register("zona")} />
                </div>
                <div className="flex flex-col gap-1">
                  <Label htmlFor="secao_voto">Seção</Label>
                  <Input
                    id="secao_voto"
                    inputMode="numeric"
                    placeholder="0000"
                    {...secaoField}
                    onChange={(e) => {
                      e.target.value = formatSecaoEleitoral(e.target.value);
                      secaoField.onChange(e);
                    }}
                  />
                  {errors.secao_voto && (
                    <p className="text-xs text-destructive">{errors.secao_voto.message}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <Label htmlFor="observacoes">Alguma observação? (opcional)</Label>
                <Textarea id="observacoes" rows={2} {...register("observacoes")} />
              </div>

              <Button type="submit" className="mt-1" disabled={submitting}>
                {submitting ? "Enviando..." : "Enviar cadastro"}
              </Button>
              <p className="text-center text-[11px] text-muted-foreground">
                Seus dados ficam vinculados apenas a {nomeColaborador} e à equipe da campanha.
              </p>
            </form>
          )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
