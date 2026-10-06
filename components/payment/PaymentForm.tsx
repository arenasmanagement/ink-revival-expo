"use client";

/**
 * PaymentForm — Embedded Stripe Payment Element
 *
 * Uses vanilla Stripe.js (no @stripe/react-stripe-js needed).
 * Loaded dynamically via Next.js Script to avoid SSR issues.
 *
 * Props:
 *   clientSecret — from PaymentIntent.client_secret
 *   orderId      — for success URL
 *   amountCents  — for display
 *   paymentType  — "auth" = TYPE 1 (shows "Authorize" copy) | "charge" = TYPE 2
 *   onSuccess    — callback after payment confirmed
 *   onError      — callback on fatal error
 */

import { useEffect, useRef, useState, useCallback } from "react";
import Script from "next/script";

interface Props {
  clientSecret: string;
  orderId:      string;
  amountCents:  number;
  paymentType:  "auth" | "charge";
  onSuccess:    (paymentIntentId: string) => void;
  onError?:     (msg: string) => void;
}

declare global {
  interface Window {
    Stripe?: (key: string, opts?: object) => StripeInstance;
  }
}

interface StripeInstance {
  elements: (opts: object) => StripeElements;
  confirmPayment: (opts: object) => Promise<{ error?: { message: string }; paymentIntent?: { id: string; status: string } }>;
}

interface StripeElements {
  create: (type: string, opts?: object) => StripeElement;
  submit: () => Promise<{ error?: { message: string } }>;
}

interface StripeElement {
  mount: (el: HTMLElement) => void;
  destroy: () => void;
}

const DISPLAY: React.CSSProperties = {
  fontFamily:    "var(--font-display, var(--font-bebas-neue), Impact, sans-serif)",
  letterSpacing: "0.04em",
};
const BODY: React.CSSProperties = {
  fontFamily: "var(--font-body, system-ui, sans-serif)",
};

export default function PaymentForm({
  clientSecret,
  orderId,
  amountCents,
  paymentType,
  onSuccess,
  onError,
}: Props) {
  const elementRef    = useRef<HTMLDivElement>(null);
  const stripeRef     = useRef<StripeInstance | null>(null);
  const elementsRef   = useRef<StripeElements | null>(null);
  const payElRef      = useRef<StripeElement | null>(null);
  const [ready,   setReady]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const initStripe = useCallback(() => {
    if (!window.Stripe) return;
    const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!pk) {
      const msg = "Stripe publishable key is not configured.";
      setError(msg);
      onError?.(msg);
      return;
    }

    const stripeInstance = window.Stripe(pk);
    stripeRef.current = stripeInstance;

    const elements = stripeInstance.elements({
      clientSecret,
      appearance: {
        theme: "night",
        variables: {
          colorPrimary:    "#C4902A",
          colorBackground: "#0E0804",
          colorText:       "#F5EDD8",
          colorDanger:     "#E07830",
          fontFamily:      "Georgia, serif",
          borderRadius:    "0px",
        },
      },
    });
    elementsRef.current = elements;

    const paymentElement = elements.create("payment", {
      layout: "tabs",
    });

    if (elementRef.current) {
      paymentElement.mount(elementRef.current);
      payElRef.current = paymentElement;
    }

    setReady(true);
  }, [clientSecret, onError]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      payElRef.current?.destroy();
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripeRef.current || !elementsRef.current) return;

    setLoading(true);
    setError("");

    // Submit the Payment Element (validates card fields)
    const { error: submitError } = await elementsRef.current.submit();
    if (submitError) {
      setError(submitError.message ?? "Please check your card details.");
      setLoading(false);
      return;
    }

    // Confirm the payment
    const { error: confirmError, paymentIntent } = await stripeRef.current.confirmPayment({
      elements:  elementsRef.current,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/register/success?orderId=${orderId}`,
      },
      redirect: "if_required",
    });

    if (confirmError) {
      const msg = confirmError.message ?? "Payment failed. Please try again.";
      setError(msg);
      setLoading(false);
    } else if (paymentIntent) {
      // Payment authorized (TYPE 1) or captured (TYPE 2)
      setLoading(false);
      onSuccess(paymentIntent.id);
    }
  }

  const dollars = (amountCents / 100).toFixed(2);
  const btnLabel = paymentType === "auth"
    ? `Authorize Hold — $${dollars}`
    : `Pay $${dollars}`;
  const noteText = paymentType === "auth"
    ? `A hold of $${dollars} will be placed on your card. No charge is made until your application is approved.`
    : `Your card will be charged $${dollars}.`;

  return (
    <>
      {/* Load Stripe.js from Stripe's CDN */}
      <Script
        src="https://js.stripe.com/v3/"
        strategy="afterInteractive"
        onLoad={initStripe}
      />

      <form onSubmit={handleSubmit} style={{ maxWidth: "520px", margin: "0 auto", padding: "0 1rem" }}>
        <div style={{ marginBottom: "1.5rem" }}>
          <div ref={elementRef} style={{ minHeight: "200px" }} />
          {!ready && (
            <p style={{ ...BODY, color: "rgba(245,237,216,0.4)", fontSize: "0.85rem", textAlign: "center", padding: "2rem 0" }}>
              Loading payment form…
            </p>
          )}
        </div>

        {error && (
          <p style={{ ...BODY, color: "#E07830", fontSize: "0.85rem", marginBottom: "1rem", padding: "0.75rem 1rem", background: "rgba(224,120,48,0.08)", border: "1px solid rgba(224,120,48,0.3)" }}>
            {error}
          </p>
        )}

        <p style={{ ...BODY, color: "rgba(245,237,216,0.4)", fontSize: "0.75rem", marginBottom: "1.25rem", lineHeight: 1.5 }}>
          {noteText}
        </p>

        <button
          type="submit"
          disabled={!ready || loading}
          style={{
            ...DISPLAY,
            width:           "100%",
            backgroundColor: (!ready || loading) ? "rgba(196,144,42,0.5)" : "#C4902A",
            color:           "#0E0804",
            fontSize:        "1.1rem",
            padding:         "0.9rem",
            border:          "none",
            cursor:          (!ready || loading) ? "not-allowed" : "pointer",
            transition:      "background-color 0.2s",
          }}
        >
          {loading ? "Processing…" : btnLabel}
        </button>

        <p style={{ ...BODY, color: "rgba(245,237,216,0.25)", fontSize: "0.7rem", textAlign: "center", marginTop: "0.75rem" }}>
          🔒 Payments secured by Stripe. Card details are never stored on our servers.
        </p>
      </form>
    </>
  );
}
