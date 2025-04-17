import { WORD_LIST } from "./constants";

export async function loadWordsFromFile(): Promise<string[]> {
  try {
    const response = await fetch("./wordlerush/words.json");
    if (!response.ok) {
      throw new Error(`Failed to load words: ${response.status}`);
    }

    const data = await response.json();
    // Convert to uppercase and filter for 5-letter words only
    const words = data.words
      .map((word: string) => word.trim().toUpperCase())
      .filter((word: string) => word.length === 5);

    // Clear the existing array and add the new words
    WORD_LIST.length = 0;

    // Add all the new words
    words.forEach((word: string) => {
      WORD_LIST.push(word);
    });

    console.log(`Loaded ${WORD_LIST.length} 5-letter words for the game`);
    return WORD_LIST;
  } catch (error) {
    console.error("Error loading word list:", error);
    throw error; // Rethrow to let the calling code handle it
  }
}
