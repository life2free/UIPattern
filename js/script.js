const newsApiUrl = "https://newsapi.org/v2/top-headlines?country=us";
const nytApiUrl =
  "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=financial&sort=newest&api-key=pQ4BKb1jHvw1WlQ1UaxGHFDfftLosi8D";
const nytImageBasePath = "https://www.nytimes.com/";

const maxDisplayCount = 10;

const goPreviousBtn = document.querySelector(".goPrevious");
const goNextBtn = document.querySelector(".goNext");

const newsTitleEle = document.querySelector(".news_title");
const newsAuthorEle = document.querySelector(".news_author");
const newsPublishedDateEle = document.querySelector(".news_publishedDate");
const newsSourceEle = document.querySelector(".news_source");
const newsImgEle = document.querySelector(".news_image");
const newsContentEle = document.querySelector(".news_content");
const queryNewsApiEle = document.querySelector("#queryNewsApi");
const queryNytApiEle = document.querySelector("#queryNytApi");

/** the interval of query, unit is millisecond, 60000 millisecond=60 seconds
 * purpose: the datas from api are updated infrequently, meanwhile，the amount of datas which are got from api is huge
 * so don't need query data from api each time when diplay datas
 * if interval is less than this value, then don't need query datas with api, otherwise, query datas with api
 */
const queryInterval = 60000;

// store the original data list which queried by api
let newsList = [];

// store the parsed data list which original datas came from news api
let newsListParsed = [];

// store the parsed data list which original datas came from new york times api
let nytListParsed = [];

/**
 * store the data list for render the page
 * when display the datas from news api, renderList copy the datas of newsListParsed
 * when display the datas from new york time api, renderList copy the datas of nytListParsed
 */
let renderList = [];
let newsIndex = 0;
let newsCount = maxDisplayCount;

// define the news class
class News {
  constructor(title, author, publishedDate, image, content, source, url) {
    this.title = title;
    this.author = author;
    this.publishedDate = publishedDate;
    this.image = image;
    this.content = content;
    this.source = source;
    this.url = url;
  }
}

// get news list by news api and renders the page
function getNewsListFromNewsApi() {
  fetch(`${newsApiUrl}`, {
    headers: {
      "X-Api-Key": "94c943336a554a92a9fd546cdef192fa"
    }
  })
    .then(res => res.json())
    .then(res => {
      if (res.articles.length > 0) {
        newsList = [...res.articles];
        newsCount =
          newsList.length > maxDisplayCount ? maxDisplayCount : newsList.length;
        // parse the original news list
        parseNewsListFromNewsApi(newsList);
      }
    })
    .then(() => {
      newsIndex = 0;
      renderList = [...newsListParsed];
      // render the page
      renderNewsDiv(newsIndex);
    })
    .catch(err => {
      console.log("Something went wrong", err);
    });
}

// parse the original news list from news api
function parseNewsListFromNewsApi(list) {
  newsListParsed = [];
  for (let i = 0; i < newsCount; i++) {
    let originNews = list[i];

    // parse the title
    let title = originNews.title == null ? "" : originNews.title;

    // parse the author
    let author = originNews.author == null ? "" : originNews.author;

    // parse the published date
    let publishedDate =
      originNews.publishedAt == null ? "" : originNews.publishedAt;
    if (publishedDate.length >= 10) {
      // just get the date, no time
      publishedDate = publishedDate.slice(0, 10);
    }

    // parse the image's url
    let image = originNews.urlToImage == null ? "" : originNews.urlToImage;

    // parse the content
    let content = originNews.content == null ? "" : originNews.content;
    if (content != "") {
      // replace the "\r\n" to '<br/><br/>'
      content = content.replace(/\r\n/g, "<br/><br/>");
      // replace the last "[  ]" to ""
      let idxBegin = content.lastIndexOf("[");
      if (idxBegin != -1) {
        let idxEnd = content.indexOf("]", idxBegin + 1);
        if (idxEnd != -1) {
          let firstPart = content.substr(0, idxBegin);
          if (idxEnd < content.length - 1) {
            let lastPart = content.substr(idxEnd + 1);
            content = firstPart + lastPart;
          } else {
            content = firstPart;
          }
        }
      }
    } else {
      // if there is no content, then using description
      let description =
        originNews.description == null ? "" : originNews.description;
      content = description;
    }

    // parse the source
    let source = "";
    if (originNews.source != null) {
      source = originNews.source.name == null ? "" : originNews.source.name;
    }

    // parse the source url
    let url = originNews.url == null ? "" : originNews.url;
    newsListParsed.push(
      new News(title, author, publishedDate, image, content, source, url)
    );
  }
}

// get news list by New York Times api and renders the page
function getNewsListFromNytApi() {
  fetch(nytApiUrl)
    .then(res => res.json())
    .then(res => {
      newsList = [];
      if (res.response.docs.length > 0) {
        for (let i = 0; i < res.response.docs.length; i++) {
          // just get the news which includes image
          if (res.response.docs[i].multimedia.length > 0) {
            newsList.push(res.response.docs[i]);
          }
        }

        newsCount =
          newsList.length > maxDisplayCount ? maxDisplayCount : newsList.length;
        // parse the original news list
        parseNewsListFromNytApi(newsList);
      }
    })
    .then(() => {
      newsIndex = 0;
      renderList = [...nytListParsed];
      // renders the page
      renderNewsDiv(newsIndex);
    })
    .catch(err => {
      console.log("Something went wrong", err);
    });
}

