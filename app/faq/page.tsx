import type { Metadata } from "next";
import FaqClient from "./FaqClient";

export const metadata: Metadata = {
  title: "FAQ – Wikimedia Indonesia",
  description:
    "Temukan jawaban atas pertanyaan yang sering ditanyakan seputar Wikimedia Indonesia, keanggotaan, dan program-program kami.",
};

export default function Page() {
  return <FaqClient />;
}