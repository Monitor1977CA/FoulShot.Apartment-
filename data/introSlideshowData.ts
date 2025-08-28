/**
 * @file data/introSlideshowData.ts
 * @description This file contains the complete dataset for the introductory slideshow.
 * This data-driven approach allows for easy modification of the intro sequence without
 * changing any component code.
 */

export interface IntroSlide {
  id: string;
  imagePrompt: string;
  narration: string;
}

export const introSlideshowData: IntroSlide[] = [
  {
    id: 'intro-1',
    imagePrompt: "A photorealistic shot of a powerful, determined man in an expensive suit, Malcolm Cole, standing in a high-rise office, looking out over a glowing city at night. His reflection in the glass shows a faint image of a basketball court.",
    narration: "In the high-stakes world of pro basketball, Malcolm Cole wasn't just an agent. He was an architect of dynasties, a keeper of secrets."
  },
  {
    id: 'intro-2',
    imagePrompt: "A photorealistic, tense shot of an explosive, athletic basketball player, Trevon Ford, arguing heatedly with his agent, Malcolm Cole, in a locker room. The lighting is harsh and the atmosphere is charged with conflict.",
    narration: "His star client, Trevon Ford, blamed him for a failed trade. In a league of big egos, betrayal cuts deep."
  },
  {
    id: 'intro-3',
    imagePrompt: "A photorealistic image of a sophisticated woman, Ariel Cole, sitting across from a lawyer in a sterile conference room. Her face is etched with stress. A legal document with the name 'Cole v. Cole' is on the table in sharp focus.",
    narration: "His ex-wife, Ariel, was locked in a contentious custody battle with him. She claimed he was using his power to ruin her."
  },
  {
    id: 'intro-4',
    imagePrompt: "A photorealistic shot of a disciplined, intense man, Walter Halley, standing in the shadows of a gym, looking at a photo on his phone. The phone's screen shows a picture of his ex-wife with another man. His expression is one of grim resolve.",
    narration: "And then there was Walter Halley, the team trainer. A quiet man who just discovered his ex-wife's new secret: Malcolm Cole."
  },
  {
    id: 'intro-5',
    imagePrompt: "A photorealistic shot of the living room of a luxurious, modern home at night. It's empty and silent. Small numbered paper evidence tags dot the floor where an incident occurred. The scene is still and full of dread.",
    narration: "On April 13th, at a private Airbnb, Malcolm's carefully constructed world came crashing down."
  },
  {
    id: 'intro-6',
    imagePrompt: "A photorealistic, close-up photograph of five small, spent brass cartridges lying on a polished hardwood floor. Numbered paper evidence tags are placed next to them. The lighting is from a forensic investigator's flashlight.",
    narration: "Five sharp sounds, like thunderclaps. No weapon. No witnesses. Just a whisper of a loud engine speeding into the night."
  },
  {
    id: 'intro-7',
    imagePrompt: "A photorealistic image of the front of a luxurious modern home at dawn. Yellow police tape is stretched across the door. The windows are dark. The red and blue lights from an official police vehicle flash against the house.",
    narration: "Three suspects. A web of secrets. And an incident that shook the league to its core. The game is over. The investigation has just begun."
  }
];