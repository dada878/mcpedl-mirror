import { db } from "@/lib/firebase-admin";
import jsdom from "jsdom";

const url = "https://mcpedl.com/category/mods/";

export async function GET() {
  const result = await (await fetch(url)).text();
  const dom = new jsdom.JSDOM(result);
  const elements = dom.window.document.querySelectorAll("div.fancybox.post");

  const lastQuerySnapshot = await db.collection("posts").orderBy("index", "desc").limit(1).get();
  let lastIndex = lastQuerySnapshot.docs.length > 0 ? lastQuerySnapshot.docs[0].data().index : 0;

  const posts = [];

  for (const element of Array.from(elements)) {
    const titleElement = element.querySelector(".fancybox__content__title > a");
    const title = titleElement ? titleElement.textContent : "No title";
    const link = titleElement?.getAttribute("href")
      ? titleElement.getAttribute("href")
      : "No link";
    const id = link ? link.replaceAll("/", "") : "No link";
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

    const descriptionElement = element.querySelector(
      ".fancybox__content__description.cursor-pointer"
    );
    const description = descriptionElement?.textContent
      ? descriptionElement.textContent.trim()
      : "No description";

    if (
      publishDate === "No publish date" ||
      link === "No link" ||
      id === "No link" ||
      title === "No title" ||
      image === "/no-image.png" ||
      description === "No description" ||
      !publishDate ||
      !link ||
      !id ||
      !title ||
      !image ||
      !description
    ) {
      continue;
    }

    posts.push({
      title,
      id,
      link: `https://mcpedl.com${link}`,
      image,
      date: new Date(publishDate),
      description,
      index: ++lastIndex,
    });

    for (const post of posts) {
      const existingPost = await db.collection("posts").doc(post.id).get();
      if (!existingPost.exists) {
        db.collection("posts").doc(post.id).set(post, { merge: true });
      }
    }
  }

  const time = await getTime();
  return Response.json({
    datetime: time,
  });
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
