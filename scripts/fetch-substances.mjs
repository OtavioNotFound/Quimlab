import { mkdir, writeFile } from 'node:fs/promises';

// Structured Wikidata data is CC0. Keep the source identifiers with the snapshot.
const query = `SELECT DISTINCT ?item ?name ?formula ?cid WHERE {
  ?item wdt:P274 ?formula; wdt:P662 ?cid; rdfs:label ?name.
  FILTER(LANG(?name) = "pt")
} ORDER BY ?item LIMIT 20000`;
const url = new URL('https://query.wikidata.org/sparql');
url.searchParams.set('query', query);
url.searchParams.set('format', 'json');
const response = await fetch(url, {
  headers: { Accept: 'application/sparql-results+json', 'User-Agent': 'QuimLab-EducationalCatalog/1.0' },
  signal: AbortSignal.timeout(90000)
});
if (!response.ok) throw new Error(`Wikidata returned ${response.status}`);
const data = await response.json();
await mkdir('scripts/data', { recursive: true });
await writeFile('scripts/data/wikidata-substances.json', JSON.stringify(data.results.bindings));
console.log(`Downloaded ${data.results.bindings.length} formula/name/PubChem records.`);
