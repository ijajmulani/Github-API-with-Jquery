$(function () {
  function issueVisited(issueId) {
    var issueCount = JSON.parse(localStorage.getItem(issueId));

    issueCount = issueCount ? issueCount + 1: 1;

    localStorage.setItem(issueId, issueCount); 
    $('.js-issue-visited-count').text(issueCount);
  }

  issueVisited($('.js-issue-minor-details').data('issueId'));
});