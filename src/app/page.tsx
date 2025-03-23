import { Header } from "@/components/Header";
import { VoiceSection } from "@/components/VoiceSection";
import { VibeSection } from "@/components/VibeSection";
import { ScriptSection } from "@/components/ScriptSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1 flex flex-col gap-x-3 w-full max-w-[var(--page-max-width)] mx-auto">
        <VoiceSection />

        <div className="flex flex-col md:flex-row gap-3">
          <VibeSection />
          <ScriptSection />
        </div>
      </main>
      <Footer />
    </>
  );
}
