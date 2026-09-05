import { z } from "zod";
import { isValidCPF, isValidTituloEleitor, onlyDigits } from "./validators";

export const eleitorSchema = z.object({
  nome_completo: z.string().min(3, "Informe o nome completo"),
  cpf: z
    .string()
    .min(1, "Informe o CPF")
    .refine((v) => isValidCPF(v), "CPF inválido"),
  titulo_eleitor: z
    .string()
    .optional()
    .refine((v) => !v || onlyDigits(v).length === 0 || isValidTituloEleitor(v), {
      message: "Título de eleitor inválido",
    }),
  zona: z.string().optional(),
  whatsapp: z.string().optional(),
  endereco: z.string().optional(),
  municipio: z.string().optional(),
  local_votacao: z.string().optional(),
  secao_voto: z.string().optional(),
  valor_recebido: z.string().optional(),
  observacoes: z.string().optional(),
});

export type EleitorSchema = z.infer<typeof eleitorSchema>;

export const loginSchema = z.object({
  email: z.string().email("Informe um e-mail válido"),
  password: z.string().min(6, "Mínimo de 6 caracteres"),
});

export const signupSchema = z.object({
  full_name: z.string().min(3, "Informe seu nome completo"),
  cpf: z
    .string()
    .min(1, "Informe o CPF")
    .refine((v) => isValidCPF(v), "CPF inválido"),
  whatsapp: z.string().min(8, "Informe um WhatsApp válido"),
  email: z.string().email("Informe um e-mail válido"),
  password: z.string().min(6, "Mínimo de 6 caracteres"),
});
