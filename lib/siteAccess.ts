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

const getCookieValue = (cookieName: string) => {
    if (typeof document === 'undefined') {
        return null;
    }

    const match = document.cookie.match(
        new RegExp(`(?:^|; )${cookieName.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&')}=([^;]*)`),
    );

    return match ? decodeURIComponent(match[1]) : null;
};

export const clearSiteAccessClientGrant = () => {
    if (typeof window !== 'undefined') {
        window.localStorage.removeItem(SITE_ACCESS_STORAGE_KEY);
    }

    if (typeof document !== 'undefined') {
        document.cookie = `${SITE_ACCESS_STORAGE_KEY}=; path=/; max-age=0; SameSite=Lax`;
    }
};

export const hasRecentSiteAccessClientGrant = () => {
    if (typeof window === 'undefined') {
        return false;
    }

    const localStorageValue = window.localStorage.getItem(SITE_ACCESS_STORAGE_KEY);
    if (hasRecentSiteAccessGrant(localStorageValue)) {
        return true;
    }

    const cookieValue = getCookieValue(SITE_ACCESS_STORAGE_KEY);
    if (hasRecentSiteAccessGrant(cookieValue)) {
        return true;
    }

    clearSiteAccessClientGrant();
    return false;
};

export const getRecentSiteAccessClientGrantTimestamp = () => {
    if (typeof window === 'undefined') {
        return null;
    }

    const localStorageValue = window.localStorage.getItem(SITE_ACCESS_STORAGE_KEY);
    if (hasRecentSiteAccessGrant(localStorageValue)) {
        return Number(localStorageValue);
    }

    const cookieValue = getCookieValue(SITE_ACCESS_STORAGE_KEY);
    if (hasRecentSiteAccessGrant(cookieValue)) {
        return Number(cookieValue);
    }

    clearSiteAccessClientGrant();
    return null;
};

export const persistSiteAccessClientGrant = (grantedAt: number) => {
    if (typeof window !== 'undefined') {
        window.localStorage.setItem(SITE_ACCESS_STORAGE_KEY, String(grantedAt));
    }

    if (typeof document !== 'undefined') {
        const secureFlag =
            typeof window !== 'undefined' && window.location.protocol === 'https:' ? '; Secure' : '';
        document.cookie =
            `${SITE_ACCESS_STORAGE_KEY}=${encodeURIComponent(String(grantedAt))}; ` +
            `path=/; max-age=${SITE_ACCESS_COOKIE_MAX_AGE}; SameSite=Lax${secureFlag}`;
    }
};
