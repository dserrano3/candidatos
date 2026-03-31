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
 * @param {string} category - Category key in queries.json (e.g., "general", "names")
 * @param {number} queryIndex - Index of the query within the category
 * @returns {Promise<string>} - Response text from Gemini
 */
export async function sendGeneralQuery(candidateIndex) {

  const generalQuery = queries['general'][0]
  const candidateName = queries['names'][candidateIndex]
  const query = generalQuery.replace('<candidato>', candidateName)

  return sendToGemini(query)
}

/**
 * Save candidate data to Firestore
 * @param {string} last_name - Candidate's last name
 * @param {string} general_summary - General summary about the candidate
 * @returns {Promise<string>} - Document ID of the created record
 */
export async function saveCandidate(last_name, general_summary) {
  const docRef = await addDoc(collection(db, 'Candidates'), {
    last_name,
    general_summary,
    createdAt: new Date()
  })
  return docRef.id
}

/**
 * Get the most recent candidate summary by last name
 * @param {string} last_name - Candidate's last name to search for
 * @returns {Promise<string|null>} - The general_summary or null if not found
 */
export async function getCandidate(last_name) {
  const q = query(
    collection(db, 'Candidates'),
    where('last_name', '==', last_name),
    orderBy('createdAt', 'desc'),
    limit(1)
  )

  const querySnapshot = await getDocs(q)

  if (querySnapshot.empty) {
    return null
  }

  return querySnapshot.docs[0].data().general_summary
}

export function dummyFunction(param) {
  return param
}
