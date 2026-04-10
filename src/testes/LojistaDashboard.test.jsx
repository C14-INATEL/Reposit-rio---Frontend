import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import LojistaDashboard from "../pages/LojistaDashboard";


beforeEach(() => {
  sessionStorage.setItem("usuario", "Loja A");
  sessionStorage.setItem("tipo", "lojista");
});

describe("LojistaDashboard", () => {

  it("renderiza o header com o nome do usuário", () => {
    render(
      <MemoryRouter>
        <LojistaDashboard />
      </MemoryRouter>
    );

    expect(screen.getByText(/Bem vindo/i)).toBeInTheDocument();
    expect(screen.getByText(/Loja A/i)).toBeInTheDocument();
  });

  it("renderiza os cards de resumo", () => {
    render(
      <MemoryRouter>
        <LojistaDashboard />
      </MemoryRouter>
    );

    expect(screen.getByText(/Total de Pedidos/i)).toBeInTheDocument();
    expect(screen.getByText(/Pendentes/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Em Rota/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/Entregues/i)).toBeInTheDocument();
  });

  it("renderiza a tabela de pedidos recentes na visão geral", () => {
    render(
      <MemoryRouter>
        <LojistaDashboard />
      </MemoryRouter>
    );

    expect(screen.getByText(/Pedidos Recentes/i)).toBeInTheDocument();
    expect(screen.getByText(/Região/i)).toBeInTheDocument();
    expect(screen.getByText(/Peso/i)).toBeInTheDocument();
    expect(screen.getByText(/Status/i)).toBeInTheDocument();
  });

  it("navega para a seção Pedidos ao clicar no menu", () => {
    render(
      <MemoryRouter>
        <LojistaDashboard />
      </MemoryRouter>
    );

    const menuPedidos = screen.getByRole("button", { name: /pedidos/i });
    fireEvent.click(menuPedidos);

    expect(screen.getByText(/Meus Pedidos/i)).toBeInTheDocument();
  });

  it("abre o formulário ao clicar em Novo Pedido", () => {
    render(
      <MemoryRouter>
        <LojistaDashboard />
      </MemoryRouter>
    );

    const btnNovo = screen.getAllByRole("button", { name: /novo pedido/i })[0];
    fireEvent.click(btnNovo);

    expect(screen.getAllByText(/Novo Pedido/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Região/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Peso/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Tipo/i)[0]).toBeInTheDocument();
  });

  it("fecha o formulário ao clicar em Cancelar", () => {
    render(
      <MemoryRouter>
        <LojistaDashboard />
      </MemoryRouter>
    );

    const btnNovo = screen.getAllByRole("button", { name: /novo pedido/i })[0];
    fireEvent.click(btnNovo);

    const btnCancelar = screen.getByRole("button", { name: /cancelar/i });
    fireEvent.click(btnCancelar);

    expect(screen.queryByText(/Custo estimado/i)).not.toBeInTheDocument();
  });

  it("botão Criar Pedido fica desabilitado sem preencher os campos", () => {
    render(
      <MemoryRouter>
        <LojistaDashboard />
      </MemoryRouter>
    );

    const btnNovo = screen.getAllByRole("button", { name: /novo pedido/i })[0];
    fireEvent.click(btnNovo);

    const btnCriar = screen.getByRole("button", { name: /criar pedido/i });
    expect(btnCriar).toBeDisabled();
  });

  it("recolhe e expande a sidebar ao clicar no toggle", () => {
    render(
      <MemoryRouter>
        <LojistaDashboard />
      </MemoryRouter>
    );

    const toggle = document.querySelector(".dash-sidebar-toggle");
    fireEvent.click(toggle);

    const sidebar = document.querySelector(".dash-sidebar");
    expect(sidebar.classList.contains("recolhida")).toBe(true);

    fireEvent.click(toggle);
    expect(sidebar.classList.contains("recolhida")).toBe(false);
  });

  it("redireciona para home ao clicar em Sair", () => {
    render(
      <MemoryRouter initialEntries={["/lojista"]}>
        <Routes>
          <Route path="/lojista" element={<LojistaDashboard />} />
          <Route path="/" element={<h1>Tela Home</h1>} />
        </Routes>
      </MemoryRouter>
    );

    const btnSair = screen.getByRole("button", { name: /sair/i });
    fireEvent.click(btnSair);

    expect(screen.getByText(/Tela Home/i)).toBeInTheDocument();
  });

});