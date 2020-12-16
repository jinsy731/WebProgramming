$(function () {
    sessionStorage.clear(); // 처음 페이지에 들어올 때 sessionStorage의 page값 삭제

    $('#moreBtn').click( function() {
        var url = decodeURI(window.location.href);
        var urlParse = url.split('=');

        // 처음이라면 sessionStorage에 page값 추가
        if(!sessionStorage.getItem('page'))
            sessionStorage.setItem('page', '1');

        console.log('urlParse', urlParse);
        console.log('session page', sessionStorage.getItem('page'));

        var _data = {
            item_name : urlParse[1],
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
                var scroll = $(window).scrollTop();
                for(var i=0; i < result.length; i++) {
                    var url = 'https://daangn.com'+result[i].url;
                    $('#itemContainer').append(
                        `<div class="col-lg-4 col-md-4 col-sm-4 bid-item">
                            <a href= ${url}>
                                <img class="rounded" src=${result[i].image_url} alt=${result[i].image_alt} style="max-width: 100%; height : auto">
                            </a>
                            <p class="mt-3 font-weight-bold">${result[i].description}</p>
                            <p><span class="bid-item-sub mr-2">지역</span>${result[i].region}</p>
                            <p><span class="bid-item-sub mr-2">가격</span>${result[i].price}</p>
                        </div>`
                    );
                }
                $(window).scrollTop(scroll);
            }
        }); //ajax end
    });// click event end
})