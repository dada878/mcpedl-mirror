"use server";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { getServerSession } from "next-auth";

export async function getTopPopularPosts(limit: number = 10) {
  const snapshot = await db
    .collection("posts")
    .orderBy("popularity", "desc")
    .limit(limit)
    .get();
  const posts = snapshot.docs.map((doc) => {
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

export async function getSavedPosts() : Promise<Post[]> {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("請先登入");
  }

  const rawData = (await db.collection("saved").doc(session.user.id).get()).data()?.posts ?? [];

  const savedPosts = rawData.map((post: any) => {
    return {
      id: post.id,
      title: post.title,
      description: post.description,
      date: post.date.toDate(),
      image: post.image,
      link: post.link,
      index: post.index,
    };
  });

  return savedPosts;
}

async function getPost(postId: string) {
  const doc = await db.collection("posts").where("id", "==", postId).get();
  if (doc.empty) {
    return null;
  }
  return doc.docs[0].data();
}

export async function removeSavedPost(postId: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("請先登入");
  }
  
  const savedPosts = (await db.collection("saved").doc(session.user.id).get()).data()?.posts ?? [];

  if (!savedPosts.filter((post: Post) => post.id === postId).length) {
    return;
  }

  await db.collection("saved").doc(session.user.id).set({
    posts: savedPosts.filter((post: Post) => post.id !== postId),
  });

  await db.collection("posts").doc(postId).update({
    popularity: FieldValue.increment(-1),
  });
}

export async function savePost(postId: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("請先登入");
  }

  const savedPosts = (await db.collection("saved").doc(session.user.id).get()).data()?.posts ?? [];

  if (savedPosts.filter((post: Post) => post.id === postId).length) {
    return;
  }

  await db.collection("saved").doc(session.user.id).set({
    posts: [...savedPosts, await getPost(postId)],
  });

  await db.collection("posts").doc(postId).update({
    popularity: FieldValue.increment(1),
  });
}

export async function isSaved(postId: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return false;
  }

  const savedPosts = (await db.collection("saved").doc(session.user.id).get()).data()?.posts ?? [];

  return savedPosts.filter((post: Post) => post.id === postId).length > 0;
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
