import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StarEmblem } from "@/components/site/star-emblem";
import { supabase } from "@/lib/supabase";
import { loginSchema } from "@/lib/validation";
import { formatCPF, onlyDigits } from "@/lib/validators";
import type { z } from "zod";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

type LoginValues = z.infer<typeof loginSchema>;

function LoginPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const cpfField = register("cpf");

  async function onSubmit(values: LoginValues) {
    setSubmitting(true);

    const { data: email, error: lookupError } = await supabase.rpc("email_for_cpf", {
      p_cpf: onlyDigits(values.cpf),
    });

    if (lookupError || !email) {
      setSubmitting(false);
      toast.error("CPF não encontrado", {
        description: "Confira o CPF ou peça ao time da campanha para liberar seu acesso.",
      });
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: values.password,
    });
    setSubmitting(false);

    if (error) {
      toast.error("Não foi possível entrar", { description: "Senha incorreta." });
      return;
    }

    toast.success("Login realizado");
    navigate({ to: "/admin" });
  }

  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden px-4 py-16">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/d/dd/Cal%C3%A7ad%C3%A3o_da_Gameleira%2C_Rio_Branco_Acre.jpg"
        alt=""
        className="absolute inset-0 size-full object-cover"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, oklch(0.17 0.03 155 / 0.9) 0%, oklch(0.2 0.05 155 / 0.82) 55%, oklch(0.33 0.085 152 / 0.6) 100%)",
        }}
      />

      <div className="relative flex w-full max-w-sm flex-col items-center">
        <Link
          to="/"
          className="mb-4 flex items-center gap-1.5 self-start text-sm font-medium text-white/85 transition-colors hover:text-white"
        >
          <ArrowLeft className="size-4" />
          Voltar para o início
        </Link>

        <Card className="w-full rounded-2xl border-white/10 bg-card/95 shadow-xl backdrop-blur">
          <CardHeader className="items-center text-center">
            <span className="mb-2 flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform active:scale-95">
              <StarEmblem className="size-5" />
            </span>
            <CardTitle className="text-xl">Entrar</CardTitle>
            <CardDescription>Acesse o painel do colaborador ou da campanha.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  inputMode="numeric"
                  placeholder="000.000.000-00"
                  autoComplete="username"
                  {...cpfField}
                  onChange={(e) => {
                    e.target.value = formatCPF(e.target.value);
                    cpfField.onChange(e);
                  }}
                />
                {errors.cpf && <p className="text-xs text-destructive">{errors.cpf.message}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password.message}</p>
                )}
              </div>
              <Button type="submit" className="mt-2" disabled={submitting}>
                {submitting ? "Entrando..." : "Entrar"}
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Ainda não tem conta?{" "}
              <Link
                to="/cadastro"
                className="font-medium text-foreground underline underline-offset-4"
              >
                Quero ser colaborador
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
