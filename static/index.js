const ScrollToTop = function (WrapperId, ScrolltotopId) {

   const scrollTop = document.getElementById(ScrolltotopId);
   const Wrapper = document.getElementById(WrapperId);
   const Has_Scrollbar = Wrapper.scrollHeight > Wrapper.clientHeight;

   if (Has_Scrollbar && Wrapper.scrollTop > 100) {
      scrollTop.style.visibility = "visible";
      scrollTop.style.opacity = 0.5;
   } else {
      scrollTop.style.visibility = "hidden";
      scrollTop.style.opacity = 0;
   }
}
const Define_HeaderSize = () => {
    // Get Header height
    const header_element = document.getElementsByTagName("header");
    if (header_element && header_element.length > 0) {
       const header_height = header_element[0].offsetHeight;
       var root = document.querySelector(':root');
       root.style.setProperty("--header-size", "" + header_height + "px");
    }
}
window.addEventListener('DOMContentLoaded', event => {

   document.getElementById("previous-button").addEventListener("click", navigate_back);
   document.getElementById("next-button").addEventListener("click", navigate_forward);

   Define_HeaderSize();

   window.addEventListener('resize', function(event) {
      Define_HeaderSize();
   }, true);

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
      ScrollToTop("sidebar-wrapper", "scrolltop");
   };

   const all_links = document.querySelectorAll('#sidebar-wrapper nav li > a');
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

   // Handle selects on mobile
   const all_select = document.querySelectorAll('#sidebar-wrapper nav > select');
   [].forEach.call(all_select, function (el) {
      el.addEventListener('change', (event) => {
         const iframe = document.getElementById("content-iframe");
         iframe.src = event.target.value;

         const all_select = document.querySelectorAll('#sidebar-wrapper nav > select');
         [].forEach.call(all_select, function (el) {
            if (el != event.target) {
               el.selectedIndex = 0;
            }
         });
      });
   });
});