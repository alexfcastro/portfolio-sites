import Image from "next/image";
import { fotos } from "@/data/fotos";

/*
 * Foto gerada por IA para esta demo fictícia (ver docs/assets.md), servida pelo otimizador de imagens do Next.
 * Os componentes de ilustração usam esta foto quando ela existe e, se não existir, desenham a ilustração.
 */
export function temFoto(id: string): boolean {
  return id in fotos;
}

export function Foto({
  id,
  sizes,
  className = "",
  alt = "",
  preload = false,
}: {
  id: string;
  sizes: string;
  className?: string;
  alt?: string;
  preload?: boolean;
}) {
  const foto = fotos[id];
  if (!foto) return null;
  return (
    <Image
      src={`/fotos/${id}.webp`}
      alt={alt}
      width={foto.width}
      height={foto.height}
      sizes={sizes}
      preload={preload}
      className={`object-cover ${className}`}
    />
  );
}
