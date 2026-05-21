import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { AuthProvider } from "@/hooks/useAuth";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Elimi Trust Ltd — Premium Marketplace Rwanda" },
      {
        name: "description",
        content:
          "Rwanda's premium classified marketplace. Real estate, vehicles, electronics, fashion, and more. Trusted by Elimi Trust Ltd since 1996.",
      },
      { name: "author", content: "Elimi Trust Ltd" },
      { property: "og:title", content: "Elimi Trust Ltd — Premium Marketplace" },
      {
        property: "og:description",
        content: "Rwanda's premium classified marketplace.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center bg-background text-center px-6">
      <div>
        <div className="text-7xl font-bold text-gradient-gold">404</div>
        <p className="mt-4 text-muted-foreground">Page not found</p>
        <a
          href="/"
          className="mt-6 inline-block px-5 py-2.5 rounded-lg bg-primary text-primary-foreground"
        >
          Go home
        </a>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => {
    console.error(error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-center px-6">
        <div>
          <h1 className="text-xl font-semibold">Something went wrong</h1>
          <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
          <a
            href="/"
            className="mt-6 inline-block px-5 py-2.5 rounded-lg bg-primary text-primary-foreground"
          >
            Go home
          </a>
        </div>
      </div>
    );
  },
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <Outlet />
          <Toaster theme="dark" position="top-right" />
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
