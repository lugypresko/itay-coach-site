import { describe, expect, it } from "vitest";

import { metadata as blueprintMetadata } from "../../src/app/(site)/campaigns/blueprint/page";
import { metadata as manifestoMetadata } from "../../src/app/(site)/campaigns/manifesto/page";
import { metadata as playerTrapMetadata } from "../../src/app/(site)/campaigns/player-trap/page";

describe("campaign concept routes", () => {
  it("keeps the original blueprint, manifesto, and diagnostic concepts as campaign surfaces", () => {
    expect(blueprintMetadata.alternates?.canonical).toBe("/campaigns/blueprint");
    expect(manifestoMetadata.alternates?.canonical).toBe("/campaigns/manifesto");
    expect(playerTrapMetadata.alternates?.canonical).toBe("/campaigns/player-trap");
    for (const metadata of [blueprintMetadata, manifestoMetadata, playerTrapMetadata]) {
      expect(metadata.robots).toEqual({ index: false, follow: false });
    }
  });
});
