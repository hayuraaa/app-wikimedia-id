import type { Metadata } from "next";
import KontakClient from "./KontakClient";

export const metadata: Metadata = {
  title: "Kontak | Wikimedia Indonesia",
  description: "Hubungi Wikimedia Indonesia — ada pertanyaan, saran, atau ingin berkolaborasi? Kami siap mendengar Anda.",
};

export default function KontakPage() {
  return <KontakClient />;
}
