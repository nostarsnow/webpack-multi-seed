function getNcp(){var e={list:[{name:"租号玩官网",url:".*://www(1?).zuhaowan.com",dev:!1,pro:!1,sm:!1,server:"//127.0.0.1:8888"}]};ncp=localStorage.ncp?JSON.parse(localStorage.ncp):e,localStorage.ncp||(localStorage.ncp=JSON.stringify(e))}function setBadge(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[255,0,0,255];chrome.browserAction.setBadgeText({text:e}),chrome.browserAction.setBadgeBackgroundColor({color:t})}var ncp={};getNcp(),chrome.webRequest.onBeforeRequest.addListener(function(e){var t={};return ncp.list.forEach(function(s){if(!new RegExp(s.url).test(e.initiator))return!1;var r=e.initiator.split("://")[0]+":";if(s.dev){if(setBadge("dev"),/(stylesheet|script)/.test(e.type)){/.*\/\/zuhaowan\.zuhaowan\.com\/static\/www3\.0\/dubhe\/(pages|common)\/((?!index\/js\/index\.js).)*$/.test(e.url)&&(t={cancel:!0});var a=e.url.match(/.*\/\/zuhaowan\.zuhaowan\.com\/static\/www3\.0\/dubhe\/pages\/(.*)\/js\/index\.js.*/);a&&(t={redirectUrl:""+r+s.server+"/"+a[1]+"/index.js"})}}else s.pro?(r="http:",setBadge(s.sm?"psm":"pro"),/.*\/\/zuhaowan\.zuhaowan\.com\/static\/www3\.0\/dubhe/.test(e.url)&&(t=s.sm&&/(stylesheet|script)/.test(e.type)&&!/\.ws\./.test(e.url)?{redirectUrl:e.url.replace(/.*\/\/zuhaowan\.zuhaowan\.com\/static\/www3\.0\/dubhe/,""+r+s.server).replace(".css",".ws.css").replace(".js",".ws.js")}:{redirectUrl:e.url.replace(/.*\/\/zuhaowan\.zuhaowan\.com\/static\/www3\.0\/dubhe/,""+r+s.server)})):s.sm?(setBadge(s.pro?"psm":"sm"),/.*\/\/zuhaowan\.zuhaowan\.com\/static\/www3\.0\/dubhe/.test(e.url)&&/(stylesheet|script)/.test(e.type)&&!/\.ws\./.test(e.url)&&(t={redirectUrl:e.url.replace(".css",".ws.css").replace(".js",".ws.js")})):setBadge("",[0,0,0,0])}),t},{urls:["<all_urls>"]},["blocking"]);