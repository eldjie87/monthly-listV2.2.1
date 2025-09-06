import { Dashboard } from "../pages/dashboard.js";

function  render(...pages) {
  const root = document.querySelector(".root");
  root.innerHTML = "";
  pages.forEach(page => {
    root.appendChild(page);
  });
}

function route(path) {
    if (path === "/") {
        render(Dashboard());
    }
}

route(window.location.pathname);

window.addEventListener("popstate", () => {
    route(window.location.pathname);
});
