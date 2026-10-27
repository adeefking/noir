(() => {
  'use strict';
  const PRODUCTS = [
    {id:1,name:'The Signature Blazer',category:'Men',type:'Modern tailoring',price:18900,oldPrice:null,badge:'Bestseller',image:'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=900&q=85',alt:'Modern tailored blazer in a fashion editorial',description:'A clean, considered silhouette with a beautifully structured shoulder.',colors:['#272521','#b8a58a','#3b4338'],sizes:['S','M','L','XL']},
    {id:2,name:'Sculpted Day Dress',category:'Women',type:'Everyday statement',price:14500,oldPrice:null,badge:'New season',image:'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=85',alt:'Elegant contemporary womenswear',description:'Soft structure and a fluid shape that moves with you.',colors:['#41342e','#d6c5ac','#181817'],sizes:['XS','S','M','L']},
    {id:3,name:'Essential Knit Polo',category:'Essentials',type:'Elevated basics',price:6800,oldPrice:7900,badge:'Limited offer',image:'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85',alt:'Minimal neutral cotton t-shirt',description:'An everyday layer, refined with a soft hand-feel and clean finish.',colors:['#e9e1d4','#282722','#8b887f'],sizes:['S','M','L','XL']},
    {id:4,name:'The Longline Coat',category:'Women',type:'Outerwear',price:22900,oldPrice:null,badge:'Signature',image:'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=900&q=85',alt:'Long elegant coat in street fashion editorial',description:'A confident outer layer made for cool evenings and long plans.',colors:['#b1a08a','#24231f','#c9c0b2'],sizes:['S','M','L']},
    {id:5,name:'Relaxed Oxford Shirt',category:'Men',type:'Everyday tailoring',price:8200,oldPrice:null,badge:'Bestseller',image:'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&q=85',alt:'Refined shirt styling',description:'An easy, versatile shirt with a lived-in feel from the first wear.',colors:['#e5dfd3','#22231f','#a9b0ad'],sizes:['S','M','L','XL']},
    {id:6,name:'The Form Trousers',category:'Essentials',type:'Wardrobe foundation',price:9900,oldPrice:null,badge:'Just landed',image:'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=85',alt:'Minimal tailored trousers',description:'A balanced straight leg, considered drape and effortless pairing.',colors:['#35342e','#c8b79e','#24201c'],sizes:['S','M','L','XL']},
    {id:7,name:'Everyday Leather Tote',category:'Accessories',type:'Carry your day',price:11500,oldPrice:null,badge:'Small batch',image:'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=85',alt:'Minimal leather handbag',description:'A clean-lined companion with room for all the essentials.',colors:['#6b4c37','#181817','#c4b296'],sizes:['One size']},
    {id:8,name:'The Evening Edit',category:'Women',type:'Occasionwear',price:16900,oldPrice:null,badge:'Occasion edit',image:'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=900&q=85',alt:'Minimal occasionwear editorial',description:'A little drama, beautifully held back. Made for the moments that matter.',colors:['#181817','#7e242c','#d7c8b0'],sizes:['XS','S','M','L']}
  ];
  const STORAGE_KEY = 'noire-cart-v2';
  const WISHLIST_KEY = 'noire-wishlist-v2';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const money = value => 'PKR ' + Number(value).toLocaleString('en-PK');
  let activeFilter = 'All';
  let searchTerm = '';
  let sortMode = 'featured';
  let cart = readStorage(STORAGE_KEY, []);
  let wishlist = readStorage(WISHLIST_KEY, []);
  let selectedQuickSize = '';
  let toastTimer;

  function readStorage(key, fallback) {
    try { const value = JSON.parse(localStorage.getItem(key)); return value ?? fallback; } catch (_) { return fallback; }
  }
  function saveStorage() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist)); } catch (_) { /* browsing still works without storage */ }
  }
  function escapeHtml(value) { return String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char])); }
  function productById(id) { return PRODUCTS.find(product => product.id === Number(id)); }
  function toast(message) {
    const el = $('#toast'); el.textContent = message; el.classList.add('show');
    window.clearTimeout(toastTimer); toastTimer = window.setTimeout(() => el.classList.remove('show'), 2300);
  }
  function productCard(product) {
    const favorite = wishlist.includes(product.id);
    const priceMarkup = product.oldPrice ? `<div class="product-price"><s>${money(product.oldPrice)}</s> <span style="color:#a17d3f">${money(product.price)}</span></div>` : `<div class="product-price">${money(product.price)}</div>`;
    return `<article class="product-card" data-product-id="${product.id}">
      <div class="product-image-wrap"><img src="${product.image}" alt="${escapeHtml(product.alt)}" loading="lazy"><span class="product-badge ${product.badge==='New season'?'gold-badge':''}">${escapeHtml(product.badge)}</span>
      <button class="favorite-btn ${favorite?'is-favorite':''}" data-favorite="${product.id}" aria-label="${favorite?'Remove':'Add'} ${escapeHtml(product.name)} ${favorite?'from':'to'} favourites" aria-pressed="${favorite}">${favorite?'♥':'♡'}</button>
      <button class="quick-add" data-quick-view="${product.id}">Quick view / choose size</button></div>
      <div class="product-info"><div class="product-type">${escapeHtml(product.type)}</div><div class="product-title-row"><h3 class="product-title">${escapeHtml(product.name)}</h3>${priceMarkup}</div><p class="product-description">${escapeHtml(product.description)}</p><div class="product-swatches" aria-label="Available colours">${product.colors.map(color=>`<span class="swatch" style="background:${color}" title="Available colour"></span>`).join('')}</div></div>
    </article>`;
  }
  function currentProducts() {
    let filtered = PRODUCTS.filter(p => (activeFilter==='All' || p.category===activeFilter) && (!searchTerm || `${p.name} ${p.category} ${p.type} ${p.description}`.toLowerCase().includes(searchTerm.toLowerCase())));
    if (sortMode==='low') filtered.sort((a,b)=>a.price-b.price);
    else if (sortMode==='high') filtered.sort((a,b)=>b.price-a.price);
    else if (sortMode==='name') filtered.sort((a,b)=>a.name.localeCompare(b.name));
    return filtered;
  }
  function renderProducts() {
    const filtered = currentProducts();
    $('#shopGrid').innerHTML = filtered.length ? filtered.map(productCard).join('') : '<p class="no-results">No pieces match that search. Try another word or category.</p>';
    $('#resultCount').textContent = `${String(filtered.length).padStart(2,'0')} ${filtered.length===1?'piece':'pieces'}`;
    const featured = [PRODUCTS[0],PRODUCTS[1],PRODUCTS[3],PRODUCTS[4],PRODUCTS[6],PRODUCTS[7]];
    $('#featuredGrid').innerHTML = featured.map(productCard).join('');
    $$('.filter-tab').forEach(button=>button.classList.toggle('active',button.dataset.filter===activeFilter));
  }
  function changeFilter(filter) {
    activeFilter = filter; searchTerm = ''; if ($('#searchInput')) $('#searchInput').value=''; renderProducts();
  }
  function navigate(hash, options={}) {
    const route = (hash || '#home').replace('#','').split('?')[0];
    const page = ['home','shop','story','journal','contact'].includes(route) ? route : 'home';
    $$('.page').forEach(el=>el.classList.toggle('active',el.dataset.page===page));
    $$('.nav-link').forEach(link=>link.classList.toggle('active',link.getAttribute('href')===`#${page}` || (page==='shop' && link.getAttribute('href')==='#shop')));
    $('#mainNav').classList.remove('open'); $('#menuToggle').setAttribute('aria-expanded','false');
    document.body.classList.remove('no-scroll');
    if (page==='shop') { activeFilter = options.filter || 'All'; searchTerm=''; renderProducts(); }
    if (!options.skipScroll) window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
    if (location.hash !== `#${page}` && !options.noHash) history.pushState(null,'',`#${page}`);
  }
  function openOverlay(id) { const el=$(id); el.classList.add('open');el.setAttribute('aria-hidden','false');document.body.classList.add('no-scroll'); }
  function closeOverlay(id) { const el=$(id); el.classList.remove('open');el.setAttribute('aria-hidden','true');if (!$('.overlay.open') && !$('#cartDrawer').classList.contains('open')) document.body.classList.remove('no-scroll'); }
  function setCartOpen(open) {
    $('#cartDrawer').classList.toggle('open',open);$('#drawerScrim').classList.toggle('open',open);$('#cartDrawer').setAttribute('aria-hidden',String(!open));
    if (open) document.body.classList.add('no-scroll'); else if (!$('.overlay.open')) document.body.classList.remove('no-scroll');
  }
  function openQuickView(id) {
    const product=productById(id);if(!product)return;selectedQuickSize='';
    $('#quickViewContent').innerHTML=`<div class="quick-view-content"><div class="quick-view-image"><img src="${product.image}" alt="${escapeHtml(product.alt)}"></div><div class="quick-view-info"><div class="eyebrow dark-eyebrow">${escapeHtml(product.type)}</div><h2>${escapeHtml(product.name)}</h2><div class="quick-view-price">${money(product.price)}</div><p>${escapeHtml(product.description)} Made to move easily through your day and stay in rotation season after season.</p><span class="size-label">SELECT YOUR SIZE</span><div class="size-options">${product.sizes.map(size=>`<button class="size-option" data-size="${escapeHtml(size)}">${escapeHtml(size)}</button>`).join('')}</div><button class="btn btn-gold" id="quickAddToBag">Add to bag <span>↗</span></button><p style="font-size:9px;margin-top:12px">Easy styling. Thoughtful details. Demo product.</p></div></div>`;
    openOverlay('#quickViewOverlay');
  }
  function addToCart(id,size) {
    const product=productById(id);if(!product)return;
    const pickedSize=size || product.sizes[0];const existing=cart.find(item=>item.id===product.id && item.size===pickedSize);
    if(existing)existing.qty+=1;else cart.push({id:product.id,size:pickedSize,qty:1});
    saveStorage();renderCart();toast(`${product.name} added to your bag`);
  }
  function changeQty(id,size,delta) {
    const item=cart.find(row=>row.id===Number(id)&&row.size===size);if(!item)return;
    item.qty+=delta;if(item.qty<=0)cart=cart.filter(row=>!(row.id===Number(id)&&row.size===size));saveStorage();renderCart();
  }
  function renderCart() {
    const count=cart.reduce((sum,item)=>sum+item.qty,0);const subtotal=cart.reduce((sum,item)=>sum+(productById(item.id)?.price||0)*item.qty,0);
    $('#cartCount').textContent=count;$('#drawerCount').textContent=`(${count})`;$('#cartSubtotal').textContent=money(subtotal);
    $('#cartEmpty').style.display=count?'none':'flex';$('#drawerBottom').style.display=count?'block':'none';$('#cartItems').style.display=count?'block':'none';
    $('#cartItems').innerHTML=cart.map(item=>{const product=productById(item.id);if(!product)return '';return `<div class="cart-line"><img src="${product.image}" alt="${escapeHtml(product.name)}"><div><h3>${escapeHtml(product.name)}</h3><p>SIZE: ${escapeHtml(item.size)}</p><div class="qty-control"><button data-qty="-1" data-id="${product.id}" data-size="${escapeHtml(item.size)}" aria-label="Decrease quantity">−</button><span>${item.qty}</span><button data-qty="1" data-id="${product.id}" data-size="${escapeHtml(item.size)}" aria-label="Increase quantity">+</button></div><button class="remove-item" data-remove="${product.id}" data-size="${escapeHtml(item.size)}">Remove</button></div><div class="cart-line-price">${money(product.price*item.qty)}</div></div>`;}).join('');
    const threshold=15000;const remain=Math.max(0,threshold-subtotal);$('#shippingMessage').textContent=remain===0?'Complimentary delivery unlocked. A little something extra.':`You're ${money(remain)} away from complimentary delivery.`;$('#shippingProgress').style.width=`${Math.min(100,subtotal/threshold*100)}%`;
  }
  function toggleFavorite(id) {
    const product=productById(id);if(!product)return;
    if(wishlist.includes(product.id)){wishlist=wishlist.filter(item=>item!==product.id);toast('Removed from your favourites');}
    else{wishlist.push(product.id);toast('Saved to your favourites');}
    saveStorage();renderProducts();
  }
  function renderSearchResults(query) {
    const q=query.trim().toLowerCase();const results=q?PRODUCTS.filter(p=>`${p.name} ${p.category} ${p.type} ${p.description}`.toLowerCase().includes(q)).slice(0,5):PRODUCTS.slice(0,3);
    $('#searchResults').innerHTML=results.length?results.map(p=>`<button class="search-result" data-search-product="${p.id}"><img src="${p.image}" alt=""><span>${escapeHtml(p.name)}<br><small>${escapeHtml(p.category)} / ${money(p.price)}</small></span><b>↗</b></button>`).join(''):'<p class="no-results">No match just yet. Try “shirt”, “dress” or “blazer”.</p>';
  }

  // Navigation links act like compact pages while keeping a simple static website.
  document.addEventListener('click',event=>{
    const categoryLink=event.target.closest('[data-category-link]');
    if(categoryLink){event.preventDefault();navigate('#shop',{filter:categoryLink.dataset.categoryLink});return;}
    const nav=event.target.closest('a[href^="#"]');
    if(nav){const target=nav.getAttribute('href');if(['#home','#shop','#story','#journal','#contact'].includes(target)){event.preventDefault();navigate(target);return;}if(target==='#top'){event.preventDefault();window.scrollTo({top:0,behavior:'smooth'});return;}}
    const favorite=event.target.closest('[data-favorite]');if(favorite){toggleFavorite(favorite.dataset.favorite);return;}
    const quick=event.target.closest('[data-quick-view]');if(quick){openQuickView(quick.dataset.quickView);return;}
    const searchProduct=event.target.closest('[data-search-product]');if(searchProduct){const id=searchProduct.dataset.searchProduct;closeOverlay('#searchOverlay');navigate('#shop');openQuickView(id);return;}
    const size=event.target.closest('[data-size]');if(size){selectedQuickSize=size.dataset.size;$$('.size-option').forEach(button=>button.classList.toggle('selected',button===size));return;}
    const qty=event.target.closest('[data-qty]');if(qty){changeQty(qty.dataset.id,qty.dataset.size,Number(qty.dataset.qty));return;}
    const remove=event.target.closest('[data-remove]');if(remove){cart=cart.filter(row=>!(row.id===Number(remove.dataset.remove)&&row.size===remove.dataset.size));saveStorage();renderCart();return;}
    if(event.target.id==='quickAddToBag'){
      const panel=$('#quickViewContent');const match=panel.querySelector('.quick-view-info h2')?.textContent;const product=PRODUCTS.find(p=>p.name===match);if(!product)return;
      if(!selectedQuickSize){toast('Please select a size first');return;}addToCart(product.id,selectedQuickSize);closeOverlay('#quickViewOverlay');return;
    }
    if(event.target.closest('#drawerScrim')||event.target.id==='cartClose'){setCartOpen(false);return;}
  });
  window.addEventListener('hashchange',()=>navigate(location.hash,{noHash:true}));window.addEventListener('popstate',()=>navigate(location.hash,{noHash:true}));
  $('#filterTabs').addEventListener('click',event=>{const button=event.target.closest('[data-filter]');if(button)changeFilter(button.dataset.filter);});
  $('#sortSelect').addEventListener('change',event=>{sortMode=event.target.value;renderProducts();});
  $('#menuToggle').addEventListener('click',()=>{const isOpen=$('#mainNav').classList.toggle('open');$('#menuToggle').setAttribute('aria-expanded',String(isOpen));});
  $('#cartOpen').addEventListener('click',()=>setCartOpen(true));$('#cartClose').addEventListener('click',()=>setCartOpen(false));$('#drawerScrim').addEventListener('click',()=>setCartOpen(false));
  $('#searchOpen').addEventListener('click',()=>{openOverlay('#searchOverlay');renderSearchResults('');$('#searchInput').focus();});$('#searchClose').addEventListener('click',()=>closeOverlay('#searchOverlay'));$('#searchInput').addEventListener('input',event=>renderSearchResults(event.target.value));$('#clearSearch').addEventListener('click',()=>{$('#searchInput').value='';renderSearchResults('');$('#searchInput').focus();});
  $('#quickViewClose').addEventListener('click',()=>closeOverlay('#quickViewOverlay'));
  $$('.overlay').forEach(overlay=>overlay.addEventListener('click',event=>{if(event.target===overlay)closeOverlay(`#${overlay.id}`);}));
  document.addEventListener('keydown',event=>{if(event.key==='Escape'){closeOverlay('#searchOverlay');closeOverlay('#quickViewOverlay');setCartOpen(false);$('#mainNav').classList.remove('open');}});
  $('#continueShopping').addEventListener('click',()=>{setCartOpen(false);navigate('#shop');});
  $('#checkoutButton').addEventListener('click',()=>toast('Demo only — checkout is not connected to payments yet.'));
  $('#accountButton').addEventListener('click',()=>toast('Customer accounts can be added when a backend is connected.'));
  $('#featuredNext').addEventListener('click',()=>$('#featuredGrid').scrollIntoView({behavior:'smooth',block:'center'}));
  $('#featuredPrev').addEventListener('click',()=>window.scrollBy({top:-220,behavior:'smooth'}));
  $('#newsletterForm').addEventListener('submit',event=>{event.preventDefault();$('#newsletterMessage').textContent='Thank you — this demo form is ready for a mailing-list integration.';$('#newsletterEmail').value='';});
  $('#contactForm').addEventListener('submit',event=>{event.preventDefault();$('#contactMessageStatus').textContent='Thanks for the note. Connect a backend or email service to receive real messages.';event.target.reset();});
  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.12}) : null;
  function observeReveals(){ $$('.reveal').forEach(el=>{if(observer)observer.observe(el);else el.classList.add('visible');}); }
  renderProducts();renderCart();observeReveals();navigate(location.hash||'#home',{noHash:true,skipScroll:true});
})();
