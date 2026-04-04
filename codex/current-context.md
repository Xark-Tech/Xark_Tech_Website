# Current Context

## Temporary Public Site Blackout

- The site is intentionally blacked out because the client has not paid yet.
- The blackout is implemented globally for public routes and is meant to be easy to reverse.
- The Sanity Studio route at `/studio` is still accessible.

## Current Implementation

- `lib/siteBlackout.ts` exports `SITE_BLACKOUT = true`.
- `app/components/LayoutChrome/LayoutChrome.tsx` checks `SITE_BLACKOUT`.
- When the flag is `true`, all non-`/studio` routes render `SiteBlackout` instead of the normal site chrome and page content.
- `app/components/ui/SiteBlackout/SiteBlackout.tsx` renders a full-viewport black screen.
- `app/components/ui/SiteBlackout/style.scss` sets the blackout UI to a plain black background.

## How To Restore The Site

- Change `SITE_BLACKOUT` in `lib/siteBlackout.ts` from `true` to `false`.
- Push the updated code to GitHub.
- Vercel will redeploy and the normal site will become live again.

## Validation Done

- `npm run build` completed successfully after the blackout change.
- Existing warnings remain in the project, but they are not caused by the blackout work.
