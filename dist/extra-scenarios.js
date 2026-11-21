(function () {
  'use strict';
  const scenarios = [];
  for (const { category, ...question } of scenarios) window.TOD_DATA[category].questions.push(question);
})();
