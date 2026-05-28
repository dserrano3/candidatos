const admin = require('firebase-admin');

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

/**
 * Save data to a Firestore collection
 * @param {string} collectionName - Name of the Firestore collection
 * @param {string} last_name - Candidate's last name
 * @param {string} general_summary - Summary about the candidate
 * @param {Array} sources - Array of source objects with url and title
 * @returns {Promise<string>} - Document ID of the created record
 */
async function saveToCollection(collectionName, last_name, general_summary, sources = []) {
  const docRef = await db.collection(collectionName).add({
    last_name,
    general_summary,
    sources,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });
  return docRef.id;
}

// Collection names mapping by category index
const COLLECTIONS = [
  'Candidates',    // 0 - General
  'Escandalos',    // 1 - Escándalos
  'Experiencia',   // 2 - Experiencia
  'Educacion',     // 3 - Educación
  'Salud',         // 4 - Salud
  'Seguridad'      // 5 - Seguridad
];

/**
 * Get collection name by category index
 * @param {number} categoryIndex - Index of the category
 * @returns {string} - Collection name
 */
function getCollectionName(categoryIndex) {
  return COLLECTIONS[categoryIndex];
}

module.exports = {
  saveToCollection,
  getCollectionName,
  COLLECTIONS
};
