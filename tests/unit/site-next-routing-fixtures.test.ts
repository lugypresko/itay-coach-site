import { describe, expect, it } from "vitest";
import { initialJourney, transition, view } from "../../src/lib/push-conversation";
import { siteNextRouteFixtures } from "../fixtures/site-next-routes";

describe("site-next canonical routing fixtures", () => {
  it.each(siteNextRouteFixtures)("returns exact route, reasons and UI outcome for $name", (fixture) => {
    const journey = fixture.actions.reduce((current, action) => transition(current, action), initialJourney());
    const safe = view(journey);

    expect(journey.route).toBe(fixture.expectedRoute);
    expect(journey.reasons).toEqual(fixture.expectedReasons);
    expect(safe.prompt.title).toBe(fixture.expectedTitle);
    expect(safe.prompt.choices?.map((choice) => choice.value) ?? null).toEqual(
      fixture.expectedFinalAction ? [fixture.expectedFinalAction] : null,
    );
  });
});

