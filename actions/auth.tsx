"use server";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function getSession() {
    const session = await getServerSession(authOptions);
    return session;
}