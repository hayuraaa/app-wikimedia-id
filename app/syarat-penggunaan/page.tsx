import type { Metadata } from "next";
import SyaratPenggunaanClient from "./SyaratPenggunaanClient";

export const metadata: Metadata = {
  title: "Syarat Penggunaan – Wikimedia Indonesia",
  description:
    "Syarat dan ketentuan penggunaan situs web Wikimedia Indonesia. Harap baca dengan seksama sebelum menggunakan layanan kami.",
};

export default function Page() {
  return <SyaratPenggunaanClient />;
}