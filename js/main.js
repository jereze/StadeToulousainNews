'use strict';

var $main = $('main');

var articlesData = null;
function fetchArticles(callback) {
  if (articlesData !== null) {
    return callback(articlesData);
  }
  console.log("Fetching json");
  $.getJSON("/api/news.min.json").done(function(data) {
    articlesData = data;
    return callback(articlesData);
  }).fail(function() {
    articlesData = [];
    return callback(articlesData);
  });
}

function index() {
  console.log('index');
  fetchArticles(function (articles) {
    $(window).scrollTop(0);
    $main.empty();
    $.each(articles, function(key, obj){
      var $article = $(
        '<article><header>' +
        '<h2><a href="/article/' + key + '""> ' + obj['article']['title'] + '</a></h2>' +
        '<p>Source: ' + obj['article']['domain'] + '</p>' +
        '</header>' +
        '<p><img src="' + obj.article.lead_image_url + '" alt="" /> ' + obj.article.excerpt + '</p>' +
        '<article>'
        );
      $main.append( $article );
    });
  });
}

function article(ctx) {
  console.log('article', ctx);
  fetchArticles(function (articles) {
    var id = ctx.params.id;
    var obj = articles[id];
    $(window).scrollTop(0);
    $main.empty().html(
      '<article>' +
      '<p><a href="/">&lt; Retour à la liste des articles</a></p>' +
      '<header><h1>' + obj.article.title + '</h1></header>' +
      '<div>' + obj.article.content + '</div>' +
      '<p><a href="' + obj.article.url + '" target="_blank">Ouvrir l\'article sur ' + obj.article.domain + '</a></p>' +
      '</article>'
      );
  });
}

page('/', index);
page('/article/:id', article);
page({
  hashbang:false
});
