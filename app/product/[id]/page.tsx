import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BuyBox } from "@/components/BuyBox";
import { ImageGallery } from "@/components/ImageGallery";
import { PriceBlock } from "@/components/PriceBlock";
import { ProductCarouselSkeleton } from "@/components/ProductCarousel";
import { RelatedProducts } from "@/components/RelatedProducts";
import { StarRating } from "@/components/StarRating";
import { categoryLabel } from "@/lib/categories";
import { getProductById } from "@/lib/products";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

// Rendered per request: reads Neon for the product and its related rail.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);
  return { title: `${product?.name ?? "Product not found"} | Amazon.com clone` };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  // Resolved before any JSX so a missing product is a real 404, not a streamed 200.
  const product = await getProductById(id);
  if (product === null) notFound();

  const categoryHref = `/s?category=${product.category}`;

  return (
    <main className="flex-1 px-4 py-4">
      <div className="mx-auto flex max-w-[1500px] flex-col gap-4">
        <nav aria-label="Breadcrumb" className="text-xs text-neutral-600">
          <Link href="/s" className="hover:text-amz-link-hover hover:underline">
            All
          </Link>
          <span className="mx-1" aria-hidden="true">
            ›
          </span>
          <Link href={categoryHref} className="hover:text-amz-link-hover hover:underline">
            {categoryLabel(product.category)}
          </Link>
        </nav>

        <article className="grid grid-cols-1 gap-6 rounded-md bg-white p-4 shadow-sm md:grid-cols-12 md:p-6">
          <div className="md:col-span-5">
            <ImageGallery images={product.images} fallback={product.thumbnail} alt={product.name} />
          </div>

          <div className="md:col-span-4">
            <h1 className="text-2xl font-medium leading-snug">{product.name}</h1>
            <div className="mt-1 flex items-center gap-2 text-sm">
              <StarRating rating={product.rating} />
              <span className="text-amz-link">
                {product.reviewCount.toLocaleString("en-US")} {product.reviewCount === 1 ? "rating" : "ratings"}
              </span>
            </div>

            <hr className="my-3 border-amz-border" />
            <PriceBlock priceCents={product.priceCents} listPriceCents={product.listPriceCents} />
            <hr className="my-3 border-amz-border" />

            <section aria-labelledby="about-heading">
              <h2 id="about-heading" className="text-base font-bold">
                About this item
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-neutral-800">{product.description}</p>
            </section>
          </div>

          <aside aria-label="Buy box" className="md:col-span-3">
            <BuyBox product={product} />
          </aside>
        </article>

        <Suspense fallback={<ProductCarouselSkeleton />}>
          <RelatedProducts category={product.category} productId={product.id} />
        </Suspense>
      </div>
    </main>
  );
}
