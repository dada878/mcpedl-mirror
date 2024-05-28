"use server";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/firebase-admin";
import { getServerSession } from "next-auth";

export async function removeSavedPost(postId: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return;
  }
  const snapshot = await db
    .collection("saved")
    .where("postId", "==", postId)
    .where("userId", "==", session.user.id)
    .get();
  snapshot.docs.forEach((doc) => {
    doc.ref.delete();
  });
}

export async function savePost(postId: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return;
  }
  await db.collection("saved").add({
    postId,
    userId: session.user.id,
  });
}

export async function isSaved(postId: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return false;
  }
  const snapshot = await db
    .collection("saved")
    .where("postId", "==", postId)
    .where("userId", "==", session.user.id)
    .get();
  return snapshot.docs.length > 0;
}

export async function getPosts(
  page: number = 1,
  type: string
): Promise<Post[]> {
  const lastQuerySnapshot = await db
    .collection("posts")
    .where("type", "==", type)
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
    .where("type", "==", type)
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
