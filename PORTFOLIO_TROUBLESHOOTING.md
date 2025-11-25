# Portfolio Upload Troubleshooting Guide

## Quick Fixes

### 1. Fixed Cloudinary URL ✅

The URL is now correct. The upload preset needs to be configured in your Cloudinary dashboard.

### 2. Check These First

#### A. Did you run the database migration?

**Error symptom**: "relation 'portfolio' does not exist" or similar

**Fix**:

1. Go to Supabase Dashboard → SQL Editor
2. Copy contents of `supabase/migrations/create_portfolio_table.sql`
3. Paste and run
4. Verify portfolio table exists

#### B. Cloudinary Upload Preset

**Error symptom**: "Upload preset not found" or 400 error when uploading image

**Fix**:

1. Go to https://cloudinary.com/console
2. Settings → Upload → Upload Presets
3. Click "Add upload preset"
4. Name it: `ml_default` (or change the name in code)
5. Set to "Unsigned"
6. **Folder**: `Gr8QMTechnovates/Images/portfolio`
7. Save

#### C. Environment Variable

**Error symptom**: "Cloudinary cloud name not configured"

**Fix**: Check `.env` file has:

```
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

---

## Debug Steps

### Step 1: Open Browser Console

1. Go to `/admin/portfolio`
2. Open DevTools (F12)
3. Go to Console tab
4. Try adding a portfolio item
5. **What errors do you see?**

### Step 2: Check Network Tab

1. Open DevTools → Network tab
2. Try uploading an image
3. Look for failed requests (red)
4. Click on the failed request
5. Check Response tab
6. **Share the error message**

### Step 3: Test Without Image First

Try creating a portfolio item with a direct image URL (skip upload):

1. Find an image URL (e.g., from Unsplash)
2. In the form, don't upload
3. Manually paste URL in image_url field (you'll need to modify form temporarily)
4. See if it saves

---

## Common Errors & Solutions

### Error: "Upload preset must be whitelisted for unsigned uploads"

**This is the current error!** It means your Cloudinary setting is "Signed" instead of "Unsigned".

**Fix**:

1. Go to **Cloudinary Console** → **Settings** (gear icon) → **Upload**
2. Scroll down to **Upload presets**
3. Find `ml_default` (or create it if missing)
4. Click **Edit**
5. Change **Signing Mode** from "Signed" to **"Unsigned"**
6. Save
7. Try uploading again (no code change needed)

### Error: "Upload preset not found"

**Solution**: Create `ml_default` upload preset in Cloudinary (see Fix B above)

### Error: "portfolio table does not exist"

**Solution**: Run the database migration (see Fix A above)

### Error: Image uploads but form doesn't submit

**Check**:

- Browser console for errors
- Is the form validated?
- Are all required fields filled?

### Error: "Failed to upload to Cloudinary"

**Check**:

- Is `VITE_CLOUDINARY_CLOUD_NAME` in`.env`?
- Is Cloudinary upload preset created?
- Is the image file too large? (try a smaller image)

---

## Alternative: Simpler Upload Method

If you want to skip Cloudinary for now and test the rest:

**Option 1**: Use image URLs directly

- Find images online
- Use their URLs
- Skip the upload step

**Option 2**: Temporary placeholder

```typescript
// In PortfolioForm.tsx, replace handleImageUpload with:
const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  // Temporary: use a placeholder
  setFormData((prev) => ({
    ...prev,
    image_url: "https://via.placeholder.com/400x300",
  }));
};
```

---

## What to Share

To help debug, please share:

1. **Console error message** (if any)
2. **Network tab** error details
3. **Which step fails**:

   - [ ] Clicking "Add Portfolio Item"
   - [ ] Uploading image
   - [ ] Filling form
   - [ ] Clicking "Create"
   - [ ] After submission

4. **Have you**:
   - [ ] Run the database migration?
   - [ ] Created Cloudinary upload preset?
   - [ ] Verified env variable exists?

---

## Test Cloudinary Setup

Run this in browser console to test Cloudinary:

```javascript
const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
console.log("Cloud name:", cloudName);

// Test if available
if (!cloudName) {
  console.error("❌ VITE_CLOUDINARY_CLOUD_NAME not set!");
} else {
  console.log("✅ Cloudinary configured with:", cloudName);
}
```

---

## Next Steps

1. Check browser console for specific error
2. Try the appropriate fix above
3. If still not working, share the error message
