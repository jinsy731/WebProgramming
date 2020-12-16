async function inputCheck(event) {
    var $inputs = $('#joinform').find('input');
    var check = true;
    $inputs.each(await function() {
        if($(this).val() === "") {
            console.log("loop");
            check = false;
        } else {
            console.log($(this).val());
        }
    });

    console.log('loop end');
    console.log(check);
    if (check === true) {
        var $pw = $("#joinForm_pw");
        $('#JOIN_PW').val(SHA256($pw.val()));
        $pw.val("");
    } else {
        alert("정보를 모두 입력해주세요");
        event.preventDefault();
    }

}