document.addEventListener("DOMContentLoaded", () => {
  fetchData();
  if (localStorage.getItem("cart")) {
    cart = JSON.parse(localStorage.getItem("cart"));
  }
  //Como no todos se desloguean antes de irse esto hara que lo desloguee auto
  if ("user" in localStorage) {
    setInterval(function () {
      logOut.style.display = "none";
      localStorage.removeItem("user");
    }, 50000);
  }
});

let localStore = localStorage.getItem("users");

const fetchData = async () => {
  try {
    const res = await fetch("/api.json");
    const data = await res.json();
    recorrerLista(data);
  } catch (error) {
    console.log(error);
  }
};

//selectores
const app = document.getElementById("app");
const row = document.getElementById("row");
const footerCarrito = document.getElementById("footer-carrito");
const templateCarrito = document.getElementById("template-carrito").content; //sin el .content no me trae nada!
const templateFooter = document.getElementById("template-footer").content;
const productList = document.getElementById("product-list");
const items = document.getElementById("items");
const body = document.querySelector("body");
const carrito = document.querySelector(".carrito");
const badgeCart = document.getElementById("badge-cart");
const templateBadgeCart = document.getElementById("template-badgeCart").content;
const fasFaBtn = document.querySelector(".fa-shopping-cart");
const cancelar = document.querySelector(".cancelar");
const fragment = new DocumentFragment();
const logOut = document.getElementById("log-out");

let cart = {};

class Carrito {
  //adquiero la info
  //tratar de que aparezca simplemente en el aire la misma card que hice click
  comprarProducto(e) {
    if (e.target.classList.contains("btn")) {
      this.leerDatosProductos(e.target.parentElement.parentElement);
    }

    e.stopPropagation();
  }

  //capturo la info que necesito en un objeto y ademas con esa info :
  // 1. hacemos que al hacer click se sume la cantidad
  // 2. que se agregue al array vacio cart

  leerDatosProductos(producto) {
    const itemCarrito = {
      imagen: producto.querySelector("#img-card").src,
      titulo: producto.querySelector("#titulo-card").textContent,
      descripcion: producto.querySelector("#text-card").textContent,
      precio: producto.querySelector(".price-element").textContent,
      id: producto.querySelector("#btn-compra").dataset.id,
      titulo_cantidad: document.querySelector(".template-cantidad"),
      cantidad: 1,
    };
    //SI EXISTE YA UN ITEMCARRITO.ID ENTONCES LE SUMO A LA CANTIDAD + 1
    if (cart.hasOwnProperty(itemCarrito.id)) {
      //itemCarrito.cantidad = cart[itemCarrito.id].cantidad + 1  esto es lo mismo que esto :
      itemCarrito.cantidad = cart[itemCarrito.id].cantidad;
      itemCarrito.cantidad++;
    }
    //DE OTRO MODO LO AGREGO SIMPLEMENTE
    cart[itemCarrito.id] = { ...itemCarrito };
    this.updateCartNumber();
    this.renderCarrito();
  }

  updateCartNumber() {
    badgeCart.innerHTML = "";
    if (Object.keys(cart).length === 0) {
      badgeCart.innerHTML = "0";
      cart = {};
      return;
    }
    const nCantidad = Object.values(cart).reduce(
      (acc, { cantidad }) => acc + cantidad,
      0
    );

    templateBadgeCart.querySelector(".carrito-icon").textContent = nCantidad;

    const clone = templateBadgeCart.cloneNode(true);
    fragment.appendChild(clone);
    badgeCart.appendChild(fragment);
  }

  showCart(e) {
    if (Object.keys(cart).length > 0) {
      body.classList.add("body2");
      carrito.style.visibility = "visible";
      carrito.classList.add("carrito2");
      carrito.classList.remove("carrito3");
      setInterval(function () {
        //Si pasan mas de, en este caso 50seg, el carrito se cierra y se borra del LocalStorage los items agregados.
        body.classList.remove("body2");
        carrito.style.visibility = "hidden";
        carrito.classList.remove("carrito2");
        carrito.classList.add("carrito3");
        cart = {};
        badgeCart.innerText = "";
        localStorage.removeItem("cart");
      }, 50000000);
    }

    return;
  }

