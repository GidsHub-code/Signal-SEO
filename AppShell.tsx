import { Link, useRouter, useLocation } from "@tanstack/react-router";
import { Home, Inbox, MessageSquare, User, Radar } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useUnreadChats } from "@/hooks/use-unread-chats";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { profile, signOut } = useAuth();
  const { total: unreadTotal } = useUnreadChats();
  const router = useRouter();
  const loc = useLocation();
  const isAgent = profile?.role === "agent";

  const homeHref = isAgent ? "/agent" : "/client";
  const inboxHref = isAgent ? "/signals" : "/request";
  const inboxLabel = isAgent ? "Signals" : "Requests";
  const inboxIcon = isAgent ? Radar : Inbox;

  const tabs = [
    { to: homeHref, label: "Home", icon: Home },
    { to: inboxHref, label: inboxLabel, icon: inboxIcon },
    { to: "/chats", label: "Chats", icon: MessageSquare },
    { to: "/profile", label: "Profile", icon: User },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-30 backdrop-blur bg-background/80 border-b">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold">
            <Logo className="h-8 w-8" />
            <span>SignalMe</span>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              await signOut();
              router.navigate({ to: "/" });
            }}
          >
            Sign out
          </Button>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-5 pb-24">{children}</main>

      <nav className="fixed bottom-0 inset-x-0 z-30 border-t bg-background/95 backdrop-blur">
        <div className="max-w-3xl mx-auto grid grid-cols-4">
          {tabs.map((t, i) => {
            const Icon = t.icon;
            const active = loc.pathname === t.to || (t.label === "Chats" && loc.pathname.startsWith("/chats")) || (t.label === "Profile" && loc.pathname.startsWith("/profile"));
            const showBadge = t.label === "Chats" && unreadTotal > 0;
            return (
              <Link
                key={i}
                to={t.to as any}
                className={`flex flex-col items-center justify-center py-2.5 text-xs gap-0.5 transition-colors ${active ? "text-primary" : "text-muted-foreground"}`}
              >
                <span className="relative">
                  <Icon className="h-5 w-5" />
                  {showBadge && (
                    <span className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-semibold flex items-center justify-center">
                      {unreadTotal > 99 ? "99+" : unreadTotal}
                    </span>
                  )}
                </span>
                {t.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
