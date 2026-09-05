import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "./reveal";

const HERO_IMAGE =
  "https://upload.wikimedia.org/wikipedia/commons/d/dd/Cal%C3%A7ad%C3%A3o_da_Gameleira%2C_Rio_Branco_Acre.jpg";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 pb-10 pt-8 sm:px-6 md:grid-cols-2 md:pb-14 md:pt-12">
        <Reveal>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Eleições 2026 · Acre
          </p>
          <h1 className="mt-3 text-3xl font-semibold leading-[1.1] tracking-tight text-foreground md:text-4xl lg:text-5xl">
            Mobilização que vence eleição.
          </h1>
          <p className="mt-3 max-w-[46ch] text-sm leading-relaxed text-muted-foreground md:text-base">
            Cadastre colaboradores, acompanhe eleitores em tempo real e organize a campanha de Pedro
            Abreu para Deputado Estadual do Acre.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            <Button asChild>
              <Link to="/cadastro">
                Quero ser colaborador
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <a href="#como-funciona">Como funciona</a>
            </Button>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-lg shadow-primary/10">
            <img
              src={HERO_IMAGE}
              alt="Calçadão da Gameleira, orla de Rio Branco, capital do Acre"
              className="absolute inset-0 size-full object-cover"
              loading="eager"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(155deg, oklch(0.33 0.085 152 / 0.55) 0%, oklch(0.2 0.05 155 / 0.35) 55%, oklch(0.17 0.03 155 / 0.15) 100%)",
              }}
            />
          </div>
          <p className="mt-1.5 text-right text-[11px] text-muted-foreground">
            Orla de Rio Branco (AC) · Foto: MTur Destinos / Wikimedia Commons
          </p>
        </Reveal>
      </div>
    </section>
  );
}
