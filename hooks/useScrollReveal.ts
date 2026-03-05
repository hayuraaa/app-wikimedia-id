// hooks/useScrollReveal.ts
// Tambahkan hook ini ke project Next.js kamu.
// Panggil di layout atau page-level component.

import { useEffect } from "react";

/**
 * useScrollReveal
 * 
 * Secara otomatis menambahkan class "visible" ke semua elemen
 * yang memiliki class "reveal" atau "reveal-stagger" saat mereka
 * masuk ke viewport.
 * 
 * Cara pakai:
 *   1. Import dan panggil hook ini di komponen page (e.g., page.tsx)
 *   2. Tambahkan class "reveal" ke elemen yang ingin di-animate
 *   3. Tambahkan class "reveal-stagger" ke container grid/flex
 *      agar anak-anaknya muncul berurutan
 */
export function useScrollReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll(".reveal, .reveal-stagger");

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            // Unobserve setelah terlihat — animasi cukup sekali
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,      // Mulai saat 12% elemen terlihat
        rootMargin: "0px 0px -40px 0px", // Sedikit sebelum batas bawah
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}