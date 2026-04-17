import * as coda from '@codahq/packs-sdk';

/**
 * Interface for categorized common words
 */
interface CommonWordCategories {
  numbers: string[];
  prepositions: string[];
  pronouns: string[];
  conjunctions: string[];
  auxiliaryVerbs: string[];
  articles: string[];
  negations: string[];
  determiners: string[];
  adverbs: string[];
  miscellaneous: string[];
}

/**
 * Configuration constants for text processing
 */
const TEXT_PROCESSING_CONFIG = {
  MIN_TOKEN_LENGTH: 2,
  WORD_SEPARATOR_REGEX: /[^\w\d ]/g,
  TOKEN_SEPARATOR: ' ',
  OUTPUT_SEPARATOR: ', ',
} as const;

// Define the new pack
export const pack = coda.newPack();

// Pack metadata:
// Name: Tags
// Description: Extract meaningful tags from text by filtering out common words and noise.
// Version: 1.0.0

/**
 * Categorized common words to be filtered out when extracting tags
 * These categories help users customize which types of words to exclude
 */
const defaultCommonWords: CommonWordCategories = {
  numbers: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
  prepositions: [
    'about',
    'above',
    'across',
    'after',
    'against',
    'along',
    'among',
    'around',
    'at',
    'before',
    'behind',
    'below',
    'beneath',
    'beside',
    'between',
    'beyond',
    'by',
    'despite',
    'down',
    'during',
    'except',
    'for',
    'from',
    'in',
    'inside',
    'into',
    'near',
    'of',
    'off',
    'on',
    'out',
    'outside',
    'over',
    'past',
    'since',
    'through',
    'throughout',
    'to',
    'toward',
    'under',
    'underneath',
    'until',
    'up',
    'upon',
    'with',
    'within',
    'without',
  ],
  pronouns: [
    'i',
    'me',
    'you',
    'he',
    'him',
    'she',
    'her',
    'it',
    'we',
    'us',
    'they',
    'them',
    'my',
    'your',
    'his',
    'their',
    'our',
    'its',
    'mine',
    'yours',
    'hers',
    'ours',
    'theirs',
    'myself',
    'yourself',
    'himself',
    'herself',
    'itself',
    'ourselves',
    'yourselves',
    'themselves',
  ],
  conjunctions: [
    'and',
    'but',
    'or',
    'nor',
    'for',
    'so',
    'yet',
    'although',
    'because',
    'if',
    'since',
    'though',
    'unless',
    'until',
    'while',
    'when',
    'whereas',
    'whether',
    'as',
  ],
  auxiliaryVerbs: [
    'am',
    'is',
    'are',
    'was',
    'were',
    'be',
    'being',
    'been',
    'have',
    'has',
    'had',
    'do',
    'does',
    'did',
    'will',
    'would',
    'shall',
    'should',
    'can',
    'could',
    'may',
    'might',
    'must',
    'ought',
    'need',
    'dare',
  ],
  articles: ['a', 'an', 'the'],
  negations: ['not', 'no', 'nor', 'never', 'none', 'nothing', 'neither', 'nowhere', 'hardly', 'barely', 'scarcely'],
  determiners: [
    'this',
    'that',
    'these',
    'those',
    'every',
    'each',
    'either',
    'neither',
    'some',
    'any',
    'many',
    'much',
    'several',
    'few',
    'all',
    'both',
    'half',
    'one',
    'another',
    'other',
    'such',
    'what',
    'which',
    'whose',
  ],
  adverbs: [
    'very',
    'too',
    'so',
    'quite',
    'just',
    'almost',
    'already',
    'also',
    'enough',
    'always',
    'never',
    'often',
    'sometimes',
    'usually',
    'generally',
    'perhaps',
    'maybe',
    'indeed',
    'simply',
    'actually',
    'really',
    'hardly',
    'barely',
    'scarcely',
    'completely',
    'entirely',
    'perfectly',
    'absolutely',
    'totally',
    'highly',
    'fully',
    'deeply',
    'widely',
    'mostly',
    'partly',
    'greatly',
    'extremely',
  ],
  miscellaneous: [
    'who',
    'whom',
    'which',
    'what',
    'where',
    'when',
    'why',
    'how',
    'here',
    'there',
    'now',
    'then',
    'hence',
    'thus',
    'therefore',
    'moreover',
    'furthermore',
    'however',
    'nevertheless',
    'nonetheless',
    'otherwise',
    'meanwhile',
    'afterwards',
    'besides',
    'anyway',
    'plus',
    'next',
    'finally',
    'even',
    'although',
    'though',
    'despite',
    'whereas',
    'except',
    'like',
    'unlike',
    'such',
    'as',
    'including',
    'especially',
  ],
};

