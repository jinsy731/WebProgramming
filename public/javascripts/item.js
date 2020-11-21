$(function () {
    sessionStorage.clear(); // 처음 페이지에 들어올 때 sessionStorage의 page값 삭제

    $('#moreBtn').click( function() {
        var url = decodeURI(window.location.href);
        var urlParse = url.split('/');

        // 처음이라면 sessionStorage에 page값 추가
        if(!sessionStorage.getItem('page'))
            sessionStorage.setItem('page', '1');

        console.log('urlParse', urlParse);
        console.log('session page', sessionStorage.getItem('page'));

        var _data = {
            item_name : urlParse[5],
            page_num : parseInt(sessionStorage.getItem('page')) + 1
        };
        sessionStorage.setItem('page', _data.page_num.toString());

        $.ajax({
            url : '/item/moreitem',
            data : _data,
            type : "post",
            dataType : "json",
            traditional : true,

            success : function(result) {
                for(var i=0; i < result.length; i++) {
                    var url = 'https://daangn.com'+result[i].url;
                    $('#itemContainer').append(
                        `<div class="col-lg-4 col-md-4 col-sm-4">
                            <a href= ${url}>
                                <img class="rounded" src=${result[i].image_url} alt=${result[i].image_alt} style="max-width: 100%; height : auto">
                            </a>
                            <p>${result[i].description}</p>
                            <p>${result[i].region}</p>
                            <p>${result[i].price}</p>
                        </div>`
                    );
                }
            }
        }); //ajax end
    });// click event end
})