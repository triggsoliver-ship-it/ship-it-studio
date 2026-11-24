/* ============================================================================
   Sales Chaser — checkout links
   ----------------------------------------------------------------------------
   Every Stripe Payment Link this site uses lives in the object below. Swap a
   URL here and the matching button changes everywhere it appears. There is
   nothing else to edit and nothing to build.

   Each key must match the data-checkout="..." attribute on a button in
   index.html. PAYMENTS.md lists the exact price each key must charge.

   This file is public. Payment Link URLs are safe to publish. A Stripe API key
   is not — never put sk_..., rk_... or a webhook secret in here. None is needed.
   ========================================================================= */

var PAYMENT_LINKS = {
  per_lead: "https://buy.stripe.com/5kQ4gyaCh3tld9Nb2QeIw0o" // £25 per qualified lead, quantity adjustable
};

/* ----------------------------------------------------------------------------
   The fallback contract.

   Buttons ship from the server with their existing mailto: href already in the
   HTML. A button is only ever upgraded to a Stripe link when the configured
   value is a real Stripe Payment Link URL. A blank, a placeholder, an http://
   value, a bare origin and a lookalike host such as buy.stripe.com.evil.example
   all fail the test, and the button is left exactly as it shipped.
   ------------------------------------------------------------------------- */
(function () {
  "use strict";

  var STRIPE_LINK = /^https:\/\/(?:buy|checkout)\.stripe\.com\/[^\s"']+$/;

  function isLive(url) {
    return typeof url === "string" && STRIPE_LINK.test(url.trim());
  }

  function wire() {
    var buttons = document.querySelectorAll("[data-checkout]");
    for (var i = 0; i < buttons.length; i++) {
      var el = buttons[i];
      var url = PAYMENT_LINKS[el.getAttribute("data-checkout")];
      if (!isLive(url)) { continue; }  // leave the mailto exactly as shipped
      el.setAttribute("href", url.trim());
      el.setAttribute("data-checkout-state", "live");
      var label = el.getAttribute("data-checkout-label");
      if (label) { el.textContent = label; }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", wire);
  } else {
    wire();
  }

  // Exposed so the fallback can be checked from the console on the live site.
  window.CHECKOUT = { links: PAYMENT_LINKS, pattern: STRIPE_LINK, isLive: isLive };
})();
