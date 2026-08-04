import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import Signup from "../Signup";
import { AuthProvider } from "../../context/AuthContext";
import { ToastProvider } from "../../context/ToastContext";

function renderSignup() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <ToastProvider>
          <Signup />
        </ToastProvider>
      </AuthProvider>
    </MemoryRouter>
  );
}

describe("Signup", () => {
  it("shows an error when the password is under 8 characters", async () => {
    const user = userEvent.setup();
    renderSignup();

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Password"), "short");
    await user.type(screen.getByLabelText("Confirm password"), "short");
    await user.click(screen.getByRole("button", { name: /sign up/i }));

    expect(
      await screen.findByText("Password must be at least 8 characters.")
    ).toBeInTheDocument();
  });

  it("shows an error when the two passwords don't match", async () => {
    const user = userEvent.setup();
    renderSignup();

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.type(screen.getByLabelText("Confirm password"), "password456");
    await user.click(screen.getByRole("button", { name: /sign up/i }));

    expect(await screen.findByText("Passwords don't match.")).toBeInTheDocument();
  });
});