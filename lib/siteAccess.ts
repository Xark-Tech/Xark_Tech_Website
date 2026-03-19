export const SITE_ACCESS_STORAGE_KEY = 'xark_site_access_granted_at';
export const SITE_ACCESS_REASK_AFTER_MS = 3 * 24 * 60 * 60 * 1000;
export const SITE_ACCESS_COOKIE_MAX_AGE = 3 * 24 * 60 * 60;
export const SITE_ACCESS_SHARED_COOKIE_DOMAIN = 'xarktechnologies.com';

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

const canUseSharedDomainCookie = (hostname?: string | null) => {
    if (!hostname) {
        return false;
    }

    return (
        hostname === SITE_ACCESS_SHARED_COOKIE_DOMAIN ||
        hostname.endsWith(`.${SITE_ACCESS_SHARED_COOKIE_DOMAIN}`)
    );
};

const getClientCookieAttributes = () => {
    if (typeof window === 'undefined') {
        return 'path=/; SameSite=Lax';
    }

    const attributes = ['path=/', 'SameSite=Lax'];

    if (window.location.protocol === 'https:') {
        attributes.push('Secure');
    }

    if (canUseSharedDomainCookie(window.location.hostname)) {
        attributes.push(`domain=${SITE_ACCESS_SHARED_COOKIE_DOMAIN}`);
    }

    return attributes.join('; ');
};

export const getServerSiteAccessCookieOptions = (hostname?: string | null) => ({
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SITE_ACCESS_COOKIE_MAX_AGE,
    ...(canUseSharedDomainCookie(hostname)
        ? { domain: SITE_ACCESS_SHARED_COOKIE_DOMAIN }
        : {}),
});

export const clearSiteAccessClientGrant = () => {
    if (typeof window !== 'undefined') {
        try {
            window.localStorage.removeItem(SITE_ACCESS_STORAGE_KEY);
        } catch {}
    }

    if (typeof document !== 'undefined') {
        document.cookie =
            `${SITE_ACCESS_STORAGE_KEY}=; ${getClientCookieAttributes()}; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
};

export const hasRecentSiteAccessClientGrant = () => {
    if (typeof window === 'undefined') {
        return false;
    }

    let localStorageValue: string | null = null;

    try {
        localStorageValue = window.localStorage.getItem(SITE_ACCESS_STORAGE_KEY);
    } catch {}

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

    let localStorageValue: string | null = null;

    try {
        localStorageValue = window.localStorage.getItem(SITE_ACCESS_STORAGE_KEY);
    } catch {}

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
        try {
            window.localStorage.setItem(SITE_ACCESS_STORAGE_KEY, String(grantedAt));
        } catch {}
    }

    if (typeof document !== 'undefined') {
        const expiresAt = new Date(grantedAt + SITE_ACCESS_REASK_AFTER_MS).toUTCString();
        document.cookie =
            `${SITE_ACCESS_STORAGE_KEY}=${encodeURIComponent(String(grantedAt))}; ` +
            `${getClientCookieAttributes()}; max-age=${SITE_ACCESS_COOKIE_MAX_AGE}; expires=${expiresAt}`;
    }
};