// parse the original news list from New York Times api
function parseNewsListFromNytApi(list) {
  nytListParsed = [];
  for (let i = 0; i < newsCount; i++) {
    let originNews = list[i];

    // parse the title
    let headline = originNews.headline;
    let title = "";
    if (headline != null) {
      title = headline.main == null ? "" : headline.main;
      if (title == "") {
        title = headline.print_headline == null ? "" : headline.print_headline;
      }
    }

    // parse the author
    let byline = originNews.byline;
    let author = "";
    if (byline != null) {
      author = byline.original == null ? "" : byline.original;
    }

    // parse the published date
    let publishedDate = originNews.pub_date == null ? "" : originNews.pub_date;
    if (publishedDate.length >= 10) {
      // just get the date, no time
      publishedDate = publishedDate.slice(0, 10);
    }

    // parse the image's url
    let multimedia = originNews.multimedia;
    let image = "";
    if (multimedia != null && multimedia.length > 0) {
      let imageUrl = "";
      if (multimedia.length >= 2) {
        imageUrl = multimedia[0].url == null ? "" : multimedia[0].url;
      } else {
        imageUrl = multimedia[0].url == null ? "" : multimedia[0].url;
      }
      image = nytImageBasePath + imageUrl;
    }

    // parse the content
    let content =
      originNews.lead_paragraph == null ? "" : originNews.lead_paragraph;
    if (content == "") {
      // if there is no content, then using abstract
      originNews.abstract == null ? "" : originNews.abstract;
    }

    // parse the source
    let source = originNews.source == null ? "" : originNews.source;

    // parse the source url
    let url = originNews.web_url == null ? "" : originNews.web_url;
    nytListParsed.push(
      new News(title, author, publishedDate, image, content, source, url)
    );
  }
}

// render the news by the index of news
function renderNewsDiv(newsIdx) {
  if (newsIdx >= 0 && newsIdx < newsCount) {
    let news = renderList[newsIdx];

    // render the title,author,publishedDate,image,content,source,url to page
    newsTitleEle.innerHTML = news.title;
    if (news.author != "") {
      newsAuthorEle.innerHTML = "By ".concat(news.author);
    } else {
      newsAuthorEle.innerHTML = "";
    }

    newsPublishedDateEle.innerHTML = news.publishedDate;

    if (news.url != "") {
      newsSourceEle.innerHTML = "related link";
      if (news.source != "") {
        newsSourceEle.innerHTML = news.source;
      }
      newsSourceEle.href = news.url;
    } else {
      newsSourceEle.innerHTML = "";
      newsSourceEle.href = "";
    }

    newsImgEle.style.backgroundImage = `url('${news.image}')`;
    newsContentEle.innerHTML = news.content;
  }
}

// get news list by news api and render the page when load html
function init() {
  getNewsListFromNewsApi();
  queryNewsApiEle.dataset.querytime = new Date().getTime();
  queryNewsApiEle.classList.add("click_style");
}

// handle the go Previous or go Next
function goPreviousOrNextHandle(e) {
  e.preventDefault();
  let direct = e.target.dataset.direction;

  if (direct == "-1") {
    // go Previous
    newsIndex -= 1;
    if (newsIndex < 0) {
      newsIndex = newsCount - 1;
    }
  } else {
    // go Next
    newsIndex += 1;
    if (newsIndex >= newsCount) {
      newsIndex = 0;
    }
  }
  renderNewsDiv(newsIndex);
}

// add the event listners to go previous and go next elements
goPreviousBtn.addEventListener("click", goPreviousOrNextHandle);
goNextBtn.addEventListener("click", goPreviousOrNextHandle);

// display datas
function displayDatas(obj) {
  let apiIndex = obj.dataset.apiindex;
  newsIndex = 0;
  let lastQueryTime =
    obj.dataset.querytime != "" ? parseInt(obj.dataset.querytime) : 0;
  let interval = new Date().getTime() - lastQueryTime;
  if (interval <= queryInterval) {
    /**
     * if the spacing interval between current time and last time when queried data is less than the queryInterval,
     * then don't need query datas with api, just use the datas last time queried
     */
    if (apiIndex == "0") {
      renderList = [...newsListParsed];
      queryNewsApiEle.classList.add("click_style");
      queryNytApiEle.classList.remove("click_style");
    } else {
      renderList = [...nytListParsed];
      queryNewsApiEle.classList.remove("click_style");
      queryNytApiEle.classList.add("click_style");
    }

    newsCount = renderList.length;
    renderNewsDiv(newsIndex);
  } else {
    /**
     * if the spacing interval between current time and last time when queried data is great than the queryInterval,
     * then need query datas with api
     */
    if (apiIndex == "0") {
      // get news list by News api
      getNewsListFromNewsApi();
      queryNewsApiEle.classList.add("click_style");
      queryNytApiEle.classList.remove("click_style");
      queryNewsApiEle.dataset.querytime = new Date().getTime();
    } else {
      // get news list by News York Times api
      getNewsListFromNytApi();
      queryNewsApiEle.classList.remove("click_style");
      queryNytApiEle.classList.add("click_style");
      queryNytApiEle.dataset.querytime = new Date().getTime();
    }
  }
}
