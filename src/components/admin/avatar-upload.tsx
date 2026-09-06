import { useRef, useState } from "react";
import { toast } from "sonner";
import { Camera, Loader2, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabase";
import { getAvatarSignedUrl, uploadAvatar } from "@/lib/storage";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

const MAX_SIZE_MB = 5;

export function AvatarUpload({
  size = "lg",
  className,
}: {
  size?: "sm" | "lg";
  className?: string;
}) {
  const { profile, user, refreshProfile } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const signedUrlRef = useRef<{ path: string | null; url: string | null }>({
    path: null,
    url: null,
  });
  if (signedUrlRef.current.path !== (profile?.avatar_path ?? null)) {
    signedUrlRef.current = { path: profile?.avatar_path ?? null, url: null };
    if (profile?.avatar_path) {
      getAvatarSignedUrl(profile.avatar_path)
        .then((url) => {
          signedUrlRef.current = { path: profile.avatar_path, url };
          setPreview((p) => p ?? url ?? null);
        })
        .catch(() => {});
    }
  }

  async function handleFile(file: File | undefined) {
    if (!file || !user) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Envie um arquivo de imagem (JPG ou PNG).");
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`A imagem deve ter até ${MAX_SIZE_MB}MB.`);
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);
    setUploading(true);

    try {
      const path = await uploadAvatar(user.id, file);
      const { error } = await supabase
        .from("profiles")
        .update({ avatar_path: path })
        .eq("id", user.id);
      if (error) throw error;
      await refreshProfile();
      toast.success("Foto de perfil atualizada");
    } catch (err) {
      toast.error("Não foi possível enviar a foto", {
        description: err instanceof Error ? err.message : undefined,
      });
      setPreview(null);
    } finally {
      setUploading(false);
    }
  }

  const dimension = size === "lg" ? "size-20" : "size-9";
  const iconDimension = size === "lg" ? "size-4" : "size-3";

  return (
    <div className={cn("relative inline-flex", className)}>
      <Avatar className={dimension}>
        <AvatarImage src={preview ?? signedUrlRef.current.url ?? undefined} className="object-cover" />
        <AvatarFallback>
          <User className={size === "lg" ? "size-8 text-muted-foreground" : "size-4 text-muted-foreground"} />
        </AvatarFallback>
      </Avatar>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        aria-label="Alterar foto de perfil"
        className={cn(
          "absolute -bottom-1 -right-1 flex items-center justify-center rounded-full border-2 border-background bg-brand-gold text-brand-navy shadow-sm transition-transform active:scale-95 disabled:opacity-70",
          size === "lg" ? "size-7" : "size-5",
        )}
      >
        {uploading ? (
          <Loader2 className={cn(iconDimension, "animate-spin")} />
        ) : (
          <Camera className={iconDimension} />
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
