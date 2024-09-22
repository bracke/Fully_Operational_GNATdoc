window.addEventListener('DOMContentLoaded', event => {
   const colorThemes = document.querySelectorAll('[name="theme"]');

   // store theme
   const storeTheme = function (theme) {
     localStorage.setItem("theme", theme);
   };

   // set theme when visitor returns
   const setTheme = function () {
     const activeTheme = localStorage.getItem("theme");
     colorThemes.forEach((themeOption) => {
       if (themeOption.id === activeTheme) {
         themeOption.checked = true;
       }
     });
     // fallback for no :has() support
     document.documentElement.className = activeTheme;
   };

   colorThemes.forEach((themeOption) => {
     themeOption.addEventListener("click", () => {
       storeTheme(themeOption.id);

       // fallback for no :has() support
       document.documentElement.className = themeOption.id;

       // Make the iframe notice the change
       document.getElementById('content-iframe').contentDocument.location.reload();

     });
   });
   const activeTheme = localStorage.getItem("theme");
   document.onload = setTheme();
});

document.addEventListener('click', (event)=> {
   // Mark the link that was clicked on with 'active' and remove any previous 'active'
   let allLinks = document.getElementsByClassName('active');
   [].forEach.call(allLinks, function(el) {
      el.classList.remove("active");
   });
   event.target.classList.add("active");
});
