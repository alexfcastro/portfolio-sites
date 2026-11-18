"use client";

import { MessagePreview } from "@/components/message-preview";
import { serena, valeConfig } from "@/data/serena";
import { demoStore } from "@/lib/demo-store";
import { MontadorVale } from "@/vale-presente/montador-vale";
import { mensagemPedido, totalVale } from "@/vale-presente/vale";

/**
 * Liga o módulo reaproveitável de vale-presente ao site da Casa Serena: guarda o vale emitido neste navegador
 * e mostra a prévia da mensagem de WhatsApp. O módulo em si não sabe nada do site.
 */
export function ValeDaCasa() {
  return (
    <div className="vale-tema">
      <MontadorVale
        config={valeConfig}
        onFinalizar={(vale, codigo, validoAte) => {
          const atual = demoStore.get();
          demoStore.set({ ...atual, vales: [...atual.vales, { codigo, para: vale.para.trim(), total: totalVale(vale, valeConfig), validoAte }].slice(-5) });
        }}
        acaoFinal={(vale) => (
          <MessagePreview businessName={serena.nome} message={mensagemPedido(vale, valeConfig)} triggerLabel="Enviar pedido pelo WhatsApp" triggerClassName="btn btn-primary" />
        )}
      />
    </div>
  );
}
