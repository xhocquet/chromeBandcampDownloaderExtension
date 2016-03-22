var tracklist = [];
var artistName;
var parser = new DOMParser();
var currentTab;

function getLinks(url, callback) {
  var regex = /"\/\/([a-z]|[A-Z]|[0-9]|\.|\/|\?|=|-|&)+"/g;
  var content = $.get(url, function(response) {
    callback(response.match(regex));
  });
}

function parseTrackList(content) {
  var virtualDOM = parser.parseFromString(content, 'text/html');
  var trackRows = virtualDOM.getElementsByClassName('track_row_view')
  artistName = virtualDOM.getElementById('band-name-location').children[0].innerHTML;

  for (var k = 0; k < trackRows.length; k++) {
    var curTrackTitle = trackRows[k].children[2].children[0].children[0].text;
    tracklist.push(artistName + " - " + curTrackTitle);
  }

  downloadLinks();
}

function downloadLinks() {
  getLinks(currentTab.url, function(links) {
    links = links.filter(link => {
      if (link.search('gif') > -1 || link.search('jpg') > -1 || link.search('html') > -1 || link.search('htm') > -1) {
        return false;
      } else {
        return true;
      }
    });

    for (var i = 0; i < links.length - 1; i++) {
      var tempLink = "http://" + links[i].substr(1, links[i].length - 2);
      // If tracklist # matches the links we found, use their names. If not, fallback to numbers
      if (tracklist.length === links.length) {
        chrome.downloads.download({url: tempLink, filename: "./" + artistName + "/" + tracklist[i] + ".mp3"});
      } else {
        chrome.downloads.download({url: tempLink, filename: "./bandcampAlbum/" + (i+1) + ".mp3"});
      }
    }
  });
}


chrome.browserAction.onClicked.addListener(function(tab) {
  currentTab = tab;
  chrome.tabs.sendMessage(tab.id, 'event', parseTrackList);
});
