import { BarChart3, ClipboardList, UserPlus } from "lucide-react";
import { Reveal } from "./reveal";

const steps = [
  {
    icon: UserPlus,
    title: "Cadastre-se como colaborador",
    body: "Crie sua conta e aguarde a liberação de acesso pelo time da campanha.",
  },
  {
    icon: ClipboardList,
    title: "Cadastre seus eleitores",
    body: "Registre nome, contato, local de votação e observações de cada eleitor visitado.",
  },
  {
    icon: BarChart3,
    title: "Acompanhe em tempo real",
    body: "O candidato acompanha o total de eleitores, por colaborador e por município.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="como-funciona" className="border-t border-border/60 py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-16 px-4 sm:px-6 md:grid-cols-2">
        <Reveal>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Como funciona a mobilização
          </h2>
          <p className="mt-4 max-w-[46ch] text-base leading-relaxed text-muted-foreground">
            Um painel simples para o colaborador cadastrar eleitores em campo e um painel completo
            para o candidato enxergar o resultado do trabalho de cada equipe, em cada município do
            Acre.
          </p>
        </Reveal>

        <ol className="relative flex flex-col gap-10">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 100}>
              <li className="relative flex gap-5">
                {i < steps.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute left-6 top-14 h-[calc(100%+1.5rem)] w-px bg-border"
                  />
                )}
                <span className="relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <step.icon className="size-5" />
                </span>
                <div className="pt-1.5">
                  <h3 className="font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-1.5 max-w-[42ch] text-sm leading-relaxed text-muted-foreground">
                    {step.body}
                  </p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
