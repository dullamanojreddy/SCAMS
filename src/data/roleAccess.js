const ROLE_FEATURES = {
  Student: new Set([
    'notices',
    'complaints',
    'map',
    'food',
    'library',
    'community',
    'placements',
    'ai-assistant',
  ]),
  Faculty: new Set(['faculty-portal', 'faculty-queries', 'faculty-notices']),
  Admin: new Set([
    'admin-console',
    'admin-users',
    'admin-emergency',
    'admin-complaints',
    'admin-canteen',
    'admin-library',
    'admin-moderation',
    'admin-placements',
    'admin-audit',
  ]),
};

export function canAccessFeature(role, featureId) {
  return ROLE_FEATURES[role]?.has(featureId) ?? false;
}
