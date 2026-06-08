Create Task 015 - Authority Evidence Layer

State: ready

Goal

Increase trust, provenance, and recommendation confidence by exposing graph-backed authority signals on every public authority asset.

Background

The following are already verified:

* Authority Graph exists
* Authority Surface exists
* Public rendering exists
* Framework page exists
* Methodology page exists
* Pillar page exists

Task 015 adds trust architecture.

Scope

Create reusable authority components:

1. EvidenceBlock

   * evidence URLs
   * evidence count
   * source type
   * citation snippet

2. ReviewBlock

   * reviewed by
   * review date
   * last updated
   * content status

3. EntityContextBlock

   * related entities
   * related methodology
   * related framework
   * audience served

4. RecommendationIntentBlock

   * target recommendation queries
   * authority intent explanation

5. RelatedAuthorityBlock

   * related pages
   * related entities
   * related concepts

Requirements

Framework pages, Pillar pages, and Methodology pages must support these blocks.

Use existing authority graph relationships whenever possible.

No schema redesign unless absolutely required.

Out of Scope

* No new agents
* No content generation
* No monitoring expansion
* No workflow changes
* No collection redesign

Validation

Verify:

* components render correctly
* pages build successfully
* entity relationships resolve
* public routes render
* typecheck passes
* build passes

Acceptance Criteria

* All authority assets can display evidence metadata
* All authority assets can display graph context
* All authority assets can display recommendation intent
* Trust signals are visible without editing page templates individually
* Build passes
* Typecheck passes

Deliverables

* Task 015 implementation
* verification report
* updated PLANS.md

````

ואחרי Task 015 הייתי נותן לקודקס:

```txt
Prepare proposal for Task 016 - Agent Draft Mode.

Do not implement.

Design the first autonomous workflow:

Approved Insight
→ Content Opportunity
→ Content Job
→ Draft
→ Quality Gate
→ Review Queue

Output:
- workflow
- contracts
- risks
- verifier
- DOD
````

זה הסדר שהייתי בוחר:

```txt
015 = Trust Layer
016 = Agent Draft Design
017 = Agent Draft Implementation
```

ולא ישר לקפוץ ל־agents שמייצרים תוכן. קודם מוכיחים שהעמודים מציגים סמכות בצורה עקבית.
