/**
 * MyDR24 lead webhook → Google Sheet (Google Apps Script).
 *
 * 1. Create a Google Sheet. Extensions → Apps Script. Paste this file. Change SECRET.
 * 2. Deploy → New deployment → type "Web app" → Execute as: Me · Who has access: Anyone → Deploy.
 * 3. Copy the web app URL and set it on your host as:
 *      LEADS_WEBHOOK_URL=https://script.google.com/macros/s/XXXX/exec?key=YOUR_SECRET
 * 4. Submit a test lead on the website; a row appears in the "Leads" tab.
 *
 * The sheet holds personal data: share it only with the care team.
 */
const SECRET = "change-me-to-a-long-random-string";
const SHEET_NAME = "Leads";
const HEADERS = ["Received (UTC)", "Ref", "Name", "Mobile", "City / PIN", "Language", "Service", "Source"];

// Stop values like "=HYPERLINK(...)" being run as formulas.
function safe(value) {
  const s = String(value == null ? "" : value);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function doPost(e) {
  if (!e || !e.parameter || e.parameter.key !== SECRET) {
    return json({ ok: false, error: "unauthorised" });
  }
  const body = JSON.parse(e.postData.contents || "{}");
  const lead = body.lead || {};
  const book = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = book.getSheetByName(SHEET_NAME) || book.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
  sheet.appendRow([
    safe(lead.createdAt), safe(lead.ref), safe(lead.name), "'" + safe(lead.mobile),
    safe(lead.city), safe(lead.language), safe(lead.service), safe(lead.source),
  ]);
  return json({ ok: true });
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
