# Culture and Media Committee Website
**Ain Shams University Faculty of Medicine Student Union (`@gilgamesh.asu`)**
**Developed by Dr. Ahmed Elkateb**

A clean, responsive, pure static website (HTML5, CSS3, Vanilla JavaScript) designed for GitHub Pages hosting with full English (`LTR`) and Arabic (`RTL`) student submission support.

---

## Color Identity (Extracted from the Gilgamesh Emblem)
- **Deep Espresso Mahogany (`#280800` / `#361006`)**: Primary header, hero, and footer surfaces
- **Warm Terracotta Rust (`#581808`)**: Secondary borders, tags, and book-page accents
- **Gilgamesh Ochre Gold (`#D89830` / `#F0B347`)**: Primary call-to-action buttons, serif headings, and highlights
- **Circuit Turquoise Cyan (`#1CA8D8`)**: Interactive verification badges and secondary highlights
- **Warm Parchment (`#FAF6F0`)**: Accessible, high-contrast reading background

---

## File Structure
```text
├── index.html           # Home Page (Hero with Join Book Club & Submit Work CTAs, Priority Cards, Upcoming Event, 3 Highlights)
├── join-book-club.html  # Dedicated Page for Joining Gilgamesh Book Club (Official Google Form Embed)
├── book-club.html       # Gilgamesh Book Club (Current Read, Bilingual Meetup, Past Reads Archive)
├── zine.html            # Creative Zine (Filterable LTR/RTL Cards + On-Page Reader Modal)
├── gallery.html         # Media & Productions Gallery (Filterable Portfolio + Fullscreen Lightbox)
├── submit.html          # Submit Work Page (Submission Guidelines + Responsive Google Form Embed)
├── verify.html          # Volunteer Certificate Verification Portal
├── certificates.json    # Official Certificate Registry queried by verify.html
├── css/
│   └── styles.css       # Responsive stylesheet with LTR & RTL Arabic typography support
├── js/
│   └── main.js          # Vanilla JS for modals, filters, lightbox, and certificate lookup
└── assets/              # Official Gilgamesh logo and committee illustrations
```

---

## Quick Admin Guide (For Committee Heads)

### 1. How to Add a New Volunteer Certificate (`certificates.json`)
1. Open `certificates.json` in GitHub and click the **Edit (pencil)** icon.
2. Copy the last `{ ... }` block, add a comma `,` after the previous block, and update the fields:
```json
  {
    "cert_id": "SU-CCM-1006",
    "name": "Student Full Name",
    "role": "Volunteer Role",
    "issue_date": "2026-11-01",
    "status": "Valid"
  }
```
3. Click **Commit changes**. The certificate is immediately verifiable on `verify.html`.

### 2. How to Add a New Student Zine Article or Poem (`zine.html`)
1. Open `zine.html` and scroll to the `<!-- ADMIN WORKFLOW GUIDE FOR ADDING NEW ZINE SUBMISSIONS -->` comment.
2. Copy any `<article class="card zine-item" ...>...</article>` block.
3. For **Arabic** submissions, set `dir="rtl"` on the `<article>` tag. For **English** submissions, set `dir="ltr"`.
4. Set `data-category="Poetry"` (or `"Essay"`, `"Short Story"`, `"Visual Works"`).
5. Put the short card preview inside `<p class="card-text">` and the full text inside `<div class="zine-full-content" style="display:none;">`.

### 3. How to Update the Google Form Embeds (`join-book-club.html` & `submit.html`)
- `join-book-club.html` is pre-configured with your official Gilgamesh Book Club joining Google Form (`https://docs.google.com/forms/d/1ZKhGyqX1LF2AKDdF0JavJSjbtBNHt_Te327P7kWLVZI/viewform?embedded=true`).
- `submit.html` has a separate Google Form embed container for student works submissions—simply replace its `<iframe>` `src` URL with your works submission Google Form link whenever needed.
