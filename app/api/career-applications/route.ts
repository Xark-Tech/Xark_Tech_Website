import { NextResponse } from 'next/server';
import {
    sendBrevoSubmissionEmail,
    toParagraphs,
    toPlainText,
    writeClient,
    writeToken,
} from '@/lib/submissionNotifications';

export const runtime = 'nodejs';

const isAllowedFileType = (mimeType: string) => {
    const allowedMimeTypes = new Set([
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]);
    return allowedMimeTypes.has(mimeType);
};

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
        const formData = await request.formData();
        const name = formData.get('name');
        const phone = formData.get('phone');
        const email = formData.get('email');
        const careerId = formData.get('careerId');
        const careerTitle = formData.get('careerTitle');
        const cvFile = formData.get('cvFile');

        if (
            typeof name !== 'string' ||
            typeof phone !== 'string' ||
            typeof email !== 'string' ||
            typeof careerId !== 'string' ||
            typeof careerTitle !== 'string' ||
            !(cvFile instanceof File)
        ) {
            return NextResponse.json({ message: 'Invalid form data.' }, { status: 400 });
        }

        if (!isAllowedFileType(cvFile.type)) {
            return NextResponse.json(
                { message: 'Invalid CV file type. Please upload PDF or Word document.' },
                { status: 400 },
            );
        }

        if (cvFile.size > 10 * 1024 * 1024) {
            return NextResponse.json(
                { message: 'CV file is too large. Maximum allowed size is 10MB.' },
                { status: 400 },
            );
        }

        const uploadedAsset = await writeClient.assets.upload(
            'file',
            Buffer.from(await cvFile.arrayBuffer()),
            {
                filename: cvFile.name,
                contentType: cvFile.type,
            },
        );

        await writeClient.create({
            _type: 'careerApplication',
            career: {
                _type: 'reference',
                _ref: careerId,
            },
            careerTitle,
            name: name.trim(),
            phone: phone.trim(),
            email: email.trim().toLowerCase(),
            cvFile: {
                _type: 'file',
                asset: {
                    _type: 'reference',
                    _ref: uploadedAsset._id,
                },
            },
            submittedAt: new Date().toISOString(),
            status: 'new',
        });

        const cleanedName = name.trim();
        const cleanedPhone = phone.trim();
        const cleanedEmail = email.trim().toLowerCase();
        const cleanedCareerTitle = careerTitle.trim();

        await sendBrevoSubmissionEmail({
            subject: `New Career Application: ${cleanedCareerTitle}`,
            htmlContent: `
                <div style="font-family: Arial, sans-serif; color: #111827;">
                    <h2 style="margin: 0 0 16px;">New Career Application</h2>
                    ${toParagraphs([
                        ['Career', cleanedCareerTitle],
                        ['Name', cleanedName],
                        ['Email', cleanedEmail],
                        ['Phone', cleanedPhone],
                        ['CV File', cvFile.name],
                        ['CV Asset URL', uploadedAsset.url || 'Stored in Sanity'],
                    ])}
                </div>
            `,
            textContent: toPlainText([
                ['Career', cleanedCareerTitle],
                ['Name', cleanedName],
                ['Email', cleanedEmail],
                ['Phone', cleanedPhone],
                ['CV File', cvFile.name],
                ['CV Asset URL', uploadedAsset.url || 'Stored in Sanity'],
            ]),
            attachment:
                typeof uploadedAsset.url === 'string' && uploadedAsset.url.length > 0
                    ? {
                          name: cvFile.name,
                          url: uploadedAsset.url,
                      }
                    : undefined,
        });

        return NextResponse.json({ message: 'Application submitted successfully.' }, { status: 201 });
    } catch {
        return NextResponse.json({ message: 'Unable to submit application.' }, { status: 500 });
    }
}
