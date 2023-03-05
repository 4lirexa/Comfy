// open and close sidebar and navbar
    import './handle_frontend.js';
// fetch products
    const all_products_api = 'https://course-api.com/javascript-store-products';
    // temporary single product
    // 'https://course-api.com/javascript-store-single-product?id=rec43w3ipXvP28vog'
    const single_product_api = 'https://course-api.com/javascript-store-single-product?id=';
    function fetch_api(url){
        
        const getproducts = 
        fetch(url)
        .then(response => response.json())
        .then(data=>data)

        
        return getproducts;

    }

    

// setup products
    const currentUrl = window.location.pathname;
    const host_add = window.location.hostname;
    // add address in header in each page
    if(document.querySelector('.header_info')){
        const first_addres = currentUrl.split('.');
        const dec_addres = first_addres[0].replace('/','');

        document.querySelector('.header_info').innerHTML =  'Home' + ' / ' + dec_addres;
    }
    const products_cont = document.querySelector('.products');
    function setProduct(container,id,image,name,price,desc,company,colors){
        if(desc && company){

            // get colors

            let colors_comb = '';
            for (const color of colors) {
                colors_comb += `<span class="color" style="background-color:${color}"></span>`;
            }

            // insert content
            container.innerHTML += `
            <div class="pro_image">
                <img src="${image}" alt="">
            </div>
            <div class="pro_detail">
                <h1>${name}</h1>
                <p class="comp">BY ${company}</p>
                <div class="pro_price">
                    $${price}
                </div>
                <div class="colors">
                    ${colors_comb}
                </div>
                <p class="pro_text">
                    ${desc}
                </p>
                <span class="add_to_cart_cont"><span id="add_to_cart" value="${id}" class="add_to_cart">add to cart</span></span>
            </div>
            `;
            return;
        }
        container.innerHTML += `
        <div id="${id}" class="product">
            <div class="product_image_container">
                <img src="${image}" alt="" class="products_image">
                <div class="product_icons">
                    <a href="./product.html?id=${id}"><i class="fas fa-search"></i></a>
                    <i id="add_to_cart" value="${id}" class="fas fa-shopping-cart"></i>
                </div>
            </div>
            <p class="product_title">${name}</p>
            <p class="product_price">$${price}</p>
        </div>
        `;
    }
    // index.html
    if(currentUrl ==  '/' || currentUrl ==  '/index.html'){
        document.addEventListener('DOMContentLoaded',e=>{

            fetch_api(all_products_api)
            .then(function(arr){
                products_cont.innerHTML = '';
                for (let i = 0; i < 3; i++) {
                    setProduct(products_cont,arr[i].id,arr[i].fields.image[0].url,arr[i].fields.name,arr[i].fields.price / 100);
                }
            })
            
            
        })
    }
    // products.html
    if(currentUrl ==  '/products.html'){
        document.addEventListener('DOMContentLoaded',e=>{

            fetch_api(all_products_api)
            .then(function(arr){
                products_cont.innerHTML = '';
                for (let i = 0; i < arr.length ; i++) {
                    setProduct(products_cont,arr[i].id,arr[i].fields.image[0].url,arr[i].fields.name,arr[i].fields.price / 100);
                }
            })
            
            
        })
    }
    // product.html
    const signle_product = document.querySelector('.header_about_contetn');

    if(currentUrl ==  '/product.html'){
        document.addEventListener('DOMContentLoaded',e=>{
            const page_url = window.location.search;
            const get_id = new URLSearchParams(page_url);
            const prod_id = get_id.get('id');
            const combined_url = single_product_api + prod_id;
        
            fetch_api(combined_url)
            .then(function(arr){
                signle_product.innerHTML = '';
                setProduct(signle_product,arr.id,arr.fields.image[0].url,arr.fields.name,arr.fields.price / 100,arr.fields.description,arr.fields.company,arr.fields.colors);
            })
            
            
        })
    }


