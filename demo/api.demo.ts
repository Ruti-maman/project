import axios from "axios";
import type { InternalAxiosRequestConfig, AxiosResponse } from "axios";

/*
 * גרסת הדמו של services/api.ts.
 * ב-GitHub Pages אין שרת, אז במקום להחליף את כל שכבת השירותים אנחנו מחליפים
 * רק את ה-adapter של axios - כל שאר הקוד (Services, Stores, Pages) לא יודע בכלל
 * שהוא לא מדבר עם ה-API האמיתי.
 */

const DB_KEY = "helpdesk-demo-db";

type Role = "admin" | "agent" | "customer";

interface DemoUser {
  id: number;
  name: string;
  email: string;
  role: Role;
  created_at: string;
}

interface DemoLookup {
  id: number;
  name: string;
}

interface DemoTicket {
  id: number;
  subject: string;
  description: string;
  status_id: number | null;
  priority_id: number | null;
  created_by: number;
  assigned_to: number | null;
  created_at: string;
  updated_at: string | null;
}

interface DemoComment {
  id: number;
  ticket_id: number;
  author_id: number;
  content: string;
  created_at: string;
}

interface DemoDb {
  users: DemoUser[];
  statuses: DemoLookup[];
  priorities: DemoLookup[];
  tickets: DemoTicket[];
  comments: DemoComment[];
  nextId: number;
}

/* ---------------------------------------------------------------- הזרעת נתונים */

// התאריכים נגזרים מ"עכשיו" כדי שהדמו לא ייראה נטוש אחרי כמה חודשים
const daysAgo = (days: number): string =>
  new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

function seed(): DemoDb {
  return {
    users: [
      {
        id: 1,
        name: "נועה אלמוג",
        email: "admin@demo.com",
        role: "admin",
        created_at: daysAgo(90),
      },
      {
        id: 2,
        name: "איתי ברזילי",
        email: "agent@demo.com",
        role: "agent",
        created_at: daysAgo(80),
      },
      {
        id: 3,
        name: "מיכל שרון",
        email: "customer@demo.com",
        role: "customer",
        created_at: daysAgo(60),
      },
    ],
    statuses: [
      { id: 1, name: "חדש" },
      { id: 2, name: "בטיפול" },
      { id: 3, name: "ממתין ללקוח" },
      { id: 4, name: "נסגר" },
    ],
    priorities: [
      { id: 1, name: "נמוכה" },
      { id: 2, name: "רגילה" },
      { id: 3, name: "גבוהה" },
      { id: 4, name: "דחופה" },
    ],
    tickets: [
      {
        id: 101,
        subject: "לא מצליחה להתחבר לאפליקציה",
        description: "אחרי עדכון הסיסמה המערכת מודיעה שהפרטים שגויים.",
        status_id: 2,
        priority_id: 3,
        created_by: 3,
        assigned_to: 2,
        created_at: daysAgo(6),
        updated_at: daysAgo(1),
      },
      {
        id: 102,
        subject: "החיוב החודשי נראה כפול",
        description: "בחשבונית של החודש מופיעים שני חיובים זהים.",
        status_id: 1,
        priority_id: 4,
        created_by: 3,
        assigned_to: null,
        created_at: daysAgo(4),
        updated_at: null,
      },
      {
        id: 103,
        subject: "בקשה להוספת משתמש לצוות",
        description: "צריכה להוסיף עובדת חדשה עם הרשאות צפייה בלבד.",
        status_id: 3,
        priority_id: 2,
        created_by: 3,
        assigned_to: 2,
        created_at: daysAgo(9),
        updated_at: daysAgo(3),
      },
      {
        id: 104,
        subject: "הדוח החודשי לא נטען",
        description: "מסך הדוחות נשאר בטעינה אינסופית בדפדפן כרום.",
        status_id: 2,
        priority_id: 3,
        created_by: 3,
        assigned_to: 2,
        created_at: daysAgo(2),
        updated_at: daysAgo(1),
      },
      {
        id: 105,
        subject: "שינוי כתובת למשלוח חשבונית",
        description: "עברנו משרד, צריך לעדכן את הכתובת בחשבוניות.",
        status_id: 4,
        priority_id: 1,
        created_by: 3,
        assigned_to: 2,
        created_at: daysAgo(21),
        updated_at: daysAgo(18),
      },
      {
        id: 106,
        subject: "האפליקציה קורסת בפתיחת מסך ההגדרות",
        description: "לחיצה על ההגדרות סוגרת את האפליקציה מיד.",
        status_id: 1,
        priority_id: 4,
        created_by: 3,
        assigned_to: null,
        created_at: daysAgo(1),
        updated_at: null,
      },
    ],
    comments: [
      {
        id: 201,
        ticket_id: 101,
        author_id: 3,
        content: "ניסיתי גם מהנייד וגם מהמחשב, אותה שגיאה.",
        created_at: daysAgo(6),
      },
      {
        id: 202,
        ticket_id: 101,
        author_id: 2,
        content: "היי מיכל, אפסתי לך את הסיסמה בצד שלנו. תנסי שוב בבקשה.",
        created_at: daysAgo(5),
      },
      {
        id: 203,
        ticket_id: 101,
        author_id: 3,
        content: "נכנסתי! תודה רבה על הטיפול המהיר.",
        created_at: daysAgo(1),
      },
      {
        id: 204,
        ticket_id: 103,
        author_id: 2,
        content: "אשמח לקבל את המייל של העובדת החדשה כדי לפתוח לה משתמש.",
        created_at: daysAgo(3),
      },
      {
        id: 205,
        ticket_id: 104,
        author_id: 2,
        content: "שחזרנו את התקלה, מעבירים לצוות הפיתוח.",
        created_at: daysAgo(1),
      },
      {
        id: 206,
        ticket_id: 105,
        author_id: 2,
        content: "הכתובת עודכנה במערכת החיוב.",
        created_at: daysAgo(19),
      },
      {
        id: 207,
        ticket_id: 105,
        author_id: 3,
        content: "מצוין, אפשר לסגור את הקריאה.",
        created_at: daysAgo(18),
      },
    ],
    nextId: 1000,
  };
}

