import colores from './colores.js'
var spaces = ["4GB","8GB","12GB","16GB","24GB","32GB","64GB","128GB"];
async function get_colors_at_sku(variantes) {
  var colors = [];
  console.log(variantes, "variantes")
  for (let i = 0; i < variantes.length; i++) {
    let variants_array = variantes[i].sku.split('-');
    let aux = variants_array.find((element) => {
      return colores.includes(element);
    }
    );
    if (aux != undefined) {
      colors.push(aux);
    }
  }
  return colors;
}
async function get_space_at_sku(variantes){
  var spaces = [];
  for (let i = 0; i < variantes.length; i++) {
    let variants_array = variantes[i].sku.split('-');
    let aux = variants_array.find((element) => {
      const regex = /\d+GB/g;
      const str = element.replace(/\s+/g, '');
      const aux = str.match(regex)
      if(aux != null){
        return spaces.includes(aux[0]);
      }
    }
    );
    if (aux != undefined) {
      spaces.push(aux);
    }
  }

  return spaces;
}
async function get_space(sku){
  let variants_array = sku.split('-');
  let aux = variants_array.find((element) => {
    const regex = /\d+GB/g;
    const str = element.replace(/\s+/g, '');
    const aux = str.match(regex)
    if(aux != null){
      return spaces.includes(aux[0]);
    }
  }
  );
  if (aux != undefined) {
    return aux;
  }
  return "";
}
async function get_color(sku){
  let variants_array = sku.split('-');
  let aux = variants_array.find((element) => {
    return colores.includes(element);
  }
  );
  if (aux != undefined) {
    return aux;
  }
  return "";
}
export default {get_colors_at_sku,get_space_at_sku,get_space,get_color};