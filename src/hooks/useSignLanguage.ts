import { useState, useCallback } from 'react';

// Enhanced sign gloss conversion utilities
const FILLER_WORDS = [
  'um', 'uh', 'like', 'you know', 'actually', 'basically', 'literally',
  'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'will', 'would', 'could', 'should', 'might', 'may', 'can', 'must',
  'do', 'does', 'did', 'have', 'has', 'had'
];

const PHRASE_MAPPINGS: Record<string, string> = {
  'how are you': 'HOW YOU',
  'what is your name': 'WHAT YOUR NAME',
  'what\'s your name': 'WHAT YOUR NAME',
  'nice to meet you': 'NICE MEET YOU',
  'see you later': 'SEE YOU LATER',
  'good morning': 'GOOD MORNING',
  'good afternoon': 'GOOD AFTERNOON',
  'good evening': 'GOOD EVENING',
  'good night': 'GOOD NIGHT',
  'excuse me': 'EXCUSE ME',
  'i am sorry': 'I SORRY',
  'i\'m sorry': 'I SORRY',
  'how much': 'HOW MUCH',
  'where is': 'WHERE',
  'what time': 'WHAT TIME',
  'thank you': 'THANK-YOU',
  'you\'re welcome': 'YOU WELCOME',
  'how old are you': 'HOW OLD YOU',
  'where do you live': 'WHERE YOU LIVE',
  'what do you do': 'WHAT YOU DO',
  'i love you': 'I LOVE YOU',
  'happy birthday': 'HAPPY BIRTHDAY',
  'merry christmas': 'MERRY CHRISTMAS',
  'happy new year': 'HAPPY NEW YEAR'
};

const WORD_MAPPINGS: Record<string, string> = {
  // Pronouns
  'i': 'I',
  'you': 'YOU',
  'he': 'HE',
  'she': 'SHE',
  'we': 'WE',
  'they': 'THEY',
  'me': 'ME',
  'my': 'MY',
  'your': 'YOUR',
  'his': 'HIS',
  'her': 'HER',
  'our': 'OUR',
  'their': 'THEIR',
  
  // Greetings
  'hello': 'HELLO',
  'hi': 'HELLO',
  'hey': 'HELLO',
  'goodbye': 'GOODBYE',
  'bye': 'GOODBYE',
  
  // Courtesy
  'thank': 'THANK-YOU',
  'thanks': 'THANK-YOU',
  'please': 'PLEASE',
  'sorry': 'SORRY',
  'excuse': 'EXCUSE',
  
  // Basic responses
  'yes': 'YES',
  'no': 'NO',
  'maybe': 'MAYBE',
  'ok': 'OK',
  'okay': 'OK',
  
  // Actions
  'help': 'HELP',
  'want': 'WANT',
  'need': 'NEED',
  'have': 'HAVE',
  'go': 'GO',
  'come': 'COME',
  'eat': 'EAT',
  'drink': 'DRINK',
  'sleep': 'SLEEP',
  'work': 'WORK',
  'play': 'PLAY',
  'learn': 'LEARN',
  'teach': 'TEACH',
  'read': 'READ',
  'write': 'WRITE',
  'walk': 'WALK',
  'run': 'RUN',
  'drive': 'DRIVE',
  'cook': 'COOK',
  'clean': 'CLEAN',
  'buy': 'BUY',
  'sell': 'SELL',
  'give': 'GIVE',
  'take': 'TAKE',
  'make': 'MAKE',
  'break': 'BREAK',
  'fix': 'FIX',
  'open': 'OPEN',
  'close': 'CLOSE',
  'start': 'START',
  'stop': 'STOP',
  'finish': 'FINISH',
  
  // Places
  'home': 'HOME',
  'school': 'SCHOOL',
  'work': 'WORK',
  'hospital': 'HOSPITAL',
  'store': 'STORE',
  'restaurant': 'RESTAURANT',
  'library': 'LIBRARY',
  'park': 'PARK',
  'church': 'CHURCH',
  'office': 'OFFICE',
  
  // Family
  'family': 'FAMILY',
  'mother': 'MOTHER',
  'mom': 'MOTHER',
  'father': 'FATHER',
  'dad': 'FATHER',
  'sister': 'SISTER',
  'brother': 'BROTHER',
  'child': 'CHILD',
  'baby': 'BABY',
  'grandmother': 'GRANDMOTHER',
  'grandfather': 'GRANDFATHER',
  
  // Time
  'today': 'TODAY',
  'tomorrow': 'TOMORROW',
  'yesterday': 'YESTERDAY',
  'now': 'NOW',
  'later': 'LATER',
  'morning': 'MORNING',
  'afternoon': 'AFTERNOON',
  'evening': 'EVENING',
  'night': 'NIGHT',
  'day': 'DAY',
  'week': 'WEEK',
  'month': 'MONTH',
  'year': 'YEAR',
  
  // Colors
  'red': 'RED',
  'blue': 'BLUE',
  'green': 'GREEN',
  'yellow': 'YELLOW',
  'black': 'BLACK',
  'white': 'WHITE',
  'brown': 'BROWN',
  'orange': 'ORANGE',
  'purple': 'PURPLE',
  'pink': 'PINK',
  
  // Numbers (spelled out)
  'one': '1',
  'two': '2',
  'three': '3',
  'four': '4',
  'five': '5',
  'six': '6',
  'seven': '7',
  'eight': '8',
  'nine': '9',
  'ten': '10',
  
  // Emotions
  'happy': 'HAPPY',
  'sad': 'SAD',
  'angry': 'ANGRY',
  'excited': 'EXCITED',
  'tired': 'TIRED',
  'sick': 'SICK',
  'fine': 'FINE',
  'good': 'GOOD',
  'bad': 'BAD',
  'love': 'LOVE',
  'like': 'LIKE',
  'hate': 'HATE',
  
  // Questions
  'what': 'WHAT',
  'where': 'WHERE',
  'when': 'WHEN',
  'who': 'WHO',
  'why': 'WHY',
  'how': 'HOW',
  'which': 'WHICH'
};

