function waitForElement(selector1, selector2, callback) {
  const interval = setInterval(() => {
    const element1 = document.querySelector(selector1);
    const element2 = document.querySelector(selector2);
    if (element1 && element2) {
      clearInterval(interval);
      callback(element1, element2);
    }
  }, 500);
}

waitForElement(
  "#sidebar2-box.browser-sidebar2.chromeclass-extrachrome",
  "#sidebar-select-box",
  (sidebar, sidebarContainer) => {
    const sidebarSplitter = document.querySelector(
      "#sidebar-splitter2.browser-sidebar2.chromeclass-extrachrome"
    );

    // create sidebar splitter
    const splitter = document.createElement("splitter");
    splitter.setAttribute("id", "sidebar-splitter-floating");
    splitter.setAttribute("class", "sidebar-splitter-floating");
    sidebar.setAttribute("floating", "true");
    sidebar.appendChild(splitter);
    let isDragging = false;
    let startX = 0;
    let startWidth = 0;

    splitter.addEventListener("mousedown", (event) => {
      isDragging = true;
      startX = event.screenX;
      startWidth = sidebar.getBoundingClientRect().width;
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
      event.preventDefault();
    });

    function onMouseMove(event) {
      if (!isDragging) return;
      const deltaX = event.screenX - startX;
      const newWidth = startWidth + deltaX;
      sidebar.style.width = newWidth + "px";
    }

    function onMouseUp() {
      if (!isDragging) return;
      isDragging = false;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    }
    function checkSplitterVisibility() {
      const sidebarMaxWidth = getComputedStyle(sidebar).maxWidth;
      if (sidebarMaxWidth === "0px") {
        splitter.style.display = "none";
        sidebar.style.opacity = "0";
      } else {
        splitter.style.display = "block";
        sidebar.style.opacity = "1";
      }
    }
    const observer = new MutationObserver(() => {
      checkSplitterVisibility();
    });

    observer.observe(sidebar, { attributes: true, attributeFilter: ["style"] });

    // add button to toggle floating sidebar
    const button = document.createElement("button");
    button.textContent = "Float";
    button.style.margin = "0 5px";
    button.addEventListener("click", () => {
      const floating = sidebar.getAttribute("floating") == "true";
      sidebar.setAttribute("floating", !floating);
      sidebarSplitter.setAttribute("floating", !floating);
      splitter.setAttribute("floating", !floating);
    });
    const sidebarHeader = sidebar.querySelector("#sidebar2-header");
    if (sidebarHeader.children.length >= 4) {
      sidebarHeader.insertBefore(button, sidebarHeader.children[4]);
    } else {
      sidebarHeader.appendChild(button);
    }
    sidebar.setAttribute("floating", "true");
    sidebarSplitter.setAttribute("floating", "true");

    // Function to hide the sidebar
    const hideSidebar = () => {
      const sidebarIcons = sidebarContainer.querySelectorAll(
        "toolbarbutton.sidepanel-icon"
      );
      sidebarIcons.forEach((icon) => {
        const checked = icon.getAttribute("checked") == "true";
        if (checked) {
          icon.click();
        }
      });
    };

    // Add event listener to handle click outside the sidebar
    document.addEventListener("click", (event) => {
      const floating = sidebar.getAttribute("floating") == "true";
      if (!floating) {
        return;
      }
      const sidepanelBrowsers = sidebar.querySelectorAll("browser");

      const clickedBrowser = getTopLevelDocument(event).activeElement;
      const clickedBrowserIsSidebarBrowser = Array.from(sidepanelBrowsers).some(
        (browser) => browser === clickedBrowser
      );
      const insideSidebar =
        sidebar.contains(event.target) || clickedBrowserIsSidebarBrowser;

      const insideSidebarContainer = sidebarContainer.contains(event.target);
      const insideSidebarSplitter = sidebarSplitter.contains(event.target);

      if (!insideSidebar && !insideSidebarContainer && !insideSidebarSplitter) {
        hideSidebar();
      }
    });
  }
);
function getTopLevelDocument(event) {
  let doc = event.target.ownerDocument || document;
  while (doc.defaultView && doc.defaultView !== doc.defaultView.parent) {
    doc = doc.defaultView.parent.document;
  }
  return doc;
}
