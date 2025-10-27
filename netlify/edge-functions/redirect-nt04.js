export default async (request, context) => {
  const url = new URL(request.url);

  // 只要命中 NT04 且未显式绕过，就重定向到选择页
  if (url.pathname === "/nga/audio/NT04.mp3" && url.searchParams.get("bypass") !== "1") {
    return Response.redirect(new URL("/nga/choose-NT04.html", url), 302);
  }

  // 其他请求照常继续
  return context.next();
};
