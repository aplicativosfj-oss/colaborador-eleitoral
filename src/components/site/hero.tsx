import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StarEmblem } from "./star-emblem";
import { Reveal } from "./reveal";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-16 sm:px-6 md:grid-cols-2 md:pb-24 md:pt-24">
        <Reveal>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Eleições 2026 · Acre
          </p>
          <h1 className="mt-4 text-5xl font-semibold leading-[1.05] tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Mobilização que vence eleição.
          </h1>
          <p className="mt-6 max-w-[46ch] text-base leading-relaxed text-muted-foreground md:text-lg">
            Cadastre colaboradores, acompanhe eleitores em tempo real e organize a campanha de Pedro
            Abreu para Deputado Estadual do Acre.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link to="/cadastro">
                Quero ser colaborador
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="#como-funciona">Como funciona</a>
            </Button>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-primary shadow-xl shadow-primary/10 md:aspect-square">
            <div
              className="absolute inset-0 opacity-90"
              style={{
                background:
                  "linear-gradient(155deg, oklch(0.33 0.085 152) 0%, oklch(0.24 0.06 155) 62%, oklch(0.18 0.04 155) 100%)",
              }}
            />
            <div
              className="absolute -inset-y-10 -right-1/3 w-2/3 rotate-[18deg]"
              style={{ background: "oklch(0.78 0.135 85 / 0.9)" }}
            />
            <div
              className="absolute -inset-y-10 -right-1/4 w-1/4 rotate-[18deg]"
              style={{ background: "oklch(0.33 0.085 152)" }}
            />
            <div className="relative flex h-full flex-col items-center justify-center gap-4 p-10 text-center">
              <StarEmblem className="size-16 text-primary-foreground drop-shadow-sm" />
              <div className="text-primary-foreground">
                <p className="text-2xl font-semibold tracking-tight">Pedro Abreu</p>
                <p className="mt-1 text-sm uppercase tracking-[0.14em] text-primary-foreground/75">
                  Deputado Estadual · Acre
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
