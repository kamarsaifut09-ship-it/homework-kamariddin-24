let config = null;

const state = {
  activeTab: 'exterior',
  colorId: 'blue',
  interiorId: 1,
  frame: 1
};

const FRAME_STEP = 120;
let wheelAmount = 0;

const imageElement = document.getElementById('main-image');
const viewer = document.getElementById('car-viewer');
const optionsList = document.getElementById('options-list');
const panelHeading = document.getElementById('panel-heading');
const frameIndicator = document.getElementById('frame-indicator');
const captionTitle = document.getElementById('caption-title');
const captionDescription = document.getElementById('caption-description');
const quoteDialog = document.getElementById('quote-dialog');

function findColor() {
  return config.exteriorColors.find(function (item) {
    return item.id === state.colorId;
  });
}

function findInterior() {
  return config.interiorOptions.find(function (item) {
    return item.id === state.interiorId;
  });
}

function totalPrice() {
  const color = findColor();
  const interior = findInterior();
  return config.basePrice + color.price + interior.price;
}

function money(value) {
  return '$' + value.toLocaleString('en-US');
}

function setPrice() {
  document.querySelectorAll('.price-value').forEach(function (node) {
    node.textContent = money(totalPrice());
  });
}

function imagePath() {
  if (state.activeTab === 'exterior') {
    return 'images/exterior/' + state.colorId + '/' + state.frame + '.png';
  }
  return 'images/interior/' + state.interiorId + '.png';
}

function refreshImage() {
  imageElement.src = imagePath();
  imageElement.alt = state.activeTab === 'exterior'
    ? config.model + ' exterior'
    : config.model + ' interior';
  frameIndicator.hidden = state.activeTab !== 'exterior';
  frameIndicator.textContent = state.frame + ' / 6';
}

function refreshCaption() {
  if (state.activeTab === 'exterior') {
    const color = findColor();
    captionTitle.textContent = color.name;
    captionDescription.textContent = color.description;
  } else {
    const interior = findInterior();
    captionTitle.textContent = interior.name;
    captionDescription.textContent = 'Selected interior upholstery for the BMW X6 M Competition.';
  }
}

function optionPrice(value) {
  return value === 0 ? 'Included' : '+' + money(value).replace('$', '$');
}

function renderColorOptions() {
  panelHeading.textContent = 'Color';
  optionsList.innerHTML = '';

  config.exteriorColors.forEach(function (color) {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'option' + (state.colorId === color.id ? ' selected' : '');
    item.innerHTML =
      '<span class="swatch" style="background:' + color.hex + '">' +
        (state.colorId === color.id ? '<span class="check">✓</span>' : '') +
      '</span>' +
      '<span class="option-info">' +
        '<span class="option-name">' + color.name + '</span>' +
        '<span class="option-price">' + optionPrice(color.price) + '</span>' +
      '</span>';

    item.addEventListener('click', function () {
      state.colorId = color.id;
      renderScreen();
    });

    optionsList.appendChild(item);
  });
}

function renderInteriorOptions() {
  panelHeading.textContent = 'Interior';
  optionsList.innerHTML = '';

  config.interiorOptions.forEach(function (interior) {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'option' + (state.interiorId === interior.id ? ' selected' : '');
    item.innerHTML =
      '<span class="swatch" style="background:' + interior.hex + '">' +
        (state.interiorId === interior.id ? '<span class="check">✓</span>' : '') +
      '</span>' +
      '<span class="option-info">' +
        '<span class="option-name">' + interior.name + '</span>' +
        '<span class="option-price">' + optionPrice(interior.price) + '</span>' +
      '</span>';

    item.addEventListener('click', function () {
      state.interiorId = interior.id;
      renderScreen();
    });

    optionsList.appendChild(item);
  });
}

function refreshButtons() {
  const next = document.getElementById('next-button');
  if (state.activeTab === 'exterior') {
    next.hidden = false;
    next.querySelector('span:first-child').textContent = 'Next: Interior';
  } else {
    next.hidden = true;
  }
}

function refreshTabs() {
  document.querySelectorAll('.tab').forEach(function (button) {
    button.classList.toggle('active', button.dataset.tab === state.activeTab);
  });
}

function renderScreen() {
  refreshTabs();
  refreshImage();
  refreshCaption();
  setPrice();
  refreshButtons();

  if (state.activeTab === 'exterior') {
    renderColorOptions();
  } else {
    renderInteriorOptions();
  }
}

function showNextFrame() {
  if (state.frame < 6) {
    state.frame += 1;
    renderScreen();
  }
}

function showPreviousFrame() {
  if (state.frame > 1) {
    state.frame -= 1;
    renderScreen();
  }
}

viewer.addEventListener('wheel', function (event) {
  if (state.activeTab !== 'exterior') return;

  event.preventDefault();
  wheelAmount += event.deltaX + event.deltaY;

  if (wheelAmount >= FRAME_STEP) {
    showNextFrame();
    wheelAmount = 0;
  } else if (wheelAmount <= -FRAME_STEP) {
    showPreviousFrame();
    wheelAmount = 0;
  }
}, { passive: false });

document.querySelectorAll('.tab').forEach(function (button) {
  button.addEventListener('click', function () {
    state.activeTab = button.dataset.tab;
    renderScreen();
  });
});

document.getElementById('next-button').addEventListener('click', function () {
  state.activeTab = 'interior';
  renderScreen();
});

function preloadImages() {
  config.exteriorColors.forEach(function (color) {
    for (let frame = 1; frame <= 6; frame += 1) {
      const image = new Image();
      image.src = 'images/exterior/' + color.id + '/' + frame + '.png';
    }
  });
}

function createQuote() {
  const color = findColor();
  const interior = findInterior();
  const options = color.price + interior.price;

  const quote = {
    model: config.model,
    exterior: color.name,
    interior: interior.name,
    basePrice: config.basePrice,
    options: options,
    total: totalPrice(),
    date: new Date().toLocaleString('en-GB', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  };

  console.log(JSON.stringify(quote, null, 2));
  return quote;
}

function openQuote() {
  const quote = createQuote();
  document.getElementById('quote-content').innerHTML =
    '<div class="quote-row"><span>Model</span><strong>' + quote.model + '</strong></div>' +
    '<div class="quote-row"><span>Exterior</span><strong>' + quote.exterior + '</strong></div>' +
    '<div class="quote-row"><span>Interior</span><strong>' + quote.interior + '</strong></div>' +
    '<div class="quote-row"><span>Base price</span><strong>' + money(quote.basePrice) + '</strong></div>' +
    '<div class="quote-row"><span>Options</span><strong>' + money(quote.options) + '</strong></div>' +
    '<div class="quote-row total"><span>Total</span><strong>' + money(quote.total) + '</strong></div>';
  quoteDialog.hidden = false;
}

document.getElementById('quote-button').addEventListener('click', openQuote);
document.getElementById('dialog-close').addEventListener('click', function () {
  quoteDialog.hidden = true;
});
document.getElementById('dialog-backdrop').addEventListener('click', function () {
  quoteDialog.hidden = true;
});

fetch('data/config.json')
  .then(function (response) {
    if (!response.ok) throw new Error('config.json could not be loaded');
    return response.json();
  })
  .then(function (data) {
    config = data;
    document.getElementById('model-name').textContent = config.model;
    preloadImages();
    renderScreen();
  })
  .catch(function (error) {
    console.error(error);
  });
