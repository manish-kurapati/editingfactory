/**
 * Editing Factory lead sheet. Paste into Extensions > Apps Script of a Google Sheet,
 * set SECRET below, then Deploy > New deployment > Web app (Execute as: Me, Access: Anyone).
 * Each submission becomes one row. New form fields automatically get their own column.
 */
var SECRET = 'CHANGE-THIS-TO-A-LONG-RANDOM-STRING';

function doPost(e) {
  var data;
  try { data = JSON.parse(e.postData.contents); } catch (err) { return out({ ok: false, error: 'bad-json' }); }
  if (data.secret !== SECRET) return out({ ok: false, error: 'forbidden' });

  var tabName = data.type === 'Editing partner' ? 'Editing partners' : 'Leads';
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(tabName) || ss.insertSheet(tabName);
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Submitted at', 'Type']);
      sheet.getRange(1, 1, 1, 2).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var row = {};
    row['Submitted at'] = Utilities.formatDate(new Date(), 'Asia/Kolkata', 'dd MMM yyyy, hh:mm a');
    row['Type'] = data.type;
    (data.fields || []).forEach(function (f) { row[f[0]] = f[1]; });
    Object.keys(row).forEach(function (key) {
      if (headers.indexOf(key) === -1) {
        sheet.getRange(1, headers.length + 1).setValue(key).setFontWeight('bold');
        headers.push(key);
      }
    });
    sheet.appendRow(headers.map(function (h) {
      var v = row[h] === undefined ? '' : String(row[h]);
      return /^[=+\-@]/.test(v) ? "'" + v : v; // stop spreadsheet formula injection
    }));
  } finally { lock.releaseLock(); }
  return out({ ok: true });
}

function out(obj) { return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON); }
