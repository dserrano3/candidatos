const fetch = require('node-fetch');
const queries = require('./queries.json');

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent';

/**
 * Send a string query to Gemini API with Google Search grounding
 * @param {string} query - The query string to send
 * @param {string} apiKey - The Gemini API key
 * @returns {Promise<{text: string, sources: Array}>} - Response text and sources from Gemini
 */
async function sendToGemini(query, apiKey) {
  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: query
            }
          ]
        }
      ],
      tools: [
        {
          google_search: {}
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  // Extract text from response
  const text = data.candidates[0].content.parts[0].text;

  // Extract sources from grounding metadata
  let sources = [];
  const groundingMetadata = data.candidates[0].groundingMetadata;
  if (groundingMetadata && groundingMetadata.groundingChunks) {
    sources = groundingMetadata.groundingChunks
      .filter(chunk => chunk.web)
      .map(chunk => ({
        url: chunk.web.uri,
        title: chunk.web.title || 'Source'
      }));
    // Remove duplicates based on URL
    sources = sources.filter((source, index, self) =>
      index === self.findIndex(s => s.url === source.url)
    );
  }

  return { text, sources };
}

/**
 * Send a query to Gemini API using queries from the JSON file
 * @param {number} candidateIndex - Index of the candidate in names array
 * @param {number} queryIndex - Index of the query in general array
 * @param {string} apiKey - The Gemini API key
 * @returns {Promise<{text: string, sources: Array}>} - Response text and sources from Gemini
 */
async function sendGeneralQuery(candidateIndex, queryIndex, apiKey) {
  const generalQuery = queries['general'][queryIndex];
  const candidateName = queries['names'][candidateIndex];
  const query = generalQuery.replace('<candidato>', candidateName);

  return sendToGemini(query, apiKey);
}

/**
 * Delay helper function
 * @param {number} ms - Milliseconds to wait
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Candidate last names used across the app
const CANDIDATE_NAMES = ['Cepeda', 'Espriella'];

module.exports = {
  sendGeneralQuery,
  delay,
  CANDIDATE_NAMES
};
