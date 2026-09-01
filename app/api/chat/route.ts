import OpenAI from "openai";
import type {
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from "openai/resources/chat/completions";
import { GoogleGenAI, Type, type FunctionCall } from "@google/genai";
import { SYSTEM_PROMPT } from "@/lib/chatbot/system-prompt";

type ToolCall = {
  id: string;
  type: "function";
  function: { name: string; arguments: string };
};

// ── Ganti baris ini untuk beralih provider ──────────────────────────────────
const PROVIDER = "gemini" as "groq" | "gemini";
// ────────────────────────────────────────────────────────────────────────────

const GROQ_MODELS = [
  process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
  "openai/gpt-oss-120b",
  "qwen/qwen3.6-27b",
  "openai/gpt-oss-20b",
  "llama-3.1-8b-instant",
];

// Model Gemini free tier — native SDK, urut dari yang paling kapabel
const GEMINI_MODELS = [
  "gemini-3.5-flash-lite",  // 500 RPD — primary
  "gemini-3.1-flash-lite",  // 500 RPD — fallback
  "gemini-3-flash",         // 20 RPD  — last resort
];

const MODELS = PROVIDER === "gemini" ? GEMINI_MODELS : GROQ_MODELS;

const WIKI_API = "https://id.wikimedia.org/w/api.php";
const MAX_MESSAGES = 30;
const MAX_MESSAGE_LENGTH = 2000;
const MAX_TOOL_ROUNDS = 3;

const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) return true;
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(k);
    }
  }
  return false;
}

// ─── Tool definitions ─────────────────────────────────────────────────────────

const PANDUAN_WIKI = [
  "Kopdar",
  "Kopdar/Persiapan_dan_Pelaksanaan",
  "Kopdar/Pelaporan",
  "WikiLatih",
  "WikiLatih/Persiapan",
  "WikiLatih/Bahan_Ajar",
  "WikiLatih/Pelatihan",
  "WikiLatih/Pelaporan",
  "Komunitas",
  "Komunitas/Kegiatan",
  "Komunitas/Komunikasi",
  "Komunitas/Laporan",
  "Komunitas/Kebijakan",
  "Komunitas/FAQ",
  "Komunitas/Kontak",
] as const;

const TOOL_DESCRIPTION =
  "Membaca halaman panduan resmi di wiki Wikimedia Indonesia (id.wikimedia.org). " +
  "Halaman Kopdar: 'Kopdar' (ketentuan umum), 'Kopdar/Persiapan_dan_Pelaksanaan', 'Kopdar/Pelaporan'. " +
  "Halaman WikiLatih: 'WikiLatih' (ketentuan umum, pelatih, dan rekomendasi susunan acara), 'WikiLatih/Persiapan', 'WikiLatih/Bahan_Ajar' (materi ajar), 'WikiLatih/Pelatihan' (tugas pelaksanaan hari-H), 'WikiLatih/Pelaporan' (proses pelaporan aktivitas, DAN dukungan dana/biaya: konsumsi, komunikasi/pulsa, transportasi lokal, penggunaan ruangan, per diem, suvenir). " +
  "Halaman Komunitas: 'Komunitas' (gambaran umum komunitas Wikimedia Indonesia), 'Komunitas/Kegiatan' (jenis-jenis kegiatan komunitas), 'Komunitas/Komunikasi' (saluran komunikasi komunitas), 'Komunitas/Laporan' (pelaporan kegiatan komunitas), 'Komunitas/Kebijakan' (kebijakan komunitas), 'Komunitas/FAQ' (pertanyaan umum seputar komunitas), 'Komunitas/Kontak' (kontak komunitas). Gunakan halaman Komunitas untuk pertanyaan umum tentang komunitas, cara bergabung, komunikasi, kegiatan, atau hal-hal lain yang tidak secara spesifik berkaitan dengan Kopdar maupun WikiLatih. " +
  "Pilih halaman yang paling spesifik dengan pertanyaan pengunjung; boleh membaca lebih dari satu halaman bila perlu.";

const TOOL_JUDUL_DESCRIPTION =
  "Judul halaman panduan yang ingin dibaca. Nilai yang valid: " + PANDUAN_WIKI.join(", ");

// OpenAI format (Groq)
const groqTools: ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "baca_panduan_wiki",
      description: TOOL_DESCRIPTION,
      parameters: {
        type: "object",
        properties: {
          judul: { type: "string", description: TOOL_JUDUL_DESCRIPTION },
        },
        required: ["judul"],
      },
    },
  },
];

// Native Gemini format
const geminiTools = [
  {
    functionDeclarations: [
      {
        name: "baca_panduan_wiki",
        description: TOOL_DESCRIPTION,
        parameters: {
          type: Type.OBJECT,
          properties: {
            judul: { type: Type.STRING, description: TOOL_JUDUL_DESCRIPTION },
          },
          required: ["judul"],
        },
      },
    ],
  },
];

// ─── Wiki helpers ─────────────────────────────────────────────────────────────

