import type { Metadata } from "next";
import Providers from "@/app/providers";
import "@/app/globals.css";



export const metadata: Metadata = {
  // title: "闪卡",
  title: "Shǎn kǎ",
  description: "chinese memory cards",
};

export default function RootLayout(
  { children }: LayoutProps<"/">) {
  
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