/* ---------------------------------------------------------------- שכבת אחסון */

let db: DemoDb = load();

function load(): DemoDb {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as DemoDb;
      // מגן על עצמנו מפני מבנה ישן ששרד ב-localStorage אחרי דיפלוי
      if (parsed && parsed.users && parsed.tickets && parsed.statuses) {
        return parsed;
      }
    }
  } catch (e) {
    /* אין טעם להפיל את הדמו בגלל אחסון פגום */
  }
  const fresh = seed();
  persist(fresh);
  return fresh;
}

function persist(next: DemoDb): void {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(next));
  } catch (e) {
    /* מצב פרטי בדפדפן - הדמו ימשיך לעבוד, פשוט בלי לשרוד רענון */
  }
}

const save = (): void => persist(db);

declare global {
  interface Window {
    __resetDemo?: () => void;
  }
}

if (typeof window !== "undefined") {
  window.__resetDemo = () => {
    localStorage.removeItem(DB_KEY);
    localStorage.removeItem("token");
    db = seed();
    save();
    window.location.reload();
  };
}

/* ---------------------------------------------------------------- טוקנים */

const base64url = (value: string): string =>
  btoa(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

// לא JWT אמיתי - רק נראה כמו אחד, כדי שה-localStorage והכלים ייראו מוכרים
function makeToken(user: DemoUser): string {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = base64url(
    JSON.stringify({ sub: user.id, role: user.role, iat: now, exp: now + 86400 })
  );
  return header + "." + payload + ".ZGVtby1zaWduYXR1cmU";
}

function userFromToken(token: string | null): DemoUser | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    const json = atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"));
    const payload = JSON.parse(json) as { sub?: number };
    const found = db.users.filter((u) => u.id === payload.sub);
    return found.length > 0 ? found[0] : null;
  } catch (e) {
    return null;
  }
}

