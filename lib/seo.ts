const BASE_URL = "https://mcpedl.dada878.com";

const siteName = "MCPEDL Mirror";
const description = "跟 MCPEDL 沒差多少，不過沒廣告而且有無限滾動和收藏內容的功能。熱門內容是統計本網站資料來排名的，幫忙收臧就可以為你認為優質的內容增加一點的熱門度分數。";

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
