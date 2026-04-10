import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
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
  /** Check a single permission */
  can: (module: AdminModule, action: PermissionAction) => boolean;
  /** Reload profile from DB */
  refreshProfile: () => Promise<void>;
  /** Sign out */
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
// PROVIDER
// ════════════════════════════════════════════════════════════

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from("admin_profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (data) {
      setProfile(data as AdminProfile);
      // Update last_active timestamp
      supabase
        .from("admin_profiles")
        .update({ last_active_at: new Date().toISOString() })
        .eq("user_id", userId)
        .then(() => {});
    } else {
      // No profile yet — auto-create with default role
      // First user becomes super_admin, others become viewer
      const { count } = await supabase
        .from("admin_profiles")
        .select("*", { count: "exact", head: true });

      const role = (count === 0 || count === null) ? "super_admin" : "viewer";

      const { data: currentUser } = await supabase.auth.getUser();

      const { data: newProfile } = await supabase
        .from("admin_profiles")
        .insert({
          user_id: userId,
          role,
          display_name: currentUser?.user?.user_metadata?.full_name || currentUser?.user?.email?.split("@")[0] || "Admin",
          email: currentUser?.user?.email || "",
          permissions: null,
        })
        .select()
        .single();

      if (newProfile) setProfile(newProfile as AdminProfile);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      const currentUser = data.user;
      setUser(currentUser);
      if (currentUser) {
        await fetchProfile(currentUser.id);
      }
      setLoading(false);
    };

    init();

    const { data: sub } = supabase.auth.onAuthStateChange(
      async (_event: string, session: Session | null) => {
        const sessionUser = session?.user || null;
        setUser(sessionUser);
        if (sessionUser) {
          await fetchProfile(sessionUser.id);
        } else {
          setProfile(null);
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
