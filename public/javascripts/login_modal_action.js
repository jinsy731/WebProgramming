$(function () {

        /*var form_data = {
            id: $("#id").val(),
            pw: $("#pw").val()
        };

        $.ajax({
            url: "MemberLoginAction.do",
            type: "POST",
            data: form_data,
            dataType : "text",
            success: function (data) {
                if(data.trim() == 'success') {
                    location.reload();
                }
                else if(data.trim() == 'wrong_id') {
                    alert("존재하지 않는 아이디입니다.");
                }
                else if(data.trim() == 'wrong_pw') {
                    alert("비밀번호가 다릅니다.");
                }
            },
            error: function () {
                alert("error");
            }
        });
    });  // loginSubmit Event Handler end*/



    $('#joinSubmit').click( function() {
        location.href = "/auth/join";

    });


}); // document.ready end

function loginInputCheck() {
    $('#prevUrl').val(location.href);
    var $id = $("#formId");
    var $pw = $("#formPw");
    if ($id.val() == '' || $pw.val() == '') {
        alert("아이디와 비밀번호를 입력해주세요.");
        return false;
    } else {
        $("#USER_ID").val(SHA256($pw.val()));
        console.log($("#USER_ID").val());
        $pw.val("");
    }
}