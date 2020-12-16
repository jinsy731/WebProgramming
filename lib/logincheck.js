module.exports = {
    isLogin : function(request, response) {
        if(request.user)
            return true;
        else
            return false;
    },

    statusUI : function(request, response) {
        var authStatusUI;

        if(this.isLogin(request, response)) {
            authStatusUI = `<li class="nav-item mx-0 mx-lg-1"><a class="nav-link py-3 px-0 px-lg-3 rounded js-scroll-trigger" href="/auth/logout">로그아웃</a></li>`;
        }
        else {
            authStatusUI = `<li class="nav-item mx-0 mx-lg-1"><a class="nav-link py-3 px-0 px-lg-3 rounded js-scroll-trigger" data-toggle="modal" data-target="#loginModal">로그인</a></li>`;
        }

        return authStatusUI;

    }
}