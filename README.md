# Freelance Mobile Video Editor & Reels Creator Portfolio

A production-quality, mobile-first cinematic portfolio website built for a freelance video editor specializing in:
- **Cinematic Mobile Video Editing**
- **Instagram Reels & YouTube Shorts**
- **Travel Montages & Landscape Hyperlapses**
- **Aesthetic Transitions (Day-to-Night, Occlusion Match Cuts)**
- **Beat Synchronization & Sound Design**
- **Short-Form Vertical Content (9:16)**

---

## Key Features

1. **Mobile-First Creative Studio Aesthetic**:
   - Deep black (`#09090b`) and charcoal surfaces (`#121216`), warm amber / electric gold accents, and subtle film grain overlay.
   - Editorial typography pairing: **Syne** for bold headlines, **Plus Jakarta Sans** for body copy, and **JetBrains Mono** for timecodes and safe-zone specs.
   - Zero-pill discipline: unboxed text with typographic bullet dividers (`·`) and natural numbering (`01`, `02`).

2. **Full-Viewport Cinematic Hero**:
   - Creator label: `"FREELANCE MOBILE VIDEO EDITOR"` with live availability pulse.
   - Headline: *"Your moments. My vision. One perfect edit."*
   - Supporting copy: *"Creating cinematic stories, one frame at a time."*
   - Thumb-friendly primary CTAs (`Watch My Showreel`, `Explore My Edits`).

3. **Featured Showreel (Vertical 9:16 Centerpiece)**:
   - Widescreen desktop layout: prominent 9:16 mobile mock-up with play controls beside concise description and featured post-production techniques.
   - Mobile layout: prioritized vertical video stacked above key highlights.
   - Custom poster, play/pause, time scrubber, mute/unmute, and fullscreen launch.

4. **"My Edits" — Vertical Video Gallery (9:16)**:
   - Heading: *"A few seconds. A whole story."*
   - Category filters: *All Edits*, *Cinematic*, *Travel*, *Instagram Reels*, *Beat Sync*, *Transitions*, *Night & Day*, *Lifestyle*, *Music Edits*.
   - Live search by keyword or client name.
   - **Mobile 2-column responsive layout**: cards remain large, clear, and thumb-friendly.
   - **Desktop 4-column responsive grid**: asymmetrical rhythm with duration badges and instant play overlay.

5. **Dedicated Vertical Video Viewer (Project Modal)**:
   - Immersive near-fullscreen vertical 9:16 player.
   - **Touch swipe gestures**: swipe left/right on mobile screens to navigate between projects.
   - Keyboard navigation with arrow keys (`ArrowLeft`, `ArrowRight`) and `Escape` to close.
   - **Share link button** with instant clipboard copy notification.
   - Editorial role, creative approach, technique breakdown, and tools used.

6. **Services ("What I edit.")**:
   - 4 core service cards:
     1. *Cinematic Reels*
     2. *Travel & Lifestyle*
     3. *Instagram & Social Media*
     4. *Personal & Creative Edits*
   - Each with dedicated features and an `"Enquire Now"` action syncing directly to the contact form.

7. **Editing Workflow ("How your video comes to life.")**:
   - 4-step pipeline:
     1. *Share your vision*
     2. *Plan the edit*
     3. *Edit & refine*
     4. *Final delivery*
   - Horizontal timeline on desktop and vertical mobile responsive flow.

8. **About Me ("A creator behind the cuts.")**:
   - Split layout on desktop, stacked on mobile.
   - Profile image with cinematic film grade, creative philosophy, mobile pacing approach, creative interests, and post-production software suite (CapCut Pro, DaVinci Resolve Studio, Premiere Pro, VN, Dehancer).

9. **Collaborator Feedback (Testimonials)**:
   - Client reviews with verified/demo placeholders and interactive collaboration card.

10. **Contact & Booking ("Let's create something worth replaying.")**:
    - Direct WhatsApp chat link using configured phone number.
    - Direct email link and Instagram DM link.
    - Fully validated contact form (React Hook Form + Zod) capturing name, email, WhatsApp, edit type, budget, delivery date, description, reference video link, and consent.

11. **Admin CMS Portal**:
    - Manage vertical video projects (create, edit, delete, reorder).
    - Manage hero copy, showreel media, bio, location, and contact numbers.
    - Track client inquiries with status pipeline (*New*, *Contacted*, *Completed*, *Archived*).
    - Firebase Firestore connection monitor with automatic fallback to local persistence.

---

## How to Customize

- **Editor Details & Showreel**: Edit `/src/data/siteConfig.ts` or click the Shield icon in the navigation bar to use the built-in Admin CMS.
- **Projects / Vertical Edits**: Edit `/src/data/projects.ts` or add new items via the Admin CMS.
- **Services**: Edit `/src/data/services.ts`.
- **Firebase Sync (Optional)**: Set `VITE_FIREBASE_PROJECT_ID` and `VITE_FIREBASE_API_KEY` in `.env`.
