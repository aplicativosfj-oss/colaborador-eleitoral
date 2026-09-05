import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StarEmblem } from "@/components/site/star-emblem";
import { supabase } from "@/lib/supabase";
import { signupSchema } from "@/lib/validation";
import { formatCPF } from "@/lib/validators";
import type { z } from "zod";

export const Route = createFileRoute("/cadastro")({
  component: CadastroPage,
});

type SignupValues = z.infer<typeof signupSchema>;

function CadastroPage() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupValues>({ resolver: zodResolver(signupSchema) });

  const cpfField = register("cpf");

  async function onSubmit(values: SignupValues) {
    setSubmitting(true);
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          full_name: values.full_name,
          whatsapp: values.whatsapp,
          cpf: values.cpf,
        },
      },
    });
    setSubmitting(false);

    if (error) {
      toast.error("Não foi possível concluir o cadastro", { description: error.message });
      return;
    }

    setDone(true);
  }

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-muted/30 px-4 py-16">
      <Card className="w-full max-w-sm rounded-2xl">
        <CardHeader className="items-center text-center">
          <span className="mb-2 flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <StarEmblem className="size-5" />
          </span>
          <CardTitle className="text-xl">Quero ser colaborador</CardTitle>
          <CardDescription>
            Cadastre-se para ajudar a organizar a campanha de Pedro Abreu.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {done ? (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <CheckCircle2 className="size-10 text-primary" />
              <p className="font-medium text-foreground">Cadastro recebido!</p>
              <p className="text-sm text-muted-foreground">
                Confirme seu e-mail (se solicitado) e aguarde a liberação de acesso pelo time da
                campanha. Você será avisado pelo WhatsApp.
              </p>
              <Button asChild variant="outline" className="mt-2">
                <Link to="/login">Ir para o login</Link>
              </Button>
            </div>
          ) : (
            <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="full_name">Nome completo</Label>
                <Input id="full_name" autoComplete="name" {...register("full_name")} />
                {errors.full_name && (
                  <p className="text-xs text-destructive">{errors.full_name.message}</p>
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
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  placeholder="(68) 90000-0000"
                  autoComplete="tel"
                  {...register("whatsapp")}
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
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password.message}</p>
                )}
              </div>
              <Button type="submit" className="mt-2" disabled={submitting}>
                {submitting ? "Enviando..." : "Criar conta"}
              </Button>
            </form>
          )}
          {!done && (
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Já tem conta?{" "}
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
