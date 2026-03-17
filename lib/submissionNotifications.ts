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
    contactRecipientEmail
  }
`;

type SubmissionEmailSettingsRaw = {
    recipientEmail?: string;
    siteAccessRecipientEmail?: string;
    contactRecipientEmail?: string;
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
    recipientType?: 'siteAccess' | 'contact';
    recipientEmail?: string;
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
    recipientType: 'siteAccess' | 'contact' = 'contact',
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
        let resolvedRecipient: string | null = null;

        if (recipientType === 'siteAccess') {
            resolvedRecipient = normalizeEmail(settings?.siteAccessRecipientEmail) || fallbackRecipient;
        } else {
            resolvedRecipient = normalizeEmail(settings?.contactRecipientEmail) || fallbackRecipient;
        }

        console.log('Resolved submission recipient email', {
            recipientType,
            resolvedRecipient,
            hasFallbackRecipient: Boolean(fallbackRecipient),
            hasSiteAccessRecipient: Boolean(normalizeEmail(settings?.siteAccessRecipientEmail)),
            hasContactRecipient: Boolean(normalizeEmail(settings?.contactRecipientEmail)),
        });

        return resolvedRecipient;
    } catch {
        console.error('Failed to fetch submission recipient email settings', { recipientType });
        return null;
    }
};

export const sendBrevoSubmissionEmail = async ({
    subject,
    htmlContent,
    textContent,
    attachment,
    recipientType = 'contact',
    recipientEmail,
    replyTo,
}: BrevoSendOptions) => {
    if (!brevoApiKey || !brevoSenderEmail) {
        console.error('Brevo email sending skipped because required environment variables are missing', {
            hasBrevoApiKey: Boolean(brevoApiKey),
            hasBrevoSenderEmail: Boolean(brevoSenderEmail),
            recipientType,
            subject,
        });
        return false;
    }

    const resolvedRecipientEmail = normalizeEmail(recipientEmail) || (await getSubmissionRecipientEmail(recipientType));
    if (!resolvedRecipientEmail) {
        console.error('No submission recipient email resolved', { recipientType, subject });
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
                        email: resolvedRecipientEmail,
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
                recipientType,
                recipientEmail: resolvedRecipientEmail,
                subject,
                status: response.status,
                body: errorBody,
            });
        }

        if (response.ok) {
            console.log('Brevo submission email sent', {
                recipientType,
                recipientEmail: resolvedRecipientEmail,
                subject,
            });
        }

        return response.ok;
    } catch (error) {
        console.error('Brevo submission email threw an exception', {
            recipientType,
            recipientEmail: resolvedRecipientEmail,
            subject,
            error,
        });
        return false;
    }
};
