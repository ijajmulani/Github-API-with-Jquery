$(function () {

  function onload() {
    var reponame = Helper.getParameterByName('reponame'),
        number = Helper.getParameterByName('number');

    if (reponame && number) {
      $.ajax({
        url: 'https://api.github.com/repos/' + reponame + '/issues/' + number,
        type: 'get',
        success: function (issue) {
          $div = $('.js-container');
          $div.find('.js-issue-title').text(issue.title);
          $div.find('.js-issue-number').text(" #"+issue.number);
          $div.find('.js-issue-state').text(issue.state);
          $div.find('.js-user-photo').attr('src', issue.user.avatar_url);
          
          $div.find('.js-username').attr('href', '/user.html?userid=' + issue.user.login).text(issue.user.login);
          $div.find('.js-issue-creation').text(" opened this issue on " + Helper.dateFormat(issue.created_at) + "  " + issue.comments + "comments");

          $div.find('.js-comment-date').text(" commented on " + Helper.dateFormat(issue.created_at));
          
          $div.find('.user-photo').attr('src', issue.user.avatar_url);
          $div.find('.js-comment-body').text(issue.body);
          $div.find('.js-issue-minor-details').attr('data-issue-id', issue.id);
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
