import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

type Ctx = {
  online: Set<string>;
  isOnline: (userId: string) => boolean;
};

const PresenceCtx = createContext<Ctx | null>(null);

export function PresenceProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [online, setOnline] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) {
      setOnline(new Set());
      return;
    }
    const channel = supabase.channel("online-users", {
      config: { presence: { key: user.id } },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState() as Record<string, unknown[]>;
        setOnline(new Set(Object.keys(state)));
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ online_at: new Date().toISOString() });
        }
      });

    const onVisibility = async () => {
      if (!document.hidden) {
        try {
          await channel.track({ online_at: new Date().toISOString() });
        } catch {}
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      supabase.removeChannel(channel);
    };
  }, [user]);

  return (
    <PresenceCtx.Provider value={{ online, isOnline: (id) => online.has(id) }}>
      {children}
    </PresenceCtx.Provider>
  );
}

export function usePresence() {
  const ctx = useContext(PresenceCtx);
  if (!ctx) return { online: new Set<string>(), isOnline: (_: string) => false };
  return ctx;
}
