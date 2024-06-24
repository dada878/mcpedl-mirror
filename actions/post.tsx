"use server";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { getServerSession } from "next-auth";

const POSTS_PER_PAGE = 20;

export async function getTopPopularPosts(limit: number = POSTS_PER_PAGE) {
  const snapshot = await db
    .collection("posts")
    .orderBy("popularity", "desc")
    .limit(limit)
    .get();
  const posts = snapshot.docs.map((doc) => {
    const data = doc.data();
    if (data) {
      return {
        id: doc.id,
        title: data.title,
        description: data.description,
        date: data.date.toDate(),
        image: data.image,
        link: data.link,
        index: data.index,
      };
    }
  });
  return posts;
}

export async function getSavedPosts(): Promise<Post[]> {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("請先登入");
  }

  const rawData =
    (await db.collection("saved").doc(session.user.id).get()).data()?.posts ??
    [];

  const savedPosts = await Promise.all(
    rawData.map(async (postReference: any) => {
      return new Promise(async (resolve) => {
        const postDocument = await postReference.get();
        const post = postDocument.data();
        if (post) {
          resolve({
            id: post.id,
            title: post.title,
            description: post.description,
            date: post.date.toDate(),
            image: post.image,
            link: post.link,
            index: post.index,
          });
        } else {
          resolve(null);
        }
      });
    })
  );

  return savedPosts.filter((post: Post | null) => post !== null);
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

  const savedPosts =
    (await db.collection("saved").doc(session.user.id).get()).data()?.posts ??
    [];

  if (!savedPosts.filter((post: Post) => post.id === postId).length) {
    return;
  }

  await db
    .collection("saved")
    .doc(session.user.id)
    .set({
      posts: savedPosts.filter((post: Post) => post.id !== postId),
    });

  await db
    .collection("posts")
    .doc(postId)
    .update({
      popularity: FieldValue.increment(-1),
    });
}

export async function savePost(postId: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("請先登入");
  }

  const savedPosts =
    (await db.collection("saved").doc(session.user.id).get()).data()?.posts ??
    [];

  if (savedPosts.filter((post: Post) => post.id === postId).length) {
    return;
  }

  await db
    .collection("saved")
    .doc(session.user.id)
    .set({
      posts: [...savedPosts, 
        db.collection("posts").doc(postId)
      ],
    });

  await db
    .collection("posts")
    .doc(postId)
    .update({
      popularity: FieldValue.increment(1),
    });
}

export async function isSaved(postId: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return false;
  }

  const savedPosts =
    (await db.collection("saved").doc(session.user.id).get()).data()?.posts ??
    [];

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
  const postsPerPage = POSTS_PER_PAGE;
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
