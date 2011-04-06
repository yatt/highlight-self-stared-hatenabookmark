// ==UserScript==
// @name highlight-self-stared-hatenabookmark
// @version 0.0.1
// @namespace http://d.hatena.ne.jp/yatt/
// @description highlight self-stared bookmark comment on b.hatena.ne.jp page
// @include http://b.hatena.ne.jp/entry?mode=more*
// ==/UserScript==

//
// TODO: 14以上のスターがついてるとき、短縮されるので、その処理
//


(function()
{

var textColor = '#ffff00'
var backColor = '#000000'

function userList()
{
    var lst = document
          .getElementById('new-bookmarks')
          .getElementsByTagName('ul')[0]
          .getElementsByTagName('li')
    var ret = []
    for (var i = 0; i < lst.length; i++)
        if (!lst[i].hasAttribute('data-twitter-id'))
            ret.push(lst[i])
    return ret
}

function homelink(domelem)
{
    return 'http://b.hatena.ne.jp/' + domelem.getAttribute('data-user') + '/';
}

function containSelfStar(domelem)
{
    var slst = domelem
          .getElementsByTagName('span')[4]
          .getElementsByTagName('a');
    var ulink = homelink(domelem);
    for (var i = 0; i < slst.length; i++)
        if (ulink == slst[i].getAttribute('href'))
            return true
    return false
}

function highlightComment(domelem)
{
    domelem.setAttribute('style',
        'background-color:' + backColor + ';' +
        'color:' + textColor
        )
}

function main()
{
    var lst = userList();
    for (var i = 0; i < lst.length; i++)
        if (containSelfStar(lst[i]))
        {
            //alert(lst[i].getAttribute('data-user'));
            highlightComment(lst[i])
        }
}


main()
})();
