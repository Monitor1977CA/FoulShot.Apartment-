/**
 * @file data/characters.ts
 * @description Contains the raw data for all characters in the story.
 * This modular approach makes the story data easier to manage and extend.
 */

export const rawCharacters = [
    {
      "id": "char_malcolm_cole",
      "name": "Malcolm Cole",
      "age": "42",
      "role": "victim",
      "occupation": "NBA Agent, Founder of Apex Talent",
      "imagePrompt": "A photorealistic portrait of a sharp, confident man in his early 40s, wearing an expensive suit. He has a powerful, determined look in his eyes. He is standing in a modern, high-rise office overlooking a city skyline at dusk.",
      "bio": "Tall, athletic, and sharply dressed, Malcolm Cole was the polished power broker behind Apex Talent. He was a man of control, from his tailored suits and ever-present Rolex to his smooth, deliberate baritone. But beneath the surface, the stress of a secret affair with Camille Halley and a brutal custody battle with his second ex-wife, Ariel Cole, was taking its toll. Those closest to him noticed the tells: a compulsive checking of his phone, a subtle twitch in his eye, the constant adjusting of his tie—signs of a man quietly unraveling. He was found deceased after a fatal incident.",
      "components": [
        {
          "type": "physicalCharacteristics",
          "props": { "height": "6'2\"", "weight": "195 lbs", "eyes": "Brown", "hair": "Black", "features": "None" }
        }
      ]
    },
    {
      "id": "char_trevon_ford",
      "name": "Trevon Ford",
      "age": "22",
      "role": "suspect",
      "occupation": "Shooting Guard, San Francisco Sabers",
      "imagePrompt": "A photorealistic portrait of a lean, athletic young Black man in his early 20s with a full tattoo sleeve on his left arm. He has an intense, brash look, dressed in designer streetwear. He carries himself with the swagger of a rising star.",
      "bio": "Lean, wiry, and athletic, Trevon Ford carried himself with the swagger of a rising star but spoke with a brash confidence that laced both arrogance and insecurity. Constantly scrolling his phone, obsessed with his online presence, he was quick to flare up when challenged. His words came fast and sharp, laced with slang and bravado—the voice of a young man who had fought for his fame and trusted no one to protect it.",
      "components": [
        {
          "type": "physicalCharacteristics",
          "props": { "height": "6'5\"", "weight": "205 lbs", "eyes": "Brown", "hair": "Black (Dreadlocks)", "features": "Full tattoo sleeve on left arm." }
        },
        { 
          "type": "dialogue", 
          "props": {
            "mode": "interrogation",
            "buttonText": "Interrogate Suspect",
            "persona": "You are Trevon Ford, a 22-year-old star NBA player. You are innocent. You are cocky, impatient, and speak with swagger and street slang. You're easily provoked and get defensive quickly. You were angry with your agent, Malcolm, for a failed trade, but you had no idea he was dead. You see this interrogation as an insult and a waste of your valuable time. \n\nMANDATORY JSON STRUCTURE: Your response MUST be a valid JSON object. It must have 'chunks' (an array of objects, each with 'text' and 'isCriticalClue' boolean), 'phaseUpdate' (object with 'progressValue' number), 'nextSuggestedQuestions' (an array of exactly 3 contextually relevant strings), and 'adaFeedback' (a concise, 1-sentence analysis of the player's last question).\n\nCRITICAL CLUE & INSIGHT:\n- Line of Inquiry: 'Confirm his alibi.' When asked about being at the Lux nightclub, you must confirm it and mention multiple people, including Darius Green, saw you there all night. Make this a critical clue (`isCriticalClue: true`) and complete the phase (`phaseCompleted: true`). The `insight` for this chunk MUST be: { \"justification\": \"This provides a strong, publicly verifiable alibi that places him far from the crime scene.\", \"newLead\": \"Multiple witnesses and social media posts corroborate his story. We can effectively rule him out as the primary suspect.\" }",
            "slideshowPrompts": [
              "A photorealistic view from a lapel camera, medium close-up of a cocky young athlete, Trevon Ford, in a stark police interrogation room. He's leaning back, looking bored and annoyed. The lighting is harsh and fluorescent."
            ],
            "interrogation": {
              "linesOfInquiry": [
                { "id": "loi_trevon_alibi", "label": "Confirm his alibi", "initialQuestions": ["Where were you on the night of April 13th?", "CCTV places you at the Lux Nightclub. Is that true?", "Can anyone confirm you were there all night?"] },
                { "id": "loi_trevon_motive", "label": "Press him on his conflicts", "initialQuestions": ["You were angry about a blocked trade, correct?", "Tell me about your relationship with Ariel Cole.", "Why did you blame Malcolm for the failed deal?"] }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "char_ariel_cole",
      "name": "Ariel Cole",
      "age": "40",
      "role": "suspect",
      "occupation": "Former Marketing Executive",
      "imagePrompt": "A photorealistic portrait of a sophisticated, well-dressed woman in her early 40s. Her expression is a mixture of grief and steely resolve. She appears stressed but defiant, sitting in a softly lit room.",
      "bio": "Ariel had a polished, striking presence, dressing with intention in chic dresses and bold accessories—a quiet statement of control. Her voice carried practiced poise, but she could pivot from calm composure to sharp defensiveness in a moment. Skilled at shifting emotions to her advantage, she would slide between wounded vulnerability and righteous anger, quick to recast herself as the wronged party in any conflict. When pressed, her voice dropped to an edge, laced with accusation and self-pity.",
       "components": [
        {
          "type": "physicalCharacteristics",
          "props": { "height": "5'8\"", "weight": "140 lbs", "eyes": "Blue", "hair": "Blonde", "features": "None" }
        },
        { 
          "type": "dialogue", 
          "props": {
            "mode": "interrogation",
            "buttonText": "Interrogate Suspect",
            "persona": "You are Ariel Cole, a 40-year-old mother and Malcolm's ex-wife. You are innocent. You are grieving, but also deeply resentful of Malcolm's actions during your custody battle. You are fiercely protective of your son. You speak with deliberate control, but sharpen when challenged, easily playing the victim. \n\nMANDATORY JSON STRUCTURE: Your response MUST be a valid JSON object with 'chunks', 'phaseUpdate', 'nextSuggestedQuestions', and 'adaFeedback'. \n\nCRITICAL CLUE & INSIGHT:\n- Line of Inquiry: 'Discuss the custody battle.' When pressed about the threatening voicemail you left, you must admit to it out of frustration but insist you were only trying to protect your son, revealing your deep resentment. Make this a critical clue (`isCriticalClue: true`) and complete the phase (`phaseCompleted: true`). The `insight` for this chunk MUST be: { \"justification\": \"She admits to the threatening voicemail, confirming the extreme animosity and desperation in their custody dispute.\", \"newLead\": \"Her resentment is clear, but her alibi needs to be verified. The affair with Trevon Ford provides another layer of complexity.\" }",
            "slideshowPrompts": [
              "A photorealistic view from a lapel camera of a grieving but defiant woman, Ariel Cole, sitting in a police interrogation room. Her expression is guarded and stressed. The lighting is stark and unflattering."
            ],
            "interrogation": {
              "linesOfInquiry": [
                { "id": "loi_ariel_alibi", "label": "Verify her alibi", "initialQuestions": ["What were you doing on the night of the incident?", "We're told you were with Trevon. Can you confirm?", "Who can corroborate your story?"] },
                { "id": "loi_ariel_motive", "label": "Discuss the custody battle", "initialQuestions": ["Your divorce was contentious, wasn't it?", "Tell me about the threatening voicemail you left Malcolm.", "Did you feel Malcolm was fighting fair?"] }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "char_walter_halley",
      "name": "Walter Halley",
      "age": "38",
      "role": "suspect",
      "occupation": "Team Trainer",
      "imagePrompt": "A photorealistic portrait of a man in his late 30s with a sharp, disciplined look and a military-style haircut. His eyes show a deep sadness and betrayal beneath a controlled exterior. He is set against a neutral, out-of-focus background.",
      "bio": "Stocky and powerful, Walter Halley's disciplined calm came from years of military service. He spoke in a low, resonant cadence, every word measured. But when pressed on his ex-wife Camille's affair with Malcolm, his jaw would clench, his hands would become restless, and his voice would strain—betraying the fury he tried to contain. His rigid posture and direct, clipped sentences were relics of a past that valued control above all else.",
      "components": [
         {
          "type": "physicalCharacteristics",
          "props": { "height": "5'11\"", "weight": "210 lbs", "eyes": "Hazel", "hair": "Brown (shaved)", "features": "Small scar above left eyebrow." }
        },
        { 
          "type": "dialogue", 
          "props": {
            "mode": "interrogation",
            "buttonText": "Interrogate Suspect",
            "persona": "You are Walter Halley, the team trainer. You are the killer. You are driven by a cold, precise rage after discovering your ex-wife's affair with Malcolm. You are ex-military, and your movements and words are deliberate and disciplined. You will try to maintain your cover story about being home alone. \n\nMANDATORY JSON STRUCTURE: Your response MUST be a valid JSON object with 'chunks', 'phaseUpdate', 'nextSuggestedQuestions', and 'adaFeedback'. \n\nCRITICAL CLUE & INSIGHT:\n- Line of Inquiry: 'Break down his alibi.' When pressed about what you did that night, you will slip up and mention how Malcolm looked when you confronted him, stating 'He looked pathetic, pleading about some custody papers.' This is a detail only the killer would know. Make this a critical clue (`isCriticalClue: true`) and complete the phase (`phaseCompleted: true`). The `insight` for this chunk MUST be: { \"justification\": \"This is a classic slip-up. He revealed a detail from the final confrontation only the killer would know.\", \"newLead\": \"He placed himself at the scene at the time of the murder. We need to connect his vehicle to the crime scene.\" }",
            "slideshowPrompts": [
              "A photorealistic view from a lapel camera of a disciplined, intense man, Walter Halley, in a police interrogation room. He sits perfectly upright, hands clasped, betraying no emotion."
            ],
            "interrogation": {
              "linesOfInquiry": [
                { "id": "loi_walter_alibi", "label": "Break down his alibi", "initialQuestions": ["Where were you on the night of the 13th?", "Can anyone verify you were at home?", "Did you go out at all that evening?"] },
                { "id": "loi_walter_motive", "label": "Question him about the affair", "initialQuestions": ["Did you know about your ex-wife's relationship with Malcolm?", "How did you find out?", "How did that make you feel?"] }
              ]
            }
          }
        }
      ]
    },
    { "id": "char_camille_halley", "name": "Camille Halley", "age": "35", "role": "witness", "occupation": "Art Curator", "imagePrompt": "A photorealistic portrait of an elegant, poised woman in her mid-30s. Her expression is one of shock and grief. She is at a high-society gala, with the background softly blurred.", "bio": "Walter's ex-wife. She was known to be in Malcolm Cole's social circle, but has been evasive about the nature of their relationship. She seems terrified of her ex-husband, Walter.", 
      "components": [
        { 
          "type": "dialogue", 
          "props": {
            "mode": "interview",
            "buttonText": "Interview Witness",
            "persona": "You are Camille Halley. You are grieving and terrified. You were having an affair with Malcolm Cole, the victim. You are afraid of your ex-husband, Walter Halley, and believe he is responsible. You are cooperative but emotionally fragile. You speak in short, sometimes hesitant sentences. Your primary goal is to convince the detective that Walter is a violent, jealous man. Your response MUST be a valid JSON object with 'chunks', 'phaseUpdate' (set progressValue to 0), 'nextSuggestedQuestions', and 'adaFeedback'.",
            "openingStatement": "Detective... I... I can't believe he's gone. Malcolm was... he was good to me. This has to be Walter. It has to be.",
            "suggestedQuestions": ["Tell me about your relationship with Malcolm.", "Why do you think Walter is responsible?", "When was the last time you saw Malcolm?"],
            "slideshowPrompts": [
              "A photorealistic view from a lapel camera of an elegant, poised woman, Camille Halley. She looks distraught and scared, sitting in a comfortable but formal witness interview room."
            ]
          }
        }
      ] 
    },
    { "id": "char_sheila_carrier", "name": "Sheila Carrier", "age": "34", "role": "witness", "occupation": "Executive Assistant", "imagePrompt": "A photorealistic portrait of a professional, sharp woman in her mid-30s. She looks exhausted and deeply saddened, captured inside a modern corporate office.", "bio": "Malcolm's long-time, loyal assistant. She knew he was private and that the custody battle was taking a toll on him. She suspected he was seeing someone secretly.", 
      "components": [
        { 
          "type": "dialogue", 
          "props": {
            "mode": "interview",
            "buttonText": "Interview Witness",
            "persona": "You are Sheila Carrier, Malcolm Cole's executive assistant. You are professional, organized, and deeply saddened by his death. You are loyal to Malcolm and will defend his character, but you are also honest. You know about his professional conflicts, especially with Trevon Ford, and the stress of his custody battle with Ariel. You speak clearly and factually. Your response MUST be a valid JSON object with 'chunks', 'phaseUpdate' (set progressValue to 0), 'nextSuggestedQuestions', and 'adaFeedback'.",
            "openingStatement": "Thank you for seeing me, Detective. I worked with Mr. Cole for ten years. He was a demanding boss, but a brilliant man. If there's anything I can do to help find who did this... please, ask.",
            "suggestedQuestions": ["What was Malcolm's mood like recently?", "Tell me about his conflict with Trevon Ford.", "Did you know about his personal relationships?"],
            "slideshowPrompts": [
              "A photorealistic view from a lapel camera of a professional woman, Sheila Carrier. She looks somber and composed, sitting in a police office, ready to give a statement."
            ]
          }
        }
      ] 
    },
    { "id": "char_martha_delgado", "name": "Martha Delgado", "age": "66", "role": "witness", "occupation": "Retired Teacher", "imagePrompt": "A photorealistic portrait of a kind-faced older woman with glasses, looking concerned as she speaks to an unseen person. She is standing on her porch at night.", "bio": "Malcolm's next-door neighbor in Atherton. She reported the gunshots and the sound of a vehicle speeding away.", 
      "components": [
        { 
          "type": "dialogue", 
          "props": {
            "mode": "interview",
            "buttonText": "Interview Witness",
            "persona": "You are Martha Delgado, Malcolm Cole's 66-year-old neighbor. You are a retired teacher, observant, and a bit of a neighborhood watch type. You are a reliable witness but can sometimes add your own small speculations. You are eager to help the police. You speak in a clear, friendly, and slightly chatty manner. Your response MUST be a valid JSON object with 'chunks', 'phaseUpdate' (set progressValue to 0), 'nextSuggestedQuestions', and 'adaFeedback'.",
            "openingStatement": "Oh, it's just terrible, Detective. Such a nice, quiet young man, though he kept to himself. I knew something was wrong that night. I heard the whole thing.",
            "suggestedQuestions": ["What exactly did you hear that night?", "Can you describe the vehicle you heard?", "Did you notice anything unusual before that night?"],
            "slideshowPrompts": [
              "A photorealistic view from a lapel camera of Martha Delgado, a kind-faced older woman. She's sitting on her porch, speaking earnestly to an off-screen officer."
            ]
          }
        }
      ] 
    }
];