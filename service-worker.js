/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("/buymaskmap/js/workbox-v4.3.1/workbox-sw.js");
workbox.setConfig({modulePathPrefix: "/buymaskmap/js/workbox-v4.3.1"});

importScripts(
  "/buymaskmap/js/precache-manifest.2b5341e1421fc83d527de49bff8cbc5c.js"
);

workbox.core.setCacheNameDetails({prefix: "maskmap"});

workbox.core.skipWaiting();

workbox.core.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerNavigationRoute(workbox.precaching.getCacheKeyForURL("/"), {
  
  blacklist: [/\/api\//],
});
