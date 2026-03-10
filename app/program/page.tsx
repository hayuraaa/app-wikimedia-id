import type { Metadata } from "next";
import ProgramClient from "./ProgramClient";

export const metadata: Metadata = {
  title: "Program – Wikimedia Indonesia",
  description:
    "Mengenal program-program Wikimedia Indonesia: Pendidikan, Data dan Teknologi, Kebudayaan, dan Komunitas untuk menyebarluaskan pengetahuan bebas di Indonesia.",
};

export default function Page() {
  return <ProgramClient />;
}