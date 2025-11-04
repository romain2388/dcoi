// src/routes/__root.tsx
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { Grommet, dark } from "grommet";
import { hpe } from "grommet-theme-hpe";
import { useEffect, useState } from "react";
import { deepMerge } from "grommet/utils";
import Background from "../components/background";
import type { ReactNode } from "react";
import { QueryClient } from "@tanstack/react-query";

const firstmerge = deepMerge(hpe, dark);
const myTheme = deepMerge(firstmerge, {
  global: {
    colors: {
      brand: "#0cb61a",
      control: {
        dark: "#dbf4d5",
      },
      focus: "#bdf4b0",
    },
    font: {
      family: "Michroma, sans-serif",
      weight: 400,
    },
  },
});

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  head: () => ({
    meta: [
      { charSet: "utf8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "TanStack Start Starter" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Michroma&family=Roboto:ital,wdth,wght@0,75..100,100..900;1,75..100,100..900&display=swap",
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function ClientOnly({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return;
  return <>{children}</>;
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        <ClientOnly>
          <Grommet theme={myTheme} full>
            <Background>{children}</Background>
          </Grommet>
        </ClientOnly>
        <Scripts />
      </body>
    </html>
  );
}
