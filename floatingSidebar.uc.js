function waitForElement(selector1, selector2, callback) {
  const interval = setInterval(() => {
    const element1 = document.querySelector(selector1);
    const element2 = document.querySelector(selector2);
    if (element1 && element2) {
      clearInterval(interval);
      callback(element1, element2);
    }
  }, 500); // Check every 100ms
}

waitForElement(
  "#sidebar2-box.browser-sidebar2.chromeclass-extrachrome",
  "#sidebar-select-box", // Replace with the correct selector for the container
  (sidebar, sidebarContainer) => {
    const sidebarSplitter = document.querySelector(
      "#sidebar-splitter2.browser-sidebar2.chromeclass-extrachrome"
    );

    // add button to toggle floating sidebar
    const button = document.createElement("button");
    button.textContent = "Float";
    button.style.margin = "0 5px";
    button.addEventListener("click", () => {
      const floating = sidebar.getAttribute("floating") == "true";
      sidebar.setAttribute("floating", !floating);
    });
    const sidebarHeader = sidebar.querySelector("#sidebar2-header");
    if (sidebarHeader.children.length >= 4) {
      // Insert the button before the 5th child (index 4 since it's zero-based)
      sidebarHeader.insertBefore(button, sidebarHeader.children[4]);
    } else {
      // If there are less than 4 children, append the button to the end
      sidebarHeader.appendChild(button);
    }
    sidebar.setAttribute("floating", "true");
    // sidebarSplitter.appendChild(sidebar);
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
