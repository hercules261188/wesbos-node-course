import axios from "axios";
import dompurify from "dompurify";

function searchResultsHtml(stores) {
  return dompurify.sanitize(
    stores
      .map(store => {
        return `<a href='/store/${store.slug}' class='search__result'>
      <strong>${store.name}</strong>
    </a>`;
      })
      .join("")
  );
}

function typeAhead(search) {
  if (!search) return;

  const input = search.querySelector('input[name="search"]');
  const results = search.querySelector(".search__results");

  input.on("input", function() {
    if (!this.value) {
      results.style.display = "none";
      return;
    }

    results.style.display = "block";

    axios
      .get(`/api/search?q=${this.value}`)
      .then(res => {
        if (res.data.length) {
          results.innerHTML = searchResultsHtml(res.data);
          return;
        }

        results.innerHTML = `<div class='search__results'>No results for ${this.value} found.</div>`;
      })
      .catch(err => {
        console.error(err);
      });
  });

  input.on("keyup", e => {
    if (![38, 40, 13].includes(e.keyCode)) return;

    const activeClass = "search__result--active";
    const current = search.querySelector(`.${activeClass}`);
    const items = search.querySelectorAll(".search__result");

    let next;
    if (e.keyCode === 40 && current) {
      next = current.nextElementSibling || items[0];
    } else if (e.keyCode === 40) {
      next = items[0];
    } else if (e.keyCode === 38 && current) {
      next = current.previousElementSibling || items[items.length - 1];
    } else if (e.keyCode === 38) {
      next = items[items.length - 1];
    } else if (e.keyCode === 13 && current.href) {
      window.location = current.href;
      return;
    }

    if (current) current.classList.remove(activeClass);
    next.classList.add(activeClass);
  });
}

export default typeAhead;
