$(function () {
  function getParameterByName(name) {
    var url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  function onload() {
    var reponame = getParameterByName('userid'),
        number = getParameterByName('number');

    if (reponame && number) {
      $.ajax({
        url: 'https://api.github.com/repos/' + reponame + '/issues/' + number,
        type: 'get',
        success: function (issue) {
          $div = $('.js-container');
          $div.find('.js-issue-title').text(issue.title);
          $div.find('.js-issue-number').text(issue.number);
          $div.find('.js-issue-status').text(issue.number);
          $div.find('.js-username').attr('href', '/user.html?userid=' + issue.user.login).text(issue.user.login);
          $div.find('.js-issue-creation').text("opened this issue on " + issue.created_at + "  " issue.comments + " comments");
          $div.find('.user-photo').attr('src', issue.user.avatar_url);
          $div.find('.js-comment-body').text(issue.body);
        }
      });
    }
  }
  onload();


  function issueVisited(issueId) {
    var issueCount = JSON.parse(localStorage.getItem(issueId));

    issueCount = issueCount ? issueCount + 1: 1;

    localStorage.setItem(issueId, issueCount); 
    $('.js-issue-visited-count').text(issueCount);
  }

  issueVisited($('.js-issue-minor-details').data('issueId'));
});