import colores from './colores.js'
var spaces = ["4GB", "8GB", "12GB", "16GB", "24GB", "32GB", "64GB", "128GB"];
async function get_colors_at_sku(variantes) {
  var colors = [];
  if (variantes == undefined) return colors;
  for (let i = 0; i < variantes.length; i++) {
    // console.log(variantes[i].sku, "variantes[i].sku")
    const stringMin = variantes[i].sku.toLowerCase().replace(/\./g, '');
    // console.log(stringMin, "stringMin")
    const colorEncontrado = colores.find(color => stringMin.includes(color.toLowerCase()));
    // console.log(colorEncontrado, "colorEncontrado")
    if (colorEncontrado != null) {
      colors.push(colorEncontrado);
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
  return aux ;
}
async function get_space(sku) {
  let variants_array = sku.toLowerCase().replace(/\s/g, '');
  const espacioEncontrado = spaces.find(espacio => variants_array.includes(espacio.toLowerCase()));
  return espacioEncontrado || null;
}
async function get_color(sku) {
  const stringMin = sku.toLowerCase().replace(/\./g, '');
  const colorEncontrado = colores.find(color => stringMin.includes(color.toLowerCase()));
  return colorEncontrado || null;
}
async function homologationcolor(data) {
  if(data == null) return null;

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
    if (data.toLowerCase() == "rosado" || data.toLowerCase() == "rosada"){
      return "rosa"
    }
  }
  if (typeof data == "object") {
    for(let i = 0; data.length > i;i++){
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
      if (data[i].toLowerCase() == "rosado" || data[i].toLowerCase() == "rosada"){
        data[i] = "rosa"
      }
    }
    return data;
  }
  return null;
}
export default { get_colors_at_sku, get_space_at_sku, get_space, get_color, homologationcolor };