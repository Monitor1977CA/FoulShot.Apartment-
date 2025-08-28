/**
 * @file data/objects.ts
 * @description Contains the raw data for all story objects (evidence) in the story.
 * This modular approach makes the story data easier to manage and extend.
 * It has been expanded with over 45 new objects to populate character asset categories.
 */

import { StoryObject } from '../types';

export const rawObjects: Omit<StoryObject, 'isEvidence' | 'assignedToSuspectIds'>[] = [
    // --- Crime Scene Objects (Atherton Airbnb) ---
    { "id": "obj_shell_casings", "name": "9mm Shell Casings", "unidentifiedDescription": "Five spent shell casings are clustered on the floor, glinting under the harsh light of a forensic lamp. They appear to be from a device, ejected in a tight grouping that suggests the person stood their ground.", "description": "Forensic analysis confirms all five 9mm casings were fired from a single device. The tight grouping suggests the person was stationary and deliberate. We're running the firing pin impressions against national databases, but so far, no matches.", "category": "physical", "locationFoundId": "loc_atherton_airbnb_foyer", "timestamp": "2025-04-13T23:35:00Z", "costToUnlock": 10, "hasBeenUnlocked": false, "rarity": "material", "imagePrompt": "A photorealistic, close-up photograph of five spent brass 9mm cartridges on a dark, polished hardwood floor. An evidence marker with the number '1' is placed beside them. The scene is lit by a stark, clinical flash, casting sharp shadows. Modern crime scene photo.", "tags": ["means"], "metadata": { "unlocksCaseFileClueId": "clue-means-primary" },
      "forensicDetails": {
        "analysis": "Five 9mm casings were recovered from the primary scene. The extractor and ejector markings are consistent across all five, confirming they were fired from a single device. The firing pin impression is ovoid with a distinct drag mark, a signature that, while not unique, is common to a specific family of aftermarket components often used in unserialized firearms.",
        "findings": [
          "Caliber: 9x19mm Luger.",
          "Manufacturer: Sterling Munitions (Lot #SM-44B-2024).",
          "Condition: Recently fired, minimal corrosion.",
          "Database Cross-reference: No matches found in NIBIN for the firing pin signature."
        ],
        "labNotes": "The tight grouping of the casings suggests a stationary shooter who did not move significantly between shots. The lack of brass deformation indicates a firearm in good working condition. Sterling is a common brand, difficult to trace. The focus should be on locating a device with a matching aftermarket striker."
      },
      "forensicScan": {
        "traces": [
          {
            "id": "trace_casings_headstamp",
            "label": "Manufacturer's Stamp",
            "coords": { "x": 0.5, "y": 0.3, "radius": 15 }
          },
          {
            "id": "trace_casings_firingpin",
            "label": "Firing Pin Impression",
            "coords": { "x": 0.4, "y": 0.6, "radius": 15 }
          },
          {
            "id": "trace_casings_extractor",
            "label": "Extractor Markings",
            "coords": { "x": 0.75, "y": 0.5, "radius": 20 },
            "linkToObjectIds": ["obj_walter_file_3"],
            "finding": {
              "name": "Ballistic Signature Profiled",
              "imagePrompt": "A photorealistic image of a forensic lab computer screen showing two microscopic images of shell casings side-by-side. The unique scratch marks on both are circled in glowing red, indicating a perfect match. The style is clean and clinical.",
              "description": "The unique extractor markings on these casings are consistent with a 9mm firearm of the type Walter Halley reported stolen. While not a definitive match without the weapon itself, it establishes a direct and critical link between the suspect and the crime scene.",
              "timestamp": "2025-04-14T11:00:00Z",
              "locationFoundId": "loc_forensic_lab",
              "rarity": "critical",
              "category": "testimony_fragment",
              "tags": ["means", "motive"]
            }
          }
        ]
      },
      "components": []
    },
    { "id": "obj_bloodstain", "name": "Dark Stain", "unidentifiedDescription": "A dark stain mars the otherwise pristine floor. Someone seems to have tried to wipe it up in a hurry, leaving streaks and smears. It has a faint, coppery smell.", "description": "Lab analysis confirms the stain is organic, a biological match for the victim, Malcolm Cole. The smear pattern indicates a hasty attempt was made to clean the scene, suggesting the perpetrator tried to conceal evidence.", "category": "physical", "locationFoundId": "loc_atherton_airbnb_foyer", "timestamp": "2025-04-13T23:34:00Z", "costToUnlock": 10, "hasBeenUnlocked": false, "rarity": "material", "imagePrompt": "Photorealistic close up on a dark, sticky stain on a hardwood floor. Streaks show a hasty attempt to clean it. The lighting is harsh and direct, from a forensic flashlight.", "tags": ["means", "opportunity"],
      "forensicDetails": {
        "analysis": "Luminol testing revealed significant spatter that was not visible to the naked eye, indicating a struggle. A sample collected from the visible stain was confirmed via DNA analysis to belong to the victim, Malcolm Cole. The partial cleaning attempt suggests the perpetrator was conscious of leaving evidence behind and tried to remove it.",
        "findings": [
          "DNA Match: Positive for Malcolm Cole.",
          "Blood Type: O-negative.",
          "Spatter Pattern: Indicates blunt force trauma or a secondary wound site.",
          "Cleaning Agent: Negative for bleach or other chemical cleaners."
        ],
        "labNotes": "The attempt to clean the stain is, in itself, a significant piece of evidence. It points to consciousness of guilt. The lack of any other DNA in the sample is also noteworthy."
      },
      "components": []
    },
    { "id": "obj_overturned_vase", "name": "Overturned Vase", "unidentifiedDescription": "A heavy crystal vase lies on its side, water and white lilies spilled across the floor. It seems to have been knocked from a nearby entryway table during some kind of commotion.", "description": "The heavy crystal vase was knocked from its table, indicating a commotion or sudden movement near the entryway. Fingerprint analysis of the vase and surrounding area is inconclusive due to smudging.", "category": "physical", "locationFoundId": "loc_atherton_airbnb_foyer", "timestamp": "2025-04-13T23:33:00Z", "costToUnlock": 5, "hasBeenUnlocked": false, "rarity": "circumstantial", "imagePrompt": "A photorealistic image of an overturned crystal vase on a floor, with water and white flowers spilled around it. The scene suggests a recent struggle. The lighting is dim and atmospheric, with a single focused light source.", "tags": ["opportunity"],
      "forensicDetails": {
        "analysis": "The position of the vase and the splash pattern of the water suggest it was knocked from the entryway console with considerable force, likely during a physical confrontation. The object's weight (4.5 lbs) means it wouldn't be easily toppled.",
        "findings": [
          "Fingerprints: Multiple partial prints were lifted, but all were too smudged for positive identification.",
          "Damage: No chips or cracks on the vase itself, indicating it fell onto the carpeted area."
        ],
        "labNotes": "The key takeaway is the evidence of a confrontation. This wasn't a clean, surprise attack. There was a confrontation immediately upon the victim or suspect entering the residence."
      },
      "components": []
    },
    { "id": "obj_peel_out_tracks", "name": "Tire Tracks", "unidentifiedDescription": "Dark, aggressive tire marks are scorched onto the asphalt in front of the house. They tell a story of a vehicle leaving in a great hurry, its tires digging into the pavement with violent force.", "description": "The aggressive peel-out marks indicate a vehicle with high torque and a heavy-duty, all-terrain tread pattern. The width and wheelbase are consistent with a full-size pickup truck. Our lab is currently analyzing the rubber compound for more specific manufacturer details.", "category": "physical", "locationFoundId": "loc_atherton_airbnb", "timestamp": "2025-04-13T23:40:00Z", "costToUnlock": 10, "hasBeenUnlocked": false, "rarity": "material", "imagePrompt": "Photorealistic, top-down shot of dark tire marks peeling out on a wet asphalt road in front of a modern house at night. The tracks are glossy under the streetlights. Modern crime scene photo.", "tags": ["opportunity", "means"], "metadata": { "unlocksCaseFileClueId": "clue-opp-primary" },
      "forensicDetails": {
        "analysis": "Analysis of the tire tracks indicates they were left by a heavy vehicle with significant horsepower, accelerating rapidly from a stationary position. The tread pattern is distinctive, with deep grooves and asymmetrical lugs characteristic of a high-end, all-terrain tire. The wheelbase measurement (145 inches) strongly suggests a full-size American pickup truck.",
        "findings": [],
        "labNotes": "The rubber compound contains trace elements of red clay, not common to the Atherton area. This could suggest where the vehicle was prior to arriving at the scene. Focus should be on identifying the specific tire model, as it is not a standard factory issue."
      },
      "forensicScan": {
        "traces": [
          { "id": "trace_tire_1", "label": "Tread Pattern", "coords": { "x": 0.5, "y": 0.25, "radius": 20 }, "scanGroupId": "group_tire_analysis" },
          { "id": "trace_tire_2", "label": "Rubber Compound", "coords": { "x": 0.3, "y": 0.5, "radius": 20 }, "scanGroupId": "group_tire_analysis" },
          { "id": "trace_tire_3", "label": "Clay Deposits", "coords": { "x": 0.7, "y": 0.7, "radius": 20 }, "scanGroupId": "group_tire_analysis" }
        ],
        "groups": [
          {
            "id": "group_tire_analysis",
            "requiredScans": 3,
            "linkToObjectIds": ["obj_ford_f150"],
            "finding": {
              "name": "Tire Tread Identified",
              "imagePrompt": "A photorealistic image of a computer screen in a forensic lab displaying a 3D model of a tire tread. Text overlays label it 'Goliath All-Terrain XT'. The style is clean, modern, and detailed.",
              "description": "The composite analysis of the tread pattern, rubber compound, and clay deposits identifies the specific tire model as 'Goliath All-Terrain XT'. This is a specialized, aftermarket tire favored by off-road enthusiasts.",
              "timestamp": "2025-04-14T14:00:00Z",
              "locationFoundId": "loc_forensic_lab",
              "rarity": "critical",
              "category": "testimony_fragment",
              "tags": ["means"]
            }
          }
        ]
      },
      "components": []
    },
    { "id": "obj_wine_glasses_used", "name": "Used Wine Glasses", "unidentifiedDescription": "Two elegant wine glasses sit on a table, both containing the dregs of a rich red wine. The rims both bear a faint, matching smudge of dark red lipstick, suggesting an intimate, recently interrupted evening.", "description": "Two wine glasses, both with traces of the same expensive merlot and a distinct shade of 'Crimson Kiss' lipstick. The placement suggests an intimate, recently interrupted meeting. We've sent a sample of the lipstick for brand identification.", "category": "physical", "locationFoundId": "loc_atherton_airbnb_kitchen", "timestamp": "2025-04-13T22:30:00Z", "costToUnlock": 5, "hasBeenUnlocked": false, "rarity": "circumstantial", "imagePrompt": "A photorealistic image of two used wine glasses on a modern coffee table in a dimly lit room. Both glasses have subtle lipstick stains on the rim. The atmosphere is quiet and suspenseful.", "tags": ["motive"],
      "forensicDetails": {
        "analysis": "Two glasses, indicating a meeting between two individuals. Both glasses show lipstick traces from the same source. DNA swabs from both rims were taken; one matches the victim, Malcolm Cole. The other is from an unidentified female.",
        "findings": [
          "Beverage: Merlot, Chateau St. Michelle, 2018.",
          "Lipstick: Confirmed as 'Crimson Kiss' by Guerlain.",
          "DNA: Sample A matches victim. Sample B (female) is being run against our database."
        ],
        "labNotes": "The scene was set for an intimate evening. The presence of lipstick on both glasses is unusual. Did they share a glass? Or was one a toast? The key is identifying the source of DNA Sample B."
      },
      "components": []
    },
    { "id": "obj_dirty_plates", "name": "Dirty Plates", "unidentifiedDescription": "Two plates hold the remains of a steak dinner. The food is barely touched, the cutlery cast aside as if the diners were suddenly and unexpectedly interrupted.", "description": "The remains of a dinner for two people, abandoned mid-meal. Analysis of the food is pending, but the scene suggests the victim was not alone and that their dinner was abruptly cut short.", "category": "physical", "locationFoundId": "loc_atherton_airbnb_kitchen", "timestamp": "2025-04-13T22:31:00Z", "costToUnlock": 0, "hasBeenUnlocked": false, "rarity": "irrelevant", "imagePrompt": "A photorealistic, top-down shot of two dirty plates with cutlery, showing the remains of a steak dinner for two. The food is barely touched. The lighting is sterile and direct.", "tags": [],
      "forensicDetails": {
        "analysis": "Two place settings with remains of a steak dinner. Both meals were barely eaten, suggesting the diners were interrupted shortly after being served. No signs of tampering or poisoning in the food samples.",
        "findings": [
          "Meal: Steak (medium-rare), asparagus, mashed potatoes.",
          "Toxicology: Negative for common poisons or drugs."
        ],
        "labNotes": "While not physical evidence, this item confirms a narrative beat: a planned dinner, cut short. The interruption was likely the arrival of the perpetrator."
      },
      "components": []
    },
    { "id": "obj_fridge_photos", "name": "Refrigerator Photos", "unidentifiedDescription": "A collection of children's drawings and a candid photo of a man and a small child, smiling, are held to the stainless steel refrigerator by colorful magnets. A small window into a life beyond business.", "description": "A photo of Malcolm and his toddler son, Kase, at a local park. A reminder of his life outside his high-powered career.", "category": "physical", "locationFoundId": "loc_atherton_airbnb_kitchen", "timestamp": "2025-04-10T00:00:00Z", "costToUnlock": 0, "hasBeenUnlocked": false, "rarity": "irrelevant", "imagePrompt": "A realistic photo of a smiling father and his young son at a park, held to a stainless steel refrigerator by a colorful alphabet magnet. The lighting is warm and natural.", "tags": [],
      "forensicDetails": {
        "analysis": "A collection of personal effects, including children's art and a photograph of the victim with his son. These items establish a personal context for the victim, humanizing him beyond the scope of the case.",
        "findings": ["Item logged for personal context."],
        "labNotes": "Serves as a reminder of the victim's life and the ongoing custody battle, which may be relevant to motive."
      },
      "components": []
    },
    { "id": "obj_childrens_toys", "name": "Children's Toys", "unidentifiedDescription": "A small pile of colorful building blocks and a well-loved stuffed giraffe are on the bedroom floor, as if a child had recently been playing here, temporarily turning this luxurious space into a playroom.", "description": "Toys belonging to Malcolm's son, Kase. He likely had his son stay with him at the Airbnb.", "category": "physical", "locationFoundId": "loc_atherton_airbnb_bedroom", "timestamp": "2025-04-13T00:00:00Z", "costToUnlock": 0, "hasBeenUnlocked": false, "rarity": "irrelevant", "imagePrompt": "A photorealistic shot of a small pile of colorful children's building blocks and a stuffed animal on the carpet of a luxurious bedroom. Natural light comes from a window.", "tags": [],
      "forensicDetails": { "analysis": "Confirms victim's son was recently at the location. Corroborates testimony regarding custody arrangements.", "findings": ["Item logged for personal context."] },
      "components": []
    },
    { "id": "obj_ladies_underwear", "name": "Ladies' Underwear", "unidentifiedDescription": "A delicate piece of black lace underwear is tangled in a pile of men's clothing in the laundry hamper. It's clearly out of place.", "description": "A pair of women's lace underwear found in the victim's laundry. This confirms he had a female guest at the Airbnb, likely the person he was having dinner with. We are running DNA tests on the garment.", "category": "physical", "locationFoundId": "loc_atherton_airbnb_bedroom", "timestamp": "2025-04-13T20:00:00Z", "costToUnlock": 5, "hasBeenUnlocked": false, "rarity": "circumstantial", "imagePrompt": "A realistic photo of a piece of black lace lingerie partially visible amongst men's shirts and socks in a wicker laundry hamper.", "tags": ["motive"],
      "forensicDetails": {
        "analysis": "DNA analysis of the garment confirms the primary wearer was Camille Halley, Walter Halley's ex-wife. This physically places her at the scene and confirms the affair.",
        "findings": ["DNA Match: Positive for Camille Halley."],
        "labNotes": "This is a direct link between the victim and one of the key players in the case. The affair is no longer speculation."
      },
      "components": []
    },
    { "id": "obj_bible", "name": "Nightstand Bible", "unidentifiedDescription": "A standard hotel bible rests on the nightstand, its cover worn from countless anonymous hands. It seems untouched.", "description": "A Gideons Bible, standard issue for hotels and rentals. No markings or signs of use.", "category": "physical", "locationFoundId": "loc_atherton_airbnb_bedroom", "timestamp": "2025-04-13T00:00:00Z", "costToUnlock": 0, "hasBeenUnlocked": false, "rarity": "irrelevant", "imagePrompt": "A photorealistic shot of a simple bible with a dark cover on a wooden nightstand in a dimly lit room.", "tags": [],
      "forensicDetails": { "analysis": "Standard rental furnishing. No forensic value.", "findings": ["Item logged and dismissed."] },
      "components": []
    },
    { "id": "obj_antidepressants", "name": "Antidepressants", "unidentifiedDescription": "A prescription bottle for a common antidepressant sits in the open nightstand drawer. The label is partially obscured.", "description": "A prescription for Sertraline, filled for Malcolm Cole. The prescription is recent. This suggests he was dealing with significant stress or depression, which could be relevant to the pressures he was under from his divorce and professional life.", "category": "physical", "locationFoundId": "loc_atherton_airbnb_bedroom", "timestamp": "2025-04-01T00:00:00Z", "costToUnlock": 0, "hasBeenUnlocked": false, "rarity": "circumstantial", "imagePrompt": "A realistic photo of a standard-issue orange prescription pill bottle. The focus is sharp on the label, where the name 'Malcolm Cole' is clearly legible.", "tags": ["motive"],
      "forensicDetails": {
        "analysis": "Prescription for Sertraline, a common SSRI. Toxicology reports on the victim confirm the medication was in his system at therapeutic levels. Confirms the victim was undergoing treatment for mental health, likely related to stress.",
        "findings": [
          "Drug: Sertraline, 50mg.",
          "Prescribing Physician: Dr. Elena Vance.",
          "Date Filled: Two weeks prior to incident."
        ],
        "labNotes": "Provides context for the victim's state of mind. The ongoing custody battle and professional pressures were clearly taking a significant toll."
      },
      "components": []
    },

    // --- Apex Talent Office Objects ---
    { "id": "obj_custody_papers_computer", "name": "Digital Custody Papers", "unidentifiedDescription": "A legal document is open on a laptop screen. The header 'IN THE SUPERIOR COURT OF CALIFORNIA' is visible, suggesting a legal dispute.", "description": "A draft of a motion filed by Malcolm's lawyer in his custody battle with Ariel Cole. The motion seeks to strip Ariel of joint custody, citing 'erratic behavior' and 'an unstable environment.' The language is aggressive and suggests an escalation of their legal fight.", "category": "document", "locationFoundId": "loc_apex_offices", "timestamp": "2025-04-12T15:00:00Z", "costToUnlock": 10, "hasBeenUnlocked": false, "rarity": "material", "imagePrompt": "A photorealistic close-up on a laptop screen displaying a legal document. The text is sharp and readable. The words 'MOTION TO MODIFY CUSTODY' are visible and subtly highlighted.", "tags": ["motive"], "metadata": { "unlocksCaseFileClueId": "clue-motive-support-1" },
      "components": [{
        "type": "documentContent",
        "props": {
          "title": "DRAFT: Motion to Modify Custody",
          "sender": "J. P. Morgan & Associates",
          "recipient": "Superior Court of California, County of San Mateo",
          "date": "April 12, 2025",
          "subject": "RE: Cole v. Cole, Case #FAM-2024-8812",
          "body": "Petitioner MALCOLM COLE, by and through his counsel, hereby moves this Court for an order modifying the existing child custody and visitation orders concerning the minor child, KASE COLE.\\n\\nThis motion is made on the grounds that there has been a significant change of circumstances since the entry of the last order. Specifically, Respondent ARIEL COLE has demonstrated a pattern of increasingly erratic and unstable behavior, creating an environment that is detrimental to the well-being of the minor child.\\n\\nPetitioner will present evidence, including but not limited to, testimony from the child's nanny, text message records, and expert witness statements, to substantiate these claims. It is Petitioner's firm belief that it is in the best interest of the minor child to award sole legal and physical custody to Petitioner, with professionally supervised visitation for Respondent.\\n\\nWe pray the Court grant this motion."
        }
      }]
    },
    { "id": "obj_failed_trade_memo", "name": "Failed Trade Memo", "unidentifiedDescription": "A printed internal memo sits on a desk, marked 'CONFIDENTIAL'. The subject line mentions a player's name and a trade deal.", "description": "An internal memo from Malcolm Cole to the SF Sabers front office, officially advising them to pull out of a lucrative trade deal for Trevon Ford. Malcolm cites 'character concerns' and 'off-court distractions' as the reason, effectively blocking a move Trevon desperately wanted. This is concrete proof of the professional conflict between them.", "category": "document", "locationFoundId": "loc_apex_offices", "timestamp": "2025-04-11T10:00:00Z", "costToUnlock": 10, "hasBeenUnlocked": false, "rarity": "material", "imagePrompt": "A photorealistic shot of a printed memo on a dark wood desk. The words 'TRADE CANCELLATION: TREVON FORD' are visible and in sharp focus.", "tags": ["motive"], "metadata": { "unlocksCaseFileClueId": "clue-motive-support-2" },
      "components": [{
        "type": "documentContent",
        "props": {
          "title": "INTERNAL MEMORANDUM",
          "sender": "Malcolm Cole",
          "recipient": "SF Sabers Front Office",
          "date": "April 11, 2025",
          "subject": "CONFIDENTIAL: Recommendation re: Trevon Ford Trade",
          "body": "After extensive consideration, it is my firm recommendation that we withdraw from the proposed three-team trade involving Trevon Ford.\\n\\nWhile the on-court potential is clear, my internal review has raised significant character concerns and flags regarding off-court distractions that I believe pose an unacceptable risk to the franchise.\\n\\nUntil Mr. Ford can demonstrate the maturity and stability required of a franchise player, I cannot, in good conscience, endorse this deal. We will revisit his status prior to the draft. Please halt all negotiations immediately."
        }
      }]
    },
    { "id": "obj_pi_photos_desk", "name": "Private Investigator Photos", "unidentifiedDescription": "A manila envelope lies on a desk. A few glossy photos are peeking out, showing a man and a woman in a clandestine meeting.", "description": "Photos from a private investigator, hired by Walter Halley. The photos clearly show Malcolm Cole and Camille Halley (Walter's ex-wife) in an intimate embrace outside a restaurant. This confirms Walter knew about the affair and was actively investigating it, establishing a powerful motive.", "category": "physical", "locationFoundId": "loc_apex_offices", "timestamp": "2025-04-10T18:00:00Z", "costToUnlock": 15, "hasBeenUnlocked": false, "rarity": "critical", "imagePrompt": "Photorealistic surveillance photos splayed on a desk, showing a man and woman embracing intimately at night outside a restaurant. The shot is slightly grainy, taken from a distance.", "tags": ["motive"], "metadata": { "unlocksCaseFileClueId": "clue-motive-primary" },
      "components": []
    },
    { "id": "obj_ford_jersey", "name": "Ford Jersey", "unidentifiedDescription": "A framed basketball jersey with the name 'FORD' on the back hangs on an office wall. The glass of the frame is cracked, as if something struck it.", "description": "Trevon Ford's jersey, displayed in a cracked frame. The damage suggests a recent, violent outburst took place in this room, likely an argument between Malcolm and Trevon.", "category": "physical", "locationFoundId": "loc_apex_offices_trophy_room", "timestamp": "2025-04-12T17:00:00Z", "costToUnlock": 5, "hasBeenUnlocked": false, "rarity": "circumstantial", "imagePrompt": "A photorealistic image of a framed San Francisco Sabers basketball jersey with the name 'FORD' on it. A large crack spiderwebs across the glass of the frame.", "tags": ["motive"],
      "forensicDetails": { "analysis": "The spiderweb crack in the frame's glass is from a single, high-impact event. The point of impact is centered on the jersey's number. No foreign material was found, suggesting it was struck with a fist or a blunt object already in the room.", "findings": ["Impact point analysis suggests a direct, forceful blow."] },
      "components": []
    },
    { "id": "obj_patched_wall", "name": "Patched Drywall", "unidentifiedDescription": "A small, hastily-repaired patch of drywall is visible on the wall near a piece of art. The paint is a slightly different shade, a sloppy attempt to conceal damage.", "description": "A fresh patch in the drywall, indicating a recent repair. This, along with the cracked jersey frame, is strong evidence of a physical altercation in Malcolm's office shortly before the murder.", "category": "physical", "locationFoundId": "loc_apex_offices_trophy_room", "timestamp": "2025-04-12T17:01:00Z", "costToUnlock": 5, "hasBeenUnlocked": false, "rarity": "circumstantial", "imagePrompt": "A realistic photo of a hastily patched section of drywall on an office wall. The paint is a slightly different shade of off-white, and the texture is uneven.", "tags": ["motive"],
      "forensicDetails": { "analysis": "The spackle is still slightly soft, confirming the repair was made within the last 48-72 hours. Analysis of the dust in the vicinity shows drywall and paint particles, consistent with a repair job.", "findings": ["Repair is less than 72 hours old."] },
      "forensicScan": {
        "traces": [
            { "id": "trace_wall_1", "label": "Paint Discoloration", "coords": { "x": 0.5, "y": 0.5, "radius": 20 }, "scanGroupId": "group_wall_analysis" },
            { "id": "trace_wall_2", "label": "Spackle Compound", "coords": { "x": 0.4, "y": 0.6, "radius": 20 }, "scanGroupId": "group_wall_analysis" },
            { "id": "trace_wall_3", "label": "Microscopic Fibers", "coords": { "x": 0.6, "y": 0.4, "radius": 20 }, "scanGroupId": "group_wall_analysis" }
        ],
        "groups": [{
            "id": "group_wall_analysis",
            "requiredScans": 3,
            "linkToObjectIds": ["obj_trevon_jacket"],
            "finding": {
              "name": "Cashmere Fiber Found",
              "imagePrompt": "A photorealistic, microscopic view of a single, dark blue cashmere fiber against a white background of drywall dust. The image is clean and clinical.",
              "description": "Microscopic analysis of the drywall dust reveals a single, dark blue cashmere fiber embedded in the wet spackle. The fiber is a match for the material used in a limited-edition designer jacket owned by Trevon Ford. This places him at the scene of the argument that caused the damage.",
              "timestamp": "2025-04-14T18:00:00Z",
              "locationFoundId": "loc_forensic_lab",
              "rarity": "critical",
              "category": "trace_evidence",
              "tags": ["motive", "opportunity"]
            }
        }]
      },
      "components": []
    },
    { "id": "obj_cigars_scotch", "name": "Cigars and Scotch", "unidentifiedDescription": "A crystal decanter of expensive scotch and an open box of high-end cigars sit on a lounge table. Two glasses have been used. A scene of a quiet business meeting or a celebration.", "description": "A bottle of Macallan 25 and two glasses, along with a box of Cohiba cigars. A setting for a high-level meeting. DNA analysis of the glasses might reveal who Malcolm met with recently.", "category": "physical", "locationFoundId": "loc_apex_offices_trophy_room", "timestamp": "2025-04-12T18:00:00Z", "costToUnlock": 5, "hasBeenUnlocked": false, "rarity": "circumstantial", "imagePrompt": "A photorealistic shot of a crystal decanter of amber-colored scotch and two glasses next to an open box of cigars on a modern glass table. The lighting is warm and cinematic.", "tags": ["opportunity"],
      "forensicDetails": { 
        "analysis": "DNA from two individuals was found on the glasses. One matches the victim. The other is being cross-referenced. The cigars are Cohiba Behike, extremely rare and expensive.", 
        "findings": ["DNA: Victim (Malcolm Cole)", "DNA: Unidentified Male"],
        "labNotes": "The choice of scotch and cigar suggests a meeting with someone of means and taste."
      },
      "components": [] 
    },

    // --- Data Integrity Fix: Added missing objects from groups ---
    { "id": "obj_ariel_gun", "name": "Ariel's Handgun", "description": "A small .380 ACP handgun, registered to Ariel Cole. It's stored in a locked case. Ballistics confirm it was NOT the murder weapon.", "category": "physical", "ownerCharacterId": "char_ariel_cole", "locationFoundId": "loc_ariel_home_bedroom", "timestamp": "2025-04-14T00:00:00Z", "hasBeenUnlocked": false, "rarity": "irrelevant", "imagePrompt": "A photorealistic shot of a small, sleek .380 ACP handgun in an open, padded case.", "tags": [], "metadata": { "unlocksCaseFileClueId": "clue-means-support-3" }, "components": [] },
    { "id": "obj_ariel_pills", "name": "Ariel's Sleeping Pills", "description": "A prescription for Ambien in Ariel Cole's name. It suggests she may be dealing with stress and sleep issues.", "category": "physical", "ownerCharacterId": "char_ariel_cole", "locationFoundId": "loc_ariel_home_bedroom", "timestamp": "2025-04-14T00:00:00Z", "hasBeenUnlocked": false, "rarity": "irrelevant", "imagePrompt": "A photorealistic shot of a prescription bottle for Ambien, with the name 'Ariel Cole' on the label.", "tags": [], "components": [] },
    { "id": "obj_trevon_painkillers", "name": "Painkillers", "description": "A bottle of prescription-strength painkillers, common for athletes. Non-descript.", "category": "physical", "ownerCharacterId": "char_trevon_ford", "locationFoundId": "loc_sabers_facility_locker_room", "timestamp": "2025-04-14T00:00:00Z", "hasBeenUnlocked": false, "rarity": "irrelevant", "imagePrompt": "A photorealistic image of a generic prescription pill bottle on a wooden shelf.", "tags": [], "components": [] },
    { "id": "obj_trevon_fan_mail", "name": "Fan Mail", "description": "A stack of unopened fan mail. Standard for a high-profile player.", "category": "document", "ownerCharacterId": "char_trevon_ford", "locationFoundId": "loc_sabers_facility_locker_room", "timestamp": "2025-04-14T00:00:00Z", "hasBeenUnlocked": false, "rarity": "irrelevant", "imagePrompt": "A photorealistic shot of a stack of colorful, unopened envelopes in a locker.", "tags": [], "components": [] },
    { "id": "obj_trevon_comp_email", "name": "Draft Email", "description": "An unsent, angry email from Trevon to Malcolm, demanding a trade and threatening to go to the press.", "category": "document", "ownerCharacterId": "char_trevon_ford", "locationFoundId": "loc_trevon_home_office", "timestamp": "2025-04-12T00:00:00Z", "hasBeenUnlocked": false, "rarity": "circumstantial", "imagePrompt": "A photorealistic shot of an email draft on a computer screen. The text is angry and full of typos.", "tags": ["motive"], "components": [] },
    { "id": "obj_trevon_comp_draft", "name": "Public Statement Draft", "description": "A draft of a public statement Trevon was preparing, airing his grievances with his agent and the team.", "category": "document", "ownerCharacterId": "char_trevon_ford", "locationFoundId": "loc_trevon_home_office", "timestamp": "2025-04-12T00:00:00Z", "hasBeenUnlocked": false, "rarity": "circumstantial", "imagePrompt": "A photorealistic shot of a word processor document titled 'My Side of the Story'.", "tags": ["motive"], "components": [] },
    { "id": "obj_walter_photos", "name": "Family Photos", "description": "Several framed photos of Walter and Camille Halley from happier times. They stand in stark contrast to the messy room.", "category": "physical", "ownerCharacterId": "char_walter_halley", "locationFoundId": "loc_walter_home_living_room", "timestamp": "2025-04-14T00:00:00Z", "hasBeenUnlocked": false, "rarity": "circumstantial", "imagePrompt": "A photorealistic image of several framed photos on a mantelpiece showing a happy couple.", "tags": ["motive"], "components": [] },
    { "id": "obj_whisky_bottles", "name": "Empty Whisky Bottles", "description": "Several empty bottles of high-end whisky are on the coffee table and in the trash, indicating heavy drinking.", "category": "physical", "ownerCharacterId": "char_walter_halley", "locationFoundId": "loc_walter_home_living_room", "timestamp": "2025-04-14T00:00:00Z", "hasBeenUnlocked": false, "rarity": "circumstantial", "imagePrompt": "A photorealistic shot of two empty, expensive-looking whisky bottles on a cluttered coffee table.", "tags": ["motive"], "components": [] },
    { "id": "obj_military_certs", "name": "Military Certificates", "description": "Framed certificates from Walter's time in the Marine Corps, including commendations for marksmanship.", "category": "document", "ownerCharacterId": "char_walter_halley", "locationFoundId": "loc_walter_home_office", "timestamp": "2025-04-14T00:00:00Z", "hasBeenUnlocked": false, "rarity": "circumstantial", "imagePrompt": "A photorealistic shot of framed military certificates on an office wall.", "tags": ["means"], "components": [] },
    { "id": "obj_training_certs", "name": "Training Certificates", "description": "Professional certifications for athletic training and sports medicine.", "category": "document", "ownerCharacterId": "char_walter_halley", "locationFoundId": "loc_walter_home_office", "timestamp": "2025-04-14T00:00:00Z", "hasBeenUnlocked": false, "rarity": "irrelevant", "imagePrompt": "A photorealistic shot of framed professional training certificates on an office wall.", "tags": [], "components": [] },
    { "id": "obj_crime_scene_photo_1", "name": "Crime Scene Photo 1", "description": "An overhead shot of the foyer, showing the position of the victim and key evidence markers.", "category": "physical", "locationFoundId": "loc_atherton_airbnb", "timestamp": "2025-04-13T23:50:00Z", "hasBeenUnlocked": false, "rarity": "irrelevant", "imagePrompt": "A photorealistic, clinical, top-down crime scene photograph of the Airbnb foyer, showing evidence markers.", "tags": [], "components": [] },
    { "id": "obj_crime_scene_photo_2", "name": "Crime Scene Photo 2", "description": "A close-up of the entry wound, providing forensic detail.", "category": "physical", "locationFoundId": "loc_atherton_airbnb", "timestamp": "2025-04-13T23:51:00Z", "hasBeenUnlocked": false, "rarity": "irrelevant", "imagePrompt": "A photorealistic, clinical close-up crime scene photograph focusing on a specific evidence detail.", "tags": [], "components": [] },


    // --- Newly Added Digital Assets ---
    { "id": "obj_trevon_jacket", "name": "Designer Cashmere Jacket", "unidentifiedDescription": "An expensive-looking designer jacket hanging in a locker.", "description": "An absurdly expensive designer cashmere jacket. It seems to be a favorite of Trevon's, as it appears in several of his social media photos. The material is a potential match for fibers found at other locations.", "category": "physical", "locationFoundId": "loc_sabers_facility_locker_room", "timestamp": "2025-04-14T00:00:00Z", "costToUnlock": 5, "hasBeenUnlocked": false, "rarity": "circumstantial", "imagePrompt": "A photorealistic close-up on the woven label of a dark blue, ridiculously expensive designer cashmere jacket. The brand name is visible but slightly blurred.", "tags": [], "components": [] },
    { "id": "obj_cctv_walter_arrival", "name": "Facility Security Recording", "description": "Security footage from the Sabers' facility on the night of the incident. It shows Walter Halley arriving at 11:58 PM, much later than his usual shift. He appears agitated and avoids looking at the camera. This contradicts his alibi of being home all night.", "category": "cctv_sighting", "ownerCharacterId": "char_walter_halley", "locationFoundId": "loc_sabers_facility_security_room", "timestamp": "2025-04-13T23:58:00Z", "costToUnlock": 10, "hasBeenUnlocked": false, "rarity": "material", "imagePrompt": "A realistic, grainy CCTV still image. A man, Walter Halley, is seen swiping a keycard at a door. The timestamp in the corner reads '23:58:12'. The image quality is low, typical of security footage.", "tags": ["opportunity"], "components": [] },
    { "id": "obj_guard_gun_cabinet", "name": "Gun Cabinet Log", "unidentifiedDescription": "A metal gun cabinet with a sign-out sheet on a clipboard.", "description": "The logbook for the facility's gun cabinet shows a 9mm handgun is missing. It was signed out by Walter Halley two days before the incident for 'range practice' but was never signed back in. This directly links him to a weapon consistent with the one used in the murder.", "category": "physical", "locationFoundId": "loc_sabers_facility_security_room", "timestamp": "2025-04-11T00:00:00Z", "costToUnlock": 15, "hasBeenUnlocked": false, "rarity": "critical", "imagePrompt": "A photorealistic shot of a clipboard with a sign-out sheet. Walter Halley's signature is clearly visible next to an entry for a 9mm handgun. The 'Date In' column is empty and highlighted.", "tags": ["means"], "components": [] },
    
    // --- NEWLY ADDED ASSETS ---
    // Trevon Ford
    { "id": "obj_trevon_social_1", "name": "Trevon's Social Media Post", "description": "A recent social media post from Trevon showing off his new yellow Lamborghini with the caption 'They tried to stop the bag... #motivation'. The post is timestamped the day after his trade was blocked.", "category": "socialMedia", "ownerCharacterId": "char_trevon_ford", "locationFoundId": "loc_trevon_home", "timestamp": "2025-04-12T19:00:00Z", "hasBeenUnlocked": false, "rarity": "circumstantial", "imagePrompt": "A photorealistic image styled like a social media post. It shows Trevon Ford leaning against a bright yellow Lamborghini at night. The text 'They tried to stop the bag...' is overlaid.", "tags": ["motive"], "components": [] },
    { "id": "obj_trevon_phone_log_1", "name": "Trevon's Phone Log", "description": "Phone records show multiple short, unanswered calls from Trevon to Ariel Cole between 11:30 PM and 12:00 AM on the night of the murder, placing him with her during the critical window.", "category": "phone_log", "ownerCharacterId": "char_trevon_ford", "locationFoundId": "loc_trevon_home_office", "timestamp": "2025-04-13T23:30:00Z", "hasBeenUnlocked": false, "rarity": "material", "imagePrompt": "A photorealistic screenshot of a smartphone call log. A series of outgoing calls to 'Ariel C.' are visible with timestamps around 11:30 PM.", "tags": ["opportunity"], "components": [] },
    { "id": "obj_trevon_cctv_1", "name": "Lux Nightclub CCTV", "description": "Security footage from the Lux Nightclub confirms Trevon Ford was present from approximately 10:00 PM until 2:00 AM. Multiple witnesses also corroborate this. This provides him a strong alibi.", "category": "cctv_sighting", "ownerCharacterId": "char_trevon_ford", "locationFoundId": "loc_trevon_home", "timestamp": "2025-04-13T23:00:00Z", "hasBeenUnlocked": false, "rarity": "circumstantial", "imagePrompt": "A grainy, realistic security camera still from a crowded nightclub. Trevon Ford is visible in the background, talking to another person. The timestamp reads '23:05:41'.", "tags": ["opportunity"], "metadata": { "unlocksCaseFileClueId": "clue-means-support-2" }, "components": [] },
    { "id": "obj_trevon_records_1", "name": "Trevon's Bank Statement", "description": "A bank statement for Trevon Ford shows a recent wire transfer of $450,000 for the purchase of a 'Lamborghini Aventador', confirming his high-end spending habits.", "category": "financial_record", "ownerCharacterId": "char_trevon_ford", "locationFoundId": "loc_trevon_home_office", "timestamp": "2025-04-05T00:00:00Z", "hasBeenUnlocked": false, "rarity": "irrelevant", "imagePrompt": "A photorealistic close-up of a bank statement document. A line item for 'Automotive Purchase - $450,000.00' is in sharp focus.", "tags": [], "components": [] },
    { "id": "obj_trevon_file_1", "name": "Trevon's Police File", "description": "Trevon Ford has a sealed juvenile record for a minor assault charge at age 17 during a high school basketball game. The record suggests a history of having a temper.", "category": "police_file", "ownerCharacterId": "char_trevon_ford", "locationFoundId": "loc_trevon_home_office", "timestamp": "2020-02-15T00:00:00Z", "hasBeenUnlocked": false, "rarity": "circumstantial", "imagePrompt": "A photorealistic shot of a police file folder labeled 'FORD, TREVON'. A 'SEALED JUVENILE RECORD' stamp is prominent.", "tags": ["motive"], "components": [] },

    // Ariel Cole
    { "id": "obj_ariel_social_1", "name": "Ariel's Social Media Post", "description": "A recent post on Ariel's private social media shows a picture of her son, Kase, with the caption 'Some things are worth fighting for. #familyfirst'. The timing coincides with the escalation of the custody battle.", "category": "socialMedia", "ownerCharacterId": "char_ariel_cole", "locationFoundId": "loc_ariel_home_living_room", "timestamp": "2025-04-11T00:00:00Z", "hasBeenUnlocked": false, "rarity": "circumstantial", "imagePrompt": "A realistic image styled like a social media post from a private account. It shows a young boy playing in a park, with the caption 'Some things are worth fighting for.'", "tags": ["motive"], "components": [] },
    { "id": "obj_ariel_phone_log_1", "name": "Ariel's Phone Log", "description": "Phone records confirm an 8-minute, heated phone call from Ariel to Malcolm on April 11th, the same day she left the threatening voicemail. This establishes a pattern of angry communication.", "category": "phone_log", "ownerCharacterId": "char_ariel_cole", "locationFoundId": "loc_ariel_home_living_room", "timestamp": "2025-04-11T14:20:00Z", "hasBeenUnlocked": false, "rarity": "circumstantial", "imagePrompt": "A realistic screenshot of a smartphone call log. An 8-minute call to 'Malcolm Cole' is highlighted.", "tags": ["motive"], "components": [] },
    { "id": "obj_ariel_records_1", "name": "Ariel's Legal Bill", "description": "A legal bill from Ariel's divorce attorney shows escalating costs associated with the custody dispute, totaling over $75,000. This indicates significant financial pressure and motive.", "category": "financial_record", "ownerCharacterId": "char_ariel_cole", "locationFoundId": "loc_ariel_home_living_room", "timestamp": "2025-04-01T00:00:00Z", "hasBeenUnlocked": false, "rarity": "material", "imagePrompt": "A photorealistic shot of a legal invoice. The 'Total Amount Due: $75,341.50' is clearly visible and circled.", "tags": ["motive"], "components": [] },
    { "id": "obj_ariel_file_1", "name": "Ariel's 911 Call Record", "description": "A record of a 911 call made by Ariel two months ago, reporting a verbal dispute with Malcolm during a custody exchange. No charges were filed, but it documents their volatile relationship.", "category": "police_file", "ownerCharacterId": "char_ariel_cole", "locationFoundId": "loc_ariel_home_living_room", "timestamp": "2025-02-20T00:00:00Z", "hasBeenUnlocked": false, "rarity": "circumstantial", "imagePrompt": "A photorealistic printout of a police dispatch report. The names 'Ariel Cole' and 'Malcolm Cole' are visible under 'Parties Involved'.", "tags": ["motive"], "components": [] },
    
    // Walter Halley
    { "id": "obj_walter_social_1", "name": "Walter's Social Media Post", "description": "Walter's social media is mostly inactive, except for one shared article from 3 months ago titled 'The Cost of Betrayal' about military honor codes. It suggests a rigid worldview.", "category": "socialMedia", "ownerCharacterId": "char_walter_halley", "locationFoundId": "loc_walter_home_office", "timestamp": "2025-01-15T00:00:00Z", "hasBeenUnlocked": false, "rarity": "circumstantial", "imagePrompt": "A realistic screenshot of a social media page showing a shared article. The headline 'The Cost of Betrayal' is prominent.", "tags": ["motive"], "components": [] },
    { "id": "obj_walter_phone_log_1", "name": "Walter's Phone Log", "description": "Call records for Walter Halley show five calls to a number belonging to 'Argus Investigations', a private investigator firm, in the week leading up to the murder.", "category": "phone_log", "ownerCharacterId": "char_walter_halley", "locationFoundId": "loc_walter_home_office", "timestamp": "2025-04-09T00:00:00Z", "hasBeenUnlocked": false, "rarity": "material", "imagePrompt": "A photorealistic screenshot of a smartphone call log. Multiple calls to 'Argus Investigations' are visible.", "tags": ["motive"], "components": [] },
    { "id": "obj_walter_cctv_1", "name": "Traffic Cam Footage", "description": "A still from a traffic camera two blocks from the Atherton Airbnb shows a dark-colored Ford F-150 turning onto the victim's street at 11:28 PM. The license plate is not visible, but the truck model is a match for Walter Halley's.", "category": "cctv_sighting", "ownerCharacterId": "char_walter_halley", "locationFoundId": "loc_walter_home_garage", "timestamp": "2025-04-13T23:28:00Z", "hasBeenUnlocked": false, "rarity": "material", "imagePrompt": "A grainy, dark, realistic traffic camera still. A dark Ford F-150 truck is turning a corner. The image is timestamped.", "tags": ["opportunity"], "components": [] },
    { "id": "obj_walter_records_1", "name": "Walter's Credit Card Statement", "description": "A credit card statement for Walter Halley shows a $2,500 payment to 'Argus Investigations', confirming he hired the private investigator who took the photos of Malcolm and Camille.", "category": "financial_record", "ownerCharacterId": "char_walter_halley", "locationFoundId": "loc_walter_home_office", "timestamp": "2025-04-08T00:00:00Z", "hasBeenUnlocked": false, "rarity": "critical", "imagePrompt": "A photorealistic shot of a credit card statement. A line item for 'Argus Investigations - $2,500.00' is highlighted.", "tags": ["motive"], "components": [] },
    { "id": "obj_walter_file_1", "name": "Walter's Military Record", "description": "Walter Halley's official military record shows an honorable discharge after 12 years of service as a Marine Force Reconnaissance member, noting 'Expert' qualifications with small arms.", "category": "police_file", "ownerCharacterId": "char_walter_halley", "locationFoundId": "loc_walter_home_office", "timestamp": "2018-01-01T00:00:00Z", "hasBeenUnlocked": false, "rarity": "material", "imagePrompt": "A photorealistic document of a military service record. The 'Qualifications' section lists 'Expert Rifleman, Expert Pistol' and is in sharp focus.", "tags": ["means"], "components": [] },
    { "id": "obj_walter_file_2", "name": "Walter's Gun Registration", "description": "A firearms registration document for Walter Halley, showing his legal ownership of a Glock 17, a 9mm handgun.", "category": "police_file", "ownerCharacterId": "char_walter_halley", "locationFoundId": "loc_walter_home_closet", "timestamp": "2020-05-10T00:00:00Z", "hasBeenUnlocked": false, "rarity": "material", "imagePrompt": "A photorealistic firearms registration document. The fields 'Make: Glock', 'Model: 17', and 'Caliber: 9mm' are clearly legible.", "tags": ["means"], "components": [] },
    { "id": "obj_walter_file_3", "name": "Walter's Stolen Gun Report", "description": "A police report filed by Walter Halley one week before the murder, claiming his registered Glock 17 was stolen from his truck. The timing is extremely suspicious, suggesting a pre-meditated attempt to create an alibi for his weapon.", "category": "police_file", "ownerCharacterId": "char_walter_halley", "locationFoundId": "loc_walter_home_office", "timestamp": "2025-04-06T00:00:00Z", "hasBeenUnlocked": false, "rarity": "critical", "imagePrompt": "A photorealistic police report document for a stolen item. The 'Item Description' section clearly reads 'Glock 17 9mm Handgun'.", "tags": ["means"], "components": [] }
];