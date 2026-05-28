/**
 * Generic helper functions
 */

import { collection, addDoc, query, where, orderBy, limit, getDocs } from 'firebase/firestore'
import { db } from '../config/firebase'
import queries from './queries.json'
import { GEMINI_API_KEY } from '../config/apiKeys'
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent'

/**
 * Send a string query to Gemini API with Google Search grounding
 * @param {string} query - The query string to send
 * @returns {Promise<{text: string, sources: Array}>} - Response text and sources from Gemini
 */
async function sendToGemini(query) {
  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
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
  })

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()

  // Extract text from response
  const text = data.candidates[0].content.parts[0].text

  // Extract sources from grounding metadata
  let sources = []
  const groundingMetadata = data.candidates[0].groundingMetadata
  if (groundingMetadata && groundingMetadata.groundingChunks) {
    sources = groundingMetadata.groundingChunks
      .filter(chunk => chunk.web)
      .map(chunk => ({
        url: chunk.web.uri,
        title: chunk.web.title || 'Source'
      }))
    // Remove duplicates based on URL
    sources = sources.filter((source, index, self) =>
      index === self.findIndex(s => s.url === source.url)
    )
  }

  return { text, sources }
}

/**
 * Send a query to Gemini API using queries from the JSON file
 * @param {number} candidateIndex - Index of the candidate in names array
 * @param {number} queryIndex - Index of the query in general array (0 for general info, 1 for escandalos)
 * @returns {Promise<{text: string, sources: Array}>} - Response text and sources from Gemini
 */
export async function sendGeneralQuery(candidateIndex, queryIndex) {

  const generalQuery = queries['general'][queryIndex]
  const candidateName = queries['names'][candidateIndex]
  const query = generalQuery.replace('<candidato>', candidateName)

  return sendToGemini(query)
}

// Candidate last names used across the app
export const CANDIDATE_NAMES = ['Cepeda', 'Espriella', 'Valencia']

/**
 * Save data to a Firestore collection
 * @param {string} collectionName - Name of the Firestore collection
 * @param {string} last_name - Candidate's last name
 * @param {string} general_summary - Summary about the candidate
 * @param {Array} sources - Array of source objects with url and title
 * @returns {Promise<string>} - Document ID of the created record
 */
async function saveToCollection(collectionName, last_name, general_summary, sources = []) {
  const docRef = await addDoc(collection(db, collectionName), {
    last_name,
    general_summary,
    sources,
    createdAt: new Date()
  })
  return docRef.id
}

/**
 * Get the most recent summary and sources by last name from a collection
 * @param {string} collectionName - Name of the Firestore collection
 * @param {string} last_name - Candidate's last name to search for
 * @returns {Promise<{summary: string, sources: Array}|null>} - The summary and sources or null if not found
 */
async function getFromCollection(collectionName, last_name) {
  const q = query(
    collection(db, collectionName),
    where('last_name', '==', last_name),
    orderBy('createdAt', 'desc'),
    limit(1)
  )
  const querySnapshot = await getDocs(q)

  if (querySnapshot.empty) {
    return null
  }

  const doc = querySnapshot.docs[0].data()
  return {
    summary: doc.general_summary,
    sources: doc.sources || []
  }
}

// Convenience wrappers for Candidates collection
export const saveCandidate = (last_name, summary, sources) => saveToCollection('Candidates', last_name, summary, sources)
export const getCandidate = (last_name) => getFromCollection('Candidates', last_name)

// Convenience wrappers for Escandalos collection
export const saveEscandalo = (last_name, summary, sources) => saveToCollection('Escandalos', last_name, summary, sources)
export const getEscandalo = (last_name) => getFromCollection('Escandalos', last_name)

// Convenience wrappers for Experiencia collection
export const saveExperiencia = (last_name, summary, sources) => saveToCollection('Experiencia', last_name, summary, sources)
export const getExperiencia = (last_name) => getFromCollection('Experiencia', last_name)

// Convenience wrappers for Educacion collection
export const saveEducacion = (last_name, summary, sources) => saveToCollection('Educacion', last_name, summary, sources)
export const getEducacion = (last_name) => getFromCollection('Educacion', last_name)

// Convenience wrappers for Salud collection
export const saveSalud = (last_name, summary, sources) => saveToCollection('Salud', last_name, summary, sources)
export const getSalud = (last_name) => getFromCollection('Salud', last_name)

// Convenience wrappers for Seguridad collection
export const saveSeguridad = (last_name, summary, sources) => saveToCollection('Seguridad', last_name, summary, sources)
export const getSeguridad = (last_name) => getFromCollection('Seguridad', last_name)

/**
 * Load all candidates using the provided getter function
 * @param {Function} getterFn - Function to get candidate data (e.g., getCandidate or getEscandalo)
 * @returns {Promise<{cepeda: object, espriella: object, valencia: object}>}
 */
export async function loadAllCandidates(getterFn) {
  const [cepeda, espriella, valencia] = await Promise.all(
    CANDIDATE_NAMES.map(name => getterFn(name))
  )
  return {
    cepeda: cepeda || { summary: 'No data available', sources: [] },
    espriella: espriella || { summary: 'No data available', sources: [] },
    valencia: valencia || { summary: 'No data available', sources: [] }
  }
}

/**
 * Delay helper function
 * @param {number} ms - Milliseconds to wait
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Fetch from Gemini and save all candidates
 * @param {number} queryIndex - Index of the query (0 for general, 1 for escandalos)
 * @param {Function} saveFn - Function to save candidate data
 * @returns {Promise<void>}
 */
export async function fetchAndSaveAllCandidates(queryIndex, saveFn) {
  for (let i = 0; i < CANDIDATE_NAMES.length; i++) {
    const result = await sendGeneralQuery(i, queryIndex)
    await saveFn(CANDIDATE_NAMES[i], result.text, result.sources)
    // Wait 3 seconds between requests to avoid rate limiting
    if (i < CANDIDATE_NAMES.length - 1) {
      await delay(3000)
    }
  }
}
