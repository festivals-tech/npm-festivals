var merge = function merge(source, dest) {
  if (typeof dest === 'object' || typeof dest === 'array') {
    for (var i in dest) {
      if (dest.hasOwnProperty(i)) {

        if (typeof dest[i] === 'object' || Array.isArray(dest[i])) {

          if (!source.hasOwnProperty(i)) {

            if (Array.isArray(dest[i])) {
              source[i] = [];
            }
            else {
              source[i] = {};
            }
          }
          merge(source[i], dest[i]);
        }
        else {
          source[i] = dest[i];
        }
      }
    }
  }
};


module.exports = {
  merge: merge
};