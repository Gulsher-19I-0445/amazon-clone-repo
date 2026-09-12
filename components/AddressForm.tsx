"use client";

import type { AddressErrors } from "@/lib/checkout";
import { US_STATES } from "@/lib/checkout";
import type { ShippingAddress } from "@/lib/types";
import { fieldClass, FormField } from "./FormField";

type AddressFormProps = {
  value: ShippingAddress;
  errors: AddressErrors;
  onChange: (next: ShippingAddress) => void;
};

// Amazon's "Add a new address" form, trimmed to the fields an order needs.
// Fully controlled; validation lives in lib/checkout.ts and is run by the
// parent on submit so errors appear all at once, as on amazon.com.
export function AddressForm({ value, errors, onChange }: AddressFormProps) {
  const set = (field: keyof ShippingAddress) => (fieldValue: string) => onChange({ ...value, [field]: fieldValue });

  return (
    <div className="flex max-w-xl flex-col gap-3">
      <FormField id="country" label="Country/Region">
        {({ id }) => (
          <select id={id} value="US" disabled className={`${fieldClass(false)} bg-neutral-100 text-neutral-600`}>
            <option value="US">United States</option>
          </select>
        )}
      </FormField>

      <FormField id="fullName" label="Full name (First and Last name)" error={errors.fullName}>
        {({ id, describedBy, invalid }) => (
          <input
            id={id}
            type="text"
            autoComplete="name"
            value={value.fullName}
            onChange={(e) => set("fullName")(e.target.value)}
            aria-describedby={describedBy}
            aria-invalid={invalid}
            className={fieldClass(invalid)}
          />
        )}
      </FormField>

      <FormField id="email" label="Email address" hint="Your order confirmation goes here." error={errors.email}>
        {({ id, describedBy, invalid }) => (
          <input
            id={id}
            type="email"
            autoComplete="email"
            value={value.email}
            onChange={(e) => set("email")(e.target.value)}
            aria-describedby={describedBy}
            aria-invalid={invalid}
            className={fieldClass(invalid)}
          />
        )}
      </FormField>

      <FormField id="phone" label="Phone number" hint="May be used to assist delivery." error={errors.phone}>
        {({ id, describedBy, invalid }) => (
          <input
            id={id}
            type="tel"
            autoComplete="tel"
            value={value.phone}
            onChange={(e) => set("phone")(e.target.value)}
            aria-describedby={describedBy}
            aria-invalid={invalid}
            className={fieldClass(invalid)}
          />
        )}
      </FormField>

      <FormField id="addressLine1" label="Address" error={errors.addressLine1}>
        {({ id, describedBy, invalid }) => (
          <input
            id={id}
            type="text"
            autoComplete="address-line1"
            placeholder="Street address or P.O. Box"
            value={value.addressLine1}
            onChange={(e) => set("addressLine1")(e.target.value)}
            aria-describedby={describedBy}
            aria-invalid={invalid}
            className={fieldClass(invalid)}
          />
        )}
      </FormField>

      <FormField id="addressLine2" label="Apt, suite, unit, building, floor, etc. (optional)">
        {({ id, describedBy, invalid }) => (
          <input
            id={id}
            type="text"
            autoComplete="address-line2"
            value={value.addressLine2}
            onChange={(e) => set("addressLine2")(e.target.value)}
            aria-describedby={describedBy}
            className={fieldClass(invalid)}
          />
        )}
      </FormField>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_140px_120px]">
        <FormField id="city" label="City" error={errors.city}>
          {({ id, describedBy, invalid }) => (
            <input
              id={id}
              type="text"
              autoComplete="address-level2"
              value={value.city}
              onChange={(e) => set("city")(e.target.value)}
              aria-describedby={describedBy}
              aria-invalid={invalid}
              className={fieldClass(invalid)}
            />
          )}
        </FormField>

        <FormField id="state" label="State" error={errors.state}>
          {({ id, describedBy, invalid }) => (
            <select
              id={id}
              autoComplete="address-level1"
              value={value.state}
              onChange={(e) => set("state")(e.target.value)}
              aria-describedby={describedBy}
              aria-invalid={invalid}
              className={fieldClass(invalid)}
            >
              <option value="">Select</option>
              {US_STATES.map((state) => (
                <option key={state.code} value={state.code}>
                  {state.name}
                </option>
              ))}
            </select>
          )}
        </FormField>

        <FormField id="postalCode" label="ZIP Code" error={errors.postalCode}>
          {({ id, describedBy, invalid }) => (
            <input
              id={id}
              type="text"
              inputMode="numeric"
              autoComplete="postal-code"
              value={value.postalCode}
              onChange={(e) => set("postalCode")(e.target.value)}
              aria-describedby={describedBy}
              aria-invalid={invalid}
              className={fieldClass(invalid)}
            />
          )}
        </FormField>
      </div>
    </div>
  );
}