// sidebar
    // open and load content
    function opensidebar(){

        // open sidebar
        const sidebar = document.querySelector('.cart_basket');
        const sidebar_cont = document.querySelector('.cart_basket_cont');

        sidebar_cont.classList.add('active');
        setTimeout(() => {
            sidebar.classList.add('active')
        }, 50);

            
        // get content
        const basket_items = JSON.parse(localStorage.getItem('products'));
        const sidebar_contin = document.querySelector('.basket_items_container');
        sidebar_contin.innerHTML ='';
        if(basket_items != null){
            for (let i = 0 ; i < basket_items.length ; i++ ) {


                sidebar_contin.innerHTML += `
                <div id="${basket_items[i].id}" class="added_item">
                    <div class="item_image">
                        <img src="${basket_items[i].image}" alt="">
                    </div>
                    <div class="item_details">
                        <p class="item_title">${basket_items[i].name}</p>
                        <p class="item_price">$${basket_items[i].price}</p>
                        <span><a href="#" class="item_remove">remove</a></span>
                    </div>
                    <div class="quantity">
                        <p class="item_q_inc"><i class="fas fa-chevron-up"></i></p>
                        <p class="item_q">${basket_items[i].qun}</p>
                        <p class="item_q_dec"><i class="fas fa-chevron-down"></i></p>
                    </div>
                </div>
                `;
                
            }
        }


        // set total value
        const card_items = document.querySelectorAll('.basket_items_container > .added_item');

        if(card_items.length){
            let total_price = 0;
            card_items.forEach(price=>{
                const price_value = price.querySelector('.item_details > .item_price');
                const amount_value = price.querySelector('.quantity > .item_q');
                const amount_value_int = amount_value.innerHTML;
                const price_value_int = price_value.innerHTML.replace('$','');
                total_price += price_value_int * amount_value_int;
            })

            const total_price_html = document.querySelector('.total_price > span');
            total_price_html.innerHTML = '$' + total_price.toFixed(2);

        }else{
            const total_price_html = document.querySelector('.total_price > span');
            total_price_html.innerHTML = '$' + 0;
        }


        // increase and decrease btns
        if(card_items.length){
            card_items.forEach(item=>{
                // increase
                const add_q = item.querySelector('.quantity > .item_q_inc');
                add_q.addEventListener('click',e=>{
                    
                    const items = localStorage.getItem('products');
                    const items_json = JSON.parse(items);

                    const new_items = new Array();

                    items_json.forEach(itemm=>{
                        if(itemm.id == item.getAttribute('id')){
                            
                            itemm.qun++;
                            new_items.push(itemm);

                        }else{
                            new_items.push(itemm);
                        }
                    })

                    localStorage.setItem('products',JSON.stringify(new_items));

                    // console.log(e.target.parentElement.parentElement);
                    const current_v = e.target.parentElement.parentElement.querySelector('.item_q').innerHTML;
                    e.target.parentElement.parentElement.querySelector('.item_q').innerHTML = parseInt(current_v) + 1;

                    // set total value
                    if(card_items.length){
                        let total_price = 0;
                        card_items.forEach(price=>{
                            const price_value = price.querySelector('.item_details > .item_price');
                            const amount_value = price.querySelector('.quantity > .item_q');
                            const amount_value_int = amount_value.innerHTML;
                            const price_value_int = price_value.innerHTML.replace('$','');
                            total_price += price_value_int * amount_value_int;
                        })
            
                        const total_price_html = document.querySelector('.total_price > span');
                        total_price_html.innerHTML = '$' + total_price.toFixed(2);
            
                    }else{
                        const total_price_html = document.querySelector('.total_price > span');
                        total_price_html.innerHTML = '$' + 0;
                    }


                })

                // decrease
                const decs_q = item.querySelector('.quantity > .item_q_dec');
                decs_q.addEventListener('click',e=>{
                    
                    const items = localStorage.getItem('products');
                    const items_json = JSON.parse(items);

                    const new_items = new Array();

                    items_json.forEach(itemm=>{
                        if(itemm.id == item.getAttribute('id')){
                            if(itemm.qun > 1){
                                itemm.qun--;
                                new_items.push(itemm);
                            }else{
                                e.target.parentElement.parentElement.querySelector('.item_q').innerHTML = 0;
                            }

                        }else{
                            new_items.push(itemm);
                        }
                    })

                    localStorage.setItem('products',JSON.stringify(new_items));


                    const current_v = e.target.parentElement.parentElement.querySelector('.item_q').innerHTML;
                    if(current_v > 1){
                        e.target.parentElement.parentElement.querySelector('.item_q').innerHTML = parseInt(current_v) - 1;
                    }else{
                        e.target.parentElement.parentElement.parentElement.remove();
                        if(new_items.length == 0){
                            localStorage.clear();
                        }
                    }

                    // set total value
                    if(card_items.length){
                        let total_price = 0;
                        card_items.forEach(price=>{
                            const price_value = price.querySelector('.item_details > .item_price');
                            const amount_value = price.querySelector('.quantity > .item_q');
                            const amount_value_int = amount_value.innerHTML;
                            const price_value_int = price_value.innerHTML.replace('$','');
                            if(amount_value_int >= 1){
                                total_price += price_value_int * amount_value_int;
                            }else{
                            }
                            
                        })
            
                        const total_price_html = document.querySelector('.total_price > span');
                        total_price_html.innerHTML = '$' + total_price.toFixed(2);
            
                    }else{
                        const total_price_html = document.querySelector('.total_price > span');
                        total_price_html.innerHTML = '$' + 0;
                    }


                })



                // remove
                const remove_item = item.querySelector('.item_remove');
                remove_item.addEventListener('click',e=>{

                    const items = localStorage.getItem('products');
                    const items_json = JSON.parse(items);

                    const new_items = new Array();

                    items_json.forEach(itemm=>{
                        if(itemm.id == item.getAttribute('id')){
                            e.target.parentElement.parentElement.parentElement.remove();
                        }else{
                            new_items.push(itemm);
                        }
                    })

                    localStorage.setItem('products',JSON.stringify(new_items));


                    if(new_items.length == 0){
                        localStorage.clear();
                    }

                    
                    // set total value
                    const content_parent = document.querySelectorAll('.basket_items_container > .added_item');
                    if(content_parent.length){
                        console.log(content_parent);
                        let total_price = 0;
                        content_parent.forEach(price=>{
                            const price_value = price.querySelector('.item_details > .item_price');
                            const amount_value = price.querySelector('.quantity > .item_q');
                            const amount_value_int = amount_value.innerHTML;
                            const price_value_int = price_value.innerHTML.replace('$','');
                            if(amount_value_int >= 1){
                                total_price += parseInt(price_value_int) * parseInt(amount_value_int);
                            }
                            
                        })
                        console.log(total_price);
            
                        const total_price_html = document.querySelector('.total_price > span');
                        total_price_html.innerHTML = '$' + total_price.toFixed(2);
            
                    }else{
                        const total_price_html = document.querySelector('.total_price > span');
                        total_price_html.innerHTML = '$' + 0;
                    }


                })

            })
        }
        


    }
    // sidebar btn
    const cart_btn = document.querySelector('.cart > i');
    cart_btn.addEventListener('click',e=>{
        opensidebar();
    })


