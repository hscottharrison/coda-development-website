
  // variable declarations
  const navItems = document.getElementsByClassName('nav-item');
  const form = document.getElementById('contact-form');

  // function declarations
  function addActiveClassToNavItem(event) {
    const navItemId = event.target.id;
    const classToBeAdded = 'active';

    for(let i = 0; i < navItems.length; i++) {
      const navItemContainsClass = navItems[i].classList.contains(classToBeAdded);
      if (navItems[i].id === navItemId && !navItemContainsClass) {
        navItems[i].classList.add(classToBeAdded)
      } else if (navItems[i].id !== navItemId && navItemContainsClass) {
        navItems[i].classList.remove(classToBeAdded)
      }
    }
  }


  function findActiveLink() {
    const activeURL = window.location.href.split('#')[1];
    if(!activeURL) {
      history.pushState('home', 'Title', '/#home');
      findActiveLink();
      return;
    }
    const idToFind = `nav-item-${activeURL}`;
    document.getElementById(idToFind).classList.add('active');
  }

  function clearFrom() {
    const name = document.getElementById('contact-form-name');
    const email = document.getElementById('contact-form-email');
    const phone = document.getElementById('contact-form-phone');
    const message = document.getElementById('contact-form-message');

    name.value = '';
    email.value = '';
    phone.value = '';
    message.value = '';
  }

  async function submitForm(event) {
    event.preventDefault();
    // set button loading state
    const button = document.getElementById('contact-form-button');
    const formError = document.getElementById('form-error-message');
    if (!formError.classList.contains('hide')) {
      formError.classList.add('hide')
    }
    button.classList.add('button--loading')

    const formData = new FormData(form);
    const urlEncoded = new URLSearchParams(formData).toString();
    const params = {
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      body: urlEncoded,
      method: "POST"
    };
    const response = await fetch('https://coda-development-mail-server-156774db9652.herokuapp.com/mailer', params)
    if (response.status === 200) {
      button.classList.remove('button--loading');
      button.innerHTML = 'SUCCESS!'
      setTimeout(() => {
        button.innerHTML = 'SUBMIT';
      }, 3000);
      clearFrom();
    } else {
      button.classList.remove('button--loading');
      formError.classList.remove('hide');
    }
  }

  function toggleNavMenu() {
    const menu = document.getElementById('nav-menu-wrapper');
    if (menu.classList.contains('nav-open')) {
      menu.classList.remove('nav-open');
    } else {
      menu.classList.add('nav-open');
    }
  }

  //init
  findActiveLink();

  //event listners
  for(let i = 0; i < navItems.length; i++) {
    navItems[i].addEventListener('click', addActiveClassToNavItem);
  }
  
  form.addEventListener('submit', submitForm);