/**
 * Validates input text and throws appropriate errors
 * @param inputText - The text to validate
 * @throws {Error} If input is invalid
 */
function validateInput(inputText: string): void {
  if (typeof inputText !== 'string') {
    throw new Error('Input text must be a string');
  }

  if (inputText.trim().length === 0) {
    throw new Error('Input text cannot be empty');
  }

  if (inputText.length > 50000) {
    throw new Error('Input text is too long (maximum 50,000 characters)');
  }
}

/**
 * Validates category names against available categories
 * @param categories - Array of category names to validate
 * @throws {Error} If any category is invalid
 */
function validateCategories(categories: string[]): void {
  const validCategories = Object.keys(defaultCommonWords);
  const invalidCategories = categories.filter(cat => !validCategories.includes(cat));

  if (invalidCategories.length > 0) {
    throw new Error(
      `Invalid categories: ${invalidCategories.join(', ')}. Valid categories are: ${validCategories.join(', ')}`
    );
  }
}

/**
 * Processes text by filtering out common words and extracting meaningful tags
 * @param inputText - The text to process
 * @param excludeCategories - Categories of words to exclude (default: none)
 * @param customExcludes - Custom words to exclude (default: none)
 * @returns Array of filtered tags
 * @throws {Error} If input validation fails
 */
