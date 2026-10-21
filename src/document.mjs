import { site, publishedSEO } from './site.mjs';

export function document(file, markup) {
  const seo = publishedSEO[file];
  const canonical = `${site.url}${seo.canonicalPath}`;
  return `<!DOCTYPE html>
<html lang="es-CR" id="top">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${seo.title}</title>
  <meta name="description" content="${seo.description}">
  <meta name="robots" content="${seo.robots}">
  <meta name="author" content="${site.name}">
${seo.keywords ? `  <meta name="keywords" content="${seo.keywords}">` : ''}
  <meta name="theme-color" content="#202a30">
  <link rel="canonical" href="${canonical}">
  <link rel="icon" type="image/svg+xml" href="assets/charlie-mark.svg">
  <link rel="apple-touch-icon" href="images/logoPrincipal.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css">
  <noscript><style>@media(max-width:960px){.site-header{position:relative;background:#202a30}.page-hero{padding-top:50px}.hero-content{padding-top:60px}}</style></noscript>
  <meta property="og:type" content="website">
  <meta property="og:locale" content="es_CR">
  <meta property="og:site_name" content="${site.name}">
  <meta property="og:title" content="${seo.title}">
  <meta property="og:description" content="${seo.description}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${site.url}/images/courier-hero.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'LocalBusiness', name: site.name, url: site.url, telephone: site.phoneHref, email: site.email, logo: `${site.url}/images/logoPrincipal.png`, areaServed: 'Costa Rica', description: 'Mensajería empresarial, documentación y trámites corporativos en Costa Rica.' })}</script>
  <script type="module" src="script.js"></script>
</head>
<body><div id="root" data-page="${file}">${markup}</div></body>
</html>`;
}
