const sortArrayByName = (arr) => {
    return arr.sort((a, b) => a.name.localeCompare(b.name));
  };

const sortArrayByPrice = (arr) => {
    return arr.sort((a, b) => a.price - b.price);
  };

  export { sortArrayByName, sortArrayByPrice };