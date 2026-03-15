import { createClient } from 'next-sanity';
import { NextResponse } from 'next/server';
import { apiVersion, dataset, projectId } from '@/sanity/env';

export const runtime = 'nodejs';

const writeToken =
    process.env.SANITY_API_EDIT_TOKEN ||
    process.env.SANITY_API_WRITE_TOKEN ||
    process.env.SANITY_API_READ_TOKEN;

const writeClient = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token: writeToken,
});

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

        return NextResponse.json({ message: 'Message submitted successfully.' }, { status: 201 });
    } catch {
        return NextResponse.json({ message: 'Unable to submit your message right now.' }, { status: 500 });
    }
}
