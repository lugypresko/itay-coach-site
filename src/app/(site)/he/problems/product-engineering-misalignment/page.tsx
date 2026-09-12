import type { Metadata } from "next";
import Link from "next/link";

import { getSiteUrl } from "@/lib/site-url";

const canonical = `${getSiteUrl()}/he/problems/product-engineering-misalignment`;

export const metadata: Metadata = {
  title: "חוסר תיאום בין מוצר לפיתוח: מי מקבל את ההחלטה",
  description: "איך להבדיל בין בעיית תקשורת לבעיית זכויות החלטה בין מוצר לפיתוח, וניסוי הפיך אחד ל־CTO או VP R&D.",
  alternates: { canonical },
  openGraph: {
    title: "חוסר תיאום בין מוצר לפיתוח | The Push",
    description: "אבחון מעשי של חוסר תיאום בין מוצר לפיתוח וניסוי הפיך אחד.",
    url: canonical,
    type: "article",
  },
  robots: { index: true, follow: true },
};

export default function HebrewProductEngineeringMisalignmentPage() {
  return (
    <main className="content-shell" lang="he" dir="rtl">
      <header className="content-hero">
        <p className="eyebrow">עמוד בעיה</p>
        <h1>כשמוצר ופיתוח לא מסכימים, ההחלטה חוזרת למנהל</h1>
        <p className="lede">חוסר תיאום אינו תמיד בעיית תקשורת. לפעמים אין בעלים ברור להכרעה בין ערך ללקוח לבין היתכנות טכנית.</p>
        <div className="content-actions"><Link className="primary-link" href="/player-trap">הביאו מקרה אחד לאבחון</Link></div>
      </header>
      <section className="content-grid">
        <article className="content-panel content-panel-wide"><h2>התשובה הקצרה</h2><p>כאשר מוצר ופיתוח חוזרים שוב ושוב לאותה מחלוקת, בדקו שתי אפשרויות: פער מידע ותקשורת, או פער בזכויות החלטה ובמדדים. מקרה יחיד אינו מוכיח דפוס. התחילו באירוע חי, הגדירו מי מחליט, איזה מידע חסר ומה ייחשב התקדמות.</p></article>
        <article className="content-panel"><h2>שלוש סצנות מוכרות</h2><ol className="content-list"><li>השקה מתקרבת ופיתוח טוען שהפתרון אינו ישים טכנית.</li><li>מוצר טוען שהפתרון כבר אינו פותר את בעיית השוק.</li><li>ה־CTO או VP R&amp;D הופך לשופט בכל סבב.</li></ol></article>
        <article className="content-panel"><h2>שתי השערות לבדיקה</h2><ul className="content-list"><li>פער תקשורת: גילוי משותף ומידע מוקדם יפתרו את המחלוקת.</li><li>פער החלטה: אין בעלים להכרעה בין ערך לקוח, סיכון והיתכנות.</li></ul></article>
        <article className="content-panel content-panel-wide"><h2>ניסוי הפיך לשבועיים</h2><p>לפני התחייבות לדרך, ערכו סקירת גילוי משותפת. כתבו תוצאה אחת משותפת, תעדו את הוויתור או הסיכון שעדיין פתוחים, ומנו אדם אחד כבעל ההחלטה. בדקו אם יש פחות הפתעות היתכנות, פחות rework ופחות החלטות שחוזרות להנהלה.</p></article>
        <article className="content-panel content-panel-wide"><h2>מתי זה לא הפתרון</h2><p>אם הבעיה המרכזית היא מחסור בכוח אדם, מומחיות טכנית, נתוני מוצר חסרים או קונפליקט ארגוני שאין לכם סמכות לשנות, אימון מנהיגותי לבדו לא יפתור אותה. קודם צריך לקרוא למגבלה בשם.</p></article>
      </section>
    </main>
  );
}
