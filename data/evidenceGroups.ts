/**
 * @file data/evidenceGroups.ts
 * @description Contains the raw data for all evidence groups in the story.
 * An evidence group is a container for multiple objects found at a single hotspot.
 * This file is critical for fixing the crash related to missing group data.
 */

import { EvidenceGroup } from '../types';

export const rawEvidenceGroups: Omit<EvidenceGroup, 'imagePrompt' | 'description'>[] = [
    {
        "id": "group_foyer_clues",
        "name": "Crime Scene Evidence",
        "objectIds": ["obj_shell_casings", "obj_bloodstain", "obj_overturned_vase"]
    },
    {
        "id": "group_kitchen_table",
        "name": "Dinner Setting",
        "objectIds": ["obj_wine_glasses_used", "obj_dirty_plates"]
    },
    {
        "id": "group_nightstand_items",
        "name": "Nightstand Drawer",
        "objectIds": ["obj_bible", "obj_antidepressants"]
    },
    {
        "id": "group_apex_computer_files",
        "name": "Malcolm's Computer",
        "objectIds": ["obj_custody_papers_computer"]
    },
    {
        "id": "group_apex_desk_items",
        "name": "Malcolm's Desk",
        "objectIds": ["obj_failed_trade_memo", "obj_pi_photos_desk"]
    },
    {
        "id": "group_trophy_room_lounge",
        "name": "Lounge Table",
        "objectIds": ["obj_cigars_scotch"]
    },
    {
        "id": "group_trevon_locker",
        "name": "Trevon's Locker",
        "objectIds": ["obj_trevon_painkillers", "obj_trevon_fan_mail", "obj_trevon_jacket"]
    },
    {
        "id": "group_walter_laptop",
        "name": "Walter's Laptop",
        "objectIds": ["obj_walter_social_1", "obj_walter_records_1"]
    },
    {
        "id": "group_ariel_desk_docs",
        "name": "Ariel's Desk",
        "objectIds": ["obj_legal_letters", "obj_voicemail_ariel"]
    },
    {
        "id": "group_ariel_kitchen_counter",
        "name": "Kitchen Counter",
        "objectIds": ["obj_tesla_keys", "obj_airbnb_keys"]
    },
    {
        "id": "group_ariel_nightstand_1",
        "name": "Ariel's Nightstand",
        "objectIds": ["obj_ariel_gun", "obj_ariel_pills"]
    },
    {
        "id": "group_trevon_docs",
        "name": "Trevon's Documents",
        "objectIds": ["obj_trevon_comp_email", "obj_trevon_comp_draft", "obj_trevon_records_1"]
    },
    {
        "id": "group_living_room_clutter",
        "name": "Coffee Table",
        "objectIds": ["obj_walter_photos", "obj_whisky_bottles"]
    },
    {
        "id": "group_walter_certificates",
        "name": "Wall Certificates",
        "objectIds": ["obj_military_certs", "obj_training_certs"]
    },
    {
        "id": "group_walter_safe",
        "name": "Gun Safe",
        "objectIds": ["obj_walter_file_2"]
    },
    {
        "id": "group_crime_scene_photos",
        "name": "Crime Scene Photo Album",
        "objectIds": ["obj_crime_scene_photo_1", "obj_crime_scene_photo_2"]
    }
];