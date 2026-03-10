import type { Metadata } from "next";
import MenjadiAnggotaClient from "./MenjadiAnggotaClient";

export const metadata: Metadata = {
  title: "Menjadi Anggota – Wikimedia Indonesia",
  description:
    "Bergabunglah dengan Wikimedia Indonesia. Informasi lengkap tentang syarat, biaya, dan cara pendaftaran keanggotaan Wikimedia Indonesia.",
};

export default function Page() {
  return <MenjadiAnggotaClient />;
}