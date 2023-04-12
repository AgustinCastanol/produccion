import colores from './colores.js'
var spaces = ["4GB","8GB","12GB","16GB","24GB","32GB","64GB","128GB"];
async function get_colors_at_sku(variantes) {
  var colors = [];
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
async function get_space_at_sku(variantes){
  var spaces = [];
  for (let i = 0; i < variantes.length; i++) {
    let variants_array = variantes[i].sku.toLowerCase().replace(/\s/g, '');
    const espacioEncontrado = spaces.find(espacio => variants_array.includes(espacio.toLowerCase()));
    if (espacioEncontrado != null) {
      spaces.push(aux);
    }
  }

  return spaces;
}
async function get_space(sku){
  let variants_array = sku.toLowerCase().replace(/\s/g, '');
  const espacioEncontrado = spaces.find(espacio => variants_array.includes(espacio.toLowerCase()));
  return espacioEncontrado || null;
}
async function get_color(sku){
  const stringMin = sku.toLowerCase().replace(/\./g, '');
  const colorEncontrado = colores.find(color => stringMin.includes(color.toLowerCase()));
  return colorEncontrado || null;
}
export default {get_colors_at_sku,get_space_at_sku,get_space,get_color};