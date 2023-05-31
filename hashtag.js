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
        fetch(`https://publish.twitter.com/oembed?url=https://twitter.com/mertcangokgoz/status/${item}`, {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Access-Control-Allow-Origin':'https://tweet-hashtager.vercel.app/',
            },
            redirect: 'follow'
        })
        .then(res => res.json())
        .then(data => {
          tweetEl.innerHTML += data.html;
        });
      }
      
    }
  })

});

