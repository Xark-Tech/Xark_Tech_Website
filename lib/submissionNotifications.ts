import groq from 'groq';
import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from '@/sanity/env';

export const writeToken =
    process.env.SANITY_API_EDIT_TOKEN ||
    process.env.SANITY_API_WRITE_TOKEN ||
    process.env.SANITY_API_READ_TOKEN;

export const writeClient = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token: writeToken,
});

const brevoApiKey = process.env.BREVO_API_KEY;
const brevoSenderEmail = process.env.BREVO_SENDER_EMAIL;
const brevoSenderName = process.env.BREVO_SENDER_NAME || 'XARK Website';

const SUBMISSION_EMAIL_QUERY = groq`
  *[_type == "submissionEmailSettings" && _id == "submissionEmailSettings"][0]{
    recipientEmail,
    siteAccessRecipientEmail,
    contactRecipientEmail,
    careerRecipientEmail
  }
`;

type SubmissionEmailSettingsRaw = {
    recipientEmail?: string;
    siteAccessRecipientEmail?: string;
    contactRecipientEmail?: string;
    careerRecipientEmail?: string;
};

type BrevoAttachment = {
    name: string;
    url: string;
};

type BrevoSendOptions = {
    subject: string;
    htmlContent: string;
    textContent: string;
    attachment?: BrevoAttachment;
    recipientType?: 'siteAccess' | 'contact' | 'career';
    replyTo?: {
        email: string;
        name?: string;
    };
};

const escapeHtml = (value: string) =>
    value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

export const toParagraphs = (lines: Array<[string, string]>) =>
    lines
        .filter(([, value]) => value.trim().length > 0)
        .map(
            ([label, value]) =>
                `<p style="margin:0 0 12px;"><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`,
        )
        .join('');

export const toPlainText = (lines: Array<[string, string]>) =>
    lines
        .filter(([, value]) => value.trim().length > 0)
        .map(([label, value]) => `${label}: ${value}`)
        .join('\n');

const normalizeEmail = (value?: string) =>
    typeof value === 'string' && value.trim().length > 0 ? value.trim().toLowerCase() : null;

export const getSubmissionRecipientEmail = async (
    recipientType: 'siteAccess' | 'contact' | 'career' = 'contact',
) => {
    if (!writeToken) {
        return null;
    }

    try {
        const settings = await writeClient.fetch<SubmissionEmailSettingsRaw | null>(
            SUBMISSION_EMAIL_QUERY,
            {},
            { next: { revalidate: 60 } },
        );

        const fallbackRecipient = normalizeEmail(settings?.recipientEmail);

        if (recipientType === 'siteAccess') {
            return normalizeEmail(settings?.siteAccessRecipientEmail) || fallbackRecipient;
        }

        if (recipientType === 'career') {
            return normalizeEmail(settings?.careerRecipientEmail) || fallbackRecipient;
        }

        return normalizeEmail(settings?.contactRecipientEmail) || fallbackRecipient;
    } catch {
        return null;
    }
};

export const sendBrevoSubmissionEmail = async ({
    subject,
    htmlContent,
    textContent,
    attachment,
    recipientType = 'contact',
    replyTo,
}: BrevoSendOptions) => {
    if (!brevoApiKey || !brevoSenderEmail) {
        return false;
    }

    const recipientEmail = await getSubmissionRecipientEmail(recipientType);
    if (!recipientEmail) {
        return false;
    }

    try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': brevoApiKey,
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                sender: {
                    email: brevoSenderEmail,
                    name: brevoSenderName,
                },
                to: [
                    {
                        email: recipientEmail,
                    },
                ],
                replyTo,
                subject,
                htmlContent,
                textContent,
                attachment: attachment ? [attachment] : undefined,
            }),
        });

        if (!response.ok) {
            const errorBody = await response.text().catch(() => '');
            console.error('Brevo submission email failed', {
                subject,
                status: response.status,
                body: errorBody,
            });
        }

        return response.ok;
    } catch {
        return false;
    }
};
