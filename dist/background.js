(()=>{"use strict";chrome.runtime.onInstalled.addListener((function(){chrome.action.disable(),chrome.declarativeContent.onPageChanged.removeRules(void 0,(function(){chrome.declarativeContent.onPageChanged.addRules([{conditions:[new chrome.declarativeContent.PageStateMatcher({pageUrl:{urlMatches:"https://www.makeplayingcards.com/*"}}),new chrome.declarativeContent.PageStateMatcher({pageUrl:{urlMatches:"https://www.printerstudio.co.uk/*"}})],actions:[new chrome.declarativeContent.ShowAction]}])}))})),chrome.action.onClicked.addListener((function(e){chrome.tabs.sendMessage(e.id,{message:"show"})})),chrome.runtime.onMessage.addListener((function(e){"download"===e.message?chrome.downloads.download({url:"data:text/plain;charset=utf-8,".concat(encodeURIComponent(JSON.stringify(e.value))),filename:"project.txt"}):"open"===e.message&&chrome.tabs.create({url:e.url})}))})();
//# sourceMappingURL=background.js.map