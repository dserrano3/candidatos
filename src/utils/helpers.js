/**
 * Generic helper functions
 */

import { collection, addDoc, query, where, orderBy, limit, getDocs } from 'firebase/firestore'
import { db } from '../config/firebase'
import queries from './queries.json'
import { GEMINI_API_KEY } from '../config/apiKeys'
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

/**
 * Send a string query to Gemini API
 * @param {string} query - The query string to send
 * @returns {Promise<string>} - Response text from Gemini
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
      ]
    })
  })

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  return data.candidates[0].content.parts[0].text
}

/**
 * Send a query to Gemini API using queries from the JSON file
 * @param {number} candidateIndex - Index of the candidate in names array
 * @param {number} queryIndex - Index of the query in general array (0 for general info, 1 for escandalos)
 * @returns {Promise<string>} - Response text from Gemini
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
 * @returns {Promise<string>} - Document ID of the created record
 */
async function saveToCollection(collectionName, last_name, general_summary) {
  const docRef = await addDoc(collection(db, collectionName), {
    last_name,
    general_summary,
    createdAt: new Date()
  })
  return docRef.id
}

/**
 * Get the most recent summary by last name from a collection
 * @param {string} collectionName - Name of the Firestore collection
 * @param {string} last_name - Candidate's last name to search for
 * @returns {Promise<string|null>} - The general_summary or null if not found
 */
async function getFromCollection(collectionName, last_name) {
  const q = query(
    collection(db, collectionName),
    where('last_name', '==', last_name),
    limit(1)
  )
  const querySnapshot = await getDocs(q)

  if (querySnapshot.empty) {
    return null
  }

  return querySnapshot.docs[0].data().general_summary
}

// Convenience wrappers for Candidates collection
export const saveCandidate = (last_name, summary) => saveToCollection('Candidates', last_name, summary)
export const getCandidate = (last_name) => getFromCollection('Candidates', last_name)

// Convenience wrappers for Escandalos collection
export const saveEscandalo = (last_name, summary) => saveToCollection('Escandalos', last_name, summary)
export const getEscandalo = (last_name) => getFromCollection('Escandalos', last_name)

// Convenience wrappers for Experiencia collection
export const saveExperiencia = (last_name, summary) => saveToCollection('Experiencia', last_name, summary)
export const getExperiencia = (last_name) => getFromCollection('Experiencia', last_name)

/**
 * Load all candidates using the provided getter function
 * @param {Function} getterFn - Function to get candidate data (e.g., getCandidate or getEscandalo)
 * @returns {Promise<{cepeda: string, espriella: string, valencia: string}>}
 */
export async function loadAllCandidates(getterFn) {
  const [cepeda, espriella, valencia] = await Promise.all(
    CANDIDATE_NAMES.map(name => getterFn(name))
  )
  return {
    cepeda: cepeda || 'No data available',
    espriella: espriella || 'No data available',
    valencia: valencia || 'No data available'
  }
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
    await saveFn(CANDIDATE_NAMES[i], result)
  }
}
