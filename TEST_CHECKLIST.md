# Quick Test Checklist

## Before Testing
- [ ] Backend running: `python server.py`
- [ ] Frontend running: `npm start`
- [ ] MongoDB running
- [ ] Check backend logs for errors

## Test 1: Submit Bug Report (Any User)
Steps:
1. Login to the app
2. Navigate to **Bug Reports** page
3. Click blue **"Report Bug"** button
4. Fill form:
   - Description: "Test button is broken"
   - Priority: "High"
   - Page: "Dashboard"
   - Browser: "Chrome"
5. Click **"Submit Bug Report"**

Expected:
- ✅ Blue success toast
- ✅ Modal closes
- ✅ New bug appears in list
- ✅ Admin receives WhatsApp notification

If fails:
- [ ] Check browser console for errors
- [ ] Check backend logs: `ERROR` messages
- [ ] Verify form fields are filled
- [ ] Check API URL in .env: `REACT_APP_BACKEND_URL`

---

## Test 2: View Bug Reports (Non-Admin User)
Steps:
1. Login as non-admin user
2. Go to **Bug Reports** page
3. Look at the list

Expected:
- ✅ Page loads without "Loading reports..." spinning
- ✅ Shows open and in_progress bugs only
- ✅ **Status dropdown is HIDDEN**
- ✅ **"Fix with AI" button is HIDDEN**
- ✅ Can see "Report Bug" button

If fails:
- [ ] Check console error: `console.error` message
- [ ] Check backend logs for 403/auth errors
- [ ] Verify token is stored in localStorage
- [ ] Check API response in Network tab

---

## Test 3: Admin Access
Steps:
1. Login as admin user
2. Go to **Bug Reports** page
3. Look at the list

Expected:
- ✅ Page loads instantly
- ✅ Shows **ALL** bugs (any status)
- ✅ **Status dropdown is VISIBLE**
- ✅ **"Fix with AI" button is VISIBLE**
- ✅ Can click dropdown and change status
- ✅ Can click "Fix with AI" button

If fails:
- [ ] Check `user?.role` value in component
- [ ] Check localStorage token validity
- [ ] Verify admin status in database

---

## Test 4: AI Bug Analysis (Admin Only)
Steps:
1. Login as admin
2. Go to **Bug Reports** page
3. Find a bug with status="open"
4. Click **"Fix with AI"** button

Expected:
- ✅ Button shows "Analyzing..." state
- ✅ After 3-5 seconds: Modal opens
- ✅ Shows Gemini's plain English explanation
- ✅ Can click "Confirm & Apply Fix" or "Cancel"

If fails:
- [ ] Check console errors
- [ ] Verify Gemini API key in backend
- [ ] Check MongoDB `bug_analyses` collection created
- [ ] Look for HTTP errors in Network tab

---

## Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| "Failed to load bug reports" message stays | API error happening | Check console/backend logs |
| "Report Bug" button doesn't open modal | State not updating | Check React DevTools |
| Form won't submit | Validation failed | Fill all required fields |
| No "Fix with AI" button appears | Not admin user OR button is hidden | Login as admin |
| Status dropdown appears for non-admin | Role check failed | Clear localStorage, re-login |
| Gemini analysis fails | API not configured | Add GEMINI_API_KEY to .env |

---

## Debug Mode

### Show Console Logs
Open DevTools (F12) → Console tab
Look for:
- `Bug reports fetch error:` (frontend API error)
- `Analysis failed:` (AI error)
- Any red `❌` errors

### Check Backend Logs
Terminal running backend:
Look for:
- `ERROR` in red
- `Bug analysis error:`
- `Traceback` (Python exception)

### Check MongoDB
```bash
# Connect to MongoDB
mongosh

# Check collections
use xac_crm  # or your DB name
db.bug_reports.find().pretty()
db.bug_analyses.find().pretty()
```

---

## Success Criteria

All tests pass when:
- ✅ Non-admin users can submit bugs
- ✅ Non-admin users can view open bugs only
- ✅ Admin users can view all bugs
- ✅ Admin users can analyze with AI
- ✅ Admin users can change status
- ✅ No 403/permission errors
- ✅ No JavaScript console errors
- ✅ Notifications work (toast)

**If all tests pass: System is ready to use! 🚀**
