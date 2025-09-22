const SHEET_NAME = "Sheet1";

function doPost(e) {
  // Add CORS headers
  const response = ContentService.createTextOutput();
  response.setMimeType(ContentService.MimeType.JSON);

  try {
    console.log('Received request type:', typeof e);
    
    let data;
    try {
      if (e && e.postData && e.postData.contents) {
        data = JSON.parse(e.postData.contents);
      } else {
        data = {};
      }
      console.log('Parsed data:', data);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      return response.setContent(JSON.stringify({
        'result': 'error',
        'message': 'Invalid JSON data received'
      }));
    }

    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      return response.setContent(JSON.stringify({
        'result': 'error',
        'message': `Sheet "${SHEET_NAME}" not found`
      }));
    }

    // Get headers
    const lastColumn = sheet.getLastColumn();
    const headers = lastColumn > 0 ? sheet.getRange(1, 1, 1, lastColumn).getValues()[0] : [];
    
    console.log('Sheet headers:', headers);

    // Create row data
    const newRow = headers.map(header => {
      if (header === "timestamp") {
        return new Date().toISOString();
      }
      return data[header] || "";
    });

    console.log('New row to append:', newRow);
    sheet.appendRow(newRow);

    return response.setContent(JSON.stringify({
      'result': 'success',
      'message': 'Data successfully added to sheet'
    }));

  } catch (error) {
    console.error('Error in doPost:', error);
    return response.setContent(JSON.stringify({
      'result': 'error',
      'message': error.message
    }));
  }
}

function doGet(e) {
  return ContentService.createTextOutput("Apps Script is working").setMimeType(ContentService.MimeType.TEXT);
}