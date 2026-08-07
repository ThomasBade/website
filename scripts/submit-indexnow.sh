#!/usr/bin/env bash
set -euo pipefail

: "${INDEXNOW_KEY:?INDEXNOW_KEY must be set as an environment variable or GitHub secret}"

HOST="thomasbade.github.io"
KEY_LOCATION="https://${HOST}/website/${INDEXNOW_KEY}.txt"
ENDPOINTS=("https://www.bing.com/indexnow" "https://api.indexnow.org/indexnow")
URLS=(
  "https://thomasbade.github.io/website/knowledge-graph/"
  "https://thomasbade.github.io/website/openapi.json"
  "https://thomasbade.github.io/website/knowledge-graph/api/v1/index.json"
  "https://thomasbade.github.io/website/knowledge-graph/data/graph.json"
  "https://thomasbade.github.io/website/knowledge-graph/data/dataset.jsonld"
  "https://thomasbade.github.io/website/knowledge-graph/data/vocabulary.json"
  "https://thomasbade.github.io/website/knowledge-graph/data/pages.json"
  "https://thomasbade.github.io/website/knowledge-graph/data/graph.ttl"
  "https://thomasbade.github.io/website/data/wikidata-links.ttl"
  "https://www.thomas-bade.de/"
  "https://www.thomas-bade.de/ki_verordnung.html"
  "https://www.thomas-bade.de/iso_42001.html"
  "https://www.thomas-bade.de/risk.html"
  "https://www.thomas-bade.de/agentic.html"
  "https://www.thomas-bade.de/fmea.html"
  "https://www.thomas-bade.de/ki_kompetenzpflicht.html"
  "https://www.thomas-bade.de/ai_monitoring.html"
  "https://www.thomas-bade.de/em_ki.html"
  "https://www.thomas-bade.de/nursing.html"
  "https://www.thomas-bade.de/who.html"
)

URL_LIST=$(printf '"%s",' "${URLS[@]}")
URL_LIST="[${URL_LIST%,}]"
PAYLOAD=$(printf '{"host":"%s","key":"%s","keyLocation":"%s","urlList":%s}' "$HOST" "$INDEXNOW_KEY" "$KEY_LOCATION" "$URL_LIST")

echo "Submitting ${#URLS[@]} URLs with key location ${KEY_LOCATION}"
for endpoint in "${ENDPOINTS[@]}"; do
  status=$(curl --silent --show-error --output /dev/null --write-out '%{http_code}' \
    --request POST "$endpoint" --header 'Content-Type: application/json; charset=utf-8' --data "$PAYLOAD")
  echo "${endpoint}: HTTP ${status}"
  [[ "$status" == "200" || "$status" == "202" ]] || exit 1
done
