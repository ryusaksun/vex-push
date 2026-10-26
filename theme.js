/* 深浅色切换：默认跟随系统；点右上角的按钮切到另一种并记在本机浏览器里。
   切回和系统一样的那种时不再记，之后又跟着系统变。
   在 <head> 里同步加载：先把记下的选择设到 <html data-theme>，页面画出来之前就是对的颜色。 */
(function () {
  var KEY = "vex-push-theme";
  var root = document.documentElement;
  var media = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  function stored() {
    try {
      var value = localStorage.getItem(KEY);
      return value === "light" || value === "dark" ? value : null;
    } catch (e) {
      return null;
    }
  }

  function systemTheme() {
    return media && media.matches ? "dark" : "light";
  }

  function current() {
    return root.getAttribute("data-theme") || systemTheme();
  }

  function apply(theme) {
    if (theme) {
      root.setAttribute("data-theme", theme);
    } else {
      root.removeAttribute("data-theme");
    }
  }

  apply(stored());

  function sync(button) {
    var label = current() === "dark" ? "切换到浅色模式" : "切换到深色模式";
    button.setAttribute("aria-label", label);
    button.title = label;
  }

  document.addEventListener("DOMContentLoaded", function () {
    var button = document.querySelector(".theme-toggle");
    if (!button) {
      return;
    }
    button.hidden = false;
    sync(button);

    button.addEventListener("click", function () {
      var next = current() === "dark" ? "light" : "dark";
      var followSystem = next === systemTheme();
      try {
        if (followSystem) {
          localStorage.removeItem(KEY);
        } else {
          localStorage.setItem(KEY, next);
        }
      } catch (e) {}
      apply(followSystem ? null : next);
      sync(button);
    });

    if (media) {
      var onSystemChange = function () {
        sync(button);
      };
      if (media.addEventListener) {
        media.addEventListener("change", onSystemChange);
      } else if (media.addListener) {
        media.addListener(onSystemChange);
      }
    }

    // 另一个标签页里切了，这边跟着变
    window.addEventListener("storage", function (event) {
      if (event.key === KEY) {
        apply(stored());
        sync(button);
      }
    });
  });
})();
