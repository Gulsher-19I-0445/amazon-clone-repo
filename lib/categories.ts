export type Category = {
  slug: string;
  label: string;
};

// Static so the header never has to hit the database. Slugs match
// Product.category in the seed data (prisma/products.json).
export const CATEGORIES: Category[] = [
  { slug: "smartphones", label: "Smartphones" },
  { slug: "laptops", label: "Laptops" },
  { slug: "tablets", label: "Tablets" },
  { slug: "mobile-accessories", label: "Mobile Accessories" },
  { slug: "mens-shirts", label: "Men's Shirts" },
  { slug: "mens-shoes", label: "Men's Shoes" },
  { slug: "mens-watches", label: "Men's Watches" },
  { slug: "womens-dresses", label: "Women's Dresses" },
  { slug: "womens-shoes", label: "Women's Shoes" },
  { slug: "womens-bags", label: "Women's Bags" },
  { slug: "womens-jewellery", label: "Women's Jewellery" },
  { slug: "womens-watches", label: "Women's Watches" },
  { slug: "tops", label: "Tops" },
  { slug: "sunglasses", label: "Sunglasses" },
  { slug: "beauty", label: "Beauty" },
  { slug: "fragrances", label: "Fragrances" },
  { slug: "skin-care", label: "Skin Care" },
  { slug: "groceries", label: "Groceries" },
  { slug: "home-decoration", label: "Home Decoration" },
  { slug: "furniture", label: "Furniture" },
  { slug: "kitchen-accessories", label: "Kitchen Accessories" },
  { slug: "sports-accessories", label: "Sports Accessories" },
  { slug: "motorcycle", label: "Motorcycle" },
  { slug: "vehicle", label: "Vehicles" },
];

// The handful shown in the secondary nav row, Amazon-style.
export const NAV_CATEGORY_SLUGS = [
  "smartphones",
  "laptops",
  "mens-shirts",
  "womens-dresses",
  "beauty",
  "groceries",
  "furniture",
  "sports-accessories",
];

export function categoryLabel(slug: string): string {
  return CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;
}
