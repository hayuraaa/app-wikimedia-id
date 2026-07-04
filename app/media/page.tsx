import type { Metadata } from "next";
import MediaClient from "./MediaClient";

export const metadata: Metadata = {
  title: "Media – Wikimedia Indonesia",
  description:
    "Kumpulan modul, materi pelatihan, dan video dari Wikimedia Indonesia seputar pendidikan, kebudayaan, komunitas, data, sains dan teknologi.",
};

export default function Page() {
  return <MediaClient />;
}