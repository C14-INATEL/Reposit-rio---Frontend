import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Rastreio from "../pages/Rastreio";

// MOCK do useNavigate
const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock
  };
});

describe("Rastreio - Testes com Mock", () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // TESTE 1 — MOCK DO CLIPBOARD
  it("deve copiar o código de rastreio ao clicar no botão", async () => {

    // Mock do clipboard
    const writeTextMock = vi.fn();
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock
      }
    });

    render(
      <MemoryRouter>
        <Rastreio />
      </MemoryRouter>
    );

    // Digita código válido
    const input = screen.getByPlaceholderText(/ex:/i);
    fireEvent.change(input, { target: { value: "TRK-ABC123XYZ-1A2B" } });

    // Clica em buscar
    fireEvent.click(screen.getByRole("button", { name: /buscar/i }));

    // Clica no botão de copiar
    const btnCopiar = await screen.findByTitle(/copiar código/i);
    fireEvent.click(btnCopiar);

    // Verifica se chamou o mock
    expect(writeTextMock).toHaveBeenCalledWith("TRK-ABC123XYZ-1A2B");
  });

  // TESTE 2 — MOCK DO NAVIGATE
  it("deve redirecionar para home ao clicar em Voltar", () => {

    render(
      <MemoryRouter>
        <Rastreio />
      </MemoryRouter>
    );

    const btnVoltar = screen.getByRole("button", { name: /voltar/i });
    fireEvent.click(btnVoltar);

    expect(navigateMock).toHaveBeenCalledWith("/");
  });

});