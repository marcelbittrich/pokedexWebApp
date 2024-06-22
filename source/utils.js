function firstLetterToUpper(name) {
  return name[0].toUpperCase() + name.slice(1);
}

function changeVisiblity($element, bool) {
  const displayValue = bool ? "block" : "none";
  $element.css("display", displayValue);
}

export { firstLetterToUpper, changeVisiblity };
