import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StarEmblem } from "@/components/site/star-emblem";
import { supabase } from "@/lib/supabase";
import { interessadoSchema } from "@/lib/validation";
import { formatCPF, formatPhoneBR } from "@/lib/validators";
import { MUNICIPIOS_ACRE } from "@/lib/municipios";
import type { z } from "zod";

export const Route = createFileRoute("/cadastro")({
  component: CadastroPage,
});

type InteressadoValues = z.infer<typeof interessadoSchema>;

function CadastroPage() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<InteressadoValues>({ resolver: zodResolver(interessadoSchema) });

  const cpfField = register("cpf");
  const whatsappField = register("whatsapp");

  async function onSubmit(values: InteressadoValues) {
    setSubmitting(true);
    const { error } = await supabase.from("interessados").insert({
      nome_completo: values.nome_completo,
      cpf: values.cpf,
      cidade: values.cidade || null,
      whatsapp: values.whatsapp,
      email: values.email,
    });
    setSubmitting(false);

    if (error) {
      if (error.code === "23505") {
        toast.error("CPF já cadastrado", {
          description: "Esse CPF já enviou um cadastro antes.",
        });
      } else {
        toast.error("Não foi possível enviar seu cadastro", { description: error.message });
      }
      return;
    }

    setDone(true);
  }

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-muted/30 px-4 py-16">
      <Link
        to="/"
        className="mb-4 flex w-full max-w-sm items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Voltar para o início
      </Link>
      <Card className="w-full max-w-sm rounded-2xl">
        <CardHeader className="items-center text-center">
          <span className="mb-2 flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <StarEmblem className="size-5" />
          </span>
          <CardTitle className="text-xl">Quero ser colaborador</CardTitle>
          <CardDescription>
            Deixe seus dados que o time da campanha entra em contato com você.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {done ? (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <CheckCircle2 className="size-10 text-primary" />
              <p className="font-medium text-foreground">Cadastro enviado!</p>
              <p className="text-sm text-muted-foreground">
                Seus dados chegaram para o time da campanha. Em breve alguém entra em contato pelo
                WhatsApp.
              </p>
              <Button asChild variant="outline" className="mt-2">
                <Link to="/">Voltar para o início</Link>
              </Button>
            </div>
          ) : (
            <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="nome_completo">Nome completo</Label>
                <Input id="nome_completo" autoComplete="name" {...register("nome_completo")} />
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
                <Label>Cidade</Label>
                <Controller
                  control={control}
                  name="cidade"
                  render={({ field }) => (
                    <Select value={field.value ?? ""} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione sua cidade" />
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
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  inputMode="numeric"
                  placeholder="(68) 90000-0000"
                  autoComplete="tel"
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
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" autoComplete="email" {...register("email")} />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>
              <Button type="submit" className="mt-2" disabled={submitting}>
                {submitting ? "Enviando..." : "Enviar cadastro"}
              </Button>
            </form>
          )}
          {!done && (
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Já faz parte da equipe?{" "}
              <Link
                to="/login"
                className="font-medium text-foreground underline underline-offset-4"
              >
                Entrar
              </Link>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
