import Chatbot from "./components/Chatbot";

export default function Home() {
  return (
    <main className="flex min-h-[calc(100vh-80px)] flex-col items-center p-4 sm:p-8">
      <section className="ticket-card w-full max-w-5xl p-5 sm:p-7 animate-[fadeIn_0.5s_ease-out]">
        <Chatbot />
      </section>
    </main>
  );
}