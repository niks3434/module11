// элементы в DOM можно получить при помощи функции querySelector
const fruitsList = document.querySelector('.fruits__list'); // список карточек
const shuffleButton = document.querySelector('.shuffle__btn'); // кнопка перемешивания
const filterButton = document.querySelector('.filter__btn'); // кнопка фильтрации
const sortKindLabel = document.querySelector('.sort__kind'); // поле с названием сортировки
const sortTimeLabel = document.querySelector('.sort__time'); // поле с временем сортировки
const sortChangeButton = document.querySelector('.sort__change__btn'); // кнопка смены сортировки
const sortActionButton = document.querySelector('.sort__action__btn'); // кнопка сортировки
const kindInput = document.querySelector('.kind__input'); // поле с названием вида
const colorInput = document.querySelector('.color__input'); // поле с названием цвета
const weightInput = document.querySelector('.weight__input'); // поле с весом
const addActionButton = document.querySelector('.add__action__btn'); // кнопка добавления

// список фруктов в JSON формате
let fruitsJSON = `[
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "Дуриан", "color": "зеленый", "weight": 35},
  {"kind": "Личи", "color": "розово-красный", "weight": 17},
  {"kind": "Карамбола", "color": "желтый", "weight": 28},
  {"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22}
]`;

// преобразование JSON в объект JavaScript
let fruits = JSON.parse(fruitsJSON);

const classColorOfFruitsPriority = [
  'fruit_carmazin',
  'fruit_orange',
  'fruit_yellow',
  'fruit_green',
  'fruit_blue',
  'fruit_violet',
  'fruit_lightbrown',
];


/*** ОТОБРАЖЕНИЕ ***/

// отрисовка карточек
const display = () => {
  fruitsList.replaceChildren();

  for (let i = 0; i < fruits.length; i++) {
    const liElement = document.createElement('li');
    liElement.classList.add('fruit__item', classColorOfFruitsPriority[getRandomInt(0, classColorOfFruitsPriority.length-1)]);
    fruitsList.appendChild(liElement);

    const divInfo = document.createElement('div');
    divInfo.className = 'fruit__info';
    liElement.appendChild(divInfo);

    const divIndex = document.createElement('div');
    divIndex.textContent = `index: ${i}`;
    divInfo.appendChild(divIndex);

    const keysFruit = Object.keys(fruits[i]);
    for (let j = 0; j < keysFruit.length; j++) {
      const div = document.createElement('div');
      div.textContent = `${keysFruit[j]}: ${fruits[i][keysFruit[j]]}`;
      divInfo.appendChild(div);
    }
  }
};


/*** ПЕРЕМЕШИВАНИЕ ***/

// генерация случайного числа в заданном диапазоне
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

display();

// перемешивание массива
const shuffleFruits = () => {
  let result = [];
  const fruitCopy = [...fruits];

  while (fruits.length > 0) {
    const randomIndex = getRandomInt(0, fruits.length - 1);
    const element = fruits.splice(randomIndex, 1)[0]; 
    result.push(element);

  }

  fruits = result;

  if (fruitCopy.length !== result.length) {
    return false;
  }

  for (let i = 0; i < fruitCopy.length; i++) {
    if (fruitCopy[i] !== result[i]) {
      return false;
    }
  }

  return true;
};

shuffleButton.addEventListener('click', () => {
  const meshap = shuffleFruits();
  if(meshap === true) {
    alert('Порядок не изменился!');
  }
  
  display();
});

/*** ФИЛЬТРАЦИЯ ***/

// фильтрация массива
const originalFruits = [...fruits];

const filterFruits = () => {
  const minWeight = parseInt(document.querySelector('.minweight__input').value) || 0;
  const maxWeight = parseInt(document.querySelector('.maxweight__input').value) || Infinity;

  const filteredFruits = originalFruits.filter((item) => {
    return item.weight >= minWeight && item.weight <= maxWeight
  });

  fruits = filteredFruits;
};

filterButton.addEventListener('click', () => {
  filterFruits();
  display();
});

/*** СОРТИРОВКА ***/

let sortKind = 'bubbleSort'; // инициализация состояния вида сортировки
let sortTime = '-'; // инициализация состояния времени сортировки

const comparationColor = (elements, classColorOfFruitsPriority) => {
  return elements.sort((a, b) => {
    const classA = Array.from(a.classList).find(cls => classColorOfFruitsPriority.includes(cls));
    const classB = Array.from(b.classList).find(cls => classColorOfFruitsPriority.includes(cls));

    if (classA === undefined) return -1;
    if (classB === undefined) return 1;

    const priorityA = classColorOfFruitsPriority.indexOf(classA);
    const priorityB = classColorOfFruitsPriority.indexOf(classB);

    return priorityA - priorityB;
  });
};

const sortAPI = {
  bubbleSort(arr, comparation) {
    const n = arr.length;

    for (let i = 0; i < n-1; i++) { 
        for (let j = 0; j < n-1-i; j++) { 
            if (comparation(arr[j], arr[j+1])) { 
                let temp = arr[j+1]; 
                arr[j+1] = arr[j]; 
                arr[j] = temp; 
            }
        }
    }       
  },

  quickSort(arr, comparation) {
    if (arr.length <= 1) {
      return arr;
    }

    const pivot = arr[Math.floor(arr.length / 2)];
    const left = [];
    const right = [];
    const equal = [];

    for (let i = 0; i < arr.length; i++) {
        const comparison = comparation(arr[i], pivot);

        if (comparison < 0) {
            left.push(arr[i]);
        } else if (comparison > 0) {
            right.push(arr[i]);
        } else {
            equal.push(arr[i]);
        }
    }

  return [...quickSort(left, comparation), ...equal, ...quickSort(right, comparation)];
  },

  // выполняет сортировку и производит замер времени
  startSort(sort, arr, comparation) {
    const start = new Date().getTime();
    sort(arr, comparation);
    const end = new Date().getTime();
    sortTime = `${end - start} ms`;
  },
};

// инициализация полей
sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;

sortChangeButton.addEventListener('click', () => {
  sortKind = sortKind === 'bubbleSort' 
              ? 'quickSort' 
              : 'bubbleSort';

  sortKindLabel.textContent = sortKind;
});

sortActionButton.addEventListener('click', () => {
  sortTime = 'sorting...';
  sortTimeLabel.textContent = sortTime;

  const sort = sortAPI[sortKind];
  sortAPI.startSort(sort, fruits, comparationColor);

  display();

  sortTimeLabel.textContent = sortTime;

});

/*** ДОБАВИТЬ ФРУКТ ***/

addActionButton.addEventListener('click', () => {

  const kind = kindInput.value.trim();
  const color = colorInput.value.trim();
  const weight = Number(weightInput.value.trim());

  if(kind !== '' && color !== '' && !isNaN(weight) && weight > 0) {
    const newFruit = {kind: kind, color: color, weight: weight};
    fruits.push(newFruit);
    display();
  } else {
    alert('Не все данные заполнены или вес указан неверно!');
  }
  
});
