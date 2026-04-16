/**
 * Google Apps Script: Portfolio Contact Form -> Google Sheet
 *
 * WHY: Static HTML cannot write to a Google Sheet directly. This Apps Script
 * sits in your Sheet, receives POSTs from the portfolio contact form, and
 * appends one row per submission.
 *
 * SETUP (one time):
 *   1. Open the target Sheet:
 *      https://docs.google.com/spreadsheets/d/1ZLElCz28kqrqBiXlyJLTbzKI1fz2uY0mNnr69y6CDew/edit
 *   2. Extensions -> Apps Script.
 *   3. Replace the default Code.gs content with this entire file.
 *   4. Save.
 *   5. Deploy -> New Deployment -> Type: Web app.
 *        - Description: Portfolio contact form
 *        - Execute as: Me (your account)
 *        - Who has access: Anyone
 *      Click Deploy, then authorize.
 *   6. Copy the Web app URL it gives you.
 *   7. Paste that URL into SHEET_WEBHOOK_URL inside index.html.
 *
 * HEADER ROW (row 1 of the Sheet). Create it once:
 *   Timestamp | Name/Company | Email | Message | Source | Submitted At (ISO)
 */

const SHEET_NAME = 'Leads'; // change if you want a specific tab name

function doPost(e) {
  try {
    const body = e && e.postData && e.postData.contents
      ? JSON.parse(e.postData.contents)
      : {};

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(['Timestamp', 'Name/Company', 'Email', 'Message', 'Source', 'Submitted At (ISO)']);
    }

    sheet.appendRow([
      new Date(),
      body.name || '',
      body.email || '',
      body.message || '',
      body.page || '',
      body.submittedAt || '',
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput('Portfolio contact webhook is live.')
    .setMimeType(ContentService.MimeType.TEXT);
}
