"use server";

import { db } from "@/lib/firebase-admin";

export async function getPosts(page: number = 1): Promise<Post[]> {
  const lastQuerySnapshot = await db
    .collection("posts")
    .orderBy("index", "desc")
    .limit(1)
    .get();
  const lastIndex =
    lastQuerySnapshot.docs.length > 0
      ? lastQuerySnapshot.docs[0].data().index
      : 0;
  const postsPerPage = 10;
  const startIndex = lastIndex - (page - 1) * postsPerPage;
  const endIndex = lastIndex - page * postsPerPage;
  const snapshot = await db
    .collection("posts")
    .orderBy("index", "desc")
    .startAt(startIndex)
    .endBefore(endIndex)
    .get();
  const posts: Post[] = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title,
      description: data.description,
      date: data.date.toDate(),
      image: data.image,
      link: data.link,
      index: data.index,
    };
  });
  return posts;
}
