# Text Tag Extractor - Coda Pack

A powerful Coda Pack that extracts meaningful tags from text by filtering out common words and noise.

## Features

- **Two extraction methods**: 
  - `ProcessText`: Full control over which word categories to exclude
  - `ExtractTags`: Intelligent defaults that automatically filter common stop words
- **Comprehensive word filtering**: Supports 10 categories of common words
- **Duplicate removal**: Automatically removes duplicate tags
- **Error handling**: Robust validation and user-friendly error messages
- **TypeScript**: Fully typed for better development experience

## Formulas

### ProcessText

Advanced text processing with full control over exclusions.

**Parameters:**
- `text` (required): The input text to process
- `excludeCategories` (optional): Array of word categories to exclude
- `customExcludes` (optional): Array of custom words to exclude

**Available Categories:**
- `numbers`: 0-9
- `prepositions`: about, above, across, after, etc.
- `pronouns`: i, me, you, he, she, etc.
- `conjunctions`: and, but, or, because, etc.
- `auxiliaryVerbs`: am, is, are, was, were, etc.
- `articles`: a, an, the
- `negations`: not, no, never, etc.
- `determiners`: this, that, these, those, etc.
- `adverbs`: very, too, so, quite, etc.
- `miscellaneous`: who, what, where, when, etc.

**Example:**
```
ProcessText("I love programming in JavaScript", ["pronouns", "prepositions"])
// Returns: "love, programming, javascript"
```

### ExtractTags

Simplified text processing with intelligent defaults.

**Parameters:**
- `text` (required): The input text to process
- `customExcludes` (optional): Array of custom words to exclude

**Default Exclusions:**
Automatically excludes: articles, prepositions, pronouns, conjunctions, auxiliaryVerbs, negations, determiners

**Example:**
```
ExtractTags("The quick brown fox jumps over the lazy dog")
// Returns: "quick, brown, fox, jumps, lazy, dog"
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Build the pack:
```bash
npm run build
```

3. Upload to Coda using the Coda CLI or web interface

## Development

### Scripts

- `npm run build` - Compile TypeScript
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix linting issues

### Code Quality

- Full TypeScript support with strict mode
- Comprehensive error handling
- Input validation
- JSDoc comments for all functions
- Consistent code formatting with Prettier

## License

MIT License