import { processProgramData } from './program.js';
import { processEventData } from './event.js';

let jsonOutputData;
let file;

// Function to handle file input event
function handleFileInput(event) {
  const selectedFile = event.target.files[0];
  if (selectedFile) {
    file = selectedFile;
  } else {
    console.error("No file selected.");
  }
}

// Event listener for processing the file
document.addEventListener('DOMContentLoaded', function () {
  const processButton = document.getElementById('processButton');
  processButton.onclick = function () {
    handleFile();
  };

  // Adding event listener for file input
  const excelFileInput = document.getElementById('excelFileInput');
  excelFileInput.addEventListener('change', handleFileInput);
  const sendToAPIButton = document.getElementById('sendToAPIButton');
  sendToAPIButton.addEventListener('click', function () {
    sendToAPI();
  });
});

// Function to handle file processing
async function handleFile() {
  const startDate = document.getElementById('startDateInput').value;
  const endDate = document.getElementById('endDateInput').value;

  if (!file) {
    document.getElementById('statusMessage').textContent = 'Please select a file.';
  } else if (!startDate) {
    document.getElementById('statusMessage').textContent = 'Please specify the start date.';
  } else if (!endDate) {
    document.getElementById('statusMessage').textContent = 'Please specify the end date.';
  } else {
    // Proceed with file processing
    try {
      const data = await excelToJson(file);
      const programData = data[0];
      const eventData = data[0];
      const programs = processProgramData(programData);
      const events = processEventData(eventData, startDate, endDate);
      const channelData = mergeData(programs, events);
      jsonOutputData = JSON.stringify(channelData, null, 2);
      document.getElementById('jsonOutput').textContent = jsonOutputData;
      enableDownloadLink(jsonOutputData);
    } catch (error) {
      console.error("Error processing Excel file:", error);
      document.getElementById('statusMessage').textContent = 'Error processing Excel file.';
    }
  }
}

// Function to convert Excel to JSON
async function excelToJson(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function (e) {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetNames = workbook.SheetNames;
        const jsonData = sheetNames.map(sheetName => {
          return XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
        });
        resolve(jsonData);
      } catch (error) {
        console.error("Error processing Excel file:", error); // Log the error
        reject(error);
      }
    };

    reader.onerror = function (error) {
      console.error("Error reading Excel file:", error); // Log the error
      reject(error);
    };

    reader.readAsArrayBuffer(file);
  });
}
// Function to merge program and event data
function mergeData(programs, events) {
  return {
    "channel": {
      "wurl_channel_slug": "asiatvlimited_zeeworld_1",
      "title": "Zee World",
      "broadcast_url": "http://test1.com",
      "language": "en",
      "programs": programs,
      "events": events
    }
  };
}

// Function to enable download link for JSON file
function enableDownloadLink(jsonData) {
  const downloadLink = document.getElementById('downloadLink');
  downloadLink.style.display = 'block';

  downloadLink.addEventListener('click', function () {
    const blob = new Blob([jsonData], { type: 'application/json' });
    const currentDate = new Date().toISOString().replace(/:/g, '-').substring(0, 19);
    const fileName = `EPG_file_${currentDate}.json`;
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = fileName;
  });
}

// Function to send JSON data to API
const axios = require('axios');

async function sendToAPI() {
  const apiURL = "https://ingest-api-prod.wurl.com/epgs"; // Replace with your actual API URL
  const apiKey = "ufeNJs0KPU7xvBYVHeYFK1eq25uYnuNb15eiajFN"; // Replace with your actual API key

  if (jsonOutputData && apiURL) {
    try {
      const response = await axios.post(apiURL, JSON.parse(jsonOutputData), {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
      });

      console.log('Data sent successfully! Server Response:', response.data);
      // Optionally, do something with the successful response
    } catch (error) {
      console.error('Error:', error.message);
      // Optionally, handle the error
    }
  } else {
    console.error('Please load an Excel file first.');
    // Optionally, notify the user to load an Excel file first
  }
}
