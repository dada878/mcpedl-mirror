import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="container border-b sticky top-0 bg-card">
      <ul className="flex p-4 gap-5">
        <li>
          <Link href="/addons">Addons</Link>
        </li>
        <li>
          <Link href="/maps">Maps</Link>
        </li>
        <li>
          <Link href="/textures">Textures</Link>
        </li>
      </ul>
    </nav>
  );
}
