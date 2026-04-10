// ════════════════════════════════════════════════════════════
// ROLE-BASED ADMIN PERMISSIONS
// ════════════════════════════════════════════════════════════

export type AdminRole = "super_admin" | "admin" | "viewer";

/** Modules that can be permission-gated */
export type AdminModule =
  | "dashboard"
  | "analytics"
  | "forms"
  | "jobs"
  | "courses"
  | "applications"
  | "service_requests"
  | "events"
  | "email_marketing"
  | "certificates"
  | "blog"
  | "messages"
  | "coupons"
  | "invoices"
  | "portfolio"
  | "transactions"
  | "devignfx"
  | "glossary"
  | "settings";

/** CRUD actions */
export type PermissionAction = "read" | "create" | "update" | "delete";

/** Full permission map per module */
export type ModulePermissions = Record<PermissionAction, boolean>;

/** Complete permissions object */
export type PermissionsMap = Record<AdminModule, ModulePermissions>;

/** Admin profile stored in the database */
export interface AdminProfile {
  id: string;
  user_id: string;
  role: AdminRole;
  display_name: string;
  email: string;
  avatar_url?: string | null;
  permissions: Partial<PermissionsMap> | null; // null = use role defaults
  last_active_at: string | null;
  created_at: string;
}

// ── Role defaults ────────────────────────────────────────

const ALL: ModulePermissions = { read: true, create: true, update: true, delete: true };
const READ_ONLY: ModulePermissions = { read: true, create: false, update: false, delete: false };
const NONE: ModulePermissions = { read: false, create: false, update: false, delete: false };

const ALL_MODULES: AdminModule[] = [
  "dashboard", "analytics", "forms", "jobs", "courses", "applications",
  "service_requests", "events", "email_marketing", "certificates", "blog",
  "messages", "coupons", "invoices", "portfolio", "transactions", "devignfx", "glossary", "settings",
];

function buildDefaults(base: ModulePermissions): PermissionsMap {
  return Object.fromEntries(ALL_MODULES.map((m) => [m, { ...base }])) as PermissionsMap;
}

export const ROLE_DEFAULTS: Record<AdminRole, PermissionsMap> = {
  super_admin: buildDefaults(ALL),
  admin: {
    ...buildDefaults(ALL),
    settings: READ_ONLY,
  },
  viewer: {
    ...buildDefaults(READ_ONLY),
    settings: NONE,
  },
};

export const ROLE_LABELS: Record<AdminRole, { label: string; color: string; description: string }> = {
  super_admin: {
    label: "Super Admin",
    color: "bg-purple-100 text-purple-700",
    description: "Full access to all modules and settings",
  },
  admin: {
    label: "Admin",
    color: "bg-blue-100 text-blue-700",
    description: "Can manage all content, limited settings access",
  },
  viewer: {
    label: "Viewer",
    color: "bg-gray-100 text-gray-700",
    description: "Read-only access to all content",
  },
};

// ── Permission helpers ───────────────────────────────────

/**
 * Resolve effective permissions for a profile.
 * Uses custom permissions if set, otherwise falls back to role defaults.
 */
export function resolvePermissions(profile: AdminProfile): PermissionsMap {
  const defaults = ROLE_DEFAULTS[profile.role];
  if (!profile.permissions) return defaults;

  // Merge custom overrides on top of role defaults
  const result = { ...defaults };
  for (const mod of ALL_MODULES) {
    if (profile.permissions[mod]) {
      result[mod] = { ...defaults[mod], ...profile.permissions[mod] };
    }
  }
  return result;
}

/** Check if a profile has a specific permission */
export function hasPermission(
  profile: AdminProfile | null,
  module: AdminModule,
  action: PermissionAction
): boolean {
  if (!profile) return false;
  if (profile.role === "super_admin") return true; // super admin always has access
  const perms = resolvePermissions(profile);
  return perms[module]?.[action] ?? false;
}
