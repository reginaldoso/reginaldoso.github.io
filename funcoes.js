// Gera um construtor de estruturas chamada processo

export function Cestruturas(keys) {
  if (!keys) return null;
  const k = keys.split(', ');
  const count = k.length;

  /* Construtor */
  function constructor() {
    for (let i = 0; i < count; i++) this[k[i]] = arguments[i];
  }
  return constructor;
}
