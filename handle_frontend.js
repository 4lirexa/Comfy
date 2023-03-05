// Navbar

    const nav_btn = document.querySelector('.toggle_btn');
    const nav_container = document.querySelector('.toggle_nav_cont');
    const close_nav = document.querySelector('#close_nav');



    // fadein
    nav_btn.addEventListener('click',e=>{
            nav_container.classList.toggle('active');
            setTimeout(function(){
                nav_container.classList.toggle('fadein');
            },0)
    })
    // fadeout
    close_nav.addEventListener('click',e=>{
        nav_container.classList.toggle('fadein');
            setTimeout(function(){
                nav_container.classList.toggle('active');
            },500)
    })

    // fadeout on resize
    window.addEventListener('resize', e=>{
        if(window.innerWidth > 770){
            nav_container.classList.remove('fadein');
            setTimeout(function(){
                nav_container.classList.remove('active');
            },500)
        }
    });

// sidebar

    const cart_btn = document.querySelector('.cart > i');
    const sidebar_cont = document.querySelector('.cart_basket_cont');
    const sidebar = document.querySelector('.cart_basket');
    const close_sidebar = document.querySelector('#close_sidebar');


    // close sidebar
    close_sidebar.addEventListener('click',e=>{
        sidebar.classList.remove('active');
        setTimeout(() => {
            sidebar_cont.classList.remove('active')
        }, 500);
    })
