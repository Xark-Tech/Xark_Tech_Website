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
    recipientEmail
  }
`;

type SubmissionEmailSettingsRaw = {
    recipientEmail?: string;
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

export const getSubmissionRecipientEmail = async () => {
    if (!writeToken) {
        return null;
    }

    try {
        const settings = await writeClient.fetch<SubmissionEmailSettingsRaw | null>(
            SUBMISSION_EMAIL_QUERY,
            {},
            { next: { revalidate: 60 } },
        );

        return typeof settings?.recipientEmail === 'string' && settings.recipientEmail.trim().length > 0
            ? settings.recipientEmail.trim().toLowerCase()
            : null;
    } catch {
        return null;
    }
};

export const sendBrevoSubmissionEmail = async ({
    subject,
    htmlContent,
    textContent,
    attachment,
}: BrevoSendOptions) => {
    if (!brevoApiKey || !brevoSenderEmail) {
        return false;
    }

    const recipientEmail = await getSubmissionRecipientEmail();
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
                subject,
                htmlContent,
                textContent,
                attachment: attachment ? [attachment] : undefined,
            }),
        });

        return response.ok;
    } catch {
        return false;
    }
};
