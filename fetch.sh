#!/usr/bin/env bash
node trend_report/clear.js
node ends_report/clear.js

node fetcher.js ./titles
node title-batch.js ./titles