import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { UserRole } from "@/lib/types";

type CreateColaboradorInput = {
  accessToken: string;
  full_name: string;
  cpf: string;
  whatsapp: string;
  email: string;
  password: string;
  role: UserRole;
};

function adminClient() {
  const url = process.env["VITE_SUPABASE_URL"];
  const serviceKey = process.env["SUPABASE_SERVICE_ROLE_KEY"];
  if (!url || !serviceKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY não configurada no servidor. Adicione a chave service_role " +
        "(Supabase > Project Settings > API) em .env.local para habilitar a criação de usuários.",
    );
  }
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/**
 * Só o service role pode chamar auth.admin.createUser (criar login sem passar
 * pela tela pública de cadastro). Por isso isso roda como server function, e
 * a role do usuário criado só é aceita se quem chamou já é admin.
 */
export const createColaboradorServerFn = createServerFn({ method: "POST" })
  .validator((data: CreateColaboradorInput) => data)
  .handler(async ({ data }) => {
    const client = adminClient();

    const {
      data: { user: caller },
      error: callerError,
    } = await client.auth.getUser(data.accessToken);
    if (callerError || !caller) {
      throw new Error("Sessão inválida. Faça login novamente.");
    }

    const { data: callerProfile, error: callerProfileError } = await client
      .from("profiles")
      .select("role")
      .eq("id", caller.id)
      .maybeSingle();
    if (callerProfileError || callerProfile?.role !== "admin") {
      throw new Error("Apenas administradores podem criar novos usuários.");
    }

    const { data: created, error: createError } = await client.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: {
        full_name: data.full_name,
        whatsapp: data.whatsapp,
        cpf: data.cpf,
        role: data.role,
      },
    });
    if (createError) {
      throw new Error(createError.message);
    }

    return { id: created.user?.id };
  });
