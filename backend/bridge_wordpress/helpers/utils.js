import colores from './colores.js'
import lettersColors from './colores_minimal.js'
var spaces = ["4GB", "8GB", "12GB", "16GB", "24GB", "32GB", "64GB", "128GB"];
async function get_colors_at_sku(variantes, check) {
  var colors = [];
  if (variantes == undefined) return colors;
  for (let i = 0; i < variantes.length; i++) {
    // console.log(variantes[i].sku, "variantes[i].sku")
    let stringMin = '';
    if (check) {
      stringMin = variantes[i].sku.split(' ')
      //traeme el ultimo elemento del array
      stringMin = stringMin[stringMin.length - 1].toLowerCase().replace(/\s/g, '');
      //colores minimales viene como {color:"Rojo",letter:"r"}, quiero buscar si tiene la letra y que devuelva el color
      const colorEncontrado = lettersColors.find(color => color.letter.includes(stringMin.toLowerCase()));
      if (colorEncontrado != null) {
        colors.push(colorEncontrado.color);
      }

    } else {
      stringMin = variantes[i].sku.toLowerCase().replace(/\./g, '');

      const colorEncontrado = colores.find(color => stringMin.includes(color.toLowerCase()));
      // console.log(colorEncontrado, "colorEncontrado")
      if (colorEncontrado != null) {
        colors.push(colorEncontrado);
      }
    }
  }
  return colors;
}
async function get_space_at_sku(variantes) {
  let aux = [];
  if (variantes == undefined) return aux;
  for (let i = 0; i < variantes.length; i++) {
    let espacioEncontrado = await get_space(variantes[i].sku);
    if (espacioEncontrado != null) {
      aux.push(espacioEncontrado);
    }
  }
  return aux;
}
async function get_space(sku) {
  let variants_array = sku.toLowerCase().replace(/\s/g, '');
  const espacioEncontrado = spaces.find(espacio => variants_array.includes(espacio.toLowerCase()));
  return espacioEncontrado || null;
}
async function get_color(sku, check) {
  if (check) {
    let stringMin = sku.split(' ')
    //traeme el ultimo elemento del array
    stringMin = stringMin[stringMin.length - 1].toLowerCase().replace(/\s/g, '');
    //colores minimales viene como {color:"Rojo",letter:"r"}, quiero buscar si tiene la letra y que devuelva el color
    // console.log(sku,stringMin, "stringMin")
    for(let i = 0; i < lettersColors.length; i++){
      if(lettersColors[i].letter.includes(stringMin)){
        // console.log(lettersColors[i].color, "match");
        return lettersColors[i].color;
      }
    }
    return null;
  }
  const stringMin = sku.toLowerCase().replace(/\./g, '');
  const colorEncontrado = colores.find(color => stringMin.includes(color.toLowerCase()));
  return colorEncontrado || null;
}
async function homologationcolor(data) {
  if (data == null) return null;

  if (typeof data == "string") {
    if (data.toLowerCase() == "roja") {
      return "rojo";
    }
    if (data.toLowerCase() == "amarilla") {
      return "amarillo";
    }
    if (data.toLowerCase() == "blanca") {
      return "blanco";
    }
    if (data.toLowerCase() == "negra") {
      return "negro";
    }
    if (data.toLowerCase() == "silver" || data.toLowerCase() == "plata") {
      return "plateado";
    }
    if (data.toLowerCase() == "rosado" || data.toLowerCase() == "rosada") {
      return "rosa"
    }
    return data;
  }
  if (typeof data == "object") {
    for (let i = 0; data.length > i; i++) {
      if (data[i].toLowerCase() == "roja") {
        data[i] = "rojo";
      }
      if (data[i].toLowerCase() == "amarilla") {
        data[i] = "amarillo";
      }
      if (data[i].toLowerCase() == "blanca") {
        data[i] = "blanco";
      }
      if (data[i].toLowerCase() == "negra") {
        data[i] = "negro";
      }
      if (data[i].toLowerCase() == "silver" || data[i].toLowerCase() == "plata") {
        data[i] = "plateado";
      }
      if (data[i].toLowerCase() == "rosado" || data[i].toLowerCase() == "rosada") {
        data[i] = "rosa"
      }
    }
    return data;
  }
  return null;
}
function corregirTexto(texto) {
  // Corregir caracteres especiales
  texto = texto
    .replace(/&aacute/gi, "a")
    .replace(/&eacute/gi, "e")
    .replace(/&iacute/gi, 'i')
    .replace(/&oacute/gi, 'o')
    .replace(/&uacute/gi, 'u')
    .replace(/&uuml/gi, "u")
    .replace(/&nbsp;/gi, " ")
    .replace(/&aacute;/gi, "á")
    .replace(/&eacute;/gi, "é")
    .replace(/&iacute;/gi, 'í')
    .replace(/&uacute;/gi, 'ú')
    .replace(/&oacute;/gi, 'ó')
    .replace(/&ntilde;/gi, "ñ")
    .replace(/&ntilde/gi,'ñ')
    .replace(/&nbsp/gi,' ')

  // .replace(/[^\w\s]/gi, '');
  return texto;
}
function searchCategoriesExtra(categories, name){
  //quiero buscar el nombre de ecologicos en las categorias, si aparece devuelvo la categoria encontrada
  const categoriesExtra = ["ecologicos","ecológico",'eco',"reciclado","reciclable"]
  let aux = [];
  for(let i = 0; i < categoriesExtra.length; i++){
    if(name.toLowerCase().includes(categoriesExtra[i])){
      if(categoriesExtra[i] != "eco"){
        // console.log(categoriesExtra[i], "categoriesExtra[i]", name)
        aux.push('Ecológicos');
      }else{
        aux.push('Ecológicos');
      }
      
    }
  }
  //eliminar duplicados
  aux = [...new Set(aux)];
//ahora lo devuelvo en un string separado por comas
  return aux == null ? categories : categories+','+aux.join(",");
}
export default { get_colors_at_sku, get_space_at_sku, get_space, get_color, homologationcolor, corregirTexto,searchCategoriesExtra };