import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "../utils/supabase";
import type { User, Session } from "@supabase/supabase-js";
import type {
  AdminProfile,
  AdminModule,
  PermissionAction,
  PermissionsMap,
} from "../types/permissions";
import { resolvePermissions, hasPermission as checkPermission } from "../types/permissions";

// ════════════════════════════════════════════════════════════
// AUTH CONTEXT
// ════════════════════════════════════════════════════════════

export interface AuthState {
  user: User | null;
  profile: AdminProfile | null;
  permissions: PermissionsMap | null;
  loading: boolean;
  can: (module: AdminModule, action: PermissionAction) => boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  user: null,
  profile: null,
  permissions: null,
  loading: true,
  can: () => false,
  refreshProfile: async () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

// ════════════════════════════════════════════════════════════
// PROVIDER — fast, no blocking on profile
// ════════════════════════════════════════════════════════════

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const profileFetched = useRef(false);

  // Fetch profile without blocking — fire and forget errors
  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("admin_profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error || !data) {
        // Table might not exist or no profile — skip silently
        // Auto-provision on first load only
        if (!profileFetched.current) {
          profileFetched.current = true;
          try {
            const { count } = await supabase
              .from("admin_profiles")
              .select("*", { count: "exact", head: true });

            const role = (count === 0 || count === null) ? "super_admin" : "viewer";
            const { data: u } = await supabase.auth.getUser();

            const { data: newProfile } = await supabase
              .from("admin_profiles")
              .insert({
                user_id: userId,
                role,
                display_name: u?.user?.user_metadata?.full_name || u?.user?.email?.split("@")[0] || "Admin",
                email: u?.user?.email || "",
                permissions: null,
              })
              .select()
              .single();

            if (newProfile) setProfile(newProfile as AdminProfile);
          } catch {
            // Table doesn't exist — that's fine
          }
        }
        return;
      }

      setProfile(data as AdminProfile);
      profileFetched.current = true;

      // Update last_active in background — don't await
      supabase
        .from("admin_profiles")
        .update({ last_active_at: new Date().toISOString() })
        .eq("user_id", userId)
        .then(() => {});
    } catch {
      // Silently fail — profile is optional
    }
  }, []);

  useEffect(() => {
    // Use getSession (local/cached) instead of getUser (network call)
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user || null;
      setUser(u);
      setLoading(false); // Unblock immediately
      if (u) fetchProfile(u.id); // Profile loads in background
    });

    const { data: sub } = supabase.auth.onAuthStateChange(
      (_event: string, session: Session | null) => {
        const u = session?.user || null;
        setUser(u);
        if (!u) {
          setProfile(null);
          profileFetched.current = false;
        } else {
          fetchProfile(u.id);
        }
      }
    );

    return () => {
      sub.subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const permissions = profile ? resolvePermissions(profile) : null;

  const can = useCallback(
    (module: AdminModule, action: PermissionAction) => checkPermission(profile, module, action),
    [profile]
  );

  const refreshProfile = useCallback(async () => {
    if (user) await fetchProfile(user.id);
  }, [user, fetchProfile]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    profileFetched.current = false;
  }, []);

  return React.createElement(
    AuthContext.Provider,
    {
      value: { user, profile, permissions, loading, can, refreshProfile, signOut },
    },
    children
  );
}

// ════════════════════════════════════════════════════════════
// ADMIN PROFILE MANAGEMENT (for super_admin)
// ════════════════════════════════════════════════════════════

export async function fetchAdminProfiles(): Promise<AdminProfile[]> {
  const { data, error } = await supabase
    .from("admin_profiles")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data || []) as AdminProfile[];
}

export async function updateAdminRole(
  profileId: string,
  role: AdminProfile["role"]
) {
  const { error } = await supabase
    .from("admin_profiles")
    .update({ role })
    .eq("id", profileId);
  if (error) throw error;
}

export async function updateAdminPermissions(
  profileId: string,
  permissions: AdminProfile["permissions"]
) {
  const { error } = await supabase
    .from("admin_profiles")
    .update({ permissions })
    .eq("id", profileId);
  if (error) throw error;
}

export async function deleteAdminProfile(profileId: string) {
  const { error } = await supabase
    .from("admin_profiles")
    .delete()
    .eq("id", profileId);
  if (error) throw error;
}
