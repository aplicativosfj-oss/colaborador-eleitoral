import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "./reveal";
import heroBg from "@/assets/hero-bg.jpg";

const CANDIDATE_IMAGE = "/pastor.jpg";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
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

      <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 pb-12 pt-10 sm:px-6 md:grid-cols-2 md:pb-16 md:pt-14">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold">
            Eleições 2026 · Acre · Nº 15150
          </p>
          <h1 className="mt-3 text-3xl font-semibold leading-[1.1] tracking-tight text-white md:text-4xl lg:text-5xl">
            Mobilização que vence eleição.
          </h1>
          <p className="mt-3 max-w-[46ch] text-sm leading-relaxed text-white/80 md:text-base">
            Cadastre colaboradores, acompanhe eleitores em tempo real e organize a campanha do
            Pastor Pedro Abreu para Deputado Estadual do Acre.
          </p>
          <p className="mt-2 max-w-[46ch] font-medium italic text-brand-gold/95">
            Fé, trabalho e compromisso com o nosso povo!
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-2.5">
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
          <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-2xl bg-white p-3 shadow-2xl ring-4 ring-brand-gold/80 md:max-w-none">
            <img
              src={CANDIDATE_IMAGE}
              alt="Pastor Pedro Abreu, candidato a Deputado Estadual do Acre, número 15150"
              className="size-full rounded-xl object-contain"
              loading="eager"
            />
          </div>
          <p className="mt-2 text-center text-[11px] text-white/70 md:text-right">
            Pastor Pedro Abreu · Deputado Estadual · Nº 15150
          </p>
        </Reveal>
      </div>
    </section>
  );
}
