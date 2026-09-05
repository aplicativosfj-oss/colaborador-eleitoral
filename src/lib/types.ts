export type UserRole = "pendente" | "colaborador" | "candidato" | "admin";

export interface Profile {
  id: string;
  full_name: string;
  cpf: string | null;
  whatsapp: string | null;
  role: UserRole;
  created_at: string;
}

export interface Eleitor {
  id: string;
  colaborador_id: string;
  nome_completo: string;
  cpf: string | null;
  titulo_eleitor: string | null;
  zona: string | null;
  foto_path: string | null;
  whatsapp: string | null;
  endereco: string | null;
  municipio: string | null;
  local_votacao: string | null;
  secao_voto: string | null;
  valor_recebido: number | null;
  observacoes: string | null;
  created_at: string;
}

export interface EleitorFormValues {
  nome_completo: string;
  cpf: string;
  titulo_eleitor: string;
  zona: string;
  whatsapp: string;
  endereco: string;
  municipio: string;
  local_votacao: string;
  secao_voto: string;
  valor_recebido: string;
  observacoes: string;
  foto: File | null;
}
