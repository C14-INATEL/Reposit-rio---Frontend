import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";

describe("Home Page", () => {

  it("renderiza textos principais", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
     
    expect(screen.getByText(/Bem-vindo ao/i)).toBeInTheDocument();
    expect(screen.getByText(/Duck/i)).toBeInTheDocument();
    expect(screen.getByText(/Gerencie suas operações/i)).toBeInTheDocument();
    
  });

  it("botão Entrar existe e responde ao clique", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const botaoEntrar = screen.getByRole("button", { name: /entrar/i });

    expect(botaoEntrar).toBeInTheDocument();

    fireEvent.click(botaoEntrar);
  });

  it("botão Rastrear existe e responde ao clique", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const botaoRastrear = screen.getByRole("button", { name: /rastrear/i });

    expect(botaoRastrear).toBeInTheDocument();

    fireEvent.click(botaoRastrear);
  });

  it("clique nos botões não quebra a aplicação", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const entrar = screen.getByRole("button", { name: /entrar/i });
    const rastrear = screen.getByRole("button", { name: /rastrear/i });

    fireEvent.click(entrar);
    fireEvent.click(rastrear);

  });

  it("navega para login ao clicar em Entrar", () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<h1>Tela de Login</h1>} />
      </Routes>
    </MemoryRouter>
  );

  const botaoEntrar = screen.getByRole("button", { name: /entrar/i });

  fireEvent.click(botaoEntrar);

  expect(screen.getByText(/Tela de Login/i)).toBeInTheDocument();
 });

});