import type { Metadata } from "next";
import TentangClient from "./TentangClient";

export const metadata: Metadata = {
  title: "Tentang Kami – Wikimedia Indonesia",
  description:
    "Wikimedia Indonesia adalah organisasi nirlaba mitra lokal Wikimedia Foundation yang berdedikasi menyebarluaskan pengetahuan bebas di Indonesia sejak 2008.",
};

export default function Page() {
  return <TentangClient />;
}