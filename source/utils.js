function firstLetterToUpper(name) {
  return name[0].toUpperCase() + name.slice(1);
}

function changeVisiblity($element, bool) {
  const displayValue = bool ? "block" : "none";
  $element.css("display", displayValue);
}

function clamp(val, min, max) {
  val = parseFloat(val);
  min = parseFloat(min);
  max = parseFloat(max);
  if (val > max) return max;
  if (val < min) return min;
  return val;
}

export { firstLetterToUpper, changeVisiblity, clamp };
