

export const toolPrompts = {
  "proofreading":
    "Please proofread the following text and identify any spelling errors, grammatical mistakes, and style inconsistencies. Provide a corrected version with explanations for each change:",

  "paraphrasing":
    "Please paraphrase the following text while maintaining its original meaning but using different words and sentence structures:",

  "ai-humanizer":
    "Please rewrite the following text to make it more engaging and human-like by adjusting tone, style, and readability:",

  "ai-summarizer":
    "Please provide a concise summary of the following text while retaining all key information:",

  "outline-generation":
    "Please generate a structured outline for the following content or topic:",

  "split-sentence":
    "Please split the following long sentences into shorter, more readable ones to enhance clarity:",

  "table-generator":
    "Please convert the following content into a well-organized table format:",

  "faq-generator":
    "Please generate frequently asked questions (FAQs) based on the following content:",

  "glossary-generator":
    "Please generate a glossary of terms and definitions from the following content:",

  "language-translation":
    "Please translate the following text into the selected language:",

  "word-choice-optimization":
    "Please optimize the word choices in the following text to enhance clarity, engagement, and overall quality:",

  "change-tone":
    "Please change the tone of the following text according to the selected tone:",

  "make-longer-shorter":
    "Please adjust the length of the following text according to the selected option:",

  "change-voice": {
    active:
      "Please rewrite the following text by converting all passive voice constructions to active voice. Make the subject perform the action directly:",
    passive:
      "Please rewrite the following text by converting all active voice constructions to passive voice. Focus on the action being performed rather than who performs it:",
  },

  "change-speech": {
    direct:
      "Please rewrite the following text by converting all indirect/reported speech to direct speech using quotation marks and present tense dialogue:",
    indirect:
      "Please rewrite the following text by converting all direct speech to indirect/reported speech, removing quotation marks and using past tense reporting verbs:",
  },

  "seo-description-generator":
    "Please generate SEO-friendly meta descriptions for the following content:",

  "tag-recommender":
    "Please recommend relevant tags for the following content:",

  "title-recommender":
    "Please recommend catchy and SEO-friendly titles for the following content:",
};

export const selectionOptions = {
  languages: [
    { value: "spanish", label: "Spanish" },
    { value: "french", label: "French" },
    { value: "german", label: "German" },
    { value: "italian", label: "Italian" },
    { value: "portuguese", label: "Portuguese" },
    { value: "chinese", label: "Chinese" },
    { value: "japanese", label: "Japanese" },
    { value: "korean", label: "Korean" },
    { value: "arabic", label: "Arabic" },
    { value: "hindi", label: "Hindi" },
  ],

  tones: [
    { value: "professional", label: "Professional" },
    { value: "friendly", label: "Friendly" },
    { value: "casual", label: "Casual" },
    { value: "straightforward", label: "Straight Forward" },
    { value: "confident", label: "Confident" },
  ],

  voices: [
    { value: "active", label: "Active Voice" },
    { value: "passive", label: "Passive Voice" },
  ],

  speeches: [
    { value: "direct", label: "Direct Speech" },
    { value: "indirect", label: "Indirect Speech" },
  ],

  lengths: [
    { value: "longer", label: "Make Longer" },
    { value: "shorter", label: "Make Shorter" },
  ],
};

// Function to get the appropriate prompt for a tool with selections
export const getPromptForTool = (toolId, selections = {}) => {
  const {
    selectedLanguage,
    selectedTone,
    selectedLength,
    selectedVoice,
    selectedSpeech,
  } = selections;

  // These tools use Python analysis instead of prompts
  if (toolId === "count-analyzer" || toolId === "readability-score") {
    return null;
  }

  // Handle tools with selection-based prompts
  switch (toolId) {
    case "language-translation":
      if (selectedLanguage) {
        const languageLabel =
          selectionOptions.languages.find(
            (opt) => opt.value === selectedLanguage,
          )?.label || selectedLanguage;
        return `Please translate the following text into ${languageLabel}:`;
      }
      return toolPrompts[toolId];

    case "change-tone":
      if (selectedTone) {
        const toneLabel =
          selectionOptions.tones.find((opt) => opt.value === selectedTone)
            ?.label || selectedTone;
        return `Please rewrite the following text using a ${toneLabel} tone:`;
      }
      return toolPrompts[toolId];

    case "make-longer-shorter":
      if (selectedLength) {
        const lengthLabel =
          selectionOptions.lengths.find((opt) => opt.value === selectedLength)
            ?.label || selectedLength;
        return `Please ${lengthLabel.toLowerCase()} the following text while maintaining its meaning and quality:`;
      }
      return toolPrompts[toolId];

    case "change-voice":
      if (selectedVoice && toolPrompts[toolId][selectedVoice]) {
        return toolPrompts[toolId][selectedVoice];
      }
      return "Please change the voice of the following text:";

    case "change-speech":
      if (selectedSpeech && toolPrompts[toolId][selectedSpeech]) {
        return toolPrompts[toolId][selectedSpeech];
      }
      return "Please change the speech of the following text:";

    default:
      return toolPrompts[toolId] || "Please process the following text:";
  }
};
