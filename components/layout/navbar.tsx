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
import { ModeToggle } from "../navbar/theme-selector";

export default function Navbar() {
  const { data: session } = useQuery({
    queryFn: () => getSession(),
    queryKey: ["session"],
  });
  const user = session?.user;
  return (
    <nav className="container border-b sticky top-0 bg-card">
      <ul className="flex justify-between items-center">
        <div className="flex p-4 gap-5">
          <li>
            <Link className="hover:underline underline-offset-2" href="/addons">
              Addons
            </Link>
          </li>
          <li>
            <Link className="hover:underline underline-offset-2" href="/maps">
              Maps
            </Link>
          </li>
          <li>
            <Link
              className="hover:underline underline-offset-2"
              href="/textures"
            >
              Textures
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
                    <Button variant={"ghost"}>登出</Button>
                  </PopoverContent>
                </Popover>
              </li>
            </>
          ) : (
            <li>
              <Link href="/login">登入</Link>
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