async function bacaHalamanWiki(judul: string): Promise<string> {
  if (!(PANDUAN_WIKI as readonly string[]).includes(judul)) {
    return `Halaman "${judul}" tidak tersedia. Halaman yang bisa dibaca: ${PANDUAN_WIKI.join(", ")}.`;
  }
  return bacaWikitext(judul);
}

async function bacaWikitext(judul: string): Promise<string> {
  const url = new URL(WIKI_API);
  url.search = new URLSearchParams({
    action: "parse",
    page: judul,
    prop: "wikitext",
    format: "json",
    origin: "*",
  }).toString();
  const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) return "Halaman tidak dapat diambil.";
  const json = await res.json();
  const wikitext: string = json?.parse?.wikitext?.["*"] ?? "";
  if (!wikitext) return `Halaman "${judul}" tidak ditemukan.`;
  const cleaned = wikitext
    .replace(/\[\[(?:Berkas|File):[^\]]*\]\]/gi, "")
    .replace(/\{\{[^{}]*\}\}/g, "")
    .replace(/\[\[[^\]|]*\|([^\]]*)\]\]/g, "$1")
    .replace(/\[\[([^\]]*)\]\]/g, "$1")
    .replace(/\[(https?:\/\/[^\s\]]+)\s+([^\]]+)\]/g, "[$2]($1)")
    .replace(/\[(https?:\/\/[^\s\]]+)\]/g, "$1")
    .replace(/'{2,}/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, 6000);
  const links = [...cleaned.matchAll(/\[([^\]]+)\]\((https?:[^\s)]+)\)/g)].map(
    (m) => `- [${m[1]}](${m[2]})`
  );
  if (links.length === 0) return cleaned;
  return `${cleaned}\n\nTAUTAN PENTING — jika relevan dengan pertanyaan, WAJIB disertakan dalam jawaban persis sebagai tautan Markdown berikut:\n${links.join("\n")}`;
}

async function runTool(name: string, argsJson: string): Promise<string> {
  try {
    const args = JSON.parse(argsJson || "{}");
    if (name === "baca_panduan_wiki") return await bacaHalamanWiki(String(args.judul ?? ""));
    return `Alat tidak dikenal: ${name}`;
  } catch {
    return "Terjadi kesalahan saat mengakses wiki. Jawab berdasarkan pengetahuan yang ada dan sampaikan keterbatasannya.";
  }
}

// ─── Logging ke dashboard ─────────────────────────────────────────────────────

function sendLog(question: string, answer: string, model: string, responseTimeMs: number): void {
  fetch("https://dashboard.wikimedia.or.id/api/external/chat-logs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question,
      answer,
      model,
      response_time_ms: responseTimeMs,
    }),
    signal: AbortSignal.timeout(5000),
  }).catch(() => {}); // fire-and-forget, abaikan error
}

// ─── Handler ──────────────────────────────────────────────────────────────────

type ClientMessage = { role: "user" | "model"; text: string };

