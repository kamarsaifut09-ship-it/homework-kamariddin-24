const BASE_PRICE = 100000;

const exteriorOptions = [
  {
    id: 'blue',
    name: 'Marina Bay Blue Metallic',
    description: 'Brilliant, vibrant colors with a metallic shine.',
    price: 0,
    color: '#004280',
    image: 'images/exterior/blue/1.png'
  },
  {
    id: 'black',
    name: 'Black Sapphire Metallic',
    description: 'Deep black with elegant gloss reflection.',
    price: 550,
    color: '#111111',
    image: 'images/exterior/black/1.png'
  },
  {
    id: 'red',
    name: 'Toronto Red Metallic',
    description: 'Expressive racing shade emphasizing sporty character.',
    price: 750,
    color: '#b30000',
    image: 'images/exterior/red/1.png'
  },
  {
    id: 'white',
    name: 'Alpine White',
    description: 'Classic pure white finish with striking contrast.',
    price: 0,
    color: '#f0f0f0',
    image: 'images/exterior/white/1.png'
  }
];

// Ровно 4 варианта интерьера (5-й полностью удалён)
const interiorOptions = [
  {
    id: 'black-leather',
    name: 'Merino Black Leather',
    description: 'Premium full-grain leather with contrasting stitching.',
    price: 0,
    color: '#1a1a1a',
    image: 'images/interior/black/1.png'
  },
  {
    id: 'sakhir-orange',
    name: 'Sakhir Orange Merino',
    description: 'Bold orange leather with sporty accents.',
    price: 1200,
    color: '#a83222',
    image: 'images/interior/orange/1.png'
  },
  {
    id: 'adelaide-grey',
    name: 'Adelaide Grey Merino',
    description: 'Elegant grey tone with smooth finish.',
    price: 1200,
    color: '#737578',
    image: 'images/interior/grey/1.png'
  },
  {
    id: 'taruma-brown',
    name: 'Taruma Brown Merino',
    description: 'Luxurious warm brown interior styling.',
    price: 1500,
    color: '#5c3a21',
    image: 'images/interior/brown/1.png'
  }
];

let currentTab = 'exterior';
let selectedExterior = exteriorOptions[0];
let selectedInterior = interiorOptions[0];

const mainImage = document.getElementById('main-image');
const captionTitle = document.getElementById('caption-title');
const captionDescription = document.getElementById('caption-description');
const panelHeading = document.getElementById('panel-heading');
const optionsList = document.getElementById('options-list');
const headerPrice = document.getElementById('header-price');
const nextButton = document.getElementById('next-button');
const quoteButton = document.getElementById('quote-button');
const quoteDialog = document.getElementById('quote-dialog');
const quoteContent = document.getElementById('quote-content');
const dialogClose = document.getElementById('dialog-close');
const dialogBackdrop = document.getElementById('dialog-backdrop');
const tabs = document.querySelectorAll('.tab');

function calculateTotal() {
  return BASE_PRICE + selectedExterior.price + selectedInterior.price;
}

function updatePriceDisplay() {
  const total = calculateTotal();
  headerPrice.textContent = `$${total.toLocaleString()}`;
}

function renderOptions() {
  const options = currentTab === 'exterior' ? exteriorOptions : interiorOptions;
  const selectedOption = currentTab === 'exterior' ? selectedExterior : selectedInterior;

  panelHeading.textContent = currentTab === 'exterior' ? 'Exterior Color' : 'Interior Upholstery';
  optionsList.innerHTML = '';

  options.forEach((opt) => {
    const isSelected = opt.id === selectedOption.id;
    const item = document.createElement('div');
    item.className = `option ${isSelected ? 'selected' : ''}`;

    item.innerHTML = `
      <div class="swatch" style="background-color: ${opt.color}">
        ${isSelected ? '<div class="check">✓</div>' : ''}
      </div>
      <div class="option-info">
        <div class="option-name">${opt.name}</div>
        <div class="option-price">${opt.price === 0 ? 'Included' : `+$${opt.price}`}</div>
      </div>
    `;

    item.addEventListener('click', () => {
      if (currentTab === 'exterior') {
        selectedExterior = opt;
      } else {
        selectedInterior = opt;
      }
      updateView();
      renderOptions();
    });

    optionsList.appendChild(item);
  });
}

function updateView() {
  const currentOption = currentTab === 'exterior' ? selectedExterior : selectedInterior;
  mainImage.src = currentOption.image;
  captionTitle.textContent = currentOption.name;
  captionDescription.textContent = currentOption.description;
  updatePriceDisplay();
}

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach((t) => t.classList.remove('active'));
    tab.classList.add('active');
    currentTab = tab.dataset.tab;

    if (currentTab === 'exterior') {
      nextButton.querySelector('span:first-child').textContent = 'Next: Interior';
    } else {
      nextButton.querySelector('span:first-child').textContent = 'Review Configuration';
    }

    renderOptions();
    updateView();
  });
});

nextButton.addEventListener('click', () => {
  if (currentTab === 'exterior') {
    const interiorTab = document.querySelector('[data-tab="interior"]');
    interiorTab.click();
  } else {
    openQuoteDialog();
  }
});

function openQuoteDialog() {
  const total = calculateTotal();
  quoteContent.innerHTML = `
    <div class="quote-row"><span>Base Price</span><strong>$${BASE_PRICE.toLocaleString()}</strong></div>
    <div class="quote-row"><span>Exterior (${selectedExterior.name})</span><strong>+$${selectedExterior.price}</strong></div>
    <div class="quote-row"><span>Interior (${selectedInterior.name})</span><strong>+$${selectedInterior.price}</strong></div>
    <div class="quote-row total"><span>Total Price</span><strong>$${total.toLocaleString()}</strong></div>
  `;
  quoteDialog.hidden = false;
}

dialogClose.addEventListener('click', () => (quoteDialog.hidden = true));
dialogBackdrop.addEventListener('click', () => (quoteDialog.hidden = true));
quoteButton.addEventListener('click', openQuoteDialog);

renderOptions();
updateView();