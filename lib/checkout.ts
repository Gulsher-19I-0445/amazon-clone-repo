import type { ShippingAddress } from "./types";

// Pure checkout rules shared by the form (client) and the order endpoint
// (server): address validation, totals and the delivery estimate.

export const US_STATES: { code: string; name: string }[] = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "DC", name: "District of Columbia" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
];

const STATE_CODES = new Set(US_STATES.map((s) => s.code));

export function emptyAddress(): ShippingAddress {
  return {
    email: "",
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
  };
}

export type AddressErrors = Partial<Record<keyof ShippingAddress, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ZIP_PATTERN = /^\d{5}(-\d{4})?$/;

/** Field → message for every invalid field; an empty object means the address is good. */
export function validateAddress(address: ShippingAddress): AddressErrors {
  const errors: AddressErrors = {};
  const trimmed = trimAddress(address);

  if (trimmed.email === "") {
    errors.email = "Enter your email address.";
  } else if (!EMAIL_PATTERN.test(trimmed.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (trimmed.fullName === "") {
    errors.fullName = "Enter a name.";
  }

  if (trimmed.phone === "") {
    errors.phone = "Enter a phone number so we can call if there are any issues with delivery.";
  } else if (trimmed.phone.replace(/\D/g, "").length < 10) {
    errors.phone = "Enter a valid 10-digit phone number.";
  }

  if (trimmed.addressLine1 === "") {
    errors.addressLine1 = "Enter an address.";
  }

  if (trimmed.city === "") {
    errors.city = "Enter a city name.";
  }

  if (!STATE_CODES.has(trimmed.state)) {
    errors.state = "Select a state.";
  }

  if (trimmed.postalCode === "") {
    errors.postalCode = "Enter a ZIP code.";
  } else if (!ZIP_PATTERN.test(trimmed.postalCode)) {
    errors.postalCode = "Enter a valid ZIP code (12345 or 12345-6789).";
  }

  return errors;
}

export function isAddressValid(address: ShippingAddress): boolean {
  return Object.keys(validateAddress(address)).length === 0;
}

/** Whitespace-trimmed copy, so what is validated is exactly what gets stored. */
export function trimAddress(address: ShippingAddress): ShippingAddress {
  return {
    email: address.email.trim(),
    fullName: address.fullName.trim(),
    phone: address.phone.trim(),
    addressLine1: address.addressLine1.trim(),
    addressLine2: address.addressLine2.trim(),
    city: address.city.trim(),
    state: address.state.trim(),
    postalCode: address.postalCode.trim(),
  };
}

/** Flat estimate shown as "Estimated tax", like amazon.com. Cosmetic: nothing is charged. */
export const ESTIMATED_TAX_RATE = 0.08;

export type OrderTotals = {
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
};

/** Shipping is always free here (see lib/cart.ts); tax is rounded to the nearest cent. */
export function calculateTotals(subtotalCents: number): OrderTotals {
  const shippingCents = 0;
  const taxCents = Math.round(subtotalCents * ESTIMATED_TAX_RATE);
  return {
    subtotalCents,
    shippingCents,
    taxCents,
    totalCents: subtotalCents + shippingCents + taxCents,
  };
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** Amazon-style "Arriving Sep 15 - Sep 17": 3 to 5 days after the order was placed. */
export function estimatedDeliveryWindow(placedAt: Date): { from: Date; to: Date } {
  return {
    from: new Date(placedAt.getTime() + 3 * DAY_MS),
    to: new Date(placedAt.getTime() + 5 * DAY_MS),
  };
}
