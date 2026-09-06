import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, LockKeyhole, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CampaignMark } from "@/components/site/campaign-mark";
import { supabase } from "@/lib/supabase";
import { loginSchema } from "@/lib/validation";
import { formatCPF, onlyDigits } from "@/lib/validators";
import type { z } from "zod";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "Entrar | Colaborador Eleitoral" },
      { name: "description", content: "Acesso seguro à gestão eleitoral da campanha Pedro Abreu 2026." },
      { property: "og:title", content: "Entrar | Colaborador Eleitoral" },
      { property: "og:description", content: "Acesso seguro à gestão eleitoral da campanha Pedro Abreu 2026." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
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
    <div className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-muted px-4 py-10">
      <img
        src="/pastor.jpg"
        alt="Pastor Pedro Abreu"
        className="absolute inset-y-0 left-0 hidden h-full w-[48%] object-cover object-top lg:block"
      />
      <div className="absolute inset-y-0 left-0 hidden w-[48%] bg-brand-navy/35 lg:block" />

      <div className="relative flex w-full max-w-[420px] flex-col lg:ml-[42%]">
        <Link
          to="/"
          className="mb-3 flex items-center gap-1.5 self-start text-xs font-semibold text-muted-foreground transition-all hover:-translate-x-0.5 hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Voltar para o início
        </Link>

        <section className="w-full overflow-hidden rounded-xl border border-border bg-card shadow-xl">
          <div className="relative overflow-hidden bg-brand-navy px-7 py-6 text-primary-foreground">
            <div className="absolute -right-10 -top-12 size-32 rotate-45 bg-brand-green/25" />
            <div className="absolute -bottom-14 -left-10 size-28 rotate-45 bg-brand-gold/20" />
            <CampaignMark className="relative" />
            <p className="relative mt-3 text-xs text-primary-foreground/65">Portal seguro do colaborador e da administração.</p>
          </div>
          <div className="p-7">
            <div className="mb-5 flex items-center justify-between">
              <div><h1 className="text-xl font-bold text-foreground">Entrar</h1><p className="mt-1 text-xs text-muted-foreground">Use seu CPF e sua senha de acesso.</p></div>
              <span className="flex size-9 items-center justify-center rounded-lg bg-secondary text-secondary-foreground"><ShieldCheck className="size-4" /></span>
            </div>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="cpf" className="text-[11px] font-bold uppercase text-muted-foreground">CPF</Label>
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
                <Label htmlFor="password" className="text-[11px] font-bold uppercase text-muted-foreground">Senha de acesso</Label>
                <div className="relative"><Input id="password" type="password" autoComplete="current-password" className="pr-10" {...register("password")} /><LockKeyhole className="pointer-events-none absolute right-3 top-2.5 size-4 text-muted-foreground" /></div>
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password.message}</p>
                )}
              </div>
              <Button type="submit" className="group mt-1 bg-brand-green text-primary-foreground hover:bg-brand-green/90" disabled={submitting}>
                {submitting ? "Entrando..." : "Entrar no sistema"}
                {!submitting && <ArrowRight className="transition-transform group-hover:translate-x-1" />}
              </Button>
            </form>
            <p className="mt-5 border-t border-border pt-5 text-center text-xs text-muted-foreground">
              Ainda não tem conta?{" "}
              <Link
                to="/cadastro"
                className="font-medium text-foreground underline underline-offset-4"
              >
                Quero ser colaborador
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