export const useSignLanguage = () => {
  const [currentGloss, setCurrentGloss] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const convertToGloss = useCallback((text: string): string => {
    // Normalize text
    const normalized = text.toLowerCase().trim().replace(/[^\w\s']/g, '');
    
    // Check for phrase mappings first
    for (const [phrase, gloss] of Object.entries(PHRASE_MAPPINGS)) {
      if (normalized.includes(phrase)) {
        return gloss;
      }
    }

    // Split into words and process
    const words = normalized.split(/\s+/);
    const glossWords: string[] = [];

    for (const word of words) {
      // Skip empty words
      if (!word.trim()) continue;
      
      // Skip filler words
      if (FILLER_WORDS.includes(word)) {
        continue;
      }

      // Check word mappings
      if (WORD_MAPPINGS[word]) {
        glossWords.push(WORD_MAPPINGS[word]);
      } else {
        // Check if it's a number
        const num = parseInt(word);
        if (!isNaN(num) && num >= 0 && num <= 999) {
          glossWords.push(num.toString());
        } else {
          // Convert to uppercase for fingerspelling
          glossWords.push(word.toUpperCase());
        }
      }
    }

    return glossWords.join(' ');
  }, []);

  const processText = useCallback((text: string) => {
    setIsProcessing(true);
    const gloss = convertToGloss(text);
    setCurrentGloss(gloss);
    setIsProcessing(false);
    return gloss;
  }, [convertToGloss]);

  const playSignSequence = useCallback(async (
    text: string, 
    setAnimation: (animation: string) => void
  ): Promise<void> => {
    const gloss = processText(text);
    const signs = gloss.split(' ');

    for (const sign of signs) {
      const signKey = getSignKey(sign);
      setAnimation(signKey);
      
      // Adjust timing based on sign complexity
      const duration = getSignDuration(signKey);
      await new Promise(resolve => setTimeout(resolve, duration));
    }
  }, [processText]);

  const getSignKey = (glossWord: string): string => {
    // Enhanced sign mappings
    const signMappings: Record<string, string> = {
      'HELLO': 'hello',
      'GOODBYE': 'goodbye',
      'THANK-YOU': 'thank_you',
      'PLEASE': 'please',
      'YES': 'yes',
      'NO': 'no',
      'I': 'hello', // placeholder - would need specific "I" sign
      'YOU': 'hello', // placeholder
      'SORRY': 'thank_you', // placeholder
      'HELP': 'hello', // placeholder
      'LOVE': 'hello', // placeholder
      'HAPPY': 'hello', // placeholder
      'GOOD': 'hello', // placeholder
      'BAD': 'hello' // placeholder
    };

    if (signMappings[glossWord]) {
      return signMappings[glossWord];
    }

    // Check if it's a number
    const num = parseInt(glossWord);
    if (!isNaN(num) && num >= 0 && num <= 9) {
      return `fingerspell_${num}`;
    }

    // For single letters, use fingerspelling
    if (glossWord.length === 1 && /[A-Z]/.test(glossWord)) {
      return `fingerspell_${glossWord.toLowerCase()}`;
    }

    // For words, fingerspell first letter as fallback
    const firstLetter = glossWord.charAt(0).toLowerCase();
    if (/[a-z]/.test(firstLetter)) {
      return `fingerspell_${firstLetter}`;
    }

    return 'hello'; // Default fallback
  };

  const getSignDuration = (signKey: string): number => {
    // Fingerspelling is faster
    if (signKey.startsWith('fingerspell_')) {
      return 800;
    }
    
    // Regular signs take longer
    return 1500;
  };

  return {
    processText,
    currentGloss,
    playSignSequence,
    isProcessing,
    convertToGloss
  };
};