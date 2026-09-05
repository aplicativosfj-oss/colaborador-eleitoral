import { Reveal } from "./reveal";

export function AboutSection() {
  return (
    <section id="sobre" className="relative isolate overflow-hidden">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/f/f4/Assis_Lima_Rio_Acre_vista_Ponte_Jucelio_Kubitschek_e_Ponte_coronel_Sebasti%C3%A3o_Dantas_Passarela_Joaquim_Macedo_Rio_Branco_AC_%2826992942418%29.jpg"
        alt="Rio Acre e pontes de Rio Branco, com a bandeira do Acre em primeiro plano"
        className="absolute inset-0 size-full object-cover"
        loading="lazy"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(115deg, oklch(0.17 0.03 155 / 0.92) 0%, oklch(0.17 0.03 155 / 0.82) 45%, oklch(0.17 0.03 155 / 0.55) 100%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-16">
        <Reveal className="max-w-[52ch]">
          <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
            Uma campanha construída rua a rua
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/80 md:text-base">
            A candidatura de Pedro Abreu para Deputado Estadual do Acre é sustentada por
            colaboradores em cada um dos 22 municípios do estado. Cada visita, cada conversa e cada
            cadastro fortalece essa rede.
          </p>
        </Reveal>
        <p className="relative mt-6 text-[11px] text-white/60">
          Rio Acre, Rio Branco (AC) · Foto: Assis Lima / MTur Destinos · Wikimedia Commons
        </p>
      </div>
    </section>
  );
}
