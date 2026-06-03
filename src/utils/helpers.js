/**
 * Generic helper functions
 */

import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore'
import { db } from '../config/firebase'

// Candidate last names used across the app
export const CANDIDATE_NAMES = ['Cepeda', 'Espriella']

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

// Convenience wrappers for each collection
export const getCandidate = (last_name) => getFromCollection('Candidates', last_name)
export const getEscandalo = (last_name) => getFromCollection('Escandalos', last_name)
export const getExperiencia = (last_name) => getFromCollection('Experiencia', last_name)
export const getEducacion = (last_name) => getFromCollection('Educacion', last_name)
export const getSalud = (last_name) => getFromCollection('Salud', last_name)
export const getSeguridad = (last_name) => getFromCollection('Seguridad', last_name)
export const getEnergia = (last_name) => getFromCollection('Energia', last_name)
export const getVicepresidente = (last_name) => getFromCollection('Vicepresidente', last_name)
export const getNoticias = (last_name) => getFromCollection('Noticias', last_name)
export const getApoyo = (last_name) => getFromCollection('Apoyo', last_name)
export const getGabinete = (last_name) => getFromCollection('Gabinete', last_name)

/**
 * Load all candidates using the provided getter function.
 * Returns null for candidates with no data in the DB — callers should skip rendering those.
 * @param {Function} getterFn - Function to get candidate data (e.g., getCandidate or getEscandalo)
 * @returns {Promise<Record<string, {summary: string, sources: Array}|null>>}
 */
export async function loadAllCandidates(getterFn) {
  const results = await Promise.all(CANDIDATE_NAMES.map(name => getterFn(name)))
  return Object.fromEntries(
    CANDIDATE_NAMES.map((name, i) => [name.toLowerCase(), results[i]])
  )
}
