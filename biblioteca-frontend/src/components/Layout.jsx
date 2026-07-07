import { NavLink, Outlet } from "react-router-dom";
import { useAuth, PAPEL_LABEL } from "../context/AuthContext";

const TABS = [
  { to: "/livros", index: "01", label: "Livros", roles: [1, 2, 3] },
  { to: "/leitores", index: "02", label: "Leitores", roles: [1, 2] },
  { to: "/emprestimos", index: "03", label: "Empréstimos", roles: [1, 2, 3] },
  { to: "/usuarios", index: "04", label: "Usuários", roles: [1] },
];

export default function Layout() {
  const { usuario, sair } = useAuth();
  const visiveis = TABS.filter((t) => t.roles.includes(usuario?.papel));

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">Acervo</div>
          <div className="brand-sub">Catálogo &amp; empréstimos</div>
        </div>
        <ul className="nav-list">
          {visiveis.map((tab) => (
            <li key={tab.to}>
              <NavLink
                to={tab.to}
                className={({ isActive }) => "nav-tab" + (isActive ? " active" : "")}
              >
                <span className="tab-index">{tab.index}</span>
                {tab.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="sidebar-footer">
          <div className="user-chip">
            <span className="name">{usuario?.login}</span>
            <span className="role">{PAPEL_LABEL[usuario?.papel]}</span>
          </div>
          <button className="logout-btn" onClick={sair}>
            Sair
          </button>
        </div>
      </aside>
      <main className="main-area">
        <Outlet />
      </main>
    </div>
  );
}
