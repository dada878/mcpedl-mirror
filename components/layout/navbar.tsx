"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getSession } from "@/actions/auth";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { signIn, signOut } from "next-auth/react";
import { ModeToggle } from "../navbar/theme-selector";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session } = useQuery({
    queryFn: () => getSession(),
    queryKey: ["session"],
  });
  const pathname = usePathname();
  const user = session?.user;
  return (
    <nav className="container px-10 border-b sticky top-0 bg-card left-0 right-0 w-full">
      <ul className="flex justify-between items-center">
        <div className="flex p-4 gap-8">
          <li>
            <Link
              className={cn("hover:underline underline-offset-4", {
                underline: pathname === "/",
              })}
              href="/"
            >
              熱門內容
            </Link>
          </li>
          <li>
            <Link
              className={cn("hover:underline underline-offset-4", {
                underline: pathname.startsWith("/addons"),
              })}
              href="/addons"
            >
              模組
            </Link>
          </li>
          <li>
            <Link
              className={cn("hover:underline underline-offset-4", {
                underline: pathname.startsWith("/maps"),
              })}
              href="/maps"
            >
              地圖
            </Link>
          </li>
          <li>
            <Link
              className={cn("hover:underline underline-offset-4", {
                underline: pathname.startsWith("/textures"),
              })}
              href="/textures"
            >
              材質包
            </Link>
          </li>
        </div>
        <div className="flex p-2 gap-5 items-center">
          {user ? (
            <>
              <li className="flex items-center justify-center gap-2">
                <Popover>
                  <PopoverTrigger className="flex gap-2 items-center">
                    <Image
                      src={user.image ?? "/avatar.png"}
                      alt={"user avatar"}
                      className="rounded-full"
                      width={32}
                      height={32}
                    />
                    {user.name}
                  </PopoverTrigger>
                  <PopoverContent className="p-2 w-full flex flex-col gap-1">
                    <Link href="/saved">
                      <Button variant={"ghost"}>我的收藏</Button>
                    </Link>
                    <Button
                      onClick={() => {
                        signOut();
                      }}
                      variant={"ghost"}
                    >
                      登出
                    </Button>
                  </PopoverContent>
                </Popover>
              </li>
            </>
          ) : (
            <li>
              <Link
                href={"#"}
                onClick={() => {
                  signIn();
                }}
              >
                登入
              </Link>
            </li>
          )}
          <li>
            <ModeToggle />
          </li>
        </div>
      </ul>
    </nav>
  );
}
