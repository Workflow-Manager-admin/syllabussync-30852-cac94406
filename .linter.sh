#!/bin/bash
cd /home/kavia/workspace/code-generation/syllabussync-30852-cac94406/syllabus_sync
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

