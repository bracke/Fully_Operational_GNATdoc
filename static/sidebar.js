const filterFunction = function (filter_value) {
   const filter = filter_value.toUpperCase();
   const Menu_Items = document.querySelectorAll("nav li")
   let txtValue;
   for (let i = 0; i < Menu_Items.length; i++) {
      txtValue = Menu_Items[i].textContent;

      if (!filter || txtValue.toUpperCase().indexOf(filter) > -1) {
         Menu_Items[i].classList.remove("d-none");
      } else {
         Menu_Items[i].classList.add("d-none");
      }
   }
   if (filter.length > 0)
   {
      const Wrapper = document.getElementById("sidebar-wrapper");
      let Has_Scrollbar = false;
      for (let i of document.querySelectorAll(".toggle")) {
         i.classList.remove("show");
         i.classList.add("show");
      }
   }
}
const navigate_back = function (event) {
   event.preventDefault();
   const aside = event?.target?.parentElement?.parentElement;

   const all_selected_links = aside.querySelectorAll('.active');
   let selected_menu_item;
   if (all_selected_links.length > 0) {
      selected_menu_item = all_selected_links[0];
   }
   // Get previous menu item.
   let sibling;
   if (selected_menu_item) {
      sibling = selected_menu_item?.parentElement?.previousSibling;
      while (sibling && sibling.style.display == "none") {
         sibling = sibling.previousSibling;
      }
   }
   else {
      const all_links = aside.querySelectorAll('nav li');
      if (all_links.length > 0) {
         let counter = all_links.length - 1;
         sibling = all_links[counter];
         while (sibling && sibling.style.display == "none") {
            counter = counter - 1;
            if (counter >= 0) {
               sibling = all_links[counter];
            }
            else {
               sibling = null;
            }
         }
      }
   }
   if (!sibling) {
      try {
         // No sibling available - look for the next nav list
         let sibling_nav = selected_menu_item?.parentElement?.parentElement?.parentElement?.previousSibling?.firstChild;

         while (!sibling && sibling_nav?.classList?.contains("nav-title")) {
            // Pick first element in nav list
            sibling = sibling_nav?.nextSibling?.lastChild;
            while (sibling && sibling.style.display == "none") {
               sibling = sibling.previousSibling;
            }
            sibling_nav = sibling_nav?.parentElement?.previousSibling?.firstChild;
         }
         if (!sibling) {
            // There are no previous nav lists - select the last menuitem
            const all_links = aside.querySelectorAll('nav li');
            if (all_links.length > 0) {
               let counter2 = all_links.length - 1;
               sibling = all_links[counter2];
               while (sibling && sibling.style.display == "none") {
                  counter2 = counter2 - 1;
                  if (counter2 >= 0) {
                     sibling = all_links[counter2];
                  }
                  else {
                     sibling = null;
                  }
               }
            }
         }
      }
      catch { }
   }
   if (sibling) {
      // Ensure nav section is open
      if (!sibling?.parentElement?.previousSibling?.classList?.contains("show")) {
         sibling.parentElement.previousSibling.classList.add("show");
      }
      sibling.scrollIntoView({ behavior: "instant", block: "end" });
      sibling.firstChild.click();
   }
}
const navigate_forward = function (event) {
   event.preventDefault();
   const aside = event?.target?.parentElement?.parentElement;

   const all_selected_links = aside.querySelectorAll('.active');
   let selected_menu_item;
   if (all_selected_links.length > 0) {
      selected_menu_item = all_selected_links[0];
   }

   let sibling;
   // Get next menu item.
   if (selected_menu_item) {
      sibling = selected_menu_item?.parentElement?.nextSibling;

      while (sibling && sibling.style.display == "none") {
         sibling = sibling.nextSibling;
      }
   }
   else {
      const all_links = aside.querySelectorAll('nav li');
      if (all_links.length > 0) {
         let counter = 0;
         sibling = all_links[counter];
         while (sibling && sibling.style.display == "none") {
            counter = counter + 1;
            if (counter < all_links.length) {
               sibling = all_links[counter];
            }
            else {
               sibling = null;
            }
         }
      }
   }
   if (!sibling) {
      // No sibling available - look for the next nav list
      try {
         let sibling_nav = selected_menu_item?.parentElement?.parentElement?.parentElement?.nextSibling?.firstChild;

         while (!sibling && sibling_nav?.classList?.contains("nav-title")) {
            // Pick first element in nav list
            sibling = sibling_nav?.nextSibling?.firstChild;
            while (sibling && sibling.style.display == "none") {
               sibling = sibling.nextSibling;
            }
            sibling_nav = sibling_nav?.parentElement?.nextSibling?.firstChild;
         }
         if (!sibling) {
            // select the first item in the menu
            const all_links = aside.querySelectorAll('nav li');
            if (all_links.length > 0) {
               let counter2 = 0;
               sibling = all_links[0];
               while (sibling && sibling.style.display == "none") {
                  counter2 = counter2 + 1;
                  if (counter2 < all_links.length) {
                     sibling = all_links[counter2];
                  }
                  else {
                     sibling = null;
                  }
               }
            }
         }
      }
      catch(Err) {
         console.log(Err);
       }
   }
   if (sibling) {
      // Ensure nav section is open
      if (!sibling?.parentElement?.previousSibling?.classList?.contains("show")) {
         sibling.parentElement.previousSibling.classList.add("show");
      }
      sibling.scrollIntoView({ behavior: "instant", block: "end" });
      sibling.firstChild.click();
   }
}