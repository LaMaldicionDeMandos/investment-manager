#!/usr/bin/env bash
node ./cron.js "showFeatureStreamingQuotes=false; i18n.langtag=es-AR; isMobile=0; optimizelyEndUserId=oeu1443746444434r0.05970273306593299; optimizelySegments=%7B%7D; optimizelyBuckets=%7B%7D; __sid=etnue3pjyd5kcekkh2iaabhl; _gat=1; _gat_UA-189938-1=1; _ga=GA1.2.1539582211.1443746444; __unam=c5d0fe8-15025fe74ba-610206ce-3424"
for i in {1..120}
do
    node ./cron.js "showFeatureStreamingQuotes=false; i18n.langtag=es-AR; isMobile=0; optimizelyEndUserId=oeu1443746444434r0.05970273306593299; optimizelySegments=%7B%7D; optimizelyBuckets=%7B%7D; __sid=etnue3pjyd5kcekkh2iaabhl; _gat=1; _gat_UA-189938-1=1; _ga=GA1.2.1539582211.1443746444; __unam=c5d0fe8-15025fe74ba-610206ce-3424" true
done