function readAuthHeader(config: InternalAxiosRequestConfig): string | null {
  const headers = config.headers as unknown as
    | { Authorization?: unknown; authorization?: unknown }
    | undefined;
  if (!headers) return null;
  const raw = headers.Authorization || headers.authorization;
  if (typeof raw !== "string") return null;
  return raw.replace(/^Bearer\s+/i, "");
}

/* ---------------------------------------------------------------- שגיאות */

interface ErrorBody {
  message: string;
}

class DemoApiError extends Error {
  isAxiosError = true;
  code = "ERR_BAD_REQUEST";
  config: InternalAxiosRequestConfig;
  response: {
    status: number;
    statusText: string;
    data: ErrorBody;
    headers: Record<string, string>;
    config: InternalAxiosRequestConfig;
  };

  constructor(
    status: number,
    message: string,
    config: InternalAxiosRequestConfig
  ) {
    super(message);
    Object.setPrototypeOf(this, DemoApiError.prototype);
    this.name = "AxiosError";
    this.config = config;
    this.response = {
      status,
      statusText: message,
      data: { message },
      headers: {},
      config,
    };
  }
}

// בדיקת דגל ולא instanceof - כך זה עובד גם אם ה-build מוריד גרסה ל-ES5
const isDemoError = (x: AxiosResponse<unknown> | DemoApiError): x is DemoApiError =>
  (x as DemoApiError).isAxiosError === true;

function ok<T>(
  data: T,
  status: number,
  config: InternalAxiosRequestConfig
): AxiosResponse<T> {
  return {
    data,
    status,
    statusText: status === 201 ? "Created" : "OK",
    headers: {},
    config,
  };
}

/* ---------------------------------------------------------------- תצוגות */

const nameOf = (list: DemoLookup[], id: number | null): string | null => {
  if (id === null) return null;
  const hit = list.filter((x) => x.id === id);
  return hit.length > 0 ? hit[0].name : null;
};

const userById = (id: number | null): DemoUser | null => {
  if (id === null) return null;
  const hit = db.users.filter((u) => u.id === id);
  return hit.length > 0 ? hit[0] : null;
};

// ה-UI קורא לשדות בכמה שמות שונים (assigned_name / agent_name / agent.name),
// אז מחזירים את כולם ונותנים לכל מסך לבחור את מה שנוח לו
function ticketView(t: DemoTicket): Record<string, unknown> {
  const statusName = nameOf(db.statuses, t.status_id);
  const priorityName = nameOf(db.priorities, t.priority_id);
  const customer = userById(t.created_by);
  const agent = userById(t.assigned_to);

  return {
    id: t.id,
    subject: t.subject,
    description: t.description,
    status_id: t.status_id,
    priority_id: t.priority_id,
    status_name: statusName,
    priority_name: priorityName,
    status: statusName || "חדש",
    created_by: t.created_by,
    user_id: t.created_by,
    customer_name: customer ? customer.name : null,
    user: customer
      ? { id: customer.id, name: customer.name, role: customer.role }
      : undefined,
    assigned_to: t.assigned_to,
    agent_id: t.assigned_to,
    assigned_name: agent ? agent.name : null,
    agent_name: agent ? agent.name : null,
    assigned_user: agent ? { id: agent.id, name: agent.name } : undefined,
    agent: agent ? { id: agent.id, name: agent.name } : undefined,
    created_at: t.created_at,
    updated_at: t.updated_at,
  };
}

function commentView(c: DemoComment): Record<string, unknown> {
  const author = userById(c.author_id);
  const role = author ? author.role : "customer";
  return {
    id: c.id,
    ticket_id: c.ticket_id,
    author_id: c.author_id,
    user_id: c.author_id,
    content: c.content,
    body: c.content,
    author_name: author ? author.name : "משתמש",
    author_email: author ? author.email : null,
    author_role: role,
    is_agent: role === "agent" || role === "admin",
    created_at: c.created_at,
  };
}

// TicketPage לא קורא ל-/comments בנפרד - הוא מצפה שהתגובות יגיעו בתוך הטיקט
function ticketDetailView(t: DemoTicket): Record<string, unknown> {
  const view = ticketView(t);
  view.comments = db.comments
    .filter((c) => c.ticket_id === t.id)
    .map(commentView);
  return view;
}

