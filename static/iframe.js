// set theme when visitor returns
const setTheme = function () {

   let activeTheme = localStorage.getItem("theme");
   if (!activeTheme) {
      if (window.matchMedia('(prefers-color-scheme: light)').matches) {
         activeTheme = 'light';
      }
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
         activeTheme = 'dark';
      }
   }
   // fallback for no :has() support
   document.documentElement.className = activeTheme;
};

const ScrollToTop = function (WrapperQuery, ScrolltotopId) {
   const scrollTop = document.getElementById(ScrolltotopId);
   const Wrapper = document.querySelector(WrapperQuery);
   const Has_Scrollbar = Wrapper.scrollHeight > Wrapper.clientHeight;

   if (Has_Scrollbar && Wrapper.scrollTop > 100) {
      scrollTop.style.visibility = "visible";
      scrollTop.style.opacity = 0.5;
   } else {
      scrollTop.style.visibility = "hidden";
      scrollTop.style.opacity = 0;
   }
}
window.addEventListener('DOMContentLoaded', event => {

   document.getElementById("previous-button").addEventListener("click", navigate_back);
   document.getElementById("next-button").addEventListener("click", navigate_forward);

   setTheme();

   // Add toggle to nav list
   const Wrapper = document.getElementById("sidebar-wrapper");
   let Has_Scrollbar = false;
   for (let i of document.querySelectorAll(".toggle")) {
      i.onclick = () => i.classList.toggle("show");
      Has_Scrollbar = Wrapper.scrollHeight > Wrapper.clientHeight;

      // Close nav list if it can't be on the page
      if (Has_Scrollbar) {
         i.classList.toggle("show");
      }
   }
   Has_Scrollbar = Wrapper.scrollHeight > Wrapper.clientHeight;

   if (!Has_Scrollbar || Wrapper.scrollTop < 100) {
      document.getElementById('scrolltop').style.visibility = "hidden";
      document.getElementById('scrolltop').style.opacity = 0;
   }

   // Show / hide scroll-to-top button
   document.getElementById("sidebar-wrapper").onscroll = () => {
      ScrollToTop("body #sidebar-wrapper", "scrolltop");
   };
   const page_content_wrapper = document.querySelector("body .page-content-wrapper");
   if (page_content_wrapper) {
      Has_Scrollbar = page_content_wrapper.scrollHeight > page_content_wrapper.clientHeight;

      if (!Has_Scrollbar || page_content_wrapper.scrollTop < 100) {
         document.getElementById('scrolltop2').style.visibility = "hidden";
         document.getElementById('scrolltop2').style.opacity = 0;
      }

      // Show / hide scroll-to-top button
      page_content_wrapper.onscroll = () => {
         ScrollToTop("body .page-content-wrapper", "scrolltop2");
      };
   }

   let all_links = document.querySelectorAll('#sidebar-wrapper nav li > a');
   [].forEach.call(all_links, function (el) {
      el.addEventListener('click', (event) => {
         // Mark the link that was clicked on with 'active' and remove any previous 'active'
         let all_selected_Links = document.getElementsByClassName('active');
         [].forEach.call(all_selected_Links, function (el) {
            el.classList.remove("active");
         });
         event.target.classList.add("active");
      });
   });
});