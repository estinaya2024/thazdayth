# 📚 File: server/src/routes/oilQuality.js

### 🌟 GLOBAL OVERVIEW
The `oilQuality` endpoint acts as the **Calculator Control Panel**. It serves the mathematical baseline values for different oil grades (Extra Virgin, Virgin, Third Quality) to the frontend, and allows the admin to tweak these agricultural algorithms.

---

### 1. Role in the Project
It powers the "Estimation Calculator" on the homepage. Without this route, the frontend wouldn't know how much oil 100kg of olives is supposed to produce this season.

### 2. Connection with Other Files
- **To `OilQualitySetting.ts` (Model)**: Modifies the underlying grading rules.
- **To `Calculator.tsx` (Frontend)**: Delivers the base coefficients needed for real-time math.

### 3. Code Breakdown & Step-by-Step Logic

#### A) Providing the Coefficients (Public)
```javascript
router.get('/', async (req, res) => {
    const qualities = await OilQualitySetting_1.OilQualitySetting.find();
    res.json(qualities);
});
```
- **WHAT?** A public `GET` request. 
- **WHY?** The calculator on the public homepage needs to execute accurate math before the user is even logged in. Delivering these settings anonymously is safe because they are just broad agricultural estimates, not private data.

#### B) Tweaking the Algorithm (Admin Only)
```javascript
router.put('/:quality', auth_1.authenticate, auth_1.ownerOnly, async (req, res) => {
    // 1. URL Path Verification
    const validQualities = ['extra_virgin', 'virgin', 'third_quality'];
    if (!validQualities.includes(req.params.quality)) {
        return res.status(400).json({ message: 'Qualité invalide.' });
    }

    // 2. Database Update
    const setting = await OilQualitySetting_1.OilQualitySetting.findOneAndUpdate(
        { quality_name: req.params.quality }, 
        req.body, 
        { new: true }
    );
    // ...
});
```
- **WHAT?** An admin-only `PUT` request targeting a specific oil grade via the URL (e.g., `/api/oil-quality/extra_virgin`).
- **WHY THE VALIDATION?** Before even touching the database, we check if `req.params.quality` is completely valid. If an admin tries to hit `/api/oil-quality/fake_oil`, it gets blocked immediately. 
- **WHY NOT UPSERT?** Unlike the global `Settings.ts` route, we do not use `upsert: true` here. We expect these three exact qualities to be pre-seeded into the database on day one. If the admin tries to update a quality that doesn't exist, we purposely return a `404 Not Found` error.

### 4. Syntax & Keywords Explained
- **`req.params.quality` vs `req.body.quality`**: 
    - `params` comes from the URL itself (`/api/oil-quality/THE_PARAM`).
    - `body` comes from the hidden JSON data attached to the request (the form inputs).
    - Here, the URL dictates *which* document to find, and the body dictates *what* values to change.

---

### 🎓 Teacher's Q&A Section
1. **Can the admin create a new "Fourth Quality" grade using this API?**
   - **Answer**: No! This API only has a `GET` and a `PUT`. There is explicitly no `POST` route. The system is structurally locked to three grades across the frontend forms, backend schemas, and database rules to prevent UI breakdown.
2. **If the admin changes the yield estimation from 20% to 15%, do old pressing requests change?**
   - **Answer**: No! Because when a user submits a pressing request, the `orders.js` and `pressing.js` controllers take a *Snapshot* of the yield and save it permanently into the request document. Changing the general estimator here only affects *future* requests.

---

### 🎙️ Presentation Script
"The Oil Quality API demonstrates architectural lockdown. By intentionally omitting a 'POST' or 'DELETE' endpoint, we structurally enforce our three-tier grading system (Extra Virgin, Virgin, Third Quality) across the entire stack. We only expose a highly-validated 'PUT' endpoint, giving the administrator the flexibility to adjust seasonal agricultural yields and processing costs without risking the foundational integrity of the platform's forms."
