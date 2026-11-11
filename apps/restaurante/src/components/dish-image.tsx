import Image from "next/image";
import { PlateArt } from "@/components/plate-art";
import { fotos } from "@/data/fotos";
import type { PlateArt as Art } from "@/data/menu";

/*
 * Foto do prato (gerada por IA para esta demo fictícia) ou, se ainda não houver foto, a ilustração.
 * Decorativa: o nome do prato já aparece no card, então o texto alternativo fica vazio.
 */
export function DishImage({ art, sizes, className = "" }: { art: Art; sizes: string; className?: string }) {
  const foto = fotos[art];
  if (!foto) return <PlateArt art={art} className={`h-auto w-full ${className}`} />;
  return (
    <span className={`foto aspect-[4/3] w-full ${className}`}>
      <Image src={`/fotos/${art}.webp`} alt="" width={foto.width} height={foto.height} sizes={sizes} className="foto-img" />
    </span>
  );
}
