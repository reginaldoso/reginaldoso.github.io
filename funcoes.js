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

// faz uma cópia de um Array de objetos
export function CopyArray(aObject) {
  // Prevent undefined objects
  // if (!aObject) return aObject;

  let bObject = Array.isArray(aObject) ? [] : {};

  let value;
  for (const key in aObject) {

    // Prevent self-references to parent object
    // if (Object.is(aObject[key], aObject)) continue;
    
    value = aObject[key];

    bObject[key] = (typeof value === "object") ? CopyArray(value) : value;
  }

  return bObject;
}


// responsável pelo delay na hora de atualizar as informações do gráfico
export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
} 

// gera numeros randomicos de 0 a 1
export function rand(){
  let numeroAleatorio = Math.floor(Math.random() * 2);
  let cor = "green";

  if(numeroAleatorio ==0){
      cor = "yellow";
      return cor;
  }

  return cor;
}


//atualizar scroll onde fica o gráfico
export function UpdateScrollGrafico(){
  const AreaScroll = document.querySelector("div#area-grafico");
  AreaScroll.scrollLeft = AreaScroll.scrollWidth;

}

// recebe um um numero inteiro e retorna uma string com uma cor em rep. hexadecimal
export function SelecionarCor(numero){
  switch (numero) {
    case 1:
      return "#0E91DB";//azul
    case 2:
      return "#FFFF00";//amarelo
    case 3:
      return "#FD1E1F";//vermelho
    default:
      return "#E4E8EB";//cinza
  }
}

// ordena um array de objetos a partir de um atributo específico
export function ordenarPorAtributo(arrayObj, Atributo) {
  return arrayObj.sort((a, b) => {
      if (a[Atributo] < b[Atributo]) {
          return -1;
      }
      if (a[Atributo] > b[Atributo]) {
          return 1;
      }
      return 0;
  });
}

// ordena um array de objetos a partir dois atributos específico. O segundo atributo é critério de empate
export function ordenarPorAtributoForte(arrayObj, Atributo1, Atributo2){
  return arrayObj.sort((a, b) => {
      if (a[Atributo1] < b[Atributo1]) {
          return -1;
      }
      if (a[Atributo1] > b[Atributo1]) {
          return 1;
      }
      if(a[Atributo1] == b[Atributo1]) {
          if(a[Atributo2] < b[Atributo2]){
              return -1;
          }
          if(a[Atributo2] > b[Atributo2]){
              return 1;
          }
      }
      return 0;
  });
}
