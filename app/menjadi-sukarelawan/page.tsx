import type { Metadata } from "next";
import MenjadiSukarelawanClient from "./MenjadiSukarelawanClient";

export const metadata: Metadata = {
  title: "Menjadi Sukarelawan Wikimedia – Wikimedia Indonesia",
  description:
    "Bergabunglah sebagai sukarelawan Wikimedia dan ikut berkontribusi dalam gerakan membebaskan pengetahuan untuk semua orang. Temukan proyek Wikimedia yang paling sesuai dengan minat Anda.",
};

export default function Page() {
  return <MenjadiSukarelawanClient />;
}
