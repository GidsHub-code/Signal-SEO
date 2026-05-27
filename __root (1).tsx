import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { AuthProvider } from "@/hooks/use-auth";
import { UnreadChatsProvider } from "@/hooks/use-unread-chats";
import { PresenceProvider } from "@/hooks/use-presence";
import { Toaster } from "@/components/ui/sonner";
import { NotificationListener } from "@/components/NotificationListener";
import { NotificationPermissionBanner } from "@/components/NotificationPermissionBanner";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "google-site-verification", content: "zzBVk2MfSY-gBy09Rm-_o2Q5nPb4yqs6QsDmpfj61xo" },
      { name: "theme-color", content: "#dc2626" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-title", content: "SignalMe" },
      { name: "format-detection", content: "telephone=no" },
      { name: "application-name", content: "SignalMe" },
      { title: "SignalMe" },
      { property: "og:title", content: "SignalMe" },
      { name: "twitter:title", content: "SignalMe" },
      { name: "description", content: "SignalMe is a demand-first rental platform in Nigeria: by which you post the type of rental property you want then Agent will respond" },
      { property: "og:description", content: "SignalMe is a demand-first rental platform in Nigeria: by which you post the type of rental property you want then Agent will respond" },
      { name: "twitter:description", content: "SignalMe is a demand-first rental platform in Nigeria: by which you post the type of rental property you want then Agent will respond" },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/95a74530-42ce-4ac7-80ca-9d5f4481c9fe/id-preview-59a640d8--526b7c15-93d9-4b79-84f3-efc60eaa4179.lovable.app-1777919328192.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/95a74530-42ce-4ac7-80ca-9d5f4481c9fe/id-preview-59a640d8--526b7c15-93d9-4b79-84f3-efc60eaa4179.lovable.app-1777919328192.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://signalme.com.ng" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "icon", href: "/icon-192.png", type: "image/png" },
      { rel: "canonical", href: "https://signalme.com.ng" },
      { rel: "preconnect", href: "https://wbailskzlyiiznxrkokc.supabase.co" },
      { rel: "dns-prefetch", href: "https://wbailskzlyiiznxrkokc.supabase.co" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NG">
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
        <PresenceProvider>
          <UnreadChatsProvider>
            <Outlet />
            <NotificationListener />
            <NotificationPermissionBanner />
            <Toaster richColors position="top-center" />
          </UnreadChatsProvider>
        </PresenceProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
