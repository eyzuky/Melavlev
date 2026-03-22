# מלבלב — אתר רשמי | Melavlev — Official Website

## הרצה מקומית / Local Development
```bash
npm install
npm run dev
```

## פריסה / Deployment
```bash
npm run build
# העלה את תיקיית dist/ לכל שירות סטטי (Netlify, Vercel, GitHub Pages)
# Upload the dist/ folder to any static hosting service
```

## ניהול תוכן / Content Management

### עדכון תוכן טקסטואלי / Updating Text Content
1. פתחו את **Google Sheets — "מלבלב – ניהול תוכן"**
2. מצאו את הטאב הרלוונטי (בית / מודל / אימפקט...)
3. ערכו את התא בעמודה `value_he` (עברית) או `value_en` (אנגלית)
4. שמרו — השינוי יופיע באתר תוך כ-60 שניות

### Updating Text Content (English)
1. Open **Google Sheets — "מלבלב – ניהול תוכן"**
2. Find the relevant tab (home / model / impact...)
3. Edit the cell in the `value_en` column (third column)
4. Save — the change appears on the website within ~60 seconds
5. If `value_en` is left empty, the website shows the Hebrew text as fallback

### עדכון תמונות / Updating Images
1. גללו לתיקיית Google Drive **"תמונות אתר מלבלב"**
2. העלו את התמונה החדשה
3. וודאו ששיתוף מוגדר "כל מי שיש לו קישור — צופה"
4. העתיקו את ה-**File ID** מהURL (החלק בין `/d/` ל-`/view`)
5. פתחו את טאב `images` בגיליון
6. הדביקו את ה-File ID בעמודה `drive_file_id`

## החלפת תמונות זמניות / Replacing Placeholder Images
חפש בקוד: `imageKey` props ב-`CMSImage` components.
הוסיפו את ה-file IDs המתאימים בטאב `images` בגיליון.

## חיבור טופס / Form Integration
חפש: `INTEGRATION` comments in `ContactForm.jsx`.
Connect to Netlify Forms, EmailJS, or a Vercel serverless function.

## יצירת קשר / Contact
wearemelavlev@gmail.com | 054-204-0111