// add to cart
    setTimeout(() => {
        const add_in_carts = document.querySelectorAll('#add_to_cart');

        if(add_in_carts.length){
            
            add_in_carts.forEach(add_in_card => {
                add_in_card.addEventListener('click',e=>{
                    // clicked elemetn
                    const element = e.target;
                    const element_value = element.getAttribute('value');
                    // let product_cart = {};
                    
                    fetch_api(single_product_api + element_value)
                    .then(tableobj =>{
                        const product_cart = {
                            'id': tableobj.id,
                            'qun': 1,
                            'name' : tableobj.fields.name,
                            'price' :tableobj.fields.price / 100,
                            'image' : tableobj.fields.image[0].url,
                            'desc' : tableobj.fields.description,
                            'company' : tableobj.fields.company,
                            'colors' : tableobj.fields.colors
                        }
                        return product_cart;
                    }).then(product_cart=>{
                        
                        const product_cart_cont = new Array();
                    

                        // localstorage
                        const items = localStorage.getItem('products');
                        const items_json = JSON.parse(items);

                        
                        
        
                        if(items_json != null){

                            let iterations = items_json.length;
                            for (let item of items_json) {
                                
                                
                                if(item.id == product_cart.id){
                                    product_cart.qun = item.qun + 1;
                                    product_cart_cont.push(product_cart);
                                }else{
                                    if (!--iterations){
                                        product_cart_cont.push(item);
                                        product_cart_cont.push(product_cart);
                                    }else{
                                        product_cart_cont.push(item);
                                    }
                                }
                                
                            }

                            localStorage.setItem('products',JSON.stringify(product_cart_cont));
                            // sidebar
                            opensidebar();
                        }else{
                            product_cart_cont.push(product_cart);
                            localStorage.setItem('products',JSON.stringify(product_cart_cont));
                            // sidebar
                            opensidebar();
                        }

                    });
                    
                    
                })
            });


        }
    }, 1000);


// basket Update
    // icon number
    setInterval(() => {
        const basket_number = document.querySelector('.prod_num');
        const basket_items = JSON.parse(localStorage.getItem('products'));

        
        if(basket_items != null){
            basket_number.innerHTML = basket_items.length;
        }else{
            basket_number.innerHTML = 0;
        }
    }, 1000);


