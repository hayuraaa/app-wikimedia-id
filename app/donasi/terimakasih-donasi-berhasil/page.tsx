import type { Metadata } from "next";
import DonasiBerhasilClient from "./DonasiBerhasilClient";

export const metadata: Metadata = {
  title: "Terima Kasih – Donasi Berhasil | Wikimedia Indonesia",
  description:
    "Terima kasih atas donasi Anda. Dukungan Anda membantu Wikimedia Indonesia menyebarluaskan pengetahuan terbuka untuk seluruh masyarakat Indonesia.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <DonasiBerhasilClient />;
}
