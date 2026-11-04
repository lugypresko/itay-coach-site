import { describe, expect, it } from "vitest";
import { Users } from "@/payload/collections/Users";
// Exercise the configured access callbacks directly, including unauthenticated creation.
const roleField = Users.fields.find((field) => "name" in field && field.name === "role")!;
const access = (roleField as {access: {create: (args: unknown) => boolean; update: (args: unknown) => boolean}}).access;
describe("administrator role assignment", () => {
  it.each([undefined, "human", "agent", "editor"])("does not let %s assign or change roles", (role) => {
    const args = {req: {user: role ? {id: 1, role} : null}};
    expect(access.create(args)).toBe(false);
    expect(access.update(args)).toBe(false);
  });
  it("keeps role management with authenticated administrators", () => {
    const args = {req: {user: {id: 1, role: "admin"}}};
    expect(access.create(args)).toBe(true);
    expect(access.update(args)).toBe(true);
  });
});
