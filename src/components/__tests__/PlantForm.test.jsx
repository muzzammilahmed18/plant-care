import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import PlantForm from "../PlantForm";
import { PlantsProvider } from "../../context/PlantsContext";
import { ToastProvider } from "../../context/ToastContext";

// PlantsProvider fetches the plant list on mount. We don't want that
// hitting a real backend during a unit test, so fetch is mocked to
// resolve with an empty list — the form's own client-side validation
// (what we're actually testing here) doesn't depend on that call.
beforeEach(() => {
  global.fetch = vi.fn(() =>
    Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
  );
});

function renderPlantForm() {
  return render(
    <ToastProvider>
      <PlantsProvider>
        <PlantForm />
      </PlantsProvider>
    </ToastProvider>
  );
}

describe("PlantForm", () => {
  it("shows a validation error when the name is under 2 characters", async () => {
    const user = userEvent.setup();
    renderPlantForm();

    await user.type(screen.getByPlaceholderText("Fiddle Leaf Fig"), "A");
    await user.click(screen.getByRole("button", { name: /add plant/i }));

    expect(
      await screen.findByText("Name must be at least 2 characters.")
    ).toBeInTheDocument();
  });

  it("shows a validation error when no category is selected", async () => {
    const user = userEvent.setup();
    renderPlantForm();

    await user.type(screen.getByPlaceholderText("Fiddle Leaf Fig"), "Snake Plant");
    await user.click(screen.getByRole("button", { name: /add plant/i }));

    expect(
      await screen.findByText("Please choose a category.")
    ).toBeInTheDocument();
  });
});