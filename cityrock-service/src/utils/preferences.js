// src/utils/preferences.js

// 선택된 항목의 빈도를 계산하고, 가장 많이 선택된 항목의 이름을 반환하는 함수
export const analyzePreferences = (selectedItems, keywords) => {
  const frequency = {};

  selectedItems.forEach((item) => {
    frequency[item] = (frequency[item] || 0) + 1; // 각 항목의 선택 빈도를 계산
  });

  // 빈도가 가장 높은 항목을 찾아냅니다.
  let mostPreferredId = null;
  let maxCount = 0;

  for (const item in frequency) {
    if (frequency[item] > maxCount) {
      mostPreferredId = item;
      maxCount = frequency[item];
    }
  }

  // 가장 많이 선택된 항목의 이름 반환
  const mostPreferredItem = keywords.find((keyword) => keyword.id === Number(mostPreferredId));
  return mostPreferredItem ? mostPreferredItem.name : null;
};

  