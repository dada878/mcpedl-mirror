const BASE_URL = "https://mcpedl.dada878.com";

const siteName = "MCPEDL Mirror";
const description = "MCPEDL Mirror is a mirror site for MCPEDL.com, a website that provides a lot of mods, maps, and resource packs for Minecraft Bedrock Edition. MCPEDL Mirror is a project that aims to provide a more stable and more feature-rich experience for users in regions where MCPEDL.com is blocked or slow.";

const SEO = {
  title: siteName,
  description: description,
  canonical: BASE_URL,
  openGraph: {
    title: siteName,
    description: description,
    url: BASE_URL,
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
      },
    ],
    siteName: siteName,
    type: "website",
  },
};

const noIndexSEO = {
  robots: {
    index: false,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

function defaultSEO({
  title,
  description,
  url,
  noindex,
}: {
  title?: string;
  description?: string;
  url?: string;
  customMeta?: { [key: string]: string };
  noindex?: boolean;
} = {}) {
  const titleMeta = title ? `${title} | ${siteName}` : siteName;
  const urlMeta = url ? `${BASE_URL}${url}` : SEO.canonical;

  let seoConfig = {
    ...SEO,
    title: titleMeta,
    canonical: urlMeta,
    description: description ?? SEO.description,
    openGraph: {
      ...SEO.openGraph,
      title: titleMeta,
      url: urlMeta,
      description: description ?? SEO.description,
    },
  };

  if (noindex) {
    seoConfig = {
      ...seoConfig,
      ...noIndexSEO,
    };
  }

  return seoConfig;
}

export { defaultSEO };
