/*
 * List element to columns plugin
 * Sebastian Kuhlgert
 */
function docsifyListColumns(hook, vm) {
  let hasColumns = false;

  hook.beforeEach(function(content) {
    hasColumns = content.match(/[\r\n]*(\s*)(<!-+\s+columns:\s*?\d\s+-+>)[\r\n\s]+([+\-\*]?)/m);
    return content;
  });

  hook.afterEach(function(html, next) {
    if (hasColumns) {
      var re = /(<!-+\s+columns:\s*?(\d)\s+-+>)[\r\n\s]+(<ul\s?>)/g;
      html = html.replace(re, function(match, g1, g2) {
        return `${g1}\n<ul class="docsify-columns" style="column-count: ${g2};">`;
      });
    }
    next(html);
  });
}

function docsifyReadTime(hook, vm) {
  let hasReadTime = false;

  hook.beforeEach(function(content) {
    hasReadTime = content.match(/(\{docsify-readtime\})/g);
    if(hasReadTime){
      var readTime = content.split(' ').length / 200;
      var re = /(\{docsify-readtime\})/g;
      content = content.replace(re, function() {
        readTime = (readTime > 1)? Math.ceil(readTime) : 'about a';
        return `<p class="docsify-readtime">${readTime} min read</p>\n`;
      });
    }
    return content;
  });
}

function docsifyFeedback(hook, vm){

  var ga = vm.config.ga || null;

  hook.afterEach(function(html, next) {
    if(ga && location.hash != "#/")
      html += `<p class="docsify-feedback" style="text-align:center;"></p>`;
    next(html);
  });
  hook.doneEach(function () {
    var container = document.querySelector(".docsify-feedback");
    if (!container) {
      return;
    }
    container.innerHTML = `<h5>Was this article helpful?</h5>`;
    container.innerHTML += `<button class="docsify-feedback_yes">Yes!</button> <button class="docsify-feedback_no">No</button>`;

    document.querySelector(".docsify-feedback_yes").addEventListener("click", function(o) {
      try{
        window.ga('send', 'event', 'Help', 'Yes', location.hash);
      }
      catch(err){}
      container.innerHTML = `<small>Thank you for your feedback!</small>`;
    });

    document.querySelector(".docsify-feedback_no").addEventListener("click", function(o) {
      try{
        window.ga('send', 'event', 'Help', 'No', location.hash);
      }
      catch(err){}
      container.innerHTML = `<textarea class="docsify-feedback_text" placeholder="Please let us know what we can do better!"></textarea> <button class="docsify-feedback_submit">Send</button>`;

      document.querySelector(".docsify-feedback_submit").addEventListener("click", function(o) {
        try{
          var text = document.querySelector(".docsify-feedback_text").value;
          window.ga('send', 'event', 'Help', text, location.hash);
        }
        catch(err){}
        container.innerHTML = `<small>Thank you for your feedback!</small>`;
      });

    });

  });
}

function docsifySidebarScroll(hook, vm){
  hook.doneEach(function() {
    document.querySelector(".sidebar-nav .active").scrollIntoView(true);
  });
}

window.$docsify = window.$docsify || {};
window.$docsify.plugins = [docsifyListColumns].concat(window.$docsify.plugins || []);
window.$docsify.plugins = [docsifyReadTime].concat(window.$docsify.plugins || []);
window.$docsify.plugins = [docsifyFeedback].concat(window.$docsify.plugins || []);
window.$docsify.plugins = [docsifySidebarScroll].concat(window.$docsify.plugins || []);