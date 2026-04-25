"use client";

import { SessionProfile } from "@/lib/exportableTypes";
import supabase from "@/lib/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";

export type AuthContextType = {
  session: Session | null;
  user: User | undefined;
  profile: SessionProfile | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
  initialSession,
  initialProfile,
}: {
  children: React.ReactNode;
  initialSession: Session | null;
  initialProfile: SessionProfile | null;
}) {
  const [session, setSession] = useState<Session | null>(initialSession);
  const [profile, setProfile] = useState<SessionProfile | null>(initialProfile);
  const [loading, setLoading] = useState(false); // ya no necesitas loading inicial

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user,
        profile,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useSession() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useSession must be used inside AuthProvider");
  }

  return context;
}