// Filters
    const filters_parent = document.querySelector('.filters');
    if(filters_parent){
        
        const filters = filters_parent.querySelectorAll('.filter');

        // category
        filters.forEach(filter => {
            filter.addEventListener('click',e=>{

                const filter_id = filter.getAttribute('id');


                fetch_api(all_products_api)
                .then(function(arr){
                    products_cont.innerHTML = '';
                    for (let i = 0; i < arr.length ; i++) {
                        if(arr[i].fields.company == filter_id){
                            setProduct(products_cont,arr[i].id,arr[i].fields.image[0].url,arr[i].fields.name,arr[i].fields.price / 100);
                        }else if (filter_id == 'all'){
                            setProduct(products_cont,arr[i].id,arr[i].fields.image[0].url,arr[i].fields.name,arr[i].fields.price / 100);
                        }
                        
                    }

                    // price range after filter
                    const price_range_value = document.querySelector('#range');
                    const product_cont = document.querySelector('.products');
                    Array.from(product_cont.children).forEach(product=>{
                        const p_price= product.children[2].innerHTML.replace('$','');
                        if(parseInt(p_price) > parseInt(price_range_value.value)){
                            // product.setAttribute('style','display:none');
                            product.classList.remove('show');
                            product.classList.add('hidden');
                        }else{
                            // product.setAttribute('style','display:flex');
                            product.classList.remove('hidden');
                            product.classList.add('show');
                        }
                    })

                    // search value after filter
                    const search_input = document.querySelector('#search');
                    const pro_cont = document.querySelector('.products');

                    pro_cont.querySelectorAll('.product').forEach(product=>{
                        const product_title = product.querySelector('.product_title');
                        if(product_title.innerHTML.indexOf(search_input.value) != -1){
                            product.classList.remove('hidden');
                            product.classList.add('show');
                        }else{
                            product.classList.remove('show');
                            product.classList.add('hidden');
                        }
                    })





                })

                filters.forEach(element=>{
                    if(element == e.target){
                        element.setAttribute('style','font-weight:bold;')
                    }else{
                        element.removeAttribute('style');
                    }
                })

            });
        })

        // price range
        const price_range_value = document.querySelector('#range');

        price_range_value.addEventListener('input',e=>{
            const price_value_ui = document.querySelector('.price_range_value > span');
            price_value_ui.innerHTML = e.target.value;

            const product_cont = document.querySelector('.products');
            Array.from(product_cont.children).forEach(product=>{
                const p_price= product.children[2].innerHTML.replace('$','');
                if(parseInt(p_price) > parseInt(e.target.value)){
                    // product.setAttribute('style','display:none');
                    product.classList.remove('show');
                    product.classList.add('hidden');
                }else{
                    // product.setAttribute('style','display:flex');
                    product.classList.remove('hidden');
                    product.classList.add('show');
                }
            })

            // search value after filter
            const search_input = document.querySelector('#search');
            const pro_cont = document.querySelector('.products');

            pro_cont.querySelectorAll('.product').forEach(product=>{
                const product_title = product.querySelector('.product_title');
                const product_pricse = product.children[2].innerHTML.replace('$','');
                if(product_title.innerHTML.indexOf(search_input.value) != -1 && parseInt(product_pricse) < e.target.value){
                    product.classList.remove('hidden');
                    product.classList.add('show');
                }else{
                    product.classList.remove('show');
                    product.classList.add('hidden');
                }
            })

            

        })
        price_range_value.addEventListener('mouseup',e=>{
            if(e.target.value == 0){
                console.log('0');
            }
        })


        // search
        const search_input = document.querySelector('#search');
        const pro_cont = document.querySelector('.products');

        search_input.addEventListener('keyup',e=>{
            pro_cont.querySelectorAll('.product').forEach(product=>{
                const product_title = product.querySelector('.product_title');
                if(product_title.innerHTML.indexOf(e.target.value) != -1){
                    product.classList.remove('hidden');
                    product.classList.add('show');
                }else{
                    product.classList.remove('show');
                    product.classList.add('hidden');
                }
            })
        })


        
    }

// responsive nav content

    const nav_ul = document.querySelector('.nav_links');
    const resp_nav_ui = document.querySelector('.nav_links_reponsive');

    resp_nav_ui.innerHTML = nav_ul.innerHTML;

