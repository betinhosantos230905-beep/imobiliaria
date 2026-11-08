import { useState } from "react";
import { toast } from "sonner";
import { ImagePlus, X, Star } from "lucide-react";
import {
  getCloudinaryUploadSignature,
  saveAdminPropertyFn,
} from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { TYPES, type Property } from "@/lib/properties";

type Draft = Omit<
  Property,
  | "id"
  | "created_at"
  | "updated_at"
  | "description"
  | "price"
  | "city"
  | "neighborhood"
  | "bedrooms"
  | "bathrooms"
  | "parking"
  | "area"
  | "images"
> & {
  id?: string;
  description: string;
  price: number;
  city: string;
  neighborhood: string;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  area: number;
  images: string[];
};

const empty: Draft = {
  title: "",
  description: "",
  purpose: "venda",
  type: "casa",
  price: 0,
  city: "",
  neighborhood: "",
  bedrooms: 0,
  bathrooms: 0,
  parking: 0,
  area: 0,
  images: [],
  featured: false,
  published: true,
};

export function PropertyForm({
  initial,
  onDone,
}: {
  initial?: Property | undefined;
  onDone: () => void;
}) {
  const [d, setD] = useState<Draft>(() =>
    initial
      ? {
          ...initial,
          description: initial.description ?? "",
          price: initial.price ?? 0,
          city: initial.city ?? "",
          neighborhood: initial.neighborhood ?? "",
          bedrooms: initial.bedrooms ?? 0,
          bathrooms: initial.bathrooms ?? 0,
          parking: initial.parking ?? 0,
          area: initial.area ?? 0,
          images: initial.images ?? [],
        }
      : empty
  );

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) =>
    setD((s) => ({ ...s, [k]: v }));

  async function upload(files: File[] | FileList | null) {
    if (!files?.length) return;

    setUploading(true);

    try {
      const signature = await getCloudinaryUploadSignature();
      const urls: string[] = [];

      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} não é uma imagem válida.`);
          continue;
        }

        if (file.size > 10 * 1024 * 1024) {
          toast.error(`${file.name} ultrapassa o limite de 10 MB.`);
          continue;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", signature.apiKey);
        formData.append("timestamp", String(signature.timestamp));
        formData.append("folder", signature.folder);
        formData.append("signature", signature.signature);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        const result = (await response.json()) as {
          secure_url?: string;
          error?: { message?: string };
        };

        if (!response.ok || !result.secure_url) {
          toast.error(
            `Falha ao enviar ${file.name}: ${result.error?.message ?? "erro no upload"}`
          );
          continue;
        }

        urls.push(result.secure_url);
      }

      if (urls.length) {
        setD((s) => ({ ...s, images: [...s.images, ...urls] }));
        toast.success(
          urls.length === 1
            ? "Foto enviada!"
            : `${urls.length} fotos enviadas!`
        );
      }
    } catch (error) {
      console.error("Erro no upload:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Não foi possível enviar as fotos."
      );
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    if (!d.title.trim()) {
      toast.error("Informe o título");
      return;
    }

    setSaving(true);

    try {
      await saveAdminPropertyFn({ data: d });
      toast.success("Anúncio salvo!");
      onDone();
    } catch (error) {
      console.error("Erro ao salvar anúncio:", error);
      toast.error(
        error instanceof Error
          ? `Erro ao salvar: ${error.message}`
          : "Erro ao salvar anúncio."
      );
    } finally {
      setSaving(false);
    }
  }

  const num = (k: keyof Draft) => (
    <Input
      type="number"
      min={0}
      value={Number(d[k])}
      onChange={(e) => set(k, Number(e.target.value) as never)}
    />
  );

  return (
    <div className="space-y-5">
      <div>
        <Label>Título</Label>
        <Input
          value={d.title}
          onChange={(e) => set("title", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Finalidade</Label>
          <select
            value={d.purpose}
            onChange={(e) => set("purpose", e.target.value)}
            className="h-9 w-full rounded-md border bg-background px-2 text-sm"
          >
            <option value="venda">Venda</option>
            <option value="aluguel">Aluguel</option>
          </select>
        </div>

        <div>
          <Label>Tipo</Label>
          <select
            value={d.type}
            onChange={(e) => set("type", e.target.value)}
            className="h-9 w-full rounded-md border bg-background px-2 text-sm capitalize"
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div><Label>Preço (R$)</Label>{num("price")}</div>
        <div><Label>Área (m²)</Label>{num("area")}</div>

        <div>
          <Label>Cidade</Label>
          <Input
            value={d.city}
            onChange={(e) => set("city", e.target.value)}
          />
        </div>

        <div>
          <Label>Bairro</Label>
          <Input
            value={d.neighborhood}
            onChange={(e) => set("neighborhood", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div><Label>Quartos</Label>{num("bedrooms")}</div>
        <div><Label>Banheiros</Label>{num("bathrooms")}</div>
        <div><Label>Vagas</Label>{num("parking")}</div>
      </div>

      <div>
        <Label>Descrição</Label>
        <Textarea
          rows={5}
          value={d.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </div>

      <div>
        <Label>
          Fotos{" "}
          {d.images.length > 0 && (
            <span className="text-muted-foreground">
              (a primeira é a capa)
            </span>
          )}
        </Label>

        <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {d.images.map((src, i) => (
            <div
              key={src}
              className="group relative aspect-square overflow-hidden rounded-lg bg-muted"
            >
              <img src={src} alt="" className="h-full w-full object-cover" />

              <div className="absolute inset-x-0 top-0 flex justify-between p-1">
                <button
                  type="button"
                  title="Definir como capa"
                  className="rounded bg-background/90 p-1"
                  onClick={() =>
                    set("images", [
                      src,
                      ...d.images.filter((x) => x !== src),
                    ])
                  }
                >
                  <Star
                    className={`size-3 ${i === 0 ? "fill-gold text-gold" : ""}`}
                  />
                </button>

                <button
                  type="button"
                  title="Remover"
                  className="rounded bg-background/90 p-1"
                  onClick={() =>
                    set("images", d.images.filter((x) => x !== src))
                  }
                >
                  <X className="size-3" />
                </button>
              </div>
            </div>
          ))}

          <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed text-xs text-muted-foreground hover:border-gold">
            <ImagePlus className="size-5" />
            {uploading ? "Enviando…" : "Adicionar"}
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                    const files = Array.from(e.target.files ?? []);
                    e.target.value = "";
                    void upload(files);
                  }}
            />
          </label>
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm">
          <Switch
            checked={d.published}
            onCheckedChange={(v) => set("published", v)}
          />
          Publicado
        </label>

        <label className="flex items-center gap-2 text-sm">
          <Switch
            checked={d.featured}
            onCheckedChange={(v) => set("featured", v)}
          />
          Destaque na página inicial
        </label>
      </div>

      <Button
        onClick={save}
        disabled={saving || uploading}
        className="w-full"
      >
        {saving ? "Salvando…" : "Salvar anúncio"}
      </Button>
    </div>
  );
}

