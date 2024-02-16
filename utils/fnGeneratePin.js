const fnGeneratePin = (prefix, length) => {
    const characters =
      "0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
    return `${prefix}${result}`;
  }
  
  module.exports = fnGeneratePin;