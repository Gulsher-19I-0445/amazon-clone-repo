import { ProductCarouselSkeleton } from "./ProductCarousel";

const bar = "rounded bg-neutral-200";

// Same footprint as app/product/[id]/page.tsx (breadcrumb, gallery / title /
// buy box article, related rail, reviews) so nothing shifts when the real page
// streams in. Rendered by that route's loading.tsx.
export function ProductPageSkeleton() {
  return (
    <main aria-busy="true" aria-label="Loading product" className="flex-1 animate-pulse px-4 py-4">
      <div className="mx-auto flex max-w-[1500px] flex-col gap-4">
        <div className={`h-3 w-32 ${bar}`} />

        <article className="grid grid-cols-1 gap-6 rounded-md bg-white p-4 shadow-sm md:grid-cols-12 md:p-6">
          <div className="flex flex-col-reverse gap-3 md:col-span-5 md:flex-row">
            <div className="flex gap-2 md:w-14 md:flex-col">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-12 w-12 shrink-0 rounded-md border border-amz-border bg-neutral-100" />
              ))}
            </div>
            <div className="aspect-square w-full flex-1 rounded bg-neutral-100" />
          </div>

          <div className="md:col-span-4">
            <div className={`h-6 w-full ${bar}`} />
            <div className={`mt-2 h-6 w-2/3 ${bar}`} />
            <div className={`mt-3 h-4 w-40 ${bar}`} />

            <hr className="my-3 border-amz-border" />
            <div className={`h-8 w-32 ${bar}`} />
            <hr className="my-3 border-amz-border" />

            <div className={`h-5 w-36 ${bar}`} />
            <div className="mt-2 space-y-2">
              <div className={`h-4 w-full ${bar}`} />
              <div className={`h-4 w-full ${bar}`} />
              <div className={`h-4 w-11/12 ${bar}`} />
              <div className={`h-4 w-3/4 ${bar}`} />
            </div>
          </div>

          <div className="self-start rounded-md border border-amz-border p-4 md:col-span-3">
            <div className={`hidden h-7 w-28 md:block ${bar}`} />
            <div className={`h-4 w-40 md:mt-3 ${bar}`} />
            <div className={`mt-3 h-6 w-24 ${bar}`} />
            <div className="mt-4 h-10 rounded-full bg-neutral-200" />
            <div className="mt-3 h-9 rounded-full bg-neutral-100" />
            <div className="mt-4 space-y-2">
              <div className={`h-3 w-3/4 ${bar}`} />
              <div className={`h-3 w-2/3 ${bar}`} />
              <div className={`h-3 w-5/6 ${bar}`} />
            </div>
          </div>
        </article>

        <ProductCarouselSkeleton />

        <section className="rounded-md bg-white p-4 shadow-sm md:p-6">
          <div className={`h-7 w-48 ${bar}`} />
          <div className="mt-3 grid grid-cols-1 gap-8 md:grid-cols-12">
            <div className="space-y-2 md:col-span-4">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className={`h-4 w-full ${bar}`} />
              ))}
            </div>
            <div className="space-y-6 md:col-span-8">
              {[0, 1].map((i) => (
                <div key={i}>
                  <div className={`h-4 w-32 ${bar}`} />
                  <div className={`mt-2 h-4 w-full ${bar}`} />
                  <div className={`mt-2 h-4 w-5/6 ${bar}`} />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
