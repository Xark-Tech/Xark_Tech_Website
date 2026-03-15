import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CareerDetailContent from '@/app/components/careers/CareerDetailContent/CareerDetailContent';
import { getAllCareerSlugs, getCareerBySlug } from '@/sanity/lib/careers';

type CareerDetailPageProps = {
    params: Promise<{
        slug: string;
    }>;
};

export async function generateStaticParams() {
    const slugs = await getAllCareerSlugs();
    return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: CareerDetailPageProps): Promise<Metadata> {
    const { slug } = await params;
    const career = await getCareerBySlug(slug);

    if (!career) {
        return {
            title: 'Careers | Xark',
            robots: {
                index: false,
                follow: false,
            },
        };
    }

    const title = `${career.title} | Careers | Xark`;
    const description = career.summary;
    const canonicalPath = `/careers/${career.slug}`;

    return {
        title,
        description,
        alternates: {
            canonical: canonicalPath,
        },
        openGraph: {
            title,
            description,
            type: 'article',
            url: canonicalPath,
        },
        twitter: {
            card: 'summary',
            title,
            description,
        },
    };
}

export default async function CareerDetailPage({ params }: CareerDetailPageProps) {
    const { slug } = await params;
    const career = await getCareerBySlug(slug);

    if (!career) {
        notFound();
    }

    return (
        <CareerDetailContent
            careerId={career.id}
            title={career.title}
            experience={career.experience}
            location={career.location}
            employmentType={career.employmentType}
            summary={career.summary}
            body={career.body}
            applicationEmail={career.applicationEmail}
        />
    );
}
