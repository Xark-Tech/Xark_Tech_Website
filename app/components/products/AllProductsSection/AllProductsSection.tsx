import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import './style.scss';

export interface ProductCardItem {
    id: string;
    slug: string;
    title: string;
    cardSubtext: string;
    icon: string;
    points: string[];
    enableDetailPage?: boolean;
}

interface AllProductsSectionProps {
    title?: string;
    items?: ProductCardItem[];
}

const AllProductsSection: React.FC<AllProductsSectionProps> = ({
    title = 'All Products',
    items = [],
}) => {
    return (
        <section className="all-products-section-container flex items-center justify-center">
            <div className="all-products-section container">
                <h5>{title}</h5>

                {items.length > 0 ? (
                    <div className="products-container">
                        {items.map((item) => (
                            <article className="product-item" key={item.id}>
                                <div className="product-item__top">
                                    <Image
                                        src={item.icon}
                                        alt=""
                                        width={49}
                                        height={49}
                                        aria-hidden="true"
                                    />
                                </div>

                                <div className="product-item__content">
                                    <h6>{item.title}</h6>
                                    <p className="product-item__description">{item.cardSubtext}</p>

                                    <ul className="product-item__points">
                                        {item.points.map((point) => (
                                            <li key={point}>
                                                <Image
                                                    src="/images/icons/green-tick.png"
                                                    alt=""
                                                    width={19}
                                                    height={19}
                                                    aria-hidden="true"
                                                />
                                                <span>{point}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {item.enableDetailPage !== false ? (
                                    <Link href={`/products/${item.slug}`} className="product-item__link">
                                        <span>Know More</span>
                                        <Image
                                            src="/images/icons/green-top-tick-arrow.png"
                                            alt=""
                                            width={20}
                                            height={20}
                                            aria-hidden="true"
                                        />
                                    </Link>
                                ) : null}
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="products-empty-state" role="status" aria-live="polite">
                        Product entries are being prepared. Check back shortly for the latest catalog.
                    </div>
                )}
            </div>
        </section>
    );
};

export default AllProductsSection;
