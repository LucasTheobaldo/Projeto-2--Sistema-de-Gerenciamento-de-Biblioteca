const EMPRESTIMO_STATUS = {
  1: { label: "Em aberto", cls: "stamp-aberto" },
  2: { label: "Devolvido", cls: "stamp-devolvido" },
  3: { label: "Atrasado", cls: "stamp-atrasado" },
};

export function EmprestimoStamp({ status }) {
  const info = EMPRESTIMO_STATUS[status] || { label: "—", cls: "stamp-aberto" };
  return <span className={`stamp ${info.cls}`}>{info.label}</span>;
}

export function BooleanStamp({ value, textoTrue, textoFalse, clsTrue, clsFalse }) {
  return (
    <span className={`stamp ${value ? clsTrue : clsFalse}`}>
      {value ? textoTrue : textoFalse}
    </span>
  );
}

export function LeitorStatusStamp({ status }) {
  return (
    <BooleanStamp
      value={status}
      textoTrue="Ativo"
      textoFalse="Inativo"
      clsTrue="stamp-ativo"
      clsFalse="stamp-inativo"
    />
  );
}

export function LivroStatusStamp({ disponivel }) {
  return (
    <BooleanStamp
      value={disponivel > 0}
      textoTrue="Disponível"
      textoFalse="Indisponível"
      clsTrue="stamp-disponivel"
      clsFalse="stamp-indisponivel"
    />
  );
}