function processText(inputText: string, excludeCategories: string[] = [], customExcludes: string[] = []): string[] {
  try {
    // Validate input
    validateInput(inputText);
    validateCategories(excludeCategories);

    // Combine categories based on user exclusions
    const combinedExcludes = new Set(customExcludes.map(word => word.toLowerCase()));

    // Add words from selected categories to exclusion set
    excludeCategories.forEach(category => {
      if (defaultCommonWords[category as keyof CommonWordCategories]) {
        defaultCommonWords[category as keyof CommonWordCategories].forEach(word =>
          combinedExcludes.add(word.toLowerCase())
        );
      }
    });

    // Clean and tokenize the input text
    const cleanedText = inputText.toLowerCase().replace(TEXT_PROCESSING_CONFIG.WORD_SEPARATOR_REGEX, '');
    const tokens = cleanedText.split(TEXT_PROCESSING_CONFIG.TOKEN_SEPARATOR);

    // Filter out excluded words, short words, and remove duplicates
    const filteredTokens = tokens.filter(
      token =>
        token.length >= TEXT_PROCESSING_CONFIG.MIN_TOKEN_LENGTH && !combinedExcludes.has(token) && token.trim() !== ''
    );

    // Remove duplicates while preserving order
    const uniqueTags = Array.from(new Set(filteredTokens));

    return uniqueTags;
  } catch (error) {
    throw new Error(`Text processing failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Extracts tags from text with intelligent defaults
 * @param inputText - The text to process
 * @param customExcludes - Custom words to exclude (default: none)
 * @returns Array of filtered tags
 */
function extractTags(inputText: string, customExcludes: string[] = []): string[] {
  // Default to excluding common stop words
  const defaultExcludes = [
    'articles',
    'prepositions',
    'pronouns',
    'conjunctions',
    'auxiliaryVerbs',
    'negations',
    'determiners',
  ];
  return processText(inputText, defaultExcludes, customExcludes);
}

/**
 * Extracts tags from text with intelligent defaults, returning comma-separated string
 * @param inputText - The text to process
 * @param customExcludes - Custom words to exclude (default: none)
 * @returns Comma-separated string of filtered tags
 */
function extractTagsAsString(inputText: string, customExcludes: string[] = []): string {
  return extractTags(inputText, customExcludes).join(TEXT_PROCESSING_CONFIG.OUTPUT_SEPARATOR);
}

// Add formula to the pack
pack.addFormula({
  name: 'ProcessText',
  description:
    'Extracts meaningful tags from text by filtering out common words and noise. Returns unique tags separated by commas.',
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: 'text',
      description: 'The input text to process and extract tags from.',
    }),
    coda.makeParameter({
      type: coda.ParameterType.StringArray,
      name: 'excludeCategories',
      description:
        'Categories of words to exclude. Valid options: numbers, prepositions, pronouns, conjunctions, auxiliaryVerbs, articles, negations, determiners, adverbs, miscellaneous.',
      optional: true,
    }),
    coda.makeParameter({
      type: coda.ParameterType.StringArray,
      name: 'customExcludes',
      description: 'Custom words to exclude from the text in addition to category exclusions.',
      optional: true,
    }),
  ],
  resultType: coda.ValueType.String,
  examples: [
    {
      params: ['The quick brown fox jumps over the lazy dog'],
      result: 'the, quick, brown, fox, jumps, over, lazy, dog',
    },
    {
      params: ['I love programming in JavaScript', ['pronouns', 'prepositions']],
      result: 'love, programming, javascript',
    },
    {
      params: ['Hello world this is a test', ['articles'], ['hello', 'world']],
      result: 'this, is, test',
    },
  ],
  execute: async function ([text, excludeCategories = [], customExcludes = []]) {
    try {
      const tags = processText(text, excludeCategories, customExcludes);
      return tags.join(TEXT_PROCESSING_CONFIG.OUTPUT_SEPARATOR);
    } catch (error) {
      throw new coda.UserVisibleError(error instanceof Error ? error.message : String(error));
    }
  },
});

// Add a simpler formula with intelligent defaults
pack.addFormula({
  name: 'ExtractTags',
  description:
    'Extracts meaningful tags from text using intelligent defaults to filter out common stop words (articles, prepositions, pronouns, etc.). This is a simplified version of ProcessText with sensible defaults.',
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: 'text',
      description: 'The input text to extract tags from.',
    }),
    coda.makeParameter({
      type: coda.ParameterType.StringArray,
      name: 'customExcludes',
      description: 'Additional custom words to exclude from the results.',
      optional: true,
    }),
  ],
  resultType: coda.ValueType.String,
  examples: [
    {
      params: ['The quick brown fox jumps over the lazy dog'],
      result: 'quick, brown, fox, jumps, lazy, dog',
    },
    {
      params: ['I love programming in JavaScript'],
      result: 'love, programming, javascript',
    },
    {
      params: ['Hello world this is a test', ['hello', 'world']],
      result: 'test',
    },
  ],
  execute: async function ([text, customExcludes = []]) {
    try {
      return extractTagsAsString(text, customExcludes);
    } catch (error) {
      throw new coda.UserVisibleError(error instanceof Error ? error.message : String(error));
    }
  },
});

pack.addFormula({
  name: 'ExtractTagsArray',
  description:
    'Extracts meaningful tags from text using intelligent defaults and returns them as an array instead of a comma-separated string.',
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: 'text',
      description: 'The input text to extract tags from.',
    }),
    coda.makeParameter({
      type: coda.ParameterType.StringArray,
      name: 'customExcludes',
      description: 'Additional custom words to exclude from the results.',
      optional: true,
    }),
  ],
  resultType: coda.ValueType.Array,
  items: { type: coda.ValueType.String },
  examples: [
    {
      params: ['The quick brown fox jumps over the lazy dog'],
      result: ['quick', 'brown', 'fox', 'jumps', 'lazy', 'dog'],
    },
    {
      params: ['Hello world this is a test', ['hello', 'world']],
      result: ['test'],
    },
  ],
  execute: async function ([text, customExcludes = []]) {
    try {
      return extractTags(text, customExcludes);
    } catch (error) {
      throw new coda.UserVisibleError(error instanceof Error ? error.message : String(error));
    }
  },
});
