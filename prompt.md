

Modify and integrate a secure **email-gated download feature** for the Blazing Automations website.  

⚠️ **Important:**
- Do **not** modify or create anything unrelated to this feature.  
- Only work with the schemas, UI components, API routes, and workflows required for this **download + lead capture flow**.  

---

### Schemas

Inspect the existing **Prisma schema `ResourceDownload`** to understand how it is working.  
- Adjust or fix it **only if needed** so that it fits the workflow below.  
- Introduce a `Lead` schema (if not already present) with fields for name, email, token, tokenExpiry, status, timestamps.  

---

### Workflow

1. User clicks **Download Template** button → modal opens .  
2. Modify `download-modal.tsx` Modal form to have: name (required), email (required).  
3. On submit:  
   - Generate token + expiry (24h)  
   - Store `Lead` as `pending`  
   - Send **email via Resend**, template built with **react-email** library  
     - Subject: **"Your Blazing Automations download link"**  
     - Body: direct message with button → `https://yourdomain.com/download?token=XYZ`  
4. When user clicks the link in email directs user back to the Resource Detail new page Called downloads Page, and the page runs the token in the URL params:  
   - API verifies token validity + expiry  
   - If valid:  
     - Mark `Lead` as `confirmed`  
     - Create `ResourceDownload` entry for audit  
     - Redirect user to download page → auto-download file (workflow template)  
   - If invalid/expired:  
     - Show friendly error + option to request new link  
5. After success: thank-you page with extra tips or links.  

---

### UI

- Use **Blazing Automations palette** (dark theme with accent colors already defined for the site).  
- Modal must match existing design system.  
- Download page should auto-trigger download + show confirmation message.  

---

### Email

- Built using **react-email** templates.  
- Sent using **Resend**.  
- Keep it simple and direct (no "confirmation" wording). Example:  

  **Subject:** `Your Blazing Automations download link`  
  **Body:** includes a button → `Download Template`  

---


### Constraints

- Only create what is needed for this feature.  
- Do not alter global config, unrelated pages, or unrelated models.  
- Follow the site’s existing theme and palette.  

---
