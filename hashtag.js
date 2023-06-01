document.querySelector('.search').addEventListener('keyup', function(event) {

  for (const item of document.querySelectorAll('.menu-title')) {
    const search = event.target.value.toLowerCase();

    if (item.textContent.indexOf(search) > -1) {
      item.parentNode.style.display = '';
    } else {
        item.parentElement.style.display = 'none';
    }
  }

});

let groupBy = function(xs, key) {
  return xs.reduce(function(rv, x) {
    (rv[String(x[key]).toLowerCase()] = rv[String(x[key]).toLowerCase()] || []).push(x);
    return rv;
  }, {});
};

fetch('./tweets-with-category-and-hashtag.json')
.then(res => res.json())
.then(data => {
  let template = document.querySelector('#category');
  let categories = groupBy(data, 'Category');
  let hastags = groupBy(data, 'Hashtag');

  for (const item in categories) {
    let clone = template.content.cloneNode(true);
    let name = clone.querySelector('.menu-title');
    name.textContent = item;
    name.dataset.ids = categories[item].map(i => i.id).join(',')
    document.querySelector('.menu-category').appendChild(clone);
  }

  for (const item in hastags) {
    let clone = template.content.cloneNode(true);
    let name = clone.querySelector('.menu-title');
    name.textContent = '#' + item;
    name.dataset.ids = hastags[item].map(i => i.id).join(',');

    document.querySelector('.menu-hashtag').appendChild(clone);
  }

  document.querySelector('.menu').addEventListener('click', (event) => {
    if(event.target.matches('.menu-title')) {
      let tweetEl = document.querySelector('.tweets');
      tweetEl.innerHTML = '';

      for (const item of event.target.dataset.ids.split(',')) {
        twttr.ready(function (twttr) {
          twttr.widgets.createTweet(item, tweetEl, {
            theme: 'light',
            conversation: 'none',
            dnt: true,
          });
      });
      }
    }
  });

  document.querySelector('.menu-title').click();

});

