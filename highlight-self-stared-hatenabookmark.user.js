// ==UserScript==
// @name highlight-self-stared-hatenabookmark
// @version 0.0.1
// @namespace http://d.hatena.ne.jp/yatt/
// @description highlight self-stared bookmark comment on b.hatena.ne.jp page
// @include http://b.hatena.ne.jp/entry?mode=more*
// ==/UserScript==
//test http://b.hatena.ne.jp/entry?mode=more&url=http%3A%2F%2Fhatena.g.hatena.ne.jp%2Fhatenabookmark%2F20110405%2F1301981564
(function(){

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

function username(domelem)
{
    return domelem.getAttribute('data-user')
}

function homelink(domelem)
{
    return 'http://b.hatena.ne.jp/' + username(domelem) + '/';
}

function highlightComment(domelem)
{
    domelem.setAttribute('style',
        'background-color:' + backColor + ';' +
        'color:' + textColor
        )
}

function starContainer(domelem)
{
    var lst = domelem.getElementsByTagName('span')
    for (var i = 0; i < lst.length; i++)
        if (lst[i].hasAttribute('class') && lst[i].getAttribute('class') == 'hatena-star-star-container')
            return lst[i]
}

function highlightIfSelfStarAsync(domelem)
{
    var path = domelem
                .getElementsByTagName('a')[1]
                .getAttribute('href')
    var uri = 'http://b.hatena.ne.jp' + path
    var name = username(domelem)

    GM_xmlhttpRequest({
        method: 'GET',
        url: 'http://s.hatena.ne.jp/entry.json?uri=' + encodeURIComponent(uri),
        onload: function(res) {
            var lst = eval('(' + res.responseText + ')').entries[0].stars
            for (var i = 0; i < lst.length; i++)
                if (lst[i].name == name)
                {
                    highlightComment(domelem)
                    break
                }
        }
    })
}

function isCompressed(starContainer)
{
    // has over thirteen stars?
    return starContainer.getElementsByTagName('span').length > 0
}

function highlightIfSelfStar(domelem)
{
    if (isCompressed(starContainer(domelem)))
    {
        highlightIfSelfStarAsync(domelem)
        return
    }
    var slst = domelem
          .getElementsByTagName('span')[4]
          .getElementsByTagName('a')
    var ulink = homelink(domelem)
    for (var i = 0; i < slst.length; i++)
        if (ulink == slst[i].getAttribute('href'))
        {
            highlightComment(domelem)
            return
        }
}

function main()
{
    var lst = userList();
    for (var i = 0; i < lst.length; i++)
        highlightIfSelfStar(lst[i])
}


function search(lst, name)
{
    for (var i = 0; i < lst.length; i++)
        if (username(lst[i]) == name)
            return lst[i]
}


main()
})()
