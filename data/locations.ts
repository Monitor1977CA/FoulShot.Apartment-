/**
 * @file data/locations.ts
 * @description Contains the raw data for all locations in the story.
 * This modular approach makes the story data easier to manage and extend.
 * All hotspot target IDs and types have been audited for correctness.
 */

export const rawLocations = [
    {
      "id": "loc_atherton_airbnb",
      "name": "Atherton Airbnb",
      "mapCoords": { "top": "65%", "left": "45%" },
      "imagePrompt": "Photorealistic, wide shot of the exterior of a modern, luxurious home at night. Yellow police tape is stretched across the property entrance. Dark tire marks are visible on the wet asphalt street. The lighting is from streetlights and the flashing lights of a distant police car.",
      "sceneSummary": "The Airbnb where Malcolm Cole was found unresponsive.",
      "detailedDescription": "This opulent, secluded rental property was chosen by Malcolm Cole for its privacy—a perfect stage for his carefully managed life. Now, it stands as a stark monument to the chaos that shattered it. Every detail, from the manicured lawn to the dark windows, holds a piece of the final hours.",
      "associatedCharacterIds": ["char_malcolm_cole"],
      "officialReportIds": [
        { "id": "obj_police_report_initial", "type": "object" },
        { "id": "obj_ballistics_report", "type": "object" },
        { "id": "group_crime_scene_photos", "type": "evidenceGroup" }
      ],
      "propertyRecords": {
        "owner": "Penrose Holdings, LLC",
        "lastSoldDate": "2021-08-15",
        "lastSoldPrice": "$4,200,000",
        "notes": "Property is a short-term luxury rental. The booking was made by Malcolm Cole using an Apex Talent corporate card, likely to obscure the expense. No forced entry was detected."
      },
      "hotspots": [
        { "id": "hotspot-atherton-tire", "label": "Analyze Tire Marks", "targetCardId": "obj_peel_out_tracks", "targetCardType": "object", "aiHint": "the tire marks on the street" },
        { "id": "hotspot-atherton-foyer", "label": "Enter Foyer", "targetCardId": "loc_atherton_airbnb_foyer", "targetCardType": "location", "type": "move", "aiHint": "the front door leading inside" }
      ]
    },
    {
      "id": "loc_atherton_airbnb_foyer",
      "name": "Airbnb Foyer",
      "isInternal": true,
      "imagePrompt": "Photorealistic shot of the grand, spacious foyer of a luxurious modern home at night. Small numbered paper evidence tags are on the floor. An overturned vase lies next to a spilled puddle of water. The lighting is a mix of ambient light and the harsh glare of a forensic flashlight.",
      "sceneSummary": "The center of the investigation, inside the foyer.",
      "detailedDescription": "This is the epicenter. The pristine elegance of the foyer is now a canvas of violence. The scattered evidence markers tell a story of a sudden, violent confrontation that began the moment the front door closed. The air is still thick with the aftermath.",
      "associatedCharacterIds": ["char_malcolm_cole"],
      "hotspots": [
        { "id": "hotspot-foyer-crime-scene", "label": "Examine Scene", "targetCardId": "group_foyer_clues", "targetCardType": "evidenceGroup", "aiHint": "the small paper tags with numbers on the floor" },
        { "id": "hotspot-foyer-kitchen", "label": "Enter Kitchen", "targetCardId": "loc_atherton_airbnb_kitchen", "targetCardType": "location", "type": "move", "aiHint": "the arched doorway leading into a kitchen" },
        { "id": "hotspot-foyer-bedroom", "label": "Go to Bedroom", "targetCardId": "loc_atherton_airbnb_bedroom", "targetCardType": "location", "type": "move", "aiHint": "the doorway to the master bedroom" },
        { "id": "hotspot-foyer-outside", "label": "Go Outside", "targetCardId": "loc_atherton_airbnb", "targetCardType": "location", "type": "move", "aiHint": "the front door leading outside" }
      ]
    },
    {
      "id": "loc_atherton_airbnb_kitchen",
      "name": "Airbnb Kitchen",
      "isInternal": true,
      "imagePrompt": "Photorealistic shot of a modern, high-end kitchen. A marble island is set for a romantic dinner for two, with two used wine glasses and two plates with half-eaten food. On the stainless steel refrigerator, children's drawings are displayed.",
      "sceneSummary": "A romantic dinner, interrupted.",
      "detailedDescription": "The scene is a paradox: a meticulously prepared romantic dinner for two, abandoned mid-meal. This kitchen speaks to a secret rendezvous, a moment of intimacy shattered by the events in the foyer. The children's drawings on the fridge are a poignant reminder of the double life Malcolm was leading.",
      "associatedCharacterIds": ["char_malcolm_cole", "char_camille_halley"],
      "hotspots": [
        { "id": "hotspot-kitchen-dinner", "label": "Inspect Dinner Setting", "targetCardId": "group_kitchen_table", "targetCardType": "evidenceGroup", "aiHint": "the plates and wine glasses on the island" },
        { "id": "hotspot-kitchen-fridge", "label": "Examine Refrigerator", "targetCardId": "obj_fridge_photos", "targetCardType": "object", "aiHint": "the photos and drawings on the refrigerator door" },
        { "id": "hotspot-kitchen-foyer", "label": "Return to Foyer", "targetCardId": "loc_atherton_airbnb_foyer", "targetCardType": "location", "type": "move", "aiHint": "the main doorway leading out of the kitchen" }
      ]
    },
    {
      "id": "loc_atherton_airbnb_bedroom",
      "name": "Airbnb Bedroom",
      "isInternal": true,
      "imagePrompt": "A photorealistic image of a luxurious master bedroom. The bed is unmade. A child's toys are scattered on the floor. A hamper is overflowing with laundry. An open nightstand drawer is visible.",
      "sceneSummary": "A space of luxury and personal effects.",
      "detailedDescription": "This room reveals the conflicting facets of Malcolm Cole's life. It's a space of transient luxury, but also of fatherhood, indicated by the scattered toys. The discarded clothing hints at the secret affair, painting a picture of a man juggling immense pressures, both personal and professional.",
      "associatedCharacterIds": ["char_malcolm_cole"],
      "hotspots": [
        { "id": "hotspot-bedroom-toys", "label": "Look at Toys", "targetCardId": "obj_childrens_toys", "targetCardType": "object", "aiHint": "the pile of toys on the floor" },
        { "id": "hotspot-bedroom-hamper", "label": "Check Hamper", "targetCardId": "obj_ladies_underwear", "targetCardType": "object", "aiHint": "the laundry hamper" },
        { "id": "hotspot-bedroom-nightstand", "label": "Search Nightstand", "targetCardId": "group_nightstand_items", "targetCardType": "evidenceGroup", "aiHint": "the open nightstand drawer" },
        { "id": "hotspot-bedroom-foyer", "label": "Return to Foyer", "targetCardId": "loc_atherton_airbnb_foyer", "targetCardType": "location", "type": "move", "aiHint": "the main doorway leading out of the bedroom" }
      ]
    },
    {
      "id": "loc_apex_offices",
      "name": "Apex Talent Offices",
      "mapCoords": { "top": "35%", "left": "40%" },
      "imagePrompt": "Photorealistic shot of the sleek, luxurious office of a high-powered sports agent. A large, minimalist desk made of glass and chrome is central. Floor-to-ceiling windows offer a stunning view of the city at dusk. A doorway leads to an adjacent room.",
      "sceneSummary": "Malcolm Cole's corporate headquarters. The last place he was seen before the incident.",
      "detailedDescription": "This is Malcolm Cole's kingdom, built of glass, steel, and ambition. From this vantage point, he orchestrated careers and made fortunes. The pristine, orderly space reflects the control he exerted over his professional life, but the documents on his desk reveal the high-stakes conflicts that were boiling beneath the surface.",
      "associatedCharacterIds": ["char_malcolm_cole"],
       "propertyRecords": {
        "owner": "Visser Commercial Properties",
        "zoning": "Commercial (C-3)",
        "notes": "Security logs show Malcolm Cole was the last person to leave the office on the night of April 13th."
       },
       "hotspots": [
        { "id": "hotspot-apex-computer", "label": "Access Computer", "targetCardId": "group_apex_computer_files", "targetCardType": "evidenceGroup", "aiHint": "the laptop on the desk" },
        { "id": "hotspot-apex-desk", "label": "Examine Desk", "targetCardId": "group_apex_desk_items", "targetCardType": "evidenceGroup", "aiHint": "the folders and papers on the desk" },
        { "id": "hotspot-apex-trophy", "label": "Enter Trophy Room", "targetCardId": "loc_apex_offices_trophy_room", "targetCardType": "location", "type": "move", "aiHint": "the doorway to an adjacent room" }
      ]
    },
     {
      "id": "loc_apex_offices_trophy_room",
      "name": "Trophy Room",
      "isInternal": true,
      "imagePrompt": "A photorealistic image of a luxurious trophy room. One wall is covered in gleaming awards. Another wall features framed basketball jerseys, including one with the name FORD on the back. Behind the Ford jersey, the drywall has a subtle, recently repaired patch.",
      "sceneSummary": "A room dedicated to success, but with signs of recent conflict.",
      "detailedDescription": "This room was designed to celebrate success and intimidate rivals. It's a monument to the partnership between Malcolm and his clients. However, the cracked jersey frame and patched wall are fresh scars, evidence of a violent argument that suggests the relationship with his star client, Trevon Ford, had soured.",
      "associatedCharacterIds": ["char_malcolm_cole", "char_trevon_ford"],
      "hotspots": [
        { "id": "hotspot-trophy-jersey", "label": "Examine Ford Jersey", "targetCardId": "obj_ford_jersey", "targetCardType": "object", "aiHint": "the framed jersey with the name FORD on the back" },
        { "id": "hotspot-trophy-wall", "label": "Inspect Wall", "targetCardId": "obj_patched_wall", "targetCardType": "object", "aiHint": "the wall area next to the Ford jersey" },
        { "id": "hotspot-trophy-table", "label": "Check Table", "targetCardId": "group_trophy_room_lounge", "targetCardType": "evidenceGroup", "aiHint": "the table with the cigar box" },
        { "id": "hotspot-trophy-office", "label": "Return to Office", "targetCardId": "loc_apex_offices", "targetCardType": "location", "type": "move", "aiHint": "the main doorway leading out of the room" }
      ]
    },
    {
      "id": "loc_sabers_facility",
      "name": "Sabers Training Facility",
      "mapCoords": { "top": "40%", "left": "75%" },
      "imagePrompt": "A photorealistic, wide-angle shot of a state-of-the-art indoor NBA training facility. Gleaming hardwood floors, advanced biometric tracking stations. It is empty and silent late at night. The only light comes from security lamps, casting long shadows across the pristine court.",
      "sceneSummary": "The central hub for the team, where all the suspects worked and interacted.",
      "detailedDescription": "This state-of-the-art facility is the nexus where the professional lives of Trevon Ford and Walter Halley converged daily under the victim's influence. It's a world of intense physical discipline and high-pressure performance, a backdrop for the rivalries and relationships that defined their careers.",
      "associatedCharacterIds": ["char_trevon_ford", "char_walter_halley"],
      "propertyRecords": {
        "owner": "San Francisco Sabers Ownership Group",
        "zoning": "Special Use (Athletic Facility)",
        "notes": "The facility has comprehensive CCTV coverage, but access to footage requires a warrant and team cooperation. Trainer Walter Halley had 24/7 keycard access."
      },
       "hotspots": [
        { "id": "hotspot-sabers-locker", "label": "Enter Locker Room", "targetCardId": "loc_sabers_facility_locker_room", "targetCardType": "location", "type": "move", "aiHint": "a door labeled 'Locker Room'" },
        { "id": "hotspot-sabers-training", "label": "Enter Training Room", "targetCardId": "loc_sabers_facility_training_room", "targetCardType": "location", "type": "move", "aiHint": "a door labeled 'Training Room'" },
        { "id": "hotspot-sabers-security", "label": "Enter Security Office", "targetCardId": "loc_sabers_facility_security_room", "targetCardType": "location", "type": "move", "aiHint": "a door labeled 'Security'" }
      ]
    },
    {
      "id": "loc_sabers_facility_locker_room",
      "name": "Locker Room",
      "isInternal": true,
      "imagePrompt": "A photorealistic shot of a massive, luxurious professional sports team locker room. Custom leather chairs sit in front of each player's expansive, dark wood locker. The lighting is low and dramatic. One locker, belonging to Trevon Ford, is slightly ajar.",
      "sceneSummary": "The players' private sanctuary.",
      "detailedDescription": "More than just a changing room, this is the inner sanctum of the team. For a player like Trevon Ford, his locker is his personal space within the high-pressure world of professional sports—a place to store both his gear and his secrets.",
      "associatedCharacterIds": ["char_trevon_ford"],
      "hotspots": [
        { "id": "hotspot-locker-trevon", "label": "Search Trevon's Locker", "targetCardId": "group_trevon_locker", "targetCardType": "evidenceGroup", "aiHint": "the locker that is slightly ajar" },
        { "id": "hotspot-locker-main", "label": "Return to Main Facility", "targetCardId": "loc_sabers_facility", "targetCardType": "location", "type": "move", "aiHint": "the main exit door" }
      ]
    },
    {
      "id": "loc_sabers_facility_training_room",
      "name": "Training Room",
      "isInternal": true,
      "imagePrompt": "A photorealistic image of a world-class athletic training room. Professional massage tables, high-tech fitness machines, a cold plunge pool, and medical cabinets line the walls. Hard cases full of team gear are stacked. A door to an interior office is visible.",
      "sceneSummary": "Where world-class athletes are made.",
      "detailedDescription": "This is Walter Halley's domain. In this room, he was the authority figure, responsible for the physical well-being of the players. The medical equipment and gear logs represent his professional obligations—a cover story for his movements on the night of the incident.",
      "associatedCharacterIds": ["char_walter_halley"],
      "hotspots": [
        { "id": "hotspot-training-gear", "label": "Inspect Team Gear", "targetCardId": "obj_gear_cases_walter_alibi", "targetCardType": "object", "aiHint": "the stack of hard cases" },
        { "id": "hotspot-training-cabinet", "label": "Check Medical Cabinet", "targetCardId": "obj_medicine_cabinet", "targetCardType": "object", "aiHint": "the medical cabinet on the wall" },
        { "id": "hotspot-training-walter-office", "label": "Enter Walter's Office", "targetCardId": "loc_sabers_facility_walters_office", "targetCardType": "location", "type": "move", "aiHint": "the door to an interior office" },
        { "id": "hotspot-training-main", "label": "Return to Main Facility", "targetCardId": "loc_sabers_facility", "targetCardType": "location", "type": "move", "aiHint": "the main exit door" }
      ]
    },
    {
      "id": "loc_sabers_facility_walters_office",
      "name": "Walter's Office",
      "isInternal": true,
      "imagePrompt": "A photorealistic image of a small, neat office within a training facility. A photo of a trainer and a player hangs on the wall. A laptop sits on the desk. The lighting is functional and stark.",
      "sceneSummary": "The trainer's private workspace.",
      "detailedDescription": "A small, private space within the sprawling facility, this office reflects Walter Halley's disciplined nature. It's here he would handle the administrative side of his job, a quiet place to work away from the noise of the court—and potentially, a place to plan.",
      "associatedCharacterIds": ["char_walter_halley"],
      "hotspots": [
        { "id": "hotspot-walter-office-photo", "label": "Examine Photo", "targetCardId": "obj_walter_trevon_photo", "targetCardType": "object", "aiHint": "the framed photo on the wall" },
        { "id": "hotspot-walter-office-laptop", "label": "Access Laptop", "targetCardId": "group_walter_laptop", "targetCardType": "evidenceGroup", "aiHint": "the laptop on the desk" },
        { "id": "hotspot-walter-office-training", "label": "Return to Training Room", "targetCardId": "loc_sabers_facility_training_room", "targetCardType": "location", "type": "move", "aiHint": "the door leading back to the training room" }
      ]
    },
    {
      "id": "loc_sabers_facility_security_room",
      "name": "Security Room",
      "isInternal": true,
      "imagePrompt": "A photorealistic image of a dark security office. The only light comes from a bank of monitors showing CCTV feeds. A recording device is on the console. A locked, chain-link cabinet is against one wall.",
      "sceneSummary": "The eyes and ears of the facility.",
      "detailedDescription": "This room is the silent witness to everything that happens within the facility. The CCTV recordings hold objective truths about who was where, and when, providing a digital breadcrumb trail that can either corroborate or destroy a suspect's alibi.",
      "associatedCharacterIds": [],
      "hotspots": [
        { "id": "hotspot-security-recordings", "label": "Check Recordings", "targetCardId": "obj_cctv_walter_arrival", "targetCardType": "object", "aiHint": "the security recording device on the console" },
        { "id": "hotspot-security-cabinet", "label": "Inspect Cabinet", "targetCardId": "obj_guard_gun_cabinet", "targetCardType": "object", "aiHint": "the locked chain-link cabinet" },
        { "id": "hotspot-security-main", "label": "Return to Main Facility", "targetCardId": "loc_sabers_facility", "targetCardType": "location", "type": "move", "aiHint": "the main exit door" }
      ]
    },
    {
      "id": "loc_ariel_home_exterior",
      "name": "Ariel Cole's House",
      "mapCoords": { "top": "15%", "left": "30%" },
      "imagePrompt": "A photorealistic shot of the grand exterior of a multi-million dollar modern home in an affluent suburb at night. The architecture is bold and geometric, with dramatic landscape lighting.",
      "sceneSummary": "The residence of Malcolm's ex-wife, Ariel Cole.",
      "detailedDescription": "This house is a fortress, representing the life Ariel Cole fought to protect during her contentious divorce. Its pristine exterior belies the emotional turmoil and secrets contained within its walls—a key location in understanding the bitter history between her and the victim.",
      "associatedCharacterIds": ["char_ariel_cole"],
      "propertyRecords": {
        "owner": "Ariel Cole",
        "lastSoldDate": "2024-03-01",
        "lastSoldPrice": "$1 (Deed Transfer)",
        "notes": "Ownership of the property was transferred to Ariel Cole as part of her divorce settlement with Malcolm Cole. The transfer was a major point of contention and was only finalized last month after a lengthy legal dispute."
      },
      "hotspots": [
        { "id": "hotspot-ariel-enter", "label": "Enter House", "targetCardId": "loc_ariel_home_living_room", "targetCardType": "location", "type": "move", "aiHint": "the front door" }
      ]
    },
    {
      "id": "loc_ariel_home_living_room",
      "name": "Ariel Cole's Living Room",
      "isInternal": true,
      "imagePrompt": "A photorealistic image of the living room of an upscale home. A large family photo hangs on the wall, but one adult's face has been visibly scratched out. A small writing desk sits in the corner. Doorways to other rooms are visible.",
      "sceneSummary": "A home marked by past and present tensions.",
      "detailedDescription": "The living room is a museum of a fractured family. The defaced photograph on the wall is a potent symbol of the rage at the heart of the custody battle. This space is central to understanding Ariel's motive and the depths of her animosity towards Malcolm.",
      "associatedCharacterIds": ["char_ariel_cole"],
       "hotspots": [
        { "id": "hotspot-ariel-photo", "label": "Examine Photo", "targetCardId": "obj_family_photos", "targetCardType": "object", "aiHint": "the large photo on the wall" },
        { "id": "hotspot-ariel-desk", "label": "Examine Desk", "targetCardId": "group_ariel_desk_docs", "targetCardType": "evidenceGroup", "aiHint": "a small writing desk in the corner" },
        { "id": "hotspot-ariel-kitchen", "label": "Enter Kitchen", "targetCardId": "loc_ariel_home_kitchen", "targetCardType": "location", "type": "move", "aiHint": "the doorway to the kitchen" },
        { "id": "hotspot-ariel-bedroom", "label": "Enter Bedroom", "targetCardId": "loc_ariel_home_bedroom", "targetCardType": "location", "type": "move", "aiHint": "the main bedroom door" },
        { "id": "hotspot-ariel-garage", "label": "Enter Garage", "targetCardId": "loc_ariel_home_garage", "targetCardType": "location", "type": "move", "aiHint": "a door leading to the garage" },
        { "id": "hotspot-ariel-exit", "label": "Go Outside", "targetCardId": "loc_ariel_home_exterior", "targetCardType": "location", "type": "move", "aiHint": "the front door" }
      ]
    },
    {
      "id": "loc_ariel_home_kitchen",
      "name": "Ariel's Kitchen",
      "isInternal": true,
      "imagePrompt": "A photorealistic image of an immaculate, modern kitchen with white marble countertops. A black Tesla key card and a set of keys are neatly placed on the counter.",
      "sceneSummary": "A kitchen of pristine order.",
      "detailedDescription": "Ariel's kitchen is a picture of control and order, but the items left on the counter—keys belonging to the victim's car and rental—suggest a recent connection to the crime scene and raise critical questions about her involvement and alibi.",
      "associatedCharacterIds": ["char_ariel_cole"],
      "hotspots": [
        { "id": "hotspot-ariel-kitchen-counter", "label": "Examine Counter", "targetCardId": "group_ariel_kitchen_counter", "targetCardType": "evidenceGroup", "aiHint": "the items on the kitchen counter" },
        { "id": "hotspot-ariel-kitchen-living", "label": "Return to Living Room", "targetCardId": "loc_ariel_home_living_room", "targetCardType": "location", "type": "move", "aiHint": "the main doorway leading out of the kitchen" }
      ]
    },
    {
      "id": "loc_ariel_home_garage",
      "name": "Ariel's Garage",
      "isInternal": true,
      "imagePrompt": "A photorealistic shot of a clean, organized two-car garage. A sleek, white Tesla Model X is parked on one side, plugged into a charging station. On the other, children's toys and bicycles are neatly arranged.",
      "sceneSummary": "A space for family life.",
      "detailedDescription": "The garage reflects the dual nature of Ariel's life: the high-powered executive with the luxury electric car, and the mother with a space full of children's toys. Her vehicle is a key part of her alibi and movements on the night of the incident.",
      "associatedCharacterIds": ["char_ariel_cole"],
      "hotspots": [
        { "id": "hotspot-ariel-garage-car", "label": "Inspect Tesla", "targetCardId": "obj_ariel_car", "targetCardType": "object", "aiHint": "the white Tesla" },
        { "id": "hotspot-ariel-garage-living", "label": "Return to Living Room", "targetCardId": "loc_ariel_home_living_room", "targetCardType": "location", "type": "move", "aiHint": "the door leading back into the house" }
      ]
    },
    {
      "id": "loc_ariel_home_bedroom",
      "name": "Ariel's Bedroom",
      "isInternal": true,
      "imagePrompt": "A photorealistic image of the master bedroom of an upscale home. The bed is unmade. On a nightstand, an open case contains a small, cheerful gnome and a pill bottle. A gold necklace is on the other nightstand. A pair of oversized men's sneakers are on the floor.",
      "sceneSummary": "Ariel's private space, showing signs of a chaotic life.",
      "detailedDescription": "This room is ground zero for Ariel's secret life. The out-of-place men's shoes and jewelry directly link her to Trevon Ford, revealing a hidden relationship that complicates her motives and provides her with a potential alibi for the time of the murder.",
      "associatedCharacterIds": ["char_ariel_cole", "char_trevon_ford"],
      "hotspots": [
        { "id": "hotspot-ariel-bedroom-nightstand", "label": "Examine Nightstand", "targetCardId": "group_ariel_nightstand_1", "targetCardType": "evidenceGroup", "aiHint": "the nightstand with the pill bottle and the case containing a gnome" },
        { "id": "hotspot-ariel-bedroom-necklace", "label": "Examine Necklace", "targetCardId": "obj_ariel_t_jewelry", "targetCardType": "object", "aiHint": "the gold necklace on the other nightstand" },
        { "id": "hotspot-ariel-bedroom-closet", "label": "Enter Closet", "targetCardId": "loc_ariel_home_closet", "targetCardType": "location", "type": "move", "aiHint": "the open closet door" },
        { "id": "hotspot-ariel-bedroom-sneakers", "label": "Inspect Sneakers", "targetCardId": "obj_size_16_sneakers", "targetCardType": "object", "aiHint": "the large sneakers on the floor" },
        { "id": "hotspot-ariel-bedroom-living", "label": "Return to Living Room", "targetCardId": "loc_ariel_home_living_room", "targetCardType": "location", "type": "move", "aiHint": "the main doorway leading out of the bedroom" }
      ]
    },
    {
      "id": "loc_ariel_home_closet",
      "name": "Ariel's Closet",
      "isInternal": true,
      "imagePrompt": "A photorealistic shot of a walk-in closet with expensive clothes hanging neatly. A single piece of black lace lingerie is hanging conspicuously on a hanger, separate from the other clothes.",
      "sceneSummary": "A space for designer clothes and secrets.",
      "detailedDescription": "The closet houses the expensive wardrobe of a woman who values appearances. The piece of lingerie, a clear gift, serves as further, intimate proof of her secret affair with Trevon Ford.",
      "associatedCharacterIds": ["char_ariel_cole"],
      "hotspots": [
        { "id": "hotspot-ariel-closet-lingerie", "label": "Examine Lingerie", "targetCardId": "obj_ariel_lingerie", "targetCardType": "object", "aiHint": "the piece of lingerie hanging on a hanger" },
        { "id": "hotspot-ariel-closet-bedroom", "label": "Return to Bedroom", "targetCardId": "loc_ariel_home_bedroom", "targetCardType": "location", "type": "move", "aiHint": "the doorway leading out of the closet" }
      ]
    },
    {
      "id": "loc_trevon_home",
      "name": "Trevon Ford's Mansion",
      "mapCoords": { "top": "75%", "left": "35%" },
      "imagePrompt": "A photorealistic image of the grand main room of a stylish, modern mansion. Clean lines, minimalist furniture, and large, expensive abstract art on the walls. The room is immaculate. Doorways to other rooms are visible. Floor-to-ceiling windows look out onto a pool.",
      "sceneSummary": "The immaculate residence of star player Trevon Ford.",
      "detailedDescription": "Trevon Ford's home is a testament to his recent success—a sterile, modern palace of new money. Its perfect organization speaks to a life managed by others, but the items within its rooms reveal the professional pressures and secret relationships of the man himself.",
      "associatedCharacterIds": ["char_trevon_ford"],
      "propertyRecords": {
        "owner": "Trevon Ford",
        "lastSoldDate": "2024-12-20",
        "lastSoldPrice": "$8,500,000",
        "notes": "Purchased all-cash following the signing of his max contract. The purchase is a clear display of his newfound wealth and a potential source of financial pressure."
      },
       "hotspots": [
        { "id": "hotspot-trevon-office", "label": "Enter Home Office", "targetCardId": "loc_trevon_home_office", "targetCardType": "location", "type": "move", "aiHint": "a door leading to a home office" },
        { "id": "hotspot-trevon-bedroom", "label": "Enter Bedroom", "targetCardId": "loc_trevon_home_bedroom", "targetCardType": "location", "type": "move", "aiHint": "the main bedroom door" },
        { "id": "hotspot-trevon-garage", "label": "Enter Garage", "targetCardId": "loc_trevon_home_garage", "targetCardType": "location", "type": "move", "aiHint": "a door leading to the garage" }
      ]
    },
    {
      "id": "loc_trevon_home_office",
      "name": "Trevon's Home Office",
      "isInternal": true,
      "imagePrompt": "A photorealistic shot of a sleek, minimalist home office. A large desk holds a high-end gaming computer setup with multiple monitors. Framed magazine covers featuring the occupant hang on the wall. A stack of mail sits on the corner of the desk.",
      "sceneSummary": "Trevon's personal command center.",
      "detailedDescription": "This isn't just an office; it's a brand management center. The high-end gaming rig and framed magazine covers speak to Trevon Ford's public persona—a young, successful star curating his own image. But the mail on his desk hints at the professional pressures and conflicts simmering just beneath the surface of this carefully constructed reality.",
      "associatedCharacterIds": ["char_trevon_ford"],
      "hotspots": [
        { "id": "hotspot-trevon-office-mail", "label": "Examine Mail", "targetCardId": "obj_trevon_warning_letter", "targetCardType": "object", "aiHint": "a stack of mail on the desk" },
        { "id": "hotspot-trevon-office-computer", "label": "Access Computer", "targetCardId": "group_trevon_docs", "targetCardType": "evidenceGroup", "aiHint": "the multi-monitor computer setup" },
        { "id": "hotspot-trevon-office-main", "label": "Return to Main Room", "targetCardId": "loc_trevon_home", "targetCardType": "location", "type": "move", "aiHint": "the main doorway leading out of the office" }
      ]
    },
     {
      "id": "loc_trevon_home_bedroom",
      "name": "Trevon's Bedroom",
      "isInternal": true,
      "imagePrompt": "A photorealistic image of a spacious, minimalist master bedroom. The bed is perfectly made. A dresser holds an open jewelry box. A pile of women's clothing lies on the floor near the closet. Above the bed, a single piece of art hangs on the wall: a neon sign.",
      "sceneSummary": "Trevon's private space.",
      "detailedDescription": "Like the rest of his house, Trevon's bedroom is a curated space. However, the pile of women's clothing and the specific items of jewelry confirm his relationship with Ariel Cole, providing crucial context for his alibi and potential motives in the case.",
      "associatedCharacterIds": ["char_trevon_ford", "char_ariel_cole"],
      "hotspots": [
        { "id": "hotspot-trevon-bedroom-nightstand", "label": "Check Nightstand", "targetCardId": "obj_trevon_gun", "targetCardType": "object", "aiHint": "the nightstand next to the bed" },
        { "id": "hotspot-trevon-bedroom-clothes", "label": "Examine Clothes", "targetCardId": "obj_trevon_womens_clothes", "targetCardType": "object", "aiHint": "a pile of clothes on the floor" },
        { "id": "hotspot-trevon-bedroom-jewelry", "label": "Inspect Jewelry", "targetCardId": "obj_trevon_t_necklace", "targetCardType": "object", "aiHint": "the open jewelry box on the dresser" },
        { "id": "hotspot-trevon-bedroom-main", "label": "Return to Main Room", "targetCardId": "loc_trevon_home", "targetCardType": "location", "type": "move", "aiHint": "the main doorway leading out of the bedroom" }
      ]
    },
    {
      "id": "loc_trevon_home_garage",
      "name": "Trevon's Garage",
      "isInternal": true,
      "imagePrompt": "A photorealistic image of a large, clean garage showroom. A bright yellow Lamborghini and a black Cadillac Escalade are parked side-by-side. Both have custom exhaust pipes. The lighting is bright and even.",
      "sceneSummary": "A collection of high-performance vehicles.",
      "detailedDescription": "Trevon's garage is a showroom for his success, housing vehicles that are as much about status as transportation. The specific characteristics of these cars, particularly their engine sounds, are crucial for comparing against witness statements from the crime scene.",
      "associatedCharacterIds": ["char_trevon_ford"],
      "hotspots": [
        { "id": "hotspot-trevon-garage-lambo", "label": "Inspect Lamborghini", "targetCardId": "obj_trevon_lambo", "targetCardType": "object", "aiHint": "the yellow sports car" },
        { "id": "hotspot-trevon-garage-escalade", "label": "Inspect Escalade", "targetCardId": "obj_trevon_escalade", "targetCardType": "object", "aiHint": "the large black SUV" },
        { "id": "hotspot-trevon-garage-main", "label": "Return to Main Room", "targetCardId": "loc_trevon_home", "targetCardType": "location", "type": "move", "aiHint": "the door leading back into the house" }
      ]
    },
    {
      "id": "loc_walter_home",
      "name": "Walter Halley's House",
      "mapCoords": { "top": "85%", "left": "55%" },
      "imagePrompt": "A photorealistic shot of the exterior of a modern, upper-middle-class suburban home at night. The lights are on inside, casting a warm glow. The architecture features clean lines, large windows, and a mix of wood and stucco.",
      "sceneSummary": "The suburban residence of team trainer Walter Halley.",
      "detailedDescription": "From the outside, Walter Halley's house is the picture of suburban stability. But this idyllic facade hides the reality of a man grappling with a painful divorce and a burning sense of betrayal, making this a key location for uncovering his true state of mind.",
      "associatedCharacterIds": ["char_walter_halley"],
       "propertyRecords": {
        "owner": "Walter Halley & Camille Halley",
        "lastSoldDate": "2018-05-20",
        "lastSoldPrice": "$1,850,000",
        "notes": "Property is co-owned by Walter and his ex-wife Camille. According to divorce filings, the division of this asset is a major point of contention. Walter currently resides in the home alone."
      },
      "hotspots": [
        { "id": "hotspot-walter-enter", "label": "Enter House", "targetCardId": "loc_walter_home_living_room", "targetCardType": "location", "type": "move", "aiHint": "the front door" }
      ]
    },
    {
      "id": "loc_walter_home_living_room",
      "name": "Walter Halley's Living Room",
      "isInternal": true,
      "imagePrompt": "A photorealistic image of the living room of an upper-middle-class home that is messy. Photos of a happy couple are still on the walls. An empty bottle of whisky is in the garbage can, and two more open bottles sit on a coffee table. Doorways to other rooms are visible.",
      "sceneSummary": "The living space, showing signs of recent turmoil.",
      "detailedDescription": "The air in this room is thick with the ghosts of a happy marriage. Photos on the wall are relics of a past Walter Halley seems unable to escape, while the whisky bottles on the table are a testament to his present pain. This isn't just a messy room; it's the heart of his motive, a space where grief has curdled into a quiet, simmering rage.",
      "associatedCharacterIds": ["char_walter_halley"],
       "hotspots": [
        { "id": "hotspot-walter-living-clutter", "label": "Examine Clutter", "targetCardId": "group_living_room_clutter", "targetCardType": "evidenceGroup", "aiHint": "the coffee table with the bottles" },
        { "id": "hotspot-walter-living-office", "label": "Enter Office", "targetCardId": "loc_walter_home_office", "targetCardType": "location", "type": "move", "aiHint": "a door leading to a home office" },
        { "id": "hotspot-walter-living-bedroom", "label": "Enter Bedroom", "targetCardId": "loc_walter_home_bedroom", "targetCardType": "location", "type": "move", "aiHint": "the doorway to the bedroom" },
        { "id": "hotspot-walter-living-garage", "label": "Go to Garage", "targetCardId": "loc_walter_home_garage", "targetCardType": "location", "type": "move", "aiHint": "the door leading to the garage" },
        { "id": "hotspot-walter-living-outside", "label": "Go Outside", "targetCardId": "loc_walter_home", "targetCardType": "location", "type": "move", "aiHint": "the front door leading outside" }
      ]
    },
    {
      "id": "loc_walter_home_office",
      "name": "Walter's Office",
      "isInternal": true,
      "imagePrompt": "A photorealistic shot of a meticulously neat home office. Framed military and personal training certificates hang on the wall. A desk with a closed laptop is perfectly organized. A stack of mail sits on a corner of the desk.",
      "sceneSummary": "A place of past achievements.",
      "detailedDescription": "Walter's home office is a shrine to his past life of discipline and achievement, both in the military and as a trainer. The orderliness of the room contrasts sharply with the chaos in his personal life, and the documents on his desk reveal the methodical steps he took to investigate his ex-wife's affair.",
      "associatedCharacterIds": ["char_walter_halley"],
      "hotspots": [
        { "id": "hotspot-walter-office-certs", "label": "View Certificates", "targetCardId": "group_walter_certificates", "targetCardType": "evidenceGroup", "aiHint": "the framed documents on the wall" },
        { "id": "hotspot-walter-office-computer", "label": "Access Computer", "targetCardId": "obj_pi_invoice_computer", "targetCardType": "object", "aiHint": "the laptop on the desk" },
        { "id": "hotspot-walter-office-mail", "label": "Check Mail", "targetCardId": "obj_restraining_order", "targetCardType": "object", "aiHint": "a stack of mail on the corner of the desk" },
        { "id": "hotspot-walter-office-living", "label": "Return to Living Room", "targetCardId": "loc_walter_home_living_room", "targetCardType": "location", "type": "move", "aiHint": "the main doorway out of the office" }
      ]
    },
    {
      "id": "loc_walter_home_bedroom",
      "name": "Walter's Bedroom",
      "isInternal": true,
      "imagePrompt": "A photorealistic image of a messy, unkempt bedroom. Clothes are on the floor. A photo of a husband and wife hangs above the bed. On the nightstand, two wedding rings are looped together on a chain. A closet door is visible.",
      "sceneSummary": "A space reflecting a life in turmoil.",
      "detailedDescription": "The bedroom shows a man who has given up on appearances. The unkempt state of the room is a direct reflection of his inner turmoil, while the carefully preserved wedding rings on his nightstand are a powerful symbol of his inability to let go of the past.",
      "associatedCharacterIds": ["char_walter_halley"],
      "hotspots": [
        { "id": "hotspot-walter-bedroom-photo", "label": "Examine Photo", "targetCardId": "obj_bedroom_photo", "targetCardType": "object", "aiHint": "the photo above the bed" },
        { "id": "hotspot-walter-bedroom-rings", "label": "Examine Wedding Rings", "targetCardId": "obj_walter_wedding_rings", "targetCardType": "object", "aiHint": "the rings on the nightstand" },
        { "id": "hotspot-walter-bedroom-closet", "label": "Enter Closet", "targetCardId": "loc_walter_home_closet", "targetCardType": "location", "type": "move", "aiHint": "the closet door" },
        { "id": "hotspot-walter-bedroom-living", "label": "Return to Living Room", "targetCardId": "loc_walter_home_living_room", "targetCardType": "location", "type": "move", "aiHint": "the primary doorway leading out of the bedroom" }
      ]
    },
    {
      "id": "loc_walter_home_closet",
      "name": "Walter's Closet",
      "isInternal": true,
      "imagePrompt": "A photorealistic image of a walk-in closet with clothes hung perfectly spaced apart. On the back wall, a tall, thin, modern gun safe decorated with a cheerful gnome sticker is visible.",
      "sceneSummary": "A place for secrets.",
      "detailedDescription": "The meticulous organization of this closet reveals Walter's military discipline. This is a space of order and control, where he keeps his most important—and potentially dangerous—possessions hidden away from the world.",
      "associatedCharacterIds": ["char_walter_halley"],
      "hotspots": [
        { "id": "hotspot-walter-closet-safe", "label": "Search Safe", "targetCardId": "group_walter_safe", "targetCardType": "evidenceGroup", "aiHint": "the thin safe" },
        { "id": "hotspot-walter-closet-bedroom", "label": "Return to Bedroom", "targetCardId": "loc_walter_home_bedroom", "targetCardType": "location", "type": "move", "aiHint": "the doorway leading out of the closet" }
      ]
    },
    {
      "id": "loc_walter_home_garage",
      "name": "Walter's Garage",
      "isInternal": true,
      "imagePrompt": "A photorealistic shot of a suburban garage. A new, powerful Ford F-150 is parked inside. A workbench holds camouflage military gear. A weight bench and squat rack stand in the corner.",
      "sceneSummary": "A space for work and preparation.",
      "detailedDescription": "Walter's garage is a reflection of his identity: disciplined, powerful, and prepared. The military gear on the workbench and the powerful truck are tools of a man with a specific set of skills, making this location crucial for establishing his means and opportunity to commit the crime.",
      "associatedCharacterIds": ["char_walter_halley"],
      "hotspots": [
        { "id": "hotspot-walter-garage-truck", "label": "Inspect Truck", "targetCardId": "obj_ford_f150", "targetCardType": "object", "aiHint": "the Ford F-150" },
        { "id": "hotspot-walter-garage-workbench", "label": "Examine Workbench", "targetCardId": "obj_military_gear", "targetCardType": "object", "aiHint": "the workbench with military gear" },
        { "id": "hotspot-walter-garage-workout", "label": "Check Workout Gear", "targetCardId": "obj_weight_bench", "targetCardType": "object", "aiHint": "the weight bench and squat rack" },
        { "id": "hotspot-walter-garage-living", "label": "Return to Living Room", "targetCardId": "loc_walter_home_living_room", "targetCardType": "location", "type": "move", "aiHint": "the door leading back into the house" }
      ]
    }
];