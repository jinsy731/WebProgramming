$(function() {


    $('#BTN_SIGNUP').click( function() {
        if($('#join_id').val().length == 0 ||
            $('#join_pw').val().length == 0 ||
            $('#email').val().length == 0 ||
            $('#name').val().length == 0 ||
            $('#addr').val().length == 0 ||
            $('#phone').val().length == 0||
            $('#gender').val().length == 0 ||
            $('#birth').val().length == 0) {

            console.log(
                {id : $('#join_id').val().length,
                pw : $('#join_pw').val().length}
                );

            console.log("abc");

            alert('모든 정보를 입력해주세요!');
            return false;
        }

    });

});