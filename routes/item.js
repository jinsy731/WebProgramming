var express = require('express');
var router = express.Router();
var axios = require('axios');
var cheerio = require('cheerio');
var logincheck = require('../lib/logincheck');
var store = require('store2');


router.get('/itemsearch', function(req, res) {
    var statusUI = logincheck.statusUI(req, res);
    res.render('./item/itemlist_search.ejs', { ui : statusUI});
})

router.get('/itemlist', function(req,res) {
    var item = req.query.item;
    var page_num = 1;

    var getHtml = async function (item, page_num) {
        try {
            return await axios.get(encodeURI("https://www.daangn.com/search/"+item+"/more/flea_market?page="+page_num));
            // 더보기 할 때 변경되는 url은 개발자 도구의 네트워크 탭에서 확인 가능
        } catch (error) {
            console.error(error);
        }
    };

    // getHtml 함수가 axios.get을 이용하여 웹페이지의 html을 가져오고
    // getHtml에서 return 되는 값이 then의 함수의 파라미터로 넘어감.
    // 그 후 반환되는 Promise 객체에 cheerio를 이용하여 데이터를 가공
    getHtml(item, page_num)
        .then(html => {
            var ulList = [];
            const $ = cheerio.load(html.data);
            const $bodyList = $('body').children("article.flea-market-article.flat-card");

            $bodyList.each(function(i, elem) {
                ulList[i] = {
                    description: $(this).find('div.card-photo img').attr('alt'),
                    url: $(this).find('a.flea-market-article-link').attr('href'),
                    image_url: $(this).find('div.card-photo img').attr('src'),
                    image_alt: $(this).find('div.card-photo img').attr('alt'),
                    region: $(this).find('div.article-info p.article-region-name').text(),
                    price: $(this).find('div.article-info p.article-price').text()
                };
            });

            // const data = ulList.filter(n => n.title);
            return ulList;
        })
        .then(result => {
            //console.log(result);
            var statusUI = logincheck.statusUI(req, res);
            res.render('./item/ItemList.ejs', {ui: statusUI, _data: result});
        });

    /*   getHtml(item ,5).then(_data => {
           console.log(_data);
       });*/

});

router.post('/moreitem', function(req, res) {

    var post = req.body;
    var item_name = post.item_name;
    var page_num = post.page_num;

    const getHtml = async function (item, page_num) {
        try {
            return await axios.get(encodeURI("https://www.daangn.com/search/"+item+"/more/flea_market?page="+page_num));
            // 더보기 할 때 변경되는 url은 개발자 도구의 네트워크 탭에서 확인 가능
        } catch (error) {
            console.error(error);
        }
    };

    // getHtml 함수가 axios.get을 이용하여 웹페이지의 html을 가져오고
    // getHtml에서 return 되는 값이 then의 함수의 파라미터로 넘어감.
    // 그 후 반환되는 Promise 객체에 cheerio를 이용하여 데이터를 가공
    getHtml(item_name, page_num)
        .then(html => {
            var ulList = [];
            const $ = cheerio.load(html.data);
            const $bodyList = $('body').children("article.flea-market-article.flat-card");

            $bodyList.each(function(i, elem) {
                ulList[i] = {
                    description: $(this).find('div.card-photo img').attr('alt'),
                    url: $(this).find('a.flea-market-article-link').attr('href'),
                    image_url: $(this).find('div.card-photo img').attr('src'),
                    image_alt: $(this).find('div.card-photo img').attr('alt'),
                    region: $(this).find('div.article-info p.article-region-name').text(),
                    price: $(this).find('div.article-info p.article-price').text()
                };
            });

            // const data = ulList.filter(n => n.title);
            return ulList;
        })
        .then(result => {
            res.send(result);
        })

    /*   getHtml(item ,5).then(_data => {
           console.log(_data);
       });*/
});


router.get('/crawling', function(req, res) {



 href="https://cafe.naver.com/ca-fe/ArticleRead.nhn?clubid=10050146&amp;page=2&amp;inCafeSearch=true&amp;searchBy=0&amp;query=%EC%8A%A4%ED%83%A0%EB%93%9C&amp;includeAll=&amp;exclude=&amp;include=&amp;exact=&amp;searchdate=all&amp;media=0&amp;sortBy=date&amp;articleid=805629454&amp;referrerAllArticles=true"



})

module.exports = router;
