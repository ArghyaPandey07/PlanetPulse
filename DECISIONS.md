# Decision Points

## DP1 — The nudge
When the weekly target is crossed, PlanetPulse shows a supportive,
encouraging message rather than a warning, shame-based message, or a
block. Blocking was rejected outright: activity logging is a required
feature that must always remain available, so blocking it as a
consequence of crossing a target would contradict the app's own
specification. Shame-based framing was rejected because it tends to
reduce continued engagement with habit-tracking tools, undermining the
app's actual purpose. An encouraging tone treats exceeding the target as
information to act on rather than a failure to be punished.

## DP2 — Absurd input
PlanetPulse rejects quantities above a defined per-activity-type maximum
(e.g. an unrealistic car trip), returning a specific message asking the
user to log it as multiple entries if it's genuinely real. Silently
accepting the value would corrupt dashboard totals with what is almost
certainly a data-entry error; silently dropping it without explanation
would leave the user confused about why their entry never appeared.
Rejecting with a specific, actionable message preserves data integrity
while still accommodating real large values, like a long-haul flight,
by asking for them to be split into realistic line items.

## DP3 — The week
Weeks run Monday through Sunday (ISO 8601), rather than a rolling
7-day window or a user-configurable start day. This was chosen for
consistency and unambiguity: an ISO week has a single universally
understood definition, avoids drift between logged activities and week
boundaries, and matches most calendar tooling a user would compare
against. Mid-week progress is shown as a live progress bar against the
current week's total, giving an at-a-glance read on pace without
needing a separate day-of-week calculation surfaced to the user.
