# Next Tasks for Memories & Highlights Features

## 1. Add Feature Flags for Memories and Highlights

**Purpose:** Conditionally enable/disable memories and highlights features independently for controlled rollout and A/B testing.

**Reasoning:**

- Allows gradual feature rollout to users without full deployment
- Enables quick rollback if issues are discovered in production
- Supports A/B testing to measure feature adoption and user engagement
- Reduces risk by allowing feature testing in production with subset of users
- Standard practice for modern feature management in large-scale applications

**Implementation Notes:**

- Create feature flag entries in the database or configuration management system
- Add flag checks at the UI layer to conditionally render components
- Ensure flags are evaluated on both client and server sides as needed
- Consider flag evaluation caching to avoid performance overhead

---

## 2. Add Heading-Like Separator for Memories and Highlights Sections

**Purpose:** Visually distinguish between memories and highlights sections with persistent section headers visible in scrollbar timeline.

**Reasoning:**

- Improves visual hierarchy and content organization
- Users can quickly identify which section they're in when scrolling
- Timeline/scrollbar integration provides navigation context at a glance
- Reduces cognitive load when browsing through large collections
- Creates natural content segments for better UX flow

**Implementation Notes:**

- Design sticky/persistent headers for both sections
- Integrate with scrollbar indicator/timeline for visual position tracking
- Ensure headers remain accessible and non-intrusive
- Consider animation for section transitions

---

## 3. Add Collapsible Controls for Memories and Highlights

**Purpose:** Allow users to collapse/expand memories and highlights sections to reduce visual clutter and focus on specific content.

**Reasoning:**

- Users may not always want to see all sections simultaneously
- Saves vertical scrolling space and improves page layout efficiency
- Preserves user preference for expanded/collapsed state
- Common UI pattern that users understand intuitively
- Reduces initial page load perception (less content to render initially)

**Implementation Notes:**

- Use standard accordion/collapse components
- Persist collapse state in local storage or user preferences database
- Include smooth animations for expand/collapse transitions
- Ensure keyboard accessibility (arrow keys, Enter for toggle)
- Consider default state based on user history or settings

---

## 4. Add Selection and Deletion Interface for Generated Highlights

**Purpose:** Enable users to browse and remove individual highlights they don't want to keep.

**Reasoning:**

- Gives users control over their generated content
- Allows removal of low-quality or irrelevant highlights
- Reduces clutter from unwanted auto-generated content
- Similar to memories feature, this maintains consistency across features
- Improves user satisfaction by enabling content curation

**Implementation Notes:**

- Add checkbox or selection mechanism for highlights
- Implement bulk delete action (delete button, context menu, etc.)
- Include confirmation dialog before permanent deletion
- Consider soft-delete vs hard-delete strategy
- Add undo functionality if possible

---

## 5. Create Carousel View for Highlights (Similar to Memories)

**Purpose:** Provide an interactive carousel interface for browsing highlights similar to the existing memories carousel.

**Reasoning:**

- Maintains UI/UX consistency across similar features
- Carousel view is ideal for browsing image galleries sequentially
- Users are already familiar with memories carousel behavior
- Reduces learning curve and improves feature discoverability
- Reuses existing carousel component code for maintainability

**Implementation Notes:**

- Adapt existing memories carousel component for highlights
- Include navigation controls (previous, next, indicators)
- Add transition animations between slides
- Consider adding metadata display (date, album name, confidence score)
- Support keyboard navigation (arrow keys)
- Implement touch/swipe gestures for mobile

---

## 6. Improve Highlight Scoring Algorithm for Better Image Selection

**Purpose:** Develop a sophisticated method to identify and select the highest-quality images from an album for highlight generation.

**Reasoning:**

- Current scoring may include irrelevant or low-quality images
- Better selection improves feature quality and user satisfaction
- Users are more likely to engage with naturally appealing highlights
- Reduces negative feedback from poor highlight selections
- Creates better first impression of the feature

**Evaluation Metrics to Consider:**

- **Sharpness/Clarity:** Use blur detection and edge analysis
- **Brightness/Exposure:** Prefer well-lit images over under/over-exposed
- **Composition:** Implement rule-of-thirds, rule-of-odds detection
- **Subject Detection:** Use ML model to detect faces, objects, landscapes
- **Color Vibrancy:** Favor images with good color contrast and saturation
- **Uniqueness:** Avoid selecting visually similar images (clustering)
- **Meta Quality:** Prefer higher resolution, specific camera settings
- **Temporal Distribution:** Spread highlights across the time period for variety
- **ML Features:** Leverage existing ML pipeline (face detection, object recognition)

**Implementation Notes:**

- Consider multi-factor scoring system with weighted criteria
- Profile performance impact of scoring algorithm
- Allow algorithm tuning/calibration based on user feedback
- Consider running scoring computation asynchronously
- Cache results for previously scored albums

---

## 7. Add Year and Month Selection for Highlight Generation

**Purpose:** Allow users to generate highlights from specific time periods (full years or months) rather than fixed-size album windows.

**Reasoning:**

- Users naturally think about photos in time-based units (holidays, yearly summaries, monthly recaps)
- Matches major photo service features (Google Photos "This Year," annual highlights)
- Provides flexibility for different use cases and time scales
- More intuitive than abstract date range selection
- Supports common scenarios: anniversary highlights, seasonal reviews, yearly recaps

**Implementation Notes:**

- Create UI selector for year/month/date-range selection
- Modify highlight generation algorithm to accept date-range parameters
- Handle edge cases (partial years, single-month edge cases)
- Consider performance impact of larger date ranges
- Pre-calculate or optimize queries for common selections
- Allow combining multiple months/years in single highlight
- Show preview of images count before generation
- Cache results for frequently selected periods (e.g., last year)

**User Flow:**

1. User navigates to highlights generation
2. Selects year/month(s) or custom date range
3. System shows preview of images in selection
4. User confirms and initiates highlight generation
5. Results displayed in carousel/grid view

---

## Priority/Sequencing Recommendations

**Phase 1 (Foundation):**

- Task 1: Feature flags (enables all following work)
- Task 2: Section headers (basic organization)

**Phase 2 (Core Features):**

- Task 3: Collapsible sections (improves UX)
- Task 4: Highlight deletion (user control)

**Phase 3 (Enhanced Experience):**

- Task 5: Carousel view (consistency, engagement)
- Task 6: Better scoring (quality improvement)

**Phase 4 (Advanced Features):**

- Task 7: Time-based selection (flexibility and user empowerment)

---

## Testing Considerations

- Unit tests for scoring algorithm variations
- Integration tests for highlight generation with different date ranges
- E2E tests for the complete user flow (select period → generate → view → manage)
- Performance testing for large album selections
- ML model accuracy validation for improved scoring
- User acceptance testing for carousel controls and deletion flow

## Commands:

`$env:COMPOSE_BAKE = 'true'; docker compose -f ./docker/docker-compose.dev.yml up --remove-orphans`

`Start-Sleep -Seconds 8; docker compose -f "d:\TAMU_docs\5th_and_beyond\Projects\Google-Photos-Alt\immich\docker\docker-compose.dev.yml" ps`
