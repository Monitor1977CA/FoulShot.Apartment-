# Foul Shot: An Interactive Noir Mystery

"Foul Shot" is an interactive visual storytelling game where you step into the shoes of a detective to solve a high-profile murder. Aided by an AI assistant, you'll investigate locations, analyze evidence, and interrogate suspects to piece together the timeline and uncover the truth.

This project is a web-based interactive mystery game built with modern frontend technologies. It leverages the Google Gemini API for dynamic content generation, including character/location images and AI-driven analysis.

---

## 🏛️ Core Architectural Principles (Post-Refactor)

The application has been refactored to a **domain-driven, feature-based architecture** to ensure it is **scalable, performant, and highly maintainable.** This is a production-ready standard for modern web applications.

### 1. New Core Gameplay: The Interactive Case File
The central gameplay loop has been redesigned around the **Kishōtenketsu** narrative structure and the ludeme of an **assembly puzzle**.
- **(Ki) Introduction:** The player is introduced to the case and begins exploring.
- **(Shō) Development:** The player investigates locations and discovers evidence. Key pieces of evidence now unlock **Clues**—narrative fragments needed to solve the case.
- **(Ten) Twist:** The Forensic Lens system allows the player to uncover hidden links that re-contextualize the evidence, providing "aha!" moments.
- **(Ketsu) Conclusion:** The player uses the **Interactive Case File** to solve the puzzle. By dragging and dropping Clues into the correct slots for Motive, Means, and Opportunity, the player builds the narrative of the crime. Correctly assembling the timeline *is* the climax and solves the case.

### 2. Co-located State Management
Following modern Redux best practices, each major feature contains its own "slice" of the Redux state. For example, the new `caseFileSlice.ts` manages all state for the interactive puzzle and lives with its related components. The root store in `/store/index.ts` simply assembles these feature-based slices.

**✨ Benefit:** This makes features truly self-contained. Adding or removing a feature is as simple as adding or removing its related files and updating one line in the root store.

### 3. Data-Driven UI
The application remains highly data-driven, decoupling the story from the UI that presents it.
1.  **The Data Layer (`/data`):** Raw story data is defined in modular files (`characters.ts`, `objects.ts`, etc.). A transformation layer in `story.ts` enriches this data for the application. The new `caseFileData.ts` defines the structure of the core puzzle.
2.  **The Registry (`/components/organisms/componentRegistry.ts`):** This "Rosetta Stone" maps data `type` strings (e.g., `'socialMedia'`) to their UI metadata (icon, label, modal).
3.  **The UI (`/components`):** The UI is fully data-driven. `CharacterCard.tsx` dynamically renders its action buttons based on a character's available data, looking up the UI metadata in the central registry.

**✨ Benefit:** To add a new character action (e.g., "Email Records"), you simply define the data and add a registry entry. The UI adapts automatically.

---

## 📂 Project Structure

-   `/src`
    -   `/components`: All React components, organized by atomic design principles (atoms, molecules, organisms, templates).
    -   `/data`: The static story data, transformation logic, and new case file puzzle data.
    -   `/hooks`: Reusable custom React hooks.
    -   `/services`: Modules for external APIs (`geminiService`) and database (`dbService`).
    -   `/store`: Redux store configuration (`index.ts`) and state slices (`storySlice.ts`, `uiSlice.ts`, `caseFileSlice.ts`, etc.).
    -   `/types.ts`: All core TypeScript type definitions.
    -   `/config.ts`: Centralized configuration for the entire application.
-   `App.tsx`: The root component; handles global layout and modal rendering.
-   `index.tsx`: The application entry point.

---

## ⛔ Obsolete Files for Safe Removal

The following files are no longer used after the architectural and gameplay overhaul. They can be safely deleted from the project to reduce clutter.

-   `data/baskervillesStory.ts`
-   `data/storyData.ts`
-   `data/hayesValleyStory.ts`
-   `hooks/useSherlock.ts`
-   `store/sherlockSlice.ts`
-   `components/atoms/CardButton.tsx`
-   `components/atoms/ActionIconButton.tsx`
-   `components/atoms/PillButton.tsx`
-   `components/atoms/StatusBadge.tsx`
-   `components/molecules/CardButtonContainer.tsx`
-   `components/organisms/SherlockBar.tsx`
-   `components/organisms/WatsonBar.tsx`
-   `components/organisms/DetailModal.tsx`
-   `components/organisms/ConnectionsModal.tsx`
-   `components/organisms/TextModal.tsx`
-   `components/organisms/modals/SocialMediaModal.tsx`
-   `components/organisms/modals/PhoneLogModal.tsx`
-   `components/organisms/modals/CctvModal.tsx`
-   `components/organisms/modals/RecordsModal.tsx`
-   `components/organisms/modals/FileModal.tsx`
-   `components/organisms/modals/TimelineSlideshowModal.tsx`
-   `components/organisms/modals/InterviewModal.tsx`
-   `components/organisms/InterviewCard.tsx`
-   `components/organisms/ObjectivesView.tsx`
-   `components/organisms/ADABar.tsx`
-   `components/atoms/CircularIconButton.tsx`
-   `components/molecules/InvestigationActions.tsx`
-   `components/organisms/GlobalHeader.tsx`
-   `components/templates/TokensView.tsx`
-   `components/molecules/BountyCard.tsx`
-   `components/atoms/TokenDisplay.tsx`
-   `components/organisms/TimelineHeader.tsx`
-   `components/organisms/CaseStrengthDashboard.tsx`
-   `components/organisms/MMOProgressView.tsx`
-   `hooks/useProcessedTimeline.ts`
-   `components/molecules/TimelineEventCard.tsx`
-   `components/molecules/TimelineEventNode.tsx`
-   `components/molecules/TimelineEventStackCard.tsx`
-   `components/molecules/TimelineEventStackNode.tsx`
-   `components/molecules/TimelineNodeWrapper.tsx`
-   `components/organisms/TimelineEventList.tsx`

---

## 🚀 Tech Stack

-   **Framework:** [React](https://react.dev/)
-   **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **AI Integration:** [Google Gemini API](https://ai.google.dev/) (`@google/genai`)
-   **Icons:** [Lucide React](https://lucide.dev/guide/react)
-   **Offline Storage:** [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) (via `idb` library)