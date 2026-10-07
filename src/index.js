// GDTECH · Worker de la página web
// - Sirve los archivos de la carpeta "public" (la web).
// - Atiende /api/visitas: el contador de visitas que se ve en el pie de página.
import { DurableObject } from "cloudflare:workers";

// "Caja" donde Cloudflare guarda el número de visitas (gratis, sin base de datos aparte).
export class Contador extends DurableObject {
  async fetch(request) {
    let visitas = (await this.ctx.storage.get("visitas")) || 0;
    if (request.method === "POST") {
      visitas += 1;
      await this.ctx.storage.put("visitas", visitas);
    }
    return Response.json({ visitas }, { headers: { "Cache-Control": "no-store" } });
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/visitas") {
      if (request.method !== "GET" && request.method !== "POST") {
        return new Response("Método no permitido", { status: 405 });
      }
      const caja = env.CONTADOR.get(env.CONTADOR.idFromName("gdtechsoporte"));
      return caja.fetch(request);
    }
    // Todo lo demás: la web normal.
    return env.ASSETS.fetch(request);
  },
};
