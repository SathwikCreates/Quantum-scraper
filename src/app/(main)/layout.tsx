import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 p-4 md:p-6 flex justify-center">
        {children}
      </main>
      <Footer />
    </div>
  );
}
