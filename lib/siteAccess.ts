export const SITE_ACCESS_STORAGE_KEY = 'xark_site_access_granted_at';
export const SITE_ACCESS_REASK_AFTER_MS = 3 * 24 * 60 * 60 * 1000;
export const SITE_ACCESS_COOKIE_MAX_AGE = 3 * 24 * 60 * 60;

export const hasRecentSiteAccessGrant = (rawValue?: string | null) => {
    if (!rawValue) {
        return false;
    }

    const grantedAt = Number(rawValue);
    if (!Number.isFinite(grantedAt)) {
        return false;
    }

    return Date.now() - grantedAt < SITE_ACCESS_REASK_AFTER_MS;
};
