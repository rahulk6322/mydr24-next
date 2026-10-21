import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_Devanagari, Plus_Jakarta_Sans } from "next/font/google";
import type { ReactNode } from "react";
import { ActionBar } from "@/components/action-bar";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { I18nProvider } from "@/components/i18n-provider";
import { RevealObserver } from "@/components/reveal-observer";
import { UIProvider } from "@/components/ui-provider";
import { THEME_STORAGE_KEY } from "@/i18n/config";
import { getI18n } from "@/i18n/server";
import { site } from "@/lib/site";
import "@/styles/tokens.css";
import "@/styles/base.css";
import "@/styles/components.css";
import "@/styles/pages.css";

const inter = Inter({ subsets: ["latin"], variable: "--nf-inter", display: "swap" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--nf-jakarta", display: "swap" });
const devanagari = Noto_Sans_Devanagari({ subsets: ["devanagari"], weight: ["400", "500", "600", "700"], variable: "--nf-deva", display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return {
    metadataBase: new URL(site.url),
    title: { default: `${site.name}: ${dict.hero.ctaPrimary} | ${site.company}`, template: `%s | ${site.name}` },
    description: dict.hero.lead,
    applicationName: site.name,
    icons: { icon: "/icon.svg" },
    openGraph: { type: "website", siteName: site.name, title: `${site.name}: ${dict.hero.title}`, description: dict.hero.lead, locale: "en_IN" },
    twitter: { card: "summary", title: site.name, description: dict.hero.lead },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0A0F1A",
};

// Applies the saved theme before first paint (dark is the default).
const themeScript = `try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export default async function RootLayout({ children }: { children: ReactNode }) {
  const { locale, dict } = await getI18n();
  return (
    <html lang={locale} data-theme="dark" className={`${inter.variable} ${jakarta.variable} ${devanagari.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <I18nProvider locale={locale} dict={dict}>
          <UIProvider>
            <Header />
            <main id="main">{children}</main>
            <Footer />
            <ActionBar />
            <RevealObserver />
          </UIProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
