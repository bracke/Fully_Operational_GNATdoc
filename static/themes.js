// store theme
const storeTheme = function (theme) {
   localStorage.setItem("theme", theme);
};

// set theme when visitor returns
const setTheme = function (colorThemes) {

   let activeTheme = localStorage.getItem("theme");
   if (!activeTheme) {
      if (window.matchMedia('(prefers-color-scheme: light)').matches) {
         activeTheme = 'light';
      }
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
         activeTheme = 'dark';
      }
   }
   colorThemes.forEach((themeOption) => {
      if (themeOption.id === activeTheme) {
         themeOption.checked = true;
      }
   });
   // fallback for no :has() support
   document.documentElement.className = activeTheme;
};
window.addEventListener('DOMContentLoaded', event => {

   const colorThemes = document.querySelectorAll('[name="theme"]');
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
   document.onload = setTheme(colorThemes);

});