import { NextResponse } from 'next/server';
import {
    sendBrevoSubmissionEmail,
    toParagraphs,
    toPlainText,
    writeClient,
    writeToken,
} from '@/lib/submissionNotifications';

export const runtime = 'nodejs';

type ContactPayload = {
    name?: unknown;
    email?: unknown;
    phone?: unknown;
    companyName?: unknown;
    city?: unknown;
    streetAddress?: unknown;
    postalCode?: unknown;
    country?: unknown;
    interestedProduct?: unknown;
    message?: unknown;
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
        const payload = (await request.json()) as ContactPayload;

        const name = getStringValue(payload.name);
        const email = getStringValue(payload.email).toLowerCase();
        const phone = getStringValue(payload.phone);
        const companyName = getStringValue(payload.companyName);
        const city = getStringValue(payload.city);
        const streetAddress = getStringValue(payload.streetAddress);
        const postalCode = getStringValue(payload.postalCode);
        const country = getStringValue(payload.country);
        const interestedProduct = getStringValue(payload.interestedProduct);
        const message = getStringValue(payload.message);

        if (!name || !email || !message) {
            return NextResponse.json(
                { message: 'Name, email, and message are required.' },
                { status: 400 },
            );
        }

        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (!isValidEmail) {
            return NextResponse.json({ message: 'Please enter a valid email address.' }, { status: 400 });
        }

        await writeClient.create({
            _type: 'contactFormSubmission',
            name,
            email,
            phone: phone || undefined,
            companyName: companyName || undefined,
            city: city || undefined,
            streetAddress: streetAddress || undefined,
            postalCode: postalCode || undefined,
            country: country || undefined,
            interestedProduct: interestedProduct || undefined,
            message,
            submittedAt: new Date().toISOString(),
            status: 'new',
        });

        const detailedEmailSent = await sendBrevoSubmissionEmail({
            subject: `New Contact Form Submission: ${name}`,
            htmlContent: `
                <div style="font-family: Arial, sans-serif; color: #111827;">
                    <h2 style="margin: 0 0 16px;">New Contact Form Submission</h2>
                    ${toParagraphs([
                        ['Name', name],
                        ['Email', email],
                        ['Phone', phone],
                        ['Company Name', companyName],
                        ['City', city],
                        ['Street Address', streetAddress],
                        ['Postal Code', postalCode],
                        ['Country', country],
                        ['Interested Product', interestedProduct],
                        ['Message', message],
                    ])}
                </div>
            `,
            textContent: toPlainText([
                ['Name', name],
                ['Email', email],
                ['Phone', phone],
                ['Company Name', companyName],
                ['City', city],
                ['Street Address', streetAddress],
                ['Postal Code', postalCode],
                ['Country', country],
                ['Interested Product', interestedProduct],
                ['Message', message],
            ]),
            replyTo: {
                email,
                name,
            },
        });

        console.log('Contact submission email detailed send result', {
            email,
            name,
            success: detailedEmailSent,
        });

        if (!detailedEmailSent) {
            const fallbackEmailSent = await sendBrevoSubmissionEmail({
                subject: `Contact Submission Fallback: ${name}`,
                htmlContent: `
                    <div style="font-family: Arial, sans-serif; color: #111827;">
                        <h2 style="margin: 0 0 16px;">Contact Submission Fallback</h2>
                        ${toParagraphs([
                            ['Name', name],
                            ['Email', email],
                            ['Phone', phone],
                            ['Message', message],
                        ])}
                    </div>
                `,
                textContent: toPlainText([
                    ['Name', name],
                    ['Email', email],
                    ['Phone', phone],
                    ['Message', message],
                ]),
                replyTo: {
                    email,
                    name,
                },
            });

            console.log('Contact submission email fallback send result', {
                email,
                name,
                success: fallbackEmailSent,
            });
        }

        return NextResponse.json({ message: 'Message submitted successfully.' }, { status: 201 });
    } catch {
        return NextResponse.json({ message: 'Unable to submit your message right now.' }, { status: 500 });
    }
}
