
const axios = require('axios');

const URL = 'http://localhost:3000/'; 
const TOTAL_REQUESTS = 100;

let completed = 0;
let failed = 0;
let totalTime = 0;

console.time("Total test duration");

(async () => {
  for (let i = 0; i < TOTAL_REQUESTS; i++) {
    const start = Date.now();
    try {
      await axios.get(URL);
      completed++;
    } catch (err) {
      failed++;
    } finally {
      totalTime += Date.now() - start;
      console.log(`[${i + 1}] ${completed + failed}/${TOTAL_REQUESTS} - ✅ ${completed} ❌ ${failed}`);
    }
  }

  console.timeEnd("Total test duration");
  console.log(`\n📊 Rezultate finale:
  - Cereri reușite: ${completed}
  - Cereri eșuate: ${failed}
  - Timp mediu/răspuns: ${(totalTime / completed).toFixed(2)} ms`);
})();