export async function POST(req: Request) {
  const apiKey =
    PROVIDER === "gemini" ? process.env.GEMINI_API_KEY : process.env.GROQ_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "Chatbot belum dikonfigurasi." }, { status: 503 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return Response.json(
      { error: "Terlalu banyak pesan. Silakan coba lagi beberapa menit lagi." },
      { status: 429 }
    );
  }

  let clientMessages: ClientMessage[];
  try {
    const body = await req.json();
    clientMessages = body.messages;
    if (
      !Array.isArray(clientMessages) ||
      clientMessages.length === 0 ||
      clientMessages.length > MAX_MESSAGES ||
      clientMessages.some(
        (m) =>
          (m.role !== "user" && m.role !== "model") ||
          typeof m.text !== "string" ||
          m.text.length === 0 ||
          m.text.length > MAX_MESSAGE_LENGTH
      ) ||
      clientMessages[clientMessages.length - 1].role !== "user"
    ) {
      throw new Error("invalid");
    }
  } catch {
    return Response.json({ error: "Format pesan tidak valid." }, { status: 400 });
  }

  const question = clientMessages[clientMessages.length - 1].text;
  const startedAt = Date.now();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const encoder = new TextEncoder();
      let modelIdx = 0;

      const enqueueError = (err: unknown) => {
        const status = (err as { status?: number })?.status;
        controller.enqueue(
          encoder.encode(
            status === 429
              ? "\n\nMaaf Kawan Wiki, chatbot sedang ramai. Silakan coba lagi satu-dua menit lagi ya. 🙏"
              : "\n\nMaaf, terjadi gangguan pada layanan chatbot. Silakan coba lagi atau hubungi info@wikimedia.or.id."
          )
        );
      };

      // ── Path Gemini (native SDK) ──────────────────────────────────────────
      if (PROVIDER === "gemini") {
        const ai = new GoogleGenAI({ apiKey });

        const contents: { role: string; parts: object[] }[] = clientMessages.map((m) => ({
          role: m.role === "model" ? "model" : "user",
          parts: [{ text: m.text }],
        }));

        try {
          for (let round = 0; round <= MAX_TOOL_ROUNDS; round++) {
            const lastRound = round === MAX_TOOL_ROUNDS;

            let response;
            while (true) {
              try {
                response = await ai.models.generateContent({
                  model: GEMINI_MODELS[modelIdx],
                  contents,
                  config: {
                    systemInstruction: SYSTEM_PROMPT,
                    maxOutputTokens: 1024,
                    ...(lastRound ? {} : { tools: geminiTools }),
                  },
                });
                break;
              } catch (err) {
                const status = (err as { status?: number })?.status;
                if ((status === 429 || status === 404 || status === 503) && modelIdx < GEMINI_MODELS.length - 1) {
                  console.warn(`Model ${GEMINI_MODELS[modelIdx]} tidak tersedia (${status}), beralih ke ${GEMINI_MODELS[modelIdx + 1]}`);
                  modelIdx++;
                  continue;
                }
                throw err;
              }
            }

            const fcs: FunctionCall[] | undefined = response!.functionCalls;
            if (!fcs || fcs.length === 0) {
              // Jawaban teks final — stream ke klien
              const finalStream = await ai.models.generateContentStream({
                model: GEMINI_MODELS[modelIdx],
                contents,
                config: {
                  systemInstruction: SYSTEM_PROMPT,
                  maxOutputTokens: 1024,
                },
              });
              let fullAnswer = "";
              for await (const chunk of finalStream) {
                if (chunk.text) {
                  controller.enqueue(encoder.encode(chunk.text));
                  fullAnswer += chunk.text;
                }
              }
              sendLog(question, fullAnswer, GEMINI_MODELS[modelIdx], Date.now() - startedAt);
              break;
            }

            // Jalankan semua tool calls secara paralel
            const toolResults = await Promise.all(
              fcs.map((fc) => runTool(fc.name!, JSON.stringify(fc.args ?? {})))
            );

            // Tambahkan giliran model + hasil tool ke riwayat
            contents.push({
              role: "model",
              parts: response!.candidates![0].content!.parts as object[],
            });
            contents.push({
              role: "user",
              parts: fcs.map((fc, i) => ({
                functionResponse: {
                  name: fc.name!,
                  response: { output: toolResults[i] },
                },
              })),
            });
          }
        } catch (err) {
          console.error("Gemini error:", (err as Error).message ?? err);
          enqueueError(err);
        } finally {
          controller.close();
        }
        return;
      }

      // ── Path Groq (OpenAI-compatible, streaming) ──────────────────────────
      const client = new OpenAI({ apiKey, baseURL: "https://api.groq.com/openai/v1" });
      const messages: ChatCompletionMessageParam[] = [
        { role: "system", content: SYSTEM_PROMPT },
        ...clientMessages.map((m) => ({
          role: m.role === "model" ? ("assistant" as const) : ("user" as const),
          content: m.text,
        })),
      ];

      try {
        for (let round = 0; round <= MAX_TOOL_ROUNDS; round++) {
          const lastRound = round === MAX_TOOL_ROUNDS;
          let content = "";
          const toolCalls: ToolCall[] = [];

          while (true) {
            try {
              const groqStream = await client.chat.completions.create({
                model: MODELS[modelIdx],
                messages,
                max_tokens: 1024,
                stream: true,
                ...(lastRound ? {} : { tools: groqTools }),
              });
              for await (const chunk of groqStream) {
                const delta = chunk.choices[0]?.delta;
                if (!delta) continue;
                if (delta.content) content += delta.content;
                for (const tc of delta.tool_calls ?? []) {
                  const idx = tc.index ?? 0;
                  if (!toolCalls[idx]) {
                    toolCalls[idx] = {
                      id: tc.id ?? `call_${idx}`,
                      type: "function",
                      function: { name: tc.function?.name ?? "", arguments: "" },
                    };
                  }
                  if (tc.function?.name) toolCalls[idx].function.name = tc.function.name;
                  if (tc.function?.arguments) toolCalls[idx].function.arguments += tc.function.arguments;
                }
              }
              break;
            } catch (err) {
              const status = (err as { status?: number })?.status;
              if (status === 429 && modelIdx < MODELS.length - 1) {
                console.warn(`Model ${MODELS[modelIdx]} kena limit, beralih ke ${MODELS[modelIdx + 1]}`);
                modelIdx++;
                content = "";
                toolCalls.length = 0;
                continue;
              }
              throw err;
            }
          }

          const calls = toolCalls.filter(Boolean);
          if (calls.length === 0) {
            const finalText = content.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
            controller.enqueue(encoder.encode(finalText));
            sendLog(question, finalText, MODELS[modelIdx], Date.now() - startedAt);
            break;
          }

          messages.push({ role: "assistant", content: content || null, tool_calls: calls });
          for (const call of calls) {
            messages.push({
              role: "tool",
              tool_call_id: call.id,
              content: await runTool(call.function.name, call.function.arguments),
            });
          }
        }
      } catch (err) {
        console.error("Groq error:", (err as Error).message ?? err);
        enqueueError(err);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
