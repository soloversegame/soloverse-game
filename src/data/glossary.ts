 export interface Subtype {
  name: string;
  description: string;
  nested?: string[]; // Optional nested bullet points
}

export interface GlossaryEntry {
  title: string;
  definition: string;
  subtypes?: Subtype[]; // The '?' means other terms don't need this field at all
  example?: string; // Optional field—no nulls needed on other terms
}

export const glossary: Record<string, GlossaryEntry> = {
  "draw": {
    title: "Draw",
    definition: "Take Cards from the Deck, while following Trap Effects."
  },
  "deal": {
    title: "Deal",
    definition: "Take Cards from the Deck, while ignoring all Trap Effects."
  },
  "playable-turn": {
    title: "Playable Turn",
    definition: "Start Your Turn while NOT facing Card Effects, allowing You to chose any Card You want to Play."
  },
  "miss-their-turn": {
    title: "Miss Their Turn",
    definition: "A Card Effect that prevents You from Playing that Turn. Generally additional Effects like Draw Effects are added, but not always."
  },
  // Complex term with subtypes and nested lists
  "targeted": {
    title: "Targeted",
    definition: "A Card Effect that affects another Player or Card Effect.",
    subtypes: [
      {
        name: "Targeting Types",
        description: "",
        nested: [
          '<strong>Self Targeting:</strong> Only You are affected.',
          '<strong>Next Targeting:</strong> The Next Player in Play Order.',
          '<strong>Group Targeting:</strong> Everyone in the Game.',
          '<strong>Specific Targeting:</strong> A Specific Player of Your Choice.'
        ]
      },
      {
        name: "Unique Targeting Types",
        description: "",
        nested: [
          '<strong>Victory Targeting:</strong> This is what <strong>"Anti-Fun"</strong> uses to stop someone from Winning.',
          '<strong>Unknown Targeting:</strong> Multiple Targeting Types available.',
          '<strong>Assassin Targeting:</strong> Only Targets the Effects of the Assassin Chaos Card.',
          '<strong>Conceptual Targeting:</strong> Targets the Rules of the Game.'
        ]
      }
    ]
  },
  "stackable": {
    title: "Stackable",
    definition: "A Card that can be Played to continue and build the Effect onto another Player."
  },
  "respond-in-kind": {
    title: "Respond in Kind",
    definition: 'The action of placing a Playable Card that allows You to <a href="#glossary:stackable">Stack</a> an Effect onto another Player or <a href="#glossary:counter">Counter</a> that Effect back at the previous Player. Responding in Kind is NOT considered a Playable Turn.'
  },
  "counter": {
    title: "Counter",
    definition: "A Card Effect that generally throws a Counterable Effect back at the Player that Targeted You. Some Counter Effects prevent certain Game Conditions.",
    example: '<strong>"Anti-Fun"</strong> allows You to cancel a Player\'s Win.'
  }
};