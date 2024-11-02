// Search function

class Result {

   constructor(name, href, hits, query) {
      this.name = name;
      this.href = href;
      this.hits = hits;
      this.query = query;
   }

   html() {
      const template = document.createElement('template');
      let content = `<li>
         <a href="${this.href}" target="document-content">${this.name}</a>
         <ul class="match-list">`;
      for (var i = 0; i < this.hits.length; i++) {
         content = content + `<li>${this.hits[i]}</li>`;
      }
      template.innerHTML = content + "</ul></li>";

      return template.content;
   }
}
const fetchFile = async (full_link, href, name) => {
   let result = "";
   try {
      let response = await fetch(full_link);
      aFile = await response.text();

      // Remove stuff that is not needed

      // Remove head section
      aFile = aFile.substring(aFile.indexOf("<body class=content>") + "<body class=content>".length);

      // Remove scripts
      const patt = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script\s*>/gi
      aFile = aFile.replace(patt, '');

      // Remove sidebar
      aFile = aFile.substring(0, aFile.indexOf("<div id=sidebar-wrapper>"));

      // Remove scrolltotop2 button
      let start = aFile.indexOf('<div id=scrolltop2>');
      let end = aFile.indexOf("</div>", start + "<div id=scrolltop2>".length) + "</div>".length;
      aFile = aFile.substring(0, start) + aFile.substring(end);

      // Remove top1 scroll target
      start = aFile.indexOf("<div id=top1></div>");
      end = start + "<div id=top1></div>".length;
      aFile = aFile.substring(0, start) + aFile.substring(end);

      // Return article containing the fetched content
      result = `<article url='${href}' name='${name}'>${aFile}</article>`;

   } catch (error) {
      console.error(error.message);
   }
   return result;
}

const fetchAllContent = async () => {
   const allLinks = document.querySelectorAll("#sidebar-wrapper nav li a");
   let href = ""; let result = ""; let el;

   for (let i = 0; i < allLinks.length; i++) {
      el = allLinks[i];
      result = result + await fetchFile(el.href, el.getAttribute("href"), el.innerText);
   }
   return result;
};

const Start_Fetch = async () => {
   let result = await fetchAllContent();
   const dataContainer = document.getElementById("searchdata-container");
   dataContainer.innerHTML = result;
}

const displayResults = (results) => {
   const display = document.querySelector("body nav.search-display > ul");
   Array.from(display.children).forEach(c => c.remove())
   results.forEach((result) => display.append(result.html()));
}

const mark_match = (text, searchQuery) => {
   const FindEndPoint = (endpoint_marker, text, zero_based) => {
      const pos = text.toLowerCase().indexOf(endpoint_marker);
      if (pos > -1) {
         const start = zero_based ? 0 : pos + endpoint_marker.length;
         const end = zero_based ? pos : text.length;
         text = text.substring(start, end);
      }
      return text;
   }
   let match = "", prefix = "", postfix = "";
   if (text && searchQuery) {
      let pos = text.toLowerCase().indexOf(searchQuery);
      if (pos > -1) {
         // Only take text from the paragraph which contains the query text
         // If no paragraph is found then look for a previous linefeed
         prefix = FindEndPoint("<p>", text.substring(0, pos), false);
         prefix = FindEndPoint("\n", prefix, false);
         match = prefix + "<mark>" + text.substring(pos, pos + searchQuery.length) + "</mark>";
         postfix = text.substring(pos + searchQuery.length);
         postfix = FindEndPoint("</p>", postfix, true);
         postfix = FindEndPoint("\n", postfix, true);

         // Find other matches in remaining text
         pos = postfix.toLowerCase().indexOf(searchQuery);
         while (pos > -1) {
            match = match + postfix.substring(0, pos);
            match = match + "<mark>";
            match = match + postfix.substring(pos, pos + searchQuery.length) + "</mark>";
            postfix = postfix.substring(pos + searchQuery.length);
            pos = postfix.toLowerCase().indexOf(searchQuery);
         }
         match = match + postfix;
      }
   }
   return match;
}

const performSearch = (query) => {

   const CreateMatchLink = (local_url, entity, text) => {
      return `<a href="${local_url}#${entity.getAttribute("id")}" target="document-content">${text}</a>`
   }
   const searchQuery = query.trim().toLowerCase();
   const results = [];

   if (searchQuery.length > 1) {
      const articles = document.querySelectorAll("#searchdata-container article");
      let found = false; let text = ""; let hits; let local_url;

      [].forEach.call(articles, function (el) {
         found = false;
         hits = []
         local_url = el.getAttribute("url");

         text = mark_match(el.getAttribute("name"),)
         if (text) {
            found = true; hits.push(text);
         }

         text = el.querySelector(".page-content-wrapper > div > div#description")?.innerHTML;
         text = mark_match(text, searchQuery)
         if (text) {
            found = true; hits.push(text);
         }

         const entities = el.querySelectorAll(".entity");
         for (var i = 0; i < entities.length; i++) {

            text = entities[i].querySelector(".section-title")?.innerHTML;
            text = mark_match(text, searchQuery)
            if (text) {
               found = true; hits.push(CreateMatchLink(local_url, entities[i], text));
            }

            text = entities[i].querySelector(".ada-code-snippet > code")?.innerHTML;
            text = mark_match(text, searchQuery);
            if (text) {
               found = true; hits.push(CreateMatchLink(local_url, entities[i], text));
            }

            text = entities[i].querySelector(".description > .title")?.innerHTML;
            text = mark_match(text, searchQuery);
            if (text) {
               found = true; hits.push(CreateMatchLink(local_url, entities[i], text));
            }
         }

         if (found) {
            results.push(new Result(el.getAttribute("name"), local_url, hits, searchQuery));
         }
      });
   }
   displayResults(results);
}

window.addEventListener('DOMContentLoaded', event => {

   // Call search function
   const search = document.getElementById("search");
   let debounceTimer;
   const debounce = (callback, time) => {
      window.clearTimeout(debounceTimer);
      debounceTimer = window.setTimeout(callback, time);
   };

   search.addEventListener(
      "input",
      (event) => {
         const query = event.target.value;
         debounce(() => performSearch(query), 500);
      },
      false
   );

   // Search trigger
   const searchTrigger = document.getElementById("search_trigger");
   if (searchTrigger) {
      const closeModal = document.getElementById("closeModal");
      closeModal.addEventListener(
         "click",
         (event) => {
            const Modal = document.getElementById("searchResults");
            Modal.close();
         });

      const searchResults = document.getElementById("searchResults");
      if (searchResults) {
         searchTrigger.addEventListener("click", (event) => {
            const searchResults = document.getElementById("searchResults");
            searchResults.showModal();
            document.getElementById("search").focus();
         });

         Start_Fetch();

      }
   }

   document.addEventListener(
      "keydown",
      (event) => {
         if (event.ctrlKey && event.key === "k") {
            const searchResults = document.getElementById("searchResults");
            searchResults.showModal();
            document.getElementById("search").focus();
            event.preventDefault();
         }
         else {
            return;
         }
      }, true);
});
