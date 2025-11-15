function getCartItems() {
	return JSON.parse(localStorage.getItem("cartItems")) || [];
}

function saveCartItems(items) {
	localStorage.setItem("cartItems", JSON.stringify(items));
}

function updateCartCount() {
	const cartCount = document.getElementById("cartCount");

	if (!cartCount) return;

	cartCount.textContent = getCartItems().length;
}

function addToCart(item) {
	const cartItems = getCartItems();

	cartItems.push(item);
	saveCartItems(cartItems);
	updateCartCount();
}

function clearCart() {
	localStorage.removeItem("cartItems");
	updateCartUI();
	updateCartCount();
}

function updateCartUI() {
	const cartModal = document.getElementById("cartModal");
	const cartContent = cartModal.querySelector(".cart-content");
	const cartItems = getCartItems();
	const hasItems = cartItems.length > 0;

	cartContent.innerHTML = `
    <button class="close-cart" id="closeCart"><i class="bx bx-x"></i></button>
    <h2>Seu carrinho</h2>
    ${
		hasItems
			? `<ul class="cart-list">
          ${cartItems
				.map(
					(item, index) => `
            <li>
              <div>
                <strong>${item.name}</strong>
                <span>${item.price}</span>
              </div>
              <button class="remove-item" data-index="${index}">
                <i class='bx bx-trash-alt'></i>
              </button>
            </li>`
				)
				.join("")}
        </ul>
        <div>
          <div class="cart-total">
            <strong>Total:</strong>
            <span>R$ ${cartItems.reduce((total, item) => total + parseFloat(item.price.replace("R$", "").replace(",", ".")), 0).toFixed(2)}</span>
          </div>
          <div class="cart-actions">
            <button class="button primary"><a href="/login.html">Finalizar compra</a></button>
            <button class="button default" id="clearCart"><i class='bx bx-trash-alt'></i></button>
          </div>
        </div>`
			: `<p>Atualmente, não há produtos no carrinho. Continue navegando e adicione pacotes de viagem!</p>`
	}
  `;

	document.getElementById("closeCart").addEventListener("click", () => {
		cartModal.classList.remove("active");
	});

	const clearBtn = document.getElementById("clearCart");

	if (clearBtn) clearBtn.addEventListener("click", clearCart);

	document.querySelectorAll(".remove-item").forEach((btn) => {
		btn.addEventListener("click", (e) => {
			const index = btn.dataset.index;
			const cartItems = getCartItems();
			cartItems.splice(index, 1);
			saveCartItems(cartItems);
			updateCartUI();
		});
	});

	updateCartCount();
}

function createPhotoModal(photos) {
	const oldModal = document.getElementById("photoModal");
	
  if (oldModal) oldModal.remove();

	let current = 0;
	const modal = document.createElement("div");
	
  modal.id = "photoModal";
	modal.style.position = "fixed";
	modal.style.top = 0;
	modal.style.left = 0;
	modal.style.width = "100vw";
	modal.style.height = "100vh";
	modal.style.background = "rgba(0,0,0,0.8)";
	modal.style.display = "flex";
	modal.style.alignItems = "center";
	modal.style.justifyContent = "center";
	modal.style.zIndex = 10000;

	function renderPhoto() {
		modal.innerHTML = `
      <button class="close-photo-modal" style="position:absolute; top:20px; right:25px; font-size: 2rem; color:#fff; background:none; border:none; cursor:pointer;">&times;</button>
      <button class="prev-photo" style="position:absolute; left:10px; background: none; border: none; color: #fff; font-size:2rem; cursor:pointer;">&#10094;</button>
      <img src="${photos[current]}" style="max-width:70vw; max-height:80vh; border-radius:10px; box-shadow:0 0 20px #000;" />
      <button class="next-photo" style="position:absolute; right:10px; background: none; border: none; color: #fff; font-size:2rem; cursor:pointer;">&#10095;</button>
    `;
		modal.querySelector(".close-photo-modal").onclick = () => modal.remove();
		modal.querySelector(".prev-photo").onclick = (e) => {
			e.stopPropagation();
			if (current > 0) {
				current--;
			} else {
				current = photos.length - 1;
			}
			renderPhoto();
		};
		modal.querySelector(".next-photo").onclick = (e) => {
			e.stopPropagation();
			if (current < photos.length - 1) {
				current++;
			} else {
				current = 0;
			}
			renderPhoto();
		};
	}
	renderPhoto();
	document.body.appendChild(modal);
}

