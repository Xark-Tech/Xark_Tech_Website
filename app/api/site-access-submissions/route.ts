import { NextResponse } from 'next/server';
import {
    sendBrevoSubmissionEmail,
    toParagraphs,
    toPlainText,
    writeClient,
    writeToken,
} from '@/lib/submissionNotifications';
import {
    SITE_ACCESS_STORAGE_KEY,
    getServerSiteAccessCookieOptions,
} from '@/lib/siteAccess';

export const runtime = 'nodejs';

type SiteAccessPayload = {
    name?: unknown;
    email?: unknown;
    phone?: unknown;
};

const getStringValue = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

export async function POST(request: Request) {
    if (!writeToken) {
        return NextResponse.json(
            {
                message:
                    'Missing SANITY_API_EDIT_TOKEN (or SANITY_API_WRITE_TOKEN / SANITY_API_READ_TOKEN).',
            },
            { status: 500 },
        );
    }

    try {
        const payload = (await request.json()) as SiteAccessPayload;

        const name = getStringValue(payload.name);
        const email = getStringValue(payload.email).toLowerCase();
        const phone = getStringValue(payload.phone);

        if (!name || !email) {
            return NextResponse.json(
                { message: 'Name and email are required.' },
                { status: 400 },
            );
        }

        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (!isValidEmail) {
            return NextResponse.json({ message: 'Please enter a valid email address.' }, { status: 400 });
        }

        const submittedAt = new Date().toISOString();
        const grantedAt = Date.now();

        await writeClient.create({
            _type: 'siteAccessSubmission',
            name,
            email,
            phone: phone || undefined,
            submittedAt,
        });

        await sendBrevoSubmissionEmail({
            recipientType: 'siteAccess',
            subject: `New Site Access Submission: ${name}`,
            htmlContent: `
                <div style="font-family: Arial, sans-serif; color: #111827;">
                    <h2 style="margin: 0 0 16px;">New Site Access Submission</h2>
                    ${toParagraphs([
                        ['Name', name],
                        ['Email', email],
                        ['Phone', phone],
                    ])}
                </div>
            `,
            textContent: toPlainText([
                ['Name', name],
                ['Email', email],
                ['Phone', phone],
            ]),
        });

        const response = NextResponse.json({ message: 'Access granted.' }, { status: 201 });
        response.cookies.set(
            SITE_ACCESS_STORAGE_KEY,
            String(grantedAt),
            getServerSiteAccessCookieOptions(request.headers.get('host')),
        );

        return response;
    } catch {
        return NextResponse.json({ message: 'Unable to submit access request.' }, { status: 500 });
    }
}
