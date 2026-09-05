import { Reveal } from "./reveal";

export function AboutSection() {
  return (
    <section id="sobre" className="relative isolate overflow-hidden">
      <img
        src="https://picsum.photos/seed/acre-mobilizacao-2026/1800/1000"
        alt=""
        className="absolute inset-0 size-full object-cover"
        loading="lazy"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(115deg, oklch(0.17 0.03 155 / 0.94) 0%, oklch(0.17 0.03 155 / 0.86) 45%, oklch(0.17 0.03 155 / 0.55) 100%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 md:py-32">
        <Reveal className="max-w-[52ch]">
          <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
            Uma campanha construída rua a rua
          </h2>
          <p className="mt-5 text-base leading-relaxed text-white/80 md:text-lg">
            A candidatura de Pedro Abreu para Deputado Estadual do Acre é sustentada por
            colaboradores em cada um dos 22 municípios do estado. Cada visita, cada conversa e cada
            cadastro fortalece essa rede.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
