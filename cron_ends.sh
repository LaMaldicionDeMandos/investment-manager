#!/usr/bin/env bash
for i in {1..360}
do
    node ./cron.js "showFeatureStreamingQuotes=false; i18n.langtag=es-AR; isMobile=0; optimizelyEndUserId=oeu1443746444434r0.05970273306593299; optimizelySegments=%7B%7D; optimizelyBuckets=%7B%7D; __sid=4h2aikt1l4pvedk3y4fzxzts; __RequestVerificationToken=YSrg3M3fnSYHTgyNa0Jdm651QOl3zoqDCdAJcO8HP9b_J52uP0mT5ZYQcsdzozkuN2WKZGfnZmoJHXdab2HoPeDDx2KgDqdG0xdv_uKyik2I7HA4_4MdTUI55f0NjEFYUw0cYg2; _gat=1; _ga=GA1.2.1539582211.1443746444; __unam=c5d0fe8-15025fe74ba-610206ce-3260" true
done