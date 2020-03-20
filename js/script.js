const url = 'http://newsapi.org/v2/top-headlines?country=us'
const maxDisplayCount =15

const goPreviousBtn = document.querySelector(".goPrevious")
const goNextBtn = document.querySelector(".goNext")

const newsTitleEle = document.querySelector(".news_title")
const newsAuthorEle = document.querySelector(".news_author")
const newsPublishedDateEle = document.querySelector(".news_publishedDate")
const newsSourceEle = document.querySelector(".news_source")
const newsImgEle = document.querySelector(".news_image")
const newsContentEle = document.querySelector(".news_content")

let newsList = []
let newsListParsed = []
let newsIndex = 0
let newsCount = maxDisplayCount


// define the news class
class News{
    constructor(title,author,publishedDate,image,content,source,url){
        this.title = title
        this.author = author
        this.publishedDate = publishedDate
        this.image = image
        this.content = content
        this.source = source
        this.url = url
    }
}

// get artickes by news api
let getNewsList = () =>{
    fetch(`${url}`, {
        headers: {
            'X-Api-Key': '94c943336a554a92a9fd546cdef192fa'
        }
    })
    .then(res => res.json())
    .then(res =>{
        if(res.articles.length > 0){
            newsList = [...res.articles]
            console.log(newsList)
            newsCount = (newsList.length > maxDisplayCount) ? maxDisplayCount : newsList.length
            // parse the original news list
            parseNewsList(newsList)
        }
    })
    .then(()=>{
        renderNewsDiv(0)
    })
    .catch(err => {
        console.log("Something went wrong", err)
    })
    
}


// parse the original news list
function parseNewsList(list){
    for(let i=0; i<newsCount; i++){
        let originNews = list[i]
        
        let title = (originNews.title == null ) ? "" : originNews.title

        let author = (originNews.author == null ) ? "" : originNews.author

        let publishedDate = (originNews.publishedAt == null) ? "" : originNews.publishedAt
        if(publishedDate.length>=10){
            // just get the date, no time
            publishedDate = publishedDate.slice(0,10)
        }

        let image = (originNews.urlToImage == null ) ? "" : originNews.urlToImage

        let content = (originNews.content == null ) ? "" : originNews.content
        if(content != ""){
            // replace the "\r\n" to '<br/><br/>'
            content = content.replace(/\r\n/g,"<br/><br/>")
            // replace the last "[  ]" to ""
            let idxBegin = content.lastIndexOf("[")
            if(idxBegin != -1){
                let idxEnd = content.indexOf("]",idxBegin+1)
                if(idxEnd != -1){
                    let firstPart = content.substr(0, idxBegin)
                    if(idxEnd<content.length - 1){
                        let lastPart = content.substr(idxEnd + 1)
                        content = firstPart + lastPart
                    }else{
                        content = firstPart
                    }
                }
            }
        }else{
            // if there is no content, then using description
            let description = (originNews.description == null ) ? "" : originNews.description
            content = description
        }

        let source = ""
        if( originNews.source != null){
            source = (originNews.source.name == null ) ? "" : originNews.source.name
        }

        let url = (originNews.url == null ) ? "" : originNews.url
        newsListParsed.push(new News(title, author, publishedDate, image, content, source, url))
    }
}

// get news list by news api when load html
function init(){
    getNewsList()
}

// render the news by index of news
function renderNewsDiv(newsIdx){
    if(newsIdx>=0 && newsIdx<newsCount){
        let news = newsListParsed[newsIdx]
        // render the title,author,publishedDate,image,content,source,url to page
        newsTitleEle.innerText = news.title
        if(news.author != ""){
            newsAuthorEle.innerText = "By ".concat(news.author)
        }else{
            newsAuthorEle.innerText = ""
        }

        newsPublishedDateEle.innerText = news.publishedDate

        if(news.url != ""){
            newsSourceEle.innerText = "related link"
            if(news.source != ""){
                newsSourceEle.innerText = news.source
            }
            newsSourceEle.href = news.url
        }else{
            newsSourceEle.innerText = ""
            newsSourceEle.href = ""
        }

        newsImgEle.style.backgroundImage = `url('${news.image}')`
        newsContentEle.innerHTML = news.content
    }
}

// handle the go Previous or go Next
function goPreviousOrNextHandle(e){
    e.preventDefault()
    let direct = e.target.dataset.direction

    if(direct == "-1"){
        // go Previous
        newsIndex -= 1
        if(newsIndex<0){
            newsIndex = newsCount -1
        }
    }else{
        // go Next
        newsIndex += 1
        if(newsIndex>=newsCount){
            newsIndex = 0
        }
    }
    renderNewsDiv(newsIndex)
}


goPreviousBtn.addEventListener("click",goPreviousOrNextHandle)
goNextBtn.addEventListener("click",goPreviousOrNextHandle)