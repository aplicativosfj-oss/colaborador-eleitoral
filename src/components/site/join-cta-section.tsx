import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "./reveal";

export function JoinCtaSection() {
  return (
    <section className="relative bg-primary py-12 md:py-16">
      <div className="absolute inset-x-0 top-0 h-1.5 bg-accent" aria-hidden="true" />
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <Reveal>
          <h2 className="text-2xl font-semibold tracking-tight text-primary-foreground md:text-3xl">
            Faça parte do time
          </h2>
          <p className="mx-auto mt-3 max-w-[48ch] text-sm leading-relaxed text-primary-foreground/80 md:text-base">
            Ajude a organizar a campanha de Pedro Abreu no seu bairro e no seu município. Leva menos
            de dois minutos para se cadastrar.
          </p>
          <div className="mt-5 flex justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link to="/cadastro">
                Quero ser colaborador
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
