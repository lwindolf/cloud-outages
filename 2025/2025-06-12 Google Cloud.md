## Impact

- Many Google cloud locations
- Secondary effects caused by Cloudflare being affected
- *Google Cloud, Google Workspace and Google Security Operations products experienced increased 503 errors in external API requests, impacting customers.* [1]

## Root Cause

- control plane policy bug in quota management
- binary crash loop in each region deployment

## Duration

- overall 7h
- most regions fixed after 2h

## Media

- \[1] https://status.cloud.google.com/incidents/ow5i3PPK96RduMcb1SsW

