// netlify/edge-functions/redirect-nt04.js
export default async (request, context) => {
  const url = new URL(request.url);
  if (url.pathname !== "/nga/audio/NT04.mp3") return context.next();

  // 站内绕过：?bypass=1
  if (url.searchParams.get("bypass") === "1") return context.next();

  const h = request.headers;
  const accept = (h.get("accept") || "").toLowerCase();
  const range  = h.get("range") || "";
  const dest   = (h.get("sec-fetch-dest") || "").toLowerCase();

  // 放行真正的媒体请求（播放器/缓存/拖动）
  if (range || dest === "audio" || accept.includes("audio/")) {
    const upstream = await context.next();
    // ⚠️ 克隆响应，再改 header，避免 immutable header 崩溃
    const res = new Response(upstream.body, upstream);
    res.headers.set("X-Edge-Bypass", "media");
    return res;
  }

  // 其余（扫码/地址栏导航等）→ 选择页
  const to = new URL("/nga/choose-NT04.html", url);
  const res = Response.redirect(to.href, 302);
  res.headers.set("Vary", "Accept, Range, Sec-Fetch-Dest");
  return res;
};
