## Root Cause

- BYOIP Prefix Mass Deletion Outage
- missing empty check on filter parameter
- A buggy automated cleanup task attempted to delete BYOIP prefixes.

## Impact

- customers lost CDN, Spectrum, Dedicated Egress, and Magic Transit

## Duration

5h

## Links

- https://blog.cloudflare.com/cloudflare-outage-february-20-2026/
