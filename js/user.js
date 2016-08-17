$(function () {
  function onload() {
    var userid = Helper.getParameterByName('userid');
    if (userid) {
      $.ajax({
        url: 'https://api.github.com/users/' + userid,
        type: 'get',
        success: function (user) {
          $div = $('.js-container');

          $div.find('.js-user-photo img').attr('src', user.avatar_url);
          $div.find('.js-user-name').text(user.name);
          $div.find('.js-user-github-url').text(user.html_url).attr('href', user.html_url);
          $div.find('.js-user-id').text(user.login);
          $div.find('.js-user-bio').text(user.bio);
          $div.find('.js-user-location').text(user.location);
          $div.find('.js-user-joined-on').text(Helper.dateFormat(user.created_at));
          $div.find('.js-followers').text(user.followers);
          $div.find('.js-following').text(user.following);

        }
      });
    }
  }
  onload();
});
