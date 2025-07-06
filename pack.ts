import * as coda from "@codahq/packs-sdk";

// Define the new pack
export const pack = coda.newPack();

// Categorized common words
const defaultCommonWords = {
    numbers: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    prepositions: ["about", "above", "across", "after", "against", "along", "among", "around", "at", "before", "behind", "below", "beneath", "beside", "between", "beyond", "by", "despite", "down", "during", "except", "for", "from", "in", "inside", "into", "near", "of", "off", "on", "out", "outside", "over", "past", "since", "through", "throughout", "to", "toward", "under", "underneath", "until", "up", "upon", "with", "within", "without"],
    pronouns: ["i", "me", "you", "he", "him", "she", "her", "it", "we", "us", "they", "them", "my", "your", "his", "their", "our", "its", "mine", "yours", "hers", "ours", "theirs", "myself", "yourself", "himself", "herself", "itself", "ourselves", "yourselves", "themselves"],
    conjunctions: ["and", "but", "or", "nor", "for", "so", "yet", "although", "because", "if", "since", "though", "unless", "until", "while", "when", "whereas", "even though", "even if", "whether", "as", "provided that"],
    auxiliaryVerbs: ["am", "is", "are", "was", "were", "be", "being", "been", "have", "has", "had", "do", "does", "did", "will", "would", "shall", "should", "can", "could", "may", "might", "must", "ought", "need", "dare"],
    articles: ["a", "an", "the"],
    negations: ["not", "no", "nor", "never", "none", "nothing", "neither", "nowhere", "hardly", "barely", "scarcely"],
    determiners: ["this", "that", "these", "those", "every", "each", "either", "neither", "some", "any", "many", "much", "several", "few", "all", "both", "half", "one", "another", "other", "such", "what", "which", "whose"],
    adverbs: ["very", "too", "so", "quite", "just", "almost", "already", "also", "enough", "always", "never", "often", "sometimes", "usually", "generally", "perhaps", "maybe", "indeed", "simply", "actually", "really", "hardly", "barely", "scarcely", "completely", "entirely", "perfectly", "absolutely", "totally", "highly", "fully", "deeply", "widely", "mostly", "partly", "entirely", "greatly", "extremely"],
    miscellaneous: ["who", "whom", "which", "what", "where", "when", "why", "how", "here", "there", "now", "then", "hence", "thus", "therefore", "moreover", "furthermore", "however", "nevertheless", "nonetheless", "otherwise", "meanwhile", "afterwards", "besides", "anyway", "also", "plus", "next", "finally", "even", "although", "though", "despite", "whereas", "except", "like", "unlike", "such", "as", "including", "especially"]
};

// Function for processing text
function processText(inputText, excludeCategories = [], customExcludes = []) {
    // Combine categories based on user exclusions
    let combinedExcludes = new Set(customExcludes);

    excludeCategories.forEach(category => {
        if (defaultCommonWords[category]) {
            defaultCommonWords[category].forEach(word => combinedExcludes.add(word));
        }
    });

    // Clean and tokenize the input text
    let cleanedText = inputText.toLowerCase().replace(/[^\w\d ]/g, '');
    let tokens = cleanedText.split(' ');

    // Filter out excluded words and duplicates
    let tags = tokens.filter(token => token.length >= 2 && !combinedExcludes.has(token));

    return tags;
}

// Add formula to the pack
pack.addFormula({
  name: "ProcessText",
  description: "Processes text by excluding specified categories and custom words.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "text",
      description: "The input text to process.",
    }),
    coda.makeParameter({
      type: coda.ParameterType.StringArray,
      name: "excludeCategories",
      description: "Categories of words to exclude (e.g., numbers, prepositions).",
      optional: true,
    }),
    coda.makeParameter({
      type: coda.ParameterType.StringArray,
      name: "customExcludes",
      description: "Custom words to exclude from the text.",
      optional: true,
    }),
  ],
  resultType: coda.ValueType.String,
  execute: async function ([text, excludeCategories = [], customExcludes = []], context) {
    return processText(text, excludeCategories, customExcludes).join(", ");
  },
});
