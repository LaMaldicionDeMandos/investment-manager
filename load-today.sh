#!/usr/bin/env bash
node today_fetch.js ./titles/runtime
node end_fetch.js ./titles/ends merval_general.csv ends.csv
node todate_extremes.js ./titles/runtime