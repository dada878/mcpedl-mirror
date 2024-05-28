import jsdom from "jsdom";

const url = "https://mcpedl.com/category/mods/";

export async function GET() {
  const result = await (await fetch(url)).text();
  const dom = new jsdom.JSDOM(result);
  const elements = dom.window.document.querySelectorAll("div.fancybox.post");

  const posts = [];

  for (const element of Array.from(elements)) {
    const titleElement = element.querySelector(".fancybox__content__title > a");
    const title = titleElement ? titleElement.textContent : "No title";
    const link = titleElement?.getAttribute("href")
      ? titleElement.getAttribute("href")
      : "No link";
    const id = link?.replaceAll("/", "");
    const imageElement = element.querySelector(
      ".post__img__static.cursor-pointer img"
    );
    const image = imageElement?.getAttribute("src")
      ? imageElement.getAttribute("src")
      : "/no-image.png";
    const publishDateElement = element.querySelector(
      ".fancybox__header__content small"
    );
    const publishDate = publishDateElement
      ? publishDateElement.textContent?.replaceAll("Published on ", "").trim()
      : "No publish date";

    if (
      publishDate === "No publish date" ||
      link === "No link" ||
      id === "No link" ||
      title === "No title"
    ) {
      continue;
    }

    posts.push({
      title,
      id,
      link: `https://mcpedl.com/${link}`,
      image,
      date: publishDate,
    });
  }

  const time = await getTime();
  return Response.json(posts);
}

async function getTime() {
  const result = await fetch(
    "http://worldtimeapi.org/api/timezone/America/Chicago",
    {
      cache: "no-store",
    }
  );
  const data = await result.json();
  return data.datetime;
}
