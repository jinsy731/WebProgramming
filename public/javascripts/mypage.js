$(function() {

    $('#mypage a').click(function(event) { event.preventDefault();});

    $('#viewInfo').click(function(event) {
        event.preventDefault();
        $.ajax({
            url : '/users/viewInfo',
            type : 'get',
            dataType : 'json',

            success : function(result) {
                    console.log(result);
                    console.log(result.ID);
                    var html =
                    `
                    <div id="userInfo">
                        <p><span>아이디</span> ${result.ID}</p>
                        <p><span>이메일</span> ${result.EMAIL}</p>
                        <p><span>이름</span> ${result.NAME}</p>
                        <p><span>주소</span> ${result.ADDRESS}</p>
                        <p><span>전화번호</span> ${result.PHONE}</p>
                        <p><span>성별</span> ${result.GENDER}</p>
                        <p><span>생일</span> ${result.BIRTH}</p>
                    </div>  
                    `;
                    $('#mypageContent').html(html);
                }
            })
    }); // viewInfo Click

    $('#viewInfo').click();


    $('#secession').click(function () {
        var html =
            `
            <form action="/users/secession_action" method="post" onsubmit="return secessionCheck()">
                <span>비밀번호 입력</span>
                <input type="password" id="passwordInput" class="form-control-sm" placeholder="비밀번호">
                <input type="hidden" id="secessionPW" name="pw">
                <button class="btn-sm btn-secondary" id="secessionBtn">탈퇴</button>
            </form>
             `;

        $('#mypageContent').html(html);
    }); // secession click


    $('#changePassword').click(function() {
       var html =
           `
            <form action="/users/changePassword_action" method="post" onsubmit="return changePasswordCheck()">
                <div class="form-group">
                    <span style="margin-right : 52px">비밀번호 입력</span>
                    <input type="password" id="passwordInput" class="form-control-sm" placeholder="비밀번호 확인">
                    <input type="hidden" id="changePW" name="pw" value="default">
                </div>
                <div class="form-group">
                    <span>변경할 비밀번호 입력</span>
                    <input type="password" id="new_passwordInput" class="form-control-sm" placeholder="변경할 비밀번호">                
                    <input type="hidden" id="changeNewPW" name="new_pw" value="default">
                </div>
                <button class="btn-sm btn-secondary" id="changePasswordBtn">변경</button>
            </form>
            `;
       $('#mypageContent').html(html);
    });


    $('#viewBid').click(function() {
        var html =
            `
            <div class="row mt-5 mb-5"  id="itemContainer">
                
            </div>

            `;
        $('#mypageContent').html(html);
        
        $.ajax({
            url : '/users/viewBid',
            type : 'get',
            dataType: 'json',

            success : function(list) {
                for(var i in list) {
                    var item_html =
                        `
                        <div class="col-lg-3 col-md-4 col-sm-6 bid-item">
                            <a href="/bid/item/${list[i].item_no}">
                                <img class="img-thumbnail rounded mypage-bid-img" src="${list[i].item_image_src}" style="width : 130px; height : 130px; object-fit: cover">
                            </a>
                            <p class="mt-3 text-center">${list[i].item_name}</p>
                            <p><span class="bid-item-sub">시작가  </span>${list[i].item_start_price}</p>
                            <p><span class="bid-item-sub">최고가  </span>${list[i].item_max_price}</p>
                            <p><span class="bid-item-sub">현재 입찰가  </span>${list[i].item_current_price}</p>
                            <a href="/bid/buyitem/${list[i].item_no}"><button class="btn btn-secondary">구매</button></a>

                        </div>
                        `;

                    $('#itemContainer').append(item_html);

                }
            }
        });
    });// viewBid end


    $('#viewMyProduct').click(function() {
        var html =
            `
            <div class="row mt-5 mb-5"  id="itemContainer">
                
            </div>

            `;
        $('#mypageContent').html(html);

        $.ajax({
            url : '/users/viewMyProduct',
            type : 'get',
            dataType: 'json',

            success : function(list) {
                for(var i in list) {
                    var item_html =
                        `
                        <div class="col-lg-3 col-md-4 col-sm-6 bid-item">
                            <a href="/bid/item/${list[i].item_no}">
                                <img class="img-thumbnail rounded mypage-bid-img" src="${list[i].item_image_src}" style="width : 130px; height : 130px; object-fit: cover">
                            </a>
                            <p class="mt-3 text-center">${list[i].item_name}</p>
                            <p><span class="bid-item-sub">시작가  </span>${list[i].item_start_price}</p>
                            <p><span class="bid-item-sub">최고가  </span>${list[i].item_max_price}</p>
                            <p><span class="bid-item-sub">현재 입찰가  </span>${list[i].item_current_price}</p>
                        </div>
                        `;

                    $('#itemContainer').append(item_html);

                }
            }
        });

    }); // viewMyProduct end

}); // document readt end

    function secessionCheck() {
        var result = confirm("탈퇴하시겠습니까?");
        if (!result) {
            console.log("secesion");
            return false;
        }
        else {
            var $pw = $('#passwordInput');
            $('#secessionPW').val(SHA256($pw.val()));
            $pw.val("");
        }

    }

function changePasswordCheck() {
    var result = confirm("비밀번호를 변경하시겠습니까?");
    if (!result)
        return false;
    else {
        var $pw = $('#passwordInput');
        var $newpw = $('#new_passwordInput');
        $('#changePW').val(SHA256($pw.val()));
        $('#changeNewPW').val(SHA256($newpw.val()));
        $pw.val("");
        $newpw.val("");

    }
}
