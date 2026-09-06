import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "./reveal";
import heroBg from "@/assets/hero-bg.jpg";

const CANDIDATE_IMAGE = "/pastor.jpg";

export function Hero() {
  return (
    <section className="relative flex min-h-[calc(100dvh-56px)] items-center overflow-hidden">
      <img
        src={heroBg}
        alt=""
        aria-hidden
        width={1920}
        height={1080}
        className="absolute inset-0 size-full object-cover"
        loading="eager"
        fetchPriority="high"
      />
      {/* Camada de escurecimento nas cores da marca para garantir legibilidade */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(100deg, color-mix(in oklab, var(--brand-navy) 88%, transparent) 0%, color-mix(in oklab, var(--brand-navy) 62%, transparent) 45%, color-mix(in oklab, var(--brand-navy) 25%, transparent) 100%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, white 0 2px, transparent 2px 22px)",
        }}
      />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-6 px-4 py-8 sm:px-6 md:grid-cols-2 md:gap-8 md:py-10">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold">
            Eleições 2026 · Acre · Nº 15150
          </p>
          <h1 className="mt-2.5 text-2xl font-semibold leading-[1.1] tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
            Mobilização que vence eleição.
          </h1>
          <p className="mt-2.5 max-w-[46ch] text-sm leading-relaxed text-white/80 md:text-base">
            Cadastre colaboradores, acompanhe apoiadores em tempo real e organize a campanha do
            Pastor Pedro Abreu para Deputado Estadual do Acre.
          </p>
          <p className="mt-2 max-w-[46ch] font-medium italic text-brand-gold/95">
            Fé, trabalho e compromisso com o nosso povo!
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2.5">
            <Button asChild className="bg-brand-gold text-brand-navy hover:bg-brand-gold/90">
              <Link to="/cadastro">
                Quero ser colaborador
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-white/30 bg-white/5 text-white hover:bg-white/15 hover:text-white"
            >
              <a href="#como-funciona">Como funciona</a>
            </Button>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="relative mx-auto max-h-[46dvh] w-full max-w-xs overflow-hidden rounded-2xl bg-white p-2.5 shadow-2xl ring-4 ring-brand-gold/80 sm:max-h-[52dvh] md:max-h-[62dvh] md:max-w-sm">
            <img
              src={CANDIDATE_IMAGE}
              alt="Pastor Pedro Abreu, candidato a Deputado Estadual do Acre, número 15150"
              className="mx-auto max-h-[42dvh] w-auto rounded-xl object-contain sm:max-h-[48dvh] md:max-h-[58dvh]"
              loading="eager"
            />
          </div>
          <p className="mt-1.5 text-center text-[11px] text-white/70 md:text-right">
            Pastor Pedro Abreu · Deputado Estadual · Nº 15150
          </p>
        </Reveal>
      </div>
    </section>
  );
}
