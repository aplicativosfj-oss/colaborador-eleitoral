import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "./reveal";

export function JoinCtaSection() {
  return (
    <section className="relative bg-primary py-20 md:py-28">
      <div className="absolute inset-x-0 top-0 h-1.5 bg-accent" aria-hidden="true" />
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <Reveal>
          <h2 className="text-3xl font-semibold tracking-tight text-primary-foreground md:text-5xl">
            Faça parte do time
          </h2>
          <p className="mx-auto mt-5 max-w-[48ch] text-base leading-relaxed text-primary-foreground/80 md:text-lg">
            Ajude a organizar a campanha de Pedro Abreu no seu bairro e no seu município. Leva menos
            de dois minutos para se cadastrar.
          </p>
          <div className="mt-8 flex justify-center">
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
