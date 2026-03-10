import type { Metadata } from "next";
import DonasiClient from "./DonasiClient";

export const metadata: Metadata = {
  title: "Donasi – Wikimedia Indonesia",
  description:
    "Dukung Wikimedia Indonesia dalam menyebarluaskan pengetahuan terbuka untuk seluruh masyarakat Indonesia. Setiap donasi Anda sangat berarti.",
};

export default function Page() {
  return <DonasiClient />;
}