// Hebrew is the default language (served at /), English lives under /en/.
export type Lang = 'he' | 'en';
export type T = { he: string; en: string };
export const langs: Lang[] = ['he', 'en'];

export const dir = (l: Lang) => (l === 'he' ? 'rtl' : 'ltr');

/** Build a localized path: url('he', '/about/') → '/about/', url('en', '/about/') → '/en/about/' */
export const url = (l: Lang, p = '/') => (l === 'he' ? p : `/en${p === '/' ? '/' : p}`);

/** Strip the language prefix from a pathname. */
export const basePath = (pathname: string) => pathname.replace(/^\/en(?=\/|$)/, '') || '/';

export const ui = {
  role: { he: 'מעצב גרפי', en: 'Graphic Designer' },
  location: { he: 'ישראל', en: 'Israel' },
  available: { he: 'פתוח לפרויקטים', en: 'Available for freelance' },
  name: { he: 'אור אסיף-הבר', en: 'Or Asif-Haber' },
  nameLines: { he: ['אור', 'אסיף-הבר'], en: ['Or Asif-', 'Haber'] },
  description: {
    he: 'אור אסיף-הבר — מעצב גרפי שבונה עולמות ויזואליים למסיבות טראנס, לייבלים ואמנים: פוסטרים, מיתוג מסיבות, עטיפות אלבום וזהויות מותג.',
    en: 'Or Asif-Haber is a graphic designer building visual worlds for psytrance parties, record labels and artists — line-up posters, party branding, cover art and brand identities.',
  },
  nav: {
    work: { he: 'עבודות', en: 'Work' },
    about: { he: 'אודות', en: 'About' },
    contact: { he: 'צור קשר', en: 'Contact' },
  },
  switchTo: { he: 'English', en: 'עברית' },
  switchLabel: { he: 'Switch to English', en: 'מעבר לעברית' },
  skip: { he: 'דלג לתוכן', en: 'Skip to content' },
  hero: {
    statement: {
      he: 'אני בונה את העולמות הוויזואליים סביב מסיבות טראנס, לייבלים ואמנים — פוסטרים, ליינאפים, מיתוג מסיבות ועטיפות אלבום — וגם זהויות מותג מחוץ לרחבה.',
      en: 'I build the visual worlds around psytrance parties, record labels and artists — line-up posters, party branding and cover art — and brand identities beyond the dance floor.',
    },
    years: { he: 'עבודות נבחרות 2024–2026', en: 'Selected work 2024–2026' },
    toWork: { he: 'לעבודות', en: 'Selected work' },
    toContact: { he: 'השאירו פרטים', en: 'Get in touch' },
  },
  work: { he: 'עבודות', en: 'Work' },
  projects: { he: 'פרויקטים', en: 'projects' },
  viewProject: { he: 'לפרויקט', en: 'View project' },
  meta: {
    client: { he: 'לקוח', en: 'Client' },
    year: { he: 'שנה', en: 'Year' },
    discipline: { he: 'תחום', en: 'Discipline' },
    tools: { he: 'כלים', en: 'Tools' },
  },
  overview: { he: 'על הפרויקט', en: 'Overview' },
  gallery: { he: 'גלריה', en: 'Gallery' },
  behance: { he: 'לצפייה ב-Behance', en: 'View on Behance' },
  next: { he: 'הפרויקט הבא', en: 'Next project' },
  allProjects: { he: 'כל העבודות', en: 'All projects' },
  of: { he: 'מתוך', en: 'of' },
  breadcrumb: { he: 'מיקום בדף', en: 'Breadcrumb' },
  moreProjects: { he: 'פרויקטים נוספים', en: 'More projects' },
  about: {
    label: { he: 'אודות', en: 'About' },
    preview: {
      he: 'מעצב גרפי, הנדסאי תקשורת חזותית (אוניברסיטת אריאל), עובד כפרילנסר מאז 2024. אני עובד ישירות מול הלקוחות מהבריף ועד המסירה — גיבוש הכיוון הקריאייטיבי, עיצוב ותיקונים — כולל עבודה חוזרת עם StoneAge Records, לייבל פסייטראנס שוודי.',
      en: 'Graphic designer and Visual Communication graduate (Ariel University), freelancing since 2024. I work directly with clients from the brief to final delivery — shaping the creative direction, designing, revising — including repeat work for StoneAge Records, a Swedish psytrance label.',
    },
    more: { he: 'עוד עליי', en: 'More about me' },
    workedWith: { he: 'עבדתי עם', en: 'Worked with' },
  },
  contact: {
    label: { he: 'צור קשר', en: 'Contact' },
    title: { he: 'יש לכם פרויקט?', en: 'Have a project?' },
    note: {
      he: 'מיתוג מסיבה, פוסטר ליינאפ, עטיפת אלבום או זהות מותג — השאירו פרטים עם כמה מילים על הפרויקט ותאריכים, ואחזור אליכם.',
      en: 'Party branding, a line-up poster, cover art or a brand identity — leave your details with a few words about the project and dates, and I’ll get back to you.',
    },
    orEmail: { he: 'או כתבו ישירות', en: 'Or write directly' },
    copy: { he: 'העתקת מייל', en: 'Copy email' },
    copied: { he: 'הועתק', en: 'Copied' },
    form: {
      name: { he: 'שם', en: 'Name' },
      email: { he: 'אימייל', en: 'Email' },
      phone: { he: 'טלפון', en: 'Phone' },
      message: { he: 'על הפרויקט', en: 'About the project' },
      messageHint: { he: 'סוג הפרויקט, תאריכים, כל מה שחשוב לדעת', en: 'Type of project, dates, anything worth knowing' },
      optional: { he: 'רשות', en: 'optional' },
      required: { he: 'שדה חובה', en: 'Required' },
      contactHint: { he: 'אימייל או טלפון — לפחות אחד מהם', en: 'Email or phone — at least one' },
      errName: { he: 'נא למלא שם', en: 'Please enter your name' },
      errEmail: { he: 'כתובת האימייל לא תקינה', en: 'That email address doesn’t look right' },
      errPhone: { he: 'מספר הטלפון לא תקין', en: 'That phone number doesn’t look right' },
      errContact: { he: 'נא להשאיר אימייל או טלפון', en: 'Please leave an email or a phone number' },
      submit: { he: 'שליחה', en: 'Send' },
      sending: { he: 'שולח…', en: 'Sending…' },
      success: { he: 'תודה! הפרטים התקבלו ואחזור אליכם בהקדם.', en: 'Thanks! Your details came through — I’ll get back to you soon.' },
      error: { he: 'משהו השתבש בשליחה. נסו שוב או כתבו ישירות למייל.', en: 'Something went wrong. Please try again or email me directly.' },
    },
  },
  footer: { top: { he: 'חזרה למעלה', en: 'Back to top' } },
  notFound: {
    title: { he: 'העמוד לא נמצא', en: 'Page not found' },
    body: { he: 'העמוד הזה לא קיים — העבודות כן.', en: 'This page doesn’t exist — the work does.' },
    cta: { he: 'לכל העבודות', en: 'See all projects' },
  },
} as const;

/** Arrow pointing "forward" in reading direction. */
export const fwd = (l: Lang) => (l === 'he' ? '←' : '→');
export const back = (l: Lang) => (l === 'he' ? '→' : '←');
