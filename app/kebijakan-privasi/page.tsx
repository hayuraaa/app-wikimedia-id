import type { Metadata } from "next";
import KebijakanPrivasiClient from "./KebijakanPrivasiClient";

export const metadata: Metadata = {
  title: "Kebijakan Privasi – Wikimedia Indonesia",
  description:
    "Kebijakan privasi Wikimedia Indonesia menjelaskan pengumpulan, penggunaan, dan perlindungan informasi pribadi pengguna situs kami.",
};

export default function Page() {
  return <KebijakanPrivasiClient />;
}