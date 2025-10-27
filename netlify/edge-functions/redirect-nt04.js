export default async (request, context) => {
  const url = new URL(request.url);
  if (url.pathname !== "/nga/audio/NT04.mp3") return context.next();

  // 1) 站内明确绕过
  if (url.searchParams.get("bypass") === "1") return context.next();

  // 2) 放行播放器/媒体请求
  const headers = request.headers;
  const accept = (headers.get("accept") || "").toLowerCase();
  const range  = headers.get("range") || "";
  const dest   = (headers.get("sec-fetch-dest") || "").toLowerCase();

  // 分段请求（拖动进度）、媒体目标、明确 audio 接受类型 → 放行
  if (range || dest === "audio" || accept.includes("audio/")) {
    return context.next();
  }

  // 3) 其余一律跳选择页（涵盖大多数扫码/导航）
  const destUrl = new URL("/nga/choose-NT04.html", url);
  const res = Response.redirect(destUrl, 302);
  // 告知缓存系统这些头会影响响应
  res.headers.set("Vary", "Accept, Range, Sec-Fetch-Dest");
  return res;
};
