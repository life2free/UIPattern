const url = 'http://newsapi.org/v2/top-headlines?country=us'

let articleList = []

// find cat by category id or name
let getArticles = () =>{
    // e.preventDefault();
    fetch(`${url}`, {
        headers: {
            'X-Api-Key': '94c943336a554a92a9fd546cdef192fa'
        }
    })
    .then(res => {
        console.log(res)
        return res.json()
    })
    .then(res =>{
        console.log(res)
        // alert(res.articles.length)
        if(res.articles.length > 0){
            console.log(res)
            res.articles.forEach(article=>articleList.push(article))
        }
    })
    .catch(err => {
        console.log("Something went wrong", err)
    })
}


// getArticles()