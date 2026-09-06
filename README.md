# KCW Family Bible Reading — English

An installable English Bible-reading tracker for the Korean Church of Westchester’s 2026–2027 family reading journey.

## Features

- All 66 books and 1,189 chapters of the Protestant Bible
- Chapter-level and book-level completion tracking
- Today's chapter count and a date-by-date reading calendar
- Chapter history for each selected calendar date
- Completed-reading milestones such as Round 1, Round 2, and Round 3
- Date history preserved when starting the next reading round
- A fresh daily Bible verse selected for each date
- Overall progress dashboard and next unread book shortcut
- Separate Old and New Testament navigation
- Progress saved privately in the browser on each device
- Installable Progressive Web App for iPhone and Android
- Church vision and prayer page

## Local development

```bash
pnpm install
pnpm dev
```

## Production build

```bash
pnpm build
```

Pushes to `main` deploy automatically to GitHub Pages.

## Scripture Notes & One-Line Gratitude

- Open **Journal** in the bottom navigation or the home shortcut to write by date.
- One daily entry includes an optional Scripture reference, up to 10,000 characters of notes, and up to 300 characters of gratitude. Writing saves immediately in this browser.
- Entries show creation and last-edit times. Browse newest dates first, filter by month, and search all journal text.
- Pencil markers on the reading calendar identify dates with journal entries. Open the selected date directly from the calendar.
- Starting a new reading round or resetting reading progress does not delete the journal. Deletion is separate and confirmed per date.
- Version 2 backups include both reading records and journal entries. Restoring a same-language v2 backup replaces both; a v1 backup replaces reading records only and preserves the journal.
- No automatic cloud sync or sharing with the church. Back up before changing devices or clearing browser data. JSON backups are not encrypted; keep them private.
- Storage failures show a warning and keep current writing in memory. Download Backup can still preserve these notes in a file.

Tests: `npm test` (dates, edits/search, v1/v2 compatibility, invalid backups, failed-write rollback).