  removeCart(e) {
    if (e.target.classList.contains("fa-shopping-cart")) {
      body.classList.remove("body2");
      carrito.style.visibility = "hidden";
      carrito.classList.remove("carrito2");
      carrito.classList.add("carrito3");
    }

    if (e.target.classList.contains("cancelar")) {
      body.classList.remove("body2");
      carrito.style.visibility = "hidden";
      carrito.classList.remove("carrito2");
      carrito.classList.add("carrito3");
    }
  }
  //renderizo la info
  renderCarrito() {
    //para que nose dupliquen
    items.innerHTML = "";
    //Object.values transforma el cart que era un objeto vacio a un array y luego lo recorro y finalmente lo dibujo
    //Con los fragment evitamos el REFLOW!! :)
    Object.values(cart).map((producto) => {
      templateCarrito.querySelector(".img-carrito").src = producto.imagen;
      templateCarrito.querySelector(".template-titulo").textContent =
        producto.titulo;
      templateCarrito.querySelectorAll("span")[0].textContent =
        producto.titulo_cantidad;
      templateCarrito.querySelector(".template-span").textContent =
        producto.cantidad;
      templateCarrito.querySelector(".btn-plus").dataset.id = producto.id;
      templateCarrito.querySelector(".btn-minus").dataset.id = producto.id;
      templateCarrito.querySelector(".template-span2").textContent =
        producto.cantidad * producto.precio;
      const clone = templateCarrito.cloneNode(true);
      fragment.appendChild(clone);
    });

    items.appendChild(fragment);
    this.updateTotal();
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  updateTotal() {
    footerCarrito.innerHTML = "";
    if (Object.keys(cart).length === 0) {
      footerCarrito.innerHTML = `
        <div scope="row" colspan="5">Carrito vacio, empieza a comprar!</div>
        `;
      return;
    }

    const nPrecio = Object.values(cart).reduce(
      (acc, { cantidad, precio }) => acc + cantidad * precio,
      0
    );

    templateFooter.querySelector(".total-precio").textContent = nPrecio;

    const clone = templateFooter.cloneNode(true);
    fragment.appendChild(clone);
    footerCarrito.appendChild(fragment);

    //despues de crear el fragment, podemos agregarle eventos a los items
    const btnVaciarCarrito = document.getElementById("vaciar-carrito");
    const btnCompletarCarrito = document.getElementById("completar-carrito");
    btnVaciarCarrito.addEventListener("click", (e) => {
      cart = {};
      body.classList.remove("body2");
      carrito.style.visibility = "hidden";
      carrito.classList.remove("carrito2");
      carrito.classList.add("carrito3");
      badgeCart.innerHTML = "";

      e.stopPropagation();
    });
    btnCompletarCarrito.addEventListener("click", (e) => {
      alert("COMPRASTE ESTE PRODUCTO");

      e.stopPropagation();
    });
  }

  btnAccion(e) {
    console.log(e.target);
    if (e.target.classList.contains("btn-plus")) {
      const producto = cart[e.target.dataset.id];
      producto.cantidad = cart[e.target.dataset.id].cantidad;
      producto.cantidad++;
      cart[e.target.dataset.id] = { ...producto };
      this.renderCarrito();
    }

    if (e.target.classList.contains("btn-minus")) {
      const producto = cart[e.target.dataset.id];
      producto.cantidad = cart[e.target.dataset.id].cantidad;
      producto.cantidad--;
      if (producto.cantidad === 0) {
        delete cart[e.target.dataset.id];
      }
      this.renderCarrito();
    }

    e.stopPropagation();
  }
}

const renderCards = (ropa) => {
  const containerCards = row;
  const card = document.createElement("div");
  card.innerHTML += ` 
                            <div class=" d-flex justify-content-around"> 
                                <div class="card  mb-3 min-vh-50" style="width: 90%" > 
                                    <a class="link_card" href="./index.html">
                                        <img class="card-img-top" id="img-card" style="height: 30rem;" alt="imagen-producto" src= ${ropa.imagen}> </img>
                                     </a>
                                    <div class="card-body" > 
                                        <h4 class="card-title text-center" id="titulo-card">  ${ropa.titulo}</h4> 
                                        <p class="card-text text-center" id="text-card"> ${ropa.descripcion} </p>  
                                        <p class=" badge badge-secondary text-light bg-dark " style="font-size: 2rem" id="precio-card">Precio : $<span class="price-element">${ropa.precio} </span></p>
                                        <a class="btn btn-primary" id="btn-compra" data-id=${ropa.id}> COMPRAR </a>
                                    </div>
                                       
                                    
                                </div>
                            </div>              
    
    `;
  containerCards.appendChild(card);
};

function recorrerLista(data) {
  data.map((x) => {
    renderCards(x);
  });
}

const carritodeCompras = new Carrito();

//para mostrar el logOut despues de que se haya logeado
if ("user" in localStorage) {
  logOut.style.display = "block";
  logOut.style.fontWeight = "900";
} else {
  logOut.style.display = "none";
}

//log out del usuario al click
function logOutUser(e) {
  if ("user" in localStorage) {
    localStorage.removeItem("user");
    logOut.style.display = "none";
    location.href = "#";
  } else {
    location.href = "#";
  }
}

//cargo todos los eventos de la pagina
function cargarEventos() {
  addEventListener("click", (e) => carritodeCompras.comprarProducto(e));
  items.addEventListener("click", (e) => carritodeCompras.btnAccion(e));
  fasFaBtn.addEventListener("click", (e) => carritodeCompras.showCart(e));
  fasFaBtn.addEventListener("dblclick", (e) => carritodeCompras.removeCart(e));
  cancelar.addEventListener("click", (e) => carritodeCompras.removeCart(e));
  logOut.addEventListener("click", (e) => logOutUser(e));
}

cargarEventos();
