
$(function() {

    var check = function () {
        console.log('check process');
        var result;
        $.ajax({
                url: '/auth/logincheck',
                type: 'get',
                async: false,
                dataType: 'text',

                success : function (data) {
                    console.log('check ajax data', data)
                    if (data.trim() === 'false') {
                        result = false;
                    }
                    else if(data.trim() === 'true') {
                        result = true;
                    }
                }
            }
        );

        return result;
        // 동기식으로 처리해도 ajax 안에서 return하면 값을 받기 전에 가져가므로 ajax 밖에서 return 해줘야함.
    }

    $('#btn_write').click( function() {
        console.log('btn click');
        var vCheck = check();
        if(!vCheck) { console.log('check', vCheck); alert('로그인 후 이용 가능합니다!');  return false;}

        location.href = '/board/write';
    })

    $('.table_item').click( function () {
        var num = $(this).children().eq(0).text();
        location.href = "/board/content/"+num;
    })

    $('#commentSubmit').click( function() {

        var url = window.location.href;
        var urlParse = url.split('/');

        var data = {
            num : urlParse[5],
            content : $('#commentInput').val()
        }

        $.ajax( {
            url : '/board/comment_write',
            async : false,
            type : "post",
            data : data,

            success : function(result) {
                result = $.trim(result);
                if(result == 'success') {
                    location.reload();
                }
                else if(result == 'failed') {
                    alert('댓글 등록에 실패했습니다!');
                }
                else if(result == 'auth_error') {
                    alert("로그인 후 이용할 수 있습니다.");
                }
            }

        }); // ajax end

    })

});