document.addEventListener("DOMContentLoaded", () => {
	const cartModal = document.getElementById("cartModal");
	const openCart = document.getElementById("openCart");

	if (openCart && cartModal) {
		openCart.addEventListener("click", () => {
			updateCartUI();
			cartModal.classList.add("active");
		});

		cartModal.addEventListener("click", (e) => {
			if (e.target === cartModal) {
				cartModal.classList.remove("active");
			}
		});
	}

	document.querySelectorAll(".room-options .card").forEach((card) => {
		const button = card.querySelector("button");

		button.addEventListener("click", () => {
			const name = card.querySelector("h4").textContent;
			const price = card.querySelector("strong").textContent;
			addToCart({ name, price });
		});
	});

	updateCartCount();

	const photosDB = {
		gramado: [
			"https://imgs.search.brave.com/KF6Qs3WANXCF4Ilpi4dLSka7q4_x8UWh7dBf0t2O9wM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvNTc5/NDcwNTU4L3B0L2Zv/dG8vc291dGgtcG9y/dGljby1hY2Nlc3Mt/Z3JhbWFkby1ycy1i/cmF6aWwuanBnP3M9/NjEyeDYxMiZ3PTAm/az0yMCZjPWNyWnIx/VVNGY0ptUk1mOF81/dzhWd2hOSWFnLUJN/ekx6dDZ6UEdEaWs1/LUE9",
			"https://imgs.search.brave.com/HSfP5SdDBp9eLLEdkHng8KSDeJMcbys5m9PBM-suYEE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvNTMy/NDAwNzg3L3Bob3Rv/L2dyYW1hZG8tc291/dGgtb2YtYnJhemls/LmpwZz9zPTYxMng2/MTImdz0wJms9MjAm/Yz1jb2t4YmZYcTVN/eXVFMkpLNV9zOEc4/bU1tZmZndi1sUXM4/c2FjNUN4M3o4PQ",
			"https://imgs.search.brave.com/2xPZkdLA29MOjtW9UT4kyJRgttcA3sVx1r3xS5NnXtI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvNjg4/NTIzMDM0L3B0L2Zv/dG8vc3RyZWV0LWFu/ZC1hcmNoaXRlY3R1/cmUtb2YtZ3JhbWFk/by1jaXR5LWdyYW1h/ZG8tcmlvLWdyYW5k/ZS1kby1zdWwtYnJh/emlsLmpwZz9zPTYx/Mng2MTImdz0wJms9/MjAmYz01Z2pLWFM5/eGh1TkRvbjVCOHRo/Tk5wb3lRbnpGZi1h/bWFIbjlZcHN5YTE4/PQ",
			"https://imgs.search.brave.com/rfduhQQsVlIwT3FBmNdXEkgqpETLtyAZgmqcyKJSA6E/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy9j/L2M2L0dyYW1hZG9f/UlNfMjAyMi5qcGc"
		],
		noronha: [
			"https://imgs.search.brave.com/lQdoMTy6kja1rf4NCybsW0LX8cTLyqkbRJan0zai8UY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS1jZG4udHJpcGFk/dmlzb3IuY29tL21l/ZGlhL3Bob3RvLW8v/MDEvM2EvYjMvMmQv/ZmVybmFuZG8tZGUt/bm9yb25oYS5qcGc",
			"https://imgs.search.brave.com/MUjQnqCSlNPM3PX4hEgm0wokJtqNr8KWNR1TalUUniQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/dmlhamFsaS5jb20u/YnIvd3AtY29udGVu/dC91cGxvYWRzLzIw/MjAvMDEvZm90b3Mt/ZGUtZmVybmFuZG8t/ZGUtbm9yb25oYS0y/NC03MzB4OTEzLmpw/Zw",
			"https://imgs.search.brave.com/ILVjvV5oF74uEP48JZ7_WJvvLmY6Z88tU-dStkQyvKo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/dmlhamFsaS5jb20u/YnIvd3AtY29udGVu/dC91cGxvYWRzLzIw/MjAvMDEvZm90b3Mt/ZGUtZmVybmFuZG8t/ZGUtbm9yb25oYS00/My03MzB4NzMwLmpw/Zw",
			"https://imgs.search.brave.com/Ppv4Qe2Byf9HWfb-8r1eSUQDLaksifXo8PJr4wEsNwY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/Zm90b3MtcHJlbWl1/bS92aXN0YS1hZXJl/YS1kYS1pbGhhLWZl/cm5hbmRvLWRlLW5v/cm9uaGEtY29tLWFn/dWFzLXR1cnF1ZXNh/XzczNTMxOC0xODE4/NC5qcGc_c2VtdD1h/aXNfaHlicmlkJnc9/NzQw"
		],
		orlando: [
			"https://imgs.search.brave.com/P95dQ3-z7t5enw0BfS1Qp7UIPQ1e8YCc7r-nKcKKCSg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvNTM1/NDE1MDM3L3Bob3Rv/L29ybGFuZG8tZmxv/cmlkYS1jaXR5c2Nh/cGUuanBnP3M9NjEy/eDYxMiZ3PTAmaz0y/MCZjPWI3UXNKRjAy/cWtHRXZJNUZZakxP/eW94TXJUMUNTVGNo/Wk5vQkNDTVI3cXM9",
			"https://imgs.search.brave.com/69jL5qan0mp32wfK-M_CKK13i7lPW1uE4QPED7ILoSA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9mLmku/dW9sLmNvbS5ici9m/b3RvZ3JhZmlhLzIw/MjUvMTAvMjkvMTc2/MTc2NTAzNjY5MDI2/NmFjYzFiODZfMTc2/MTc2NTAzNl8zeDJf/bWQuanBn",
			"https://imgs.search.brave.com/U3QlEZe9KP5YvbXEdXcvwzrfdIxJMG7zwHgGgfntd6A/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvNDk4/NDY1OTU4L3Bob3Rv/L29ybGFuZG8tZXll/LmpwZz9zPTYxMng2/MTImdz0wJms9MjAm/Yz1XWHJkZ0pQQ1Rt/cTZCMDZWa2Q4enBO/Z3QwN19pWXl0TVVN/VEw4OTByVkp3PQ",
			"https://imgs.search.brave.com/EwJ0AwugZgTHU-UQlaulKYulRrxfxP85BxRtH1r202M/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/YnJpdGFubmljYS5j/b20vMDcvMjAxNjA3/LTAwNC1BRTQzMThF/NS9PcmxhbmRvLUZs/b3JpZGEtYWVyaWFs/LWNpdHlzY2FwZS10/b3dhcmRzLUVvbGEt/TGFrZS5qcGc"
		]
	};

	let selected = null;

	if (window.location.pathname.includes("gramado")) selected = photosDB.gramado;
	else if (window.location.pathname.includes("noronha")) selected = photosDB.noronha;
	else if (window.location.pathname.includes("orlando")) selected = photosDB.orlando;

	const seeMoreEl = document.querySelector(".see-more");
  
	if (seeMoreEl && selected) {
		seeMoreEl.style.cursor = "pointer";
		seeMoreEl.addEventListener("click", () => createPhotoModal(selected));
	}
});
