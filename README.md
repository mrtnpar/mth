# Booking Flow

Implementation of a three-step public booking flow (Contact, Payment, Confirmation)
based on the provided design.

## Setup

Prereqs: Node.js 18+ and npm.

```bash
npm install
```

## Develop

```bash
npm run dev
```

Then open `http://localhost:3000/booking/contact`.

## Tests

```bash
npm test
npm run test:watch
```

## Available Paths

- `/booking/contact`
- `/booking/payment`
- `/booking/confirmation`

## AI Usage

I used AI primarily for planning and review. My workflow was: plan first, iterate
on the plan with considerations and reasoning (why), then implement. This mirrors
spec-driven development, but with more manual review and decision-making.

## Assumptions

- The design reads as US‑oriented, so I matched its copy and input formats to reduce user friction; if locale requirements expand, phone formatting and labels should be locale‑driven.
- Card payment is the only method shown, so I optimized the flow for a single, trusted payment path.
- The experience is linear to keep cognitive load low and ensure required info is captured before payment.
- Copy and policy text are treated as approved, static content; if marketing/legal updates are frequent, it should move to config/CMS.

## Tradeoffs

- Route‑based steps keep URLs meaningful for sharing, analytics, and customer support, at the cost of extra routing logic versus a single‑page wizard.
- Centralized state/validation in Context keeps the UX consistent across steps; persistence can be added later if product needs drafts or recovery.
- Zod + custom validation keeps rules explicit and errors consistent; a form library would scale faster if the form grows significantly.
- Input masking guides entry and reduces formatting errors, but can be less flexible for some paste/edit behaviors.
- Integration tests prioritize the end‑to‑end booking flow; deeper unit tests were deprioritized for speed.

## Scope Decisions

- Left out auth, provider selection, appointment scheduling, insurance details, payment processor integration, and backend persistence to stay focused on the booking UX.
- SMS opt‑in was explicitly out of scope; if added, it would touch the contact data model, UI, validation, and consent copy.
- Submission logs booking data to the console as requested instead of calling an API.

## Scope Change Response (SMS Opt-in)

If asked to add an SMS opt-in checkbox on Contact Information:

- I would add a new boolean field in the contact data model, add a labeled
  checkbox UI on the Contact step, and update validation + submission output.
- I would confirm copy, placement, and any compliance requirements (opt-in
  language, marketing consent rules), then estimate the added work and propose
  a small follow-up PR if needed.

## Links

- Hosted page: https://mth.mrtn.workers.dev/booking/contact
- GitHub repo: https://github.com/mrtnpar/mth

## Project Organization

- `src/app/booking/[step]/page.tsx`: step routing and screen selection.
- `src/components/booking/*`: UI components for each step and shared booking UI.
- `src/contexts/BookingContext.tsx`: booking state, validation, and navigation.
- `src/lib/*`: step helpers and validation schema.
- `src/app/globals.css`: global styles and design tokens.
