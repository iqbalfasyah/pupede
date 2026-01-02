let data = {};
let currentCategory = '';
let editIndex = null;

$(async function () {
  const res = await fetch('../product.json');
  data = await res.json();

  initCategories();
  renderProducts();
});

function gdriveToDirect(url) {
  if (!url) return '';

  const match = url.match(/\/d\/([^/]+)/) || url.match(/id=([^&]+)/);
  if (!match) return url;

  const fileId = match[1];
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
}


// ------------------
function initCategories() {
  const select = $('#categorySelect');
  select.empty();

  Object.keys(data).forEach(key => {
    select.append(`<option value="${key}">${data[key].name}</option>`);
  });

  currentCategory = select.val();

  select.on('change', function () {
    currentCategory = this.value;
    renderProducts();
  });
}

// ------------------
function renderProducts() {
  const list = $('#productList');
  list.empty();

  data[currentCategory].items.forEach((item, i) => {
    const imgUrl = gdriveToDirect(item.image);

    list.append(`
      <div class="card">
        <img src="${imgUrl}" alt="${item.name}" loading="lazy">
        <h3>${item.name}</h3>
        <p>Rp. ${formatRupiah(item.price)}</p>
        <button onclick="editItem(${i})">Edit</button>
        <button onclick="deleteItem(${i})">Delete</button>
      </div>
    `);
  });
}

function formatRupiah(value) {
  const number = Number(value) || 0;
  return number.toLocaleString('id-ID');
}


// ------------------
$('#addItemBtn').on('click', () => {
  editIndex = null;
  openModal();
});

// ------------------
function editItem(index) {
  editIndex = index;
  const item = data[currentCategory].items[index];

  $('#img').val(item.image);
  $('#name').val(item.name);
  $('#price').val(item.price);
  $('#tokopedia').val(item.tokopedia);
  $('#shopee').val(item.shopee);
  $('#tiktok').val(item.tiktok);

  openModal('Edit Product');
}

// ------------------
function deleteItem(index) {
  if (confirm('Delete this item?')) {
    data[currentCategory].items.splice(index, 1);
    renderProducts();
  }
}

// ------------------
$('#saveBtn').on('click', () => {
  const item = {
    image: $('#img').val(),
    name: $('#name').val(),
    price: $('#price').val(),
    tokopedia: $('#tokopedia').val(),
    shopee: $('#shopee').val(),
    tiktok: $('#tiktok').val()
  };

  if (editIndex === null) {
    data[currentCategory].items.push(item);
  } else {
    data[currentCategory].items[editIndex] = item;
  }

  closeModal();
  renderProducts();
});

// ------------------
function openModal(title = 'Add Product') {
  $('#modalTitle').text(title);
  $('#modal').removeClass('hidden');
}

// ------------------
function closeModal() {
  $('#modal').addClass('hidden');
  $('input').val('');
}

// ------------------
$('#downloadJson').on('click', () => {
  const blob = new Blob(
    [JSON.stringify(data, null, 2)],
    { type: 'application/json' }
  );

  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'product.json';
  a.click();
});
