let isHappyHour 

// Logical Operator
isHappyHour = isHappyHour || '🍵'; // '🍺'

// Ternary
isHappyHour = isHappyHour ? isHappyHour : '🍵'; // '🍺'

// If/Else
if (isHappyHour) {
  isHappyHour = isHappyHour;
} else {
  isHappyHour = '🍵';
}

console.log(isHappyHour); // '🍺'