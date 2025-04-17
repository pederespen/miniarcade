import { WORD_LIST } from "./constants";

/**
 * Loads words from the text file and updates the word list
 */
export async function loadWordsFromFile(): Promise<string[]> {
  try {
    const response = await fetch("/wordlerush/words.txt");
    if (!response.ok) {
      throw new Error(`Failed to load words: ${response.status}`);
    }

    const text = await response.text();
    // Convert to uppercase and filter for 5-letter words only
    const words = text
      .split("\n")
      .map((word) => word.trim().toUpperCase())
      .filter((word) => word.length === 5);

    // Clear the existing array and add the new words
    WORD_LIST.length = 0;

    // Add all the new words
    words.forEach((word) => {
      WORD_LIST.push(word);
    });

    console.log(`Loaded ${WORD_LIST.length} 5-letter words for the game`);
    return WORD_LIST;
  } catch (error) {
    console.error("Error loading word list:", error);
    throw error; // Rethrow to let the calling code handle it
  }
}
