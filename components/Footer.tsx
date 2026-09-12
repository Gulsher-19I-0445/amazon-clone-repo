import Link from "next/link";
import { categoryLabel, NAV_CATEGORY_SLUGS } from "@/lib/categories";
import { Logo } from "./Logo";

type FooterLink = {
  label: string;
  // Only links to routes this app actually has get an href. The rest are
  // placeholder links (<a> without href): styled the same, but not focusable
  // and not announced as links, so they don't read as broken.
  href?: string;
};

type FooterColumn = {
  heading: string;
  links: FooterLink[];
};

const FOOTER_COLUMNS: FooterColumn[] = [
  {
    heading: "Get to Know Us",
    links: [
      { label: "About Amazon" },
      { label: "Careers" },
      { label: "Press Releases" },
      { label: "Amazon Science" },
      { label: "Sustainability" },
    ],
  },
  {
    heading: "Shop with Us",
    links: [
      { label: "Today's Deals", href: "/s?deals=true" },
      { label: "All Products", href: "/s" },
      ...NAV_CATEGORY_SLUGS.slice(0, 3).map((slug) => ({
        label: categoryLabel(slug),
        href: `/s?category=${slug}`,
      })),
    ],
  },
  {
    heading: "Let Us Help You",
    links: [
      { label: "Your Account" },
      { label: "Your Orders", href: "/cart" },
      { label: "Shipping Rates & Policies" },
      { label: "Returns & Replacements" },
      { label: "Help" },
    ],
  },
  {
    heading: "Policies",
    links: [
      { label: "Conditions of Use" },
      { label: "Privacy Notice" },
      { label: "Interest-Based Ads" },
      { label: "Consumer Health Data Privacy" },
    ],
  },
];

const BOTTOM_LINKS: FooterLink[] = [
  { label: "Conditions of Use" },
  { label: "Privacy Notice" },
  { label: "Your Ads Privacy Choices" },
];

function FooterLinkItem({ link, className }: { link: FooterLink; className: string }) {
  if (link.href) {
    return (
      <Link href={link.href} className={`${className} hover:underline`}>
        {link.label}
      </Link>
    );
  }
  return <a className={`${className} cursor-default`}>{link.label}</a>;
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="text-white">
      {/* "#top" is a browser-native fragment: with no matching id it scrolls to the document top. */}
      <a
        href="#top"
        className="block bg-amz-navy-lighter py-4 text-center text-sm hover:bg-[#485769]"
      >
        Back to top
      </a>

      <nav aria-label="Footer" className="bg-amz-navy-light px-4 py-10">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.heading}>
              <h2 className="mb-2 text-base font-bold">{column.heading}</h2>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <FooterLinkItem link={link} className="text-sm text-neutral-300" />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      <div className="bg-amz-navy px-4 py-6 text-center">
        <div className="flex justify-center">
          <Logo />
        </div>
        <ul className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1">
          {BOTTOM_LINKS.map((link) => (
            <li key={link.label}>
              <FooterLinkItem link={link} className="text-xs text-neutral-300" />
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-neutral-300">
          &copy; 1996-{year}, Amazon.com clone &mdash; a demo project, not affiliated with
          Amazon.com, Inc.
        </p>
      </div>
    </footer>
  );
}
