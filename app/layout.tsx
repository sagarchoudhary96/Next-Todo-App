import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { ListTodoIcon } from "lucide-react";

const montserrat = Montserrat({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Todo App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.className} antialiased overflow-hidden flex flex-col h-screen`}
      >
        <header className="flex justify-between items-center mb-2 p-4">
          <div className="flex items-center gap-2">
            <ListTodoIcon className="w-8 h-8 bg-black text-white p-1.5 rounded-lg" />
            <h1 className="text-xl font-bold">TODO APP</h1>
          </div>
        </header>
        <main className="p-4 flex-1 flex flex-col overflow-hidden">{children}</main>
      </body>
    </html>
  );
}
