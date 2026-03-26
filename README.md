# Tags

Tags is a Coda pack for extracting meaningful keywords from text by removing stop words, duplicates, and short tokens. It is intended for lightweight text tagging inside Coda.

## Overview

* Purpose: Turn freeform text into a cleaned list of tags.
* Inputs: Text, optional stop-word category exclusions, and optional custom excludes.
* Outputs: A comma-separated tag string.
* Audience: Coda users building tagging, search, or summarization workflows from raw text.

## Requirements

* Account(s): Coda account.
* Credentials: None.
* External setup: Not applicable.
* Limits: Input text is rejected when empty or excessively long.

## Installation

1. Install the pack in a Coda doc.
2. No authentication is required.
3. Use `ProcessText` or `ExtractTags` in your doc formulas.

## Authentication

This pack does not use external authentication.

* Method: None.
* Required scopes or permissions: Not applicable.
* Where credentials are entered in Coda: Not applicable.

## Formulas

| Name | Type | Description | Inputs | Returns |
| --- | --- | --- | --- | --- |
| `ProcessText` | Formula | Extracts tags with explicit category and custom exclusions. | `text`, `excludeCategories` optional, `customExcludes` optional | Comma-separated tag string |
| `ExtractTags` | Formula | Extracts tags with the pack’s default exclusion rules. | `text`, `customExcludes` optional | Comma-separated tag string |

## Example usage

### Generate tags from a note

1. Add a text column with a paragraph or note.
2. Call `ExtractTags(thisRow.Note)` or `ProcessText(...)` with custom exclusions.
3. Store the returned comma-separated tag list in a helper column.

## Limitations

* Output is string-based and does not preserve frequencies or weights.
* Stop-word filtering follows the pack’s built-in category lists and custom excludes only.
* The pack is intended for lightweight tagging, not full natural-language understanding.

## Troubleshooting

| Problem | Likely cause | Resolution |
| --- | --- | --- |
| Empty input error | The text value is blank or whitespace only | Provide non-empty text |
| Invalid category error | Unsupported exclusion category was passed | Use only the categories supported by the pack |
| Poor tags | The text has too much noise or the exclusions are too broad | Adjust exclusions or supply custom excluded words |

## Development notes

* Entry point: `pack.ts`
* Build: `pnpm run build`
* Lint: `pnpm run lint`
* Test: `pnpm run test`

## Repository

* Source: https://github.com/ramiisaac/coda_tags
* Issue tracking: https://github.com/ramiisaac/coda_tags/issues

## Author

Author: Rami Isaac <https://github.com/ramiisaac>

Last Edited: 2026-03-26
