// 缓存名字
const CACHE_NAME = "met-audio-cache-v1";

// 安装时（可以什么都不做，因为你已有 cacheAllAudio 逻辑）
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

// 激活时清理旧缓存
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }))
    )
  );
});

// 请求拦截
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // 只处理音频目录
  if (url.pathname.startsWith("/audio/")) {
    event.respondWith(
      caches.match(event.request).then((resp) => {
        return resp || fetch(event.request);
      })
    );
  }
});