const publicUser = (u: DemoUser): Record<string, unknown> => ({
  id: u.id,
  name: u.name,
  email: u.email,
  role: u.role,
  created_at: u.created_at,
});

/* ---------------------------------------------------------------- ניתוב */

const toInt = (value: string): number => {
  const n = parseInt(value, 10);
  return isNaN(n) ? -1 : n;
};

function parseBody(raw: unknown): Record<string, unknown> {
  if (typeof raw === "string" && raw.length > 0) {
    try {
      return JSON.parse(raw) as Record<string, unknown>;
    } catch (e) {
      return {};
    }
  }
  if (raw && typeof raw === "object") return raw as Record<string, unknown>;
  return {};
}

const str = (v: unknown): string => (typeof v === "string" ? v : "");
const num = (v: unknown): number | null => {
  if (typeof v === "number" && !isNaN(v)) return v;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    return isNaN(n) ? null : n;
  }
  return null;
};

// ה-role שנבחר במסכי הניהול הוא "client", בעוד שאר המערכת מדברת "customer"
function normalizeRole(value: unknown): Role {
  const r = str(value).toLowerCase();
  if (r === "admin") return "admin";
  if (r === "agent") return "agent";
  return "customer";
}

function handle(
  config: InternalAxiosRequestConfig
): AxiosResponse<unknown> | DemoApiError {
  const method = (config.method || "get").toLowerCase();
  const path = (config.url || "").split("?")[0].replace(/\/+$/, "");
  const seg = path.split("/").filter((p) => p.length > 0);
  const body = parseBody(config.data);
  const fail = (status: number, message: string): DemoApiError =>
    new DemoApiError(status, message, config);

  /* --- אימות --- */

  if (path === "/auth/login" && method === "post") {
    const email = str(body.email).trim().toLowerCase();
    const matches = db.users.filter((u) => u.email.toLowerCase() === email);
    if (matches.length === 0) {
      return fail(401, "אימייל או סיסמה שגויים");
    }
    // בדמו כל סיסמה מתקבלת - אין טעם לחסום מישהו מחוץ למסך הכניסה
    const user = matches[0];
    return ok({ token: makeToken(user), user: publicUser(user) }, 200, config);
  }

  if (path === "/auth/register" && method === "post") {
    const email = str(body.email).trim().toLowerCase();
    const name = str(body.name).trim();
    if (!email || !name) return fail(400, "חסרים שם או אימייל");
    if (db.users.filter((u) => u.email.toLowerCase() === email).length > 0) {
      return fail(409, "האימייל הזה כבר רשום במערכת");
    }
    const user: DemoUser = {
      id: db.nextId++,
      name,
      email,
      role: "customer",
      created_at: new Date().toISOString(),
    };
    db.users.push(user);
    save();
    return ok({ token: makeToken(user), user: publicUser(user) }, 201, config);
  }

  const me = userFromToken(readAuthHeader(config));
  if (!me) return fail(401, "נדרשת התחברות מחדש");

  const isAdmin = me.role === "admin";
  const isStaff = isAdmin || me.role === "agent";

  if (path === "/auth/me" && method === "get") {
    return ok(publicUser(me), 200, config);
  }

  /* --- טיקטים --- */

  if (path === "/tickets" && method === "get") {
    const visible = isStaff
      ? db.tickets
      : db.tickets.filter((t) => t.created_by === me.id);
    return ok(visible.map(ticketView), 200, config);
  }

  if (path === "/tickets" && method === "post") {
    const subject = str(body.subject).trim();
    if (!subject) return fail(400, "חובה למלא נושא לפנייה");
    const ticket: DemoTicket = {
      id: db.nextId++,
      subject,
      description: str(body.description) || subject,
      status_id: db.statuses.length > 0 ? db.statuses[0].id : null,
      priority_id: num(body.priority_id),
      created_by: me.id,
      assigned_to: null,
      created_at: new Date().toISOString(),
      updated_at: null,
    };
    db.tickets.push(ticket);
    save();
    return ok(ticketDetailView(ticket), 201, config);
  }

  if (seg.length === 2 && seg[0] === "tickets") {
    const id = toInt(seg[1]);
    const found = db.tickets.filter((t) => t.id === id);
    if (found.length === 0) return fail(404, "הקריאה לא נמצאה");
    const ticket = found[0];

    if (method === "get") {
      if (!isStaff && ticket.created_by !== me.id) {
        return fail(403, "אין לך הרשאה לצפות בקריאה הזו");
      }
      return ok(ticketDetailView(ticket), 200, config);
    }

    if (method === "patch") {
      if (!isStaff) return fail(403, "רק נציג או מנהל יכולים לעדכן קריאה");
      if ("status_id" in body) ticket.status_id = num(body.status_id);
      if ("priority_id" in body) ticket.priority_id = num(body.priority_id);
      if ("assigned_to" in body) {
        if (!isAdmin) return fail(403, "רק מנהל יכול להקצות נציג");
        const assigned = num(body.assigned_to);
        ticket.assigned_to = assigned && assigned > 0 ? assigned : null;
      }
      if ("subject" in body) ticket.subject = str(body.subject);
      if ("description" in body) ticket.description = str(body.description);
      ticket.updated_at = new Date().toISOString();
      save();
      return ok(ticketDetailView(ticket), 200, config);
    }

    if (method === "delete") {
      if (!isAdmin) return fail(403, "רק מנהל יכול למחוק קריאה");
      db.tickets = db.tickets.filter((t) => t.id !== id);
      db.comments = db.comments.filter((c) => c.ticket_id !== id);
      save();
      return ok({ message: "הקריאה נמחקה" }, 200, config);
    }
  }

  /* --- תגובות --- */

  if (seg.length === 3 && seg[0] === "tickets" && seg[2] === "comments") {
    const ticketId = toInt(seg[1]);
    const found = db.tickets.filter((t) => t.id === ticketId);
    if (found.length === 0) return fail(404, "הקריאה לא נמצאה");
    if (!isStaff && found[0].created_by !== me.id) {
      return fail(403, "אין לך הרשאה לקריאה הזו");
    }

    if (method === "get") {
      return ok(
        db.comments.filter((c) => c.ticket_id === ticketId).map(commentView),
        200,
        config
      );
    }

    if (method === "post") {
      const content = str(body.content).trim();
      if (!content) return fail(400, "לא ניתן לשלוח תגובה ריקה");
      const comment: DemoComment = {
        id: db.nextId++,
        ticket_id: ticketId,
        author_id: me.id,
        content,
        created_at: new Date().toISOString(),
      };
      db.comments.push(comment);
      save();
      return ok(commentView(comment), 201, config);
    }
  }

  /* --- סטטוסים ועדיפויות --- */

  // TicketService נופל מ-/statuses/:id ל-/status/:id, אז שני השמות נתמכים
  const lookupRoutes: Array<{ names: string[]; list: DemoLookup[] }> = [
    { names: ["statuses", "status"], list: db.statuses },
    { names: ["priorities", "priority"], list: db.priorities },
  ];

  for (let i = 0; i < lookupRoutes.length; i++) {
    const route = lookupRoutes[i];
    if (seg.length === 0 || route.names.indexOf(seg[0]) === -1) continue;

    if (seg.length === 1 && method === "get") {
      return ok(route.list.slice(), 200, config);
    }

    if (seg.length === 1 && method === "post") {
      if (!isAdmin) return fail(403, "רק מנהל יכול להוסיף ערך לרשימה");
      const name = str(body.name).trim();
      if (!name) return fail(400, "חובה למלא שם");
      const item: DemoLookup = { id: db.nextId++, name };
      route.list.push(item);
      save();
      return ok(item, 201, config);
    }

    if (seg.length === 2 && method === "delete") {
      if (!isAdmin) return fail(403, "רק מנהל יכול למחוק ערך מהרשימה");
      const id = toInt(seg[1]);
      let removed = false;
      // מוחקים במקום (splice) ולא מחליפים מערך, כדי שההפניה ל-db תישאר תקפה
      for (let j = route.list.length - 1; j >= 0; j--) {
        if (route.list[j].id === id) {
          route.list.splice(j, 1);
          removed = true;
        }
      }
      if (!removed) return fail(404, "הערך לא נמצא");
      save();
      return ok({ message: "נמחק" }, 200, config);
    }
  }

  /* --- משתמשים --- */

  if (path === "/users" && method === "get") {
    // ה-API האמיתי מרשה זאת למנהל בלבד, אבל מסך הטיקט צריך שמות נציגים
    // כדי להציג "נציג מטפל", אז ללקוח מוחזרת רשימה מצומצמת בלי אימיילים
    if (isStaff) return ok(db.users.map(publicUser), 200, config);
    return ok(
      db.users.map((u) => ({ id: u.id, name: u.name, role: u.role })),
      200,
      config
    );
  }

  if (path === "/users" && method === "post") {
    if (!isAdmin) return fail(403, "רק מנהל יכול ליצור משתמשים");
    const email = str(body.email).trim().toLowerCase();
    const name = str(body.name).trim() || str(body.username).trim();
    if (!email || !name) return fail(400, "חסרים שם או אימייל");
    if (db.users.filter((u) => u.email.toLowerCase() === email).length > 0) {
      return fail(409, "האימייל הזה כבר רשום במערכת");
    }
    const user: DemoUser = {
      id: db.nextId++,
      name,
      email,
      role: normalizeRole(body.role),
      created_at: new Date().toISOString(),
    };
    db.users.push(user);
    save();
    return ok(publicUser(user), 201, config);
  }

  if (seg.length === 2 && seg[0] === "users") {
    const id = toInt(seg[1]);
    const found = db.users.filter((u) => u.id === id);
    if (found.length === 0) return fail(404, "המשתמש לא נמצא");
    const user = found[0];

    if (method === "get") {
      if (isStaff) return ok(publicUser(user), 200, config);
      return ok({ id: user.id, name: user.name, role: user.role }, 200, config);
    }

    if (method === "patch") {
      if (!isAdmin) return fail(403, "רק מנהל יכול לעדכן משתמשים");
      if ("name" in body) user.name = str(body.name);
      if ("email" in body) user.email = str(body.email);
      if ("role" in body) user.role = normalizeRole(body.role);
      save();
      return ok(publicUser(user), 200, config);
    }

    if (method === "delete") {
      if (!isAdmin) return fail(403, "רק מנהל יכול למחוק משתמשים");
      if (user.id === me.id) return fail(400, "אי אפשר למחוק את המשתמש המחובר");
      db.users = db.users.filter((u) => u.id !== id);
      db.tickets = db.tickets.map((t) =>
        t.assigned_to === id ? { ...t, assigned_to: null } : t
      );
      save();
      return ok({ message: "המשתמש נמחק" }, 200, config);
    }
  }

  return fail(404, "הנתיב לא קיים בדמו: " + method.toUpperCase() + " " + path);
}

/* ---------------------------------------------------------------- ה-adapter */

// השהיה מלאכותית - בלי זה מסכי הטעינה מהבהבים ונראים שבורים
const latency = (): number => 120 + Math.floor(Math.random() * 130);

function demoAdapter(
  config: InternalAxiosRequestConfig
): Promise<AxiosResponse> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let result: AxiosResponse<unknown> | DemoApiError;
      try {
        result = handle(config);
      } catch (e) {
        result = new DemoApiError(500, "שגיאה פנימית בדמו", config);
      }
      if (isDemoError(result)) reject(result);
      else resolve(result as AxiosResponse);
    }, latency());
  });
}

const api = axios.create({
  baseURL: "http://localhost:4000",
  adapter: demoAdapter,
});

// הוספת הטוקן לכל בקשה
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// טיפול בשגיאות (בלי לזרוק אותך החוצה באלימות)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Token expired or invalid - logging out");
      localStorage.removeItem("token");
      // כאן ביטלנו את הריענון האוטומטי כדי למנוע לופים
    }
    return Promise.reject(error);
  }
);

export default api;
