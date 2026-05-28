const { onSchedule } = require('firebase-functions/v2/scheduler');
const { onRequest } = require('firebase-functions/v2/https');
const { defineString } = require('firebase-functions/params');
const { sendGeneralQuery, delay, CANDIDATE_NAMES } = require('./src/gemini');
const { saveToCollection, getCollectionName, COLLECTIONS } = require('./src/firestore');

// Define the Gemini API key parameter
const geminiApiKey = defineString('GEMINI_API_KEY');

/**
 * Fetch from Gemini and save all candidates for a given category
 * @param {number} categoryIndex - Index of the category (0-5)
 */
async function updateCategory(categoryIndex) {
  const collectionName = getCollectionName(categoryIndex);
  const apiKey = geminiApiKey.value();

  console.log(`Starting update for category ${categoryIndex} (${collectionName})`);

  for (let i = 0; i < CANDIDATE_NAMES.length; i++) {
    try {
      console.log(`Fetching data for ${CANDIDATE_NAMES[i]}...`);
      const result = await sendGeneralQuery(i, categoryIndex, apiKey);

      console.log(`Saving data for ${CANDIDATE_NAMES[i]} to ${collectionName}...`);
      const docId = await saveToCollection(collectionName, CANDIDATE_NAMES[i], result.text, result.sources);
      console.log(`Saved document ${docId} for ${CANDIDATE_NAMES[i]}`);

      // Wait 5 seconds between requests to avoid rate limiting
      if (i < CANDIDATE_NAMES.length - 1) {
        console.log('Waiting 5 seconds before next request...');
        await delay(5000);
      }
    } catch (error) {
      console.error(`Error processing ${CANDIDATE_NAMES[i]}:`, error);
    }
  }

  console.log(`Completed update for category ${categoryIndex} (${collectionName})`);
}

// Scheduled function: Update Candidates (General) - runs at 00:00 Colombia time (05:00 UTC)
exports.updateCandidates = onSchedule({
  schedule: '0 5 * * *',
  timeZone: 'America/Bogota',
  region: 'us-central1'
}, async (event) => {
  await updateCategory(0);
});

// Scheduled function: Update Escandalos - runs at 04:00 Colombia time (09:00 UTC)
exports.updateEscandalos = onSchedule({
  schedule: '0 9 * * *',
  timeZone: 'America/Bogota',
  region: 'us-central1'
}, async (event) => {
  await updateCategory(1);
});

// Scheduled function: Update Experiencia - runs at 08:00 Colombia time (13:00 UTC)
exports.updateExperiencia = onSchedule({
  schedule: '0 13 * * *',
  timeZone: 'America/Bogota',
  region: 'us-central1'
}, async (event) => {
  await updateCategory(2);
});

// Scheduled function: Update Educacion - runs at 12:00 Colombia time (17:00 UTC)
exports.updateEducacion = onSchedule({
  schedule: '0 17 * * *',
  timeZone: 'America/Bogota',
  region: 'us-central1'
}, async (event) => {
  await updateCategory(3);
});

// Scheduled function: Update Salud - runs at 16:00 Colombia time (21:00 UTC)
exports.updateSalud = onSchedule({
  schedule: '0 21 * * *',
  timeZone: 'America/Bogota',
  region: 'us-central1'
}, async (event) => {
  await updateCategory(4);
});

// Scheduled function: Update Seguridad - runs at 20:00 Colombia time (01:00 UTC next day)
exports.updateSeguridad = onSchedule({
  schedule: '0 1 * * *',
  timeZone: 'America/Bogota',
  region: 'us-central1'
}, async (event) => {
  await updateCategory(5);
});

// HTTP trigger for manual updates
exports.manualUpdate = onRequest({
  region: 'us-central1',
  cors: true
}, async (req, res) => {
  const categoryParam = req.query.category;

  if (categoryParam === undefined) {
    res.status(400).json({
      error: 'Missing category parameter',
      usage: 'GET /manualUpdate?category=0 (0-5 for each category)'
    });
    return;
  }

  const categoryIndex = parseInt(categoryParam, 10);

  if (isNaN(categoryIndex) || categoryIndex < 0 || categoryIndex > 5) {
    res.status(400).json({
      error: 'Invalid category parameter',
      valid: '0=Candidates, 1=Escandalos, 2=Experiencia, 3=Educacion, 4=Salud, 5=Seguridad'
    });
    return;
  }

  try {
    await updateCategory(categoryIndex);
    res.json({
      success: true,
      category: categoryIndex,
      collection: COLLECTIONS[categoryIndex],
      message: `Successfully updated ${COLLECTIONS[categoryIndex]}`
    });
  } catch (error) {
    console.error('Error in manual update:', error);
    res.status(500).json({
      error: 'Failed to update category',
      message: error.message
    });
  }
});
