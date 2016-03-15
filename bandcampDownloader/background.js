chrome.browserAction.onClicked.addListener(function(tab) {
  results = getLinks(tab.url, function(links) {
    for (var i = 0; i < links.length - 1; i++) {
      var tempLink = "http://" + links[i].substr(1, links[i].length - 2);
      if (tempLink.search('gif') > -1 || tempLink.search('jpg') > -1) {
        return false;
      }
      chrome.downloads.download({url: tempLink});
    }
  });
})


function getLinks(url, callback) {
  var regex = /"\/\/([a-z]|[A-Z]|[0-9]|\.|\/|\?|=|-|&)+"/g;
  var content = $.get(url, function(response) {
    callback(response.match(regex));
  });
}
