// function to capitalize the first letter of a string

const fnCapitalizeLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
module.exports = fnCapitalizeLetter;
