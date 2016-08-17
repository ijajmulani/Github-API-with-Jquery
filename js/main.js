$(function () {
  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  function debounce (wait, func, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  };

  
  function hideSearchArea(){
    var mouse_inside_search = false;
    $('.search-box').hover(function(){ 
      mouse_inside_search = true; 
    }, function(){ 
      mouse_inside_search = false; 
    });
    if(! mouse_inside_search){
      $('#searchSuggestions').addClass('hide');
      $('.js-search-box').removeClass('search-box-open');
      $('.js-search-input').removeClass('search-input');
    }
  }

  //Hide Search Area when clicked outside
  $("body").mouseup(function(){ 
    hideSearchArea();
  });
  
  //Search item navigation
  $('.search-box').on('focus', 'li', function() {
    var $this = $(this);
    $this.addClass('hover-search-item').siblings().removeClass('hover-search-item');
  }).on('keydown', 'li', function(e) {
    e.preventDefault();
    var charCode = String.fromCharCode(e.which).toLowerCase(),
      $input = $('#searchInput'),
      $this = $(this);
    if (e.keyCode === 40) {
      $this.next().focus();
    } else if (e.keyCode === 38) {
      $this.prev().focus();
    } else if (e.keyCode === 13) {
      $this.find('a')[0].click();
    } else {
      $input.val($input.val() + charCode).focus();
    }
  });

  $('#searchInput').on('keydown', function(e) {
    if (e.keyCode === 40) {
      $('.search-list-item').first().focus();
      return false;
    } else if (e.keyCode === 38) {
      $('.search-list-item').last().focus();
      return false;
    } 
  });

  // Search on input
  $('#searchInput').on('keyup', debounce(250, function() {
    var $search = $(this),
        searchKey = $search.val();

    if (searchKey.length >= 3 ) {
      $.ajax({
        url: 'https://api.github.com/search/repositories?q=' + searchKey,
        type: 'get',
        success: function (data) {
          var $searchSuggestions = $('#searchSuggestions');

          if (data.items.length > 0) {
            var searchTemplate = '<li class="search-list-item js-search-list-item" tabindex="" data-repo-name="" data-full-name=""> <a class="searchListElement js-search search-item" href="/" ></a> </li>',
            $searchTemplate = $(searchTemplate),
            htmlData = "";


            $.each(data.items, function (key, value) {
              $div = $searchTemplate.clone();
              $div.attr('tabindex', key + 1);
              $div.data('repoName', value.name);
              $div.data('fullName', value.full_name);
              $div.find('.js-search').text(value.full_name);
              htmlData += $div[0].outerHTML;

              if (key == 6) {
                return false;
              };
            });

            $searchSuggestions.html(htmlData).removeClass('hide');
            $('.js-search-box').addClass('search-box-open');
            $('.js-search-input').addClass('search-input');
          }
        }
      });
    }
  }));

  $('html').on('click', '.js-search', function(e) {
    e.preventDefault();
    var $searchBox = $(this),
        searchKey = $(this).closest('.js-search-list-item').data('fullName'),
        today = new Date(),
        dd = today.getDate(),
        mm = today.getMonth() + 1,
        yyyy = today.getFullYear();
        
    if (dd < 10) {
        dd='0'+dd;
    } 
    if(mm < 10) {
        mm='0'+mm;
    } 
    today = yyyy+'-'+mm+'-'+dd;

    $('.js-repo-name').text(searchKey);

    $.ajax({
      url: 'https://api.github.com/search/issues?q=+state:open+created:'+ today +'+type:issue+repo:' + searchKey,
      type: 'get',
      success: function (data) {
        var $issuesTable = $('.js-issues-table');
        // $issuesTable.html(data);
        $issuesTable.load("templates/search_issues.html", function(data) {
          $issuesTableTemplate = $(".js-issues-template").remove();
          $rows = $issuesTableTemplate.find('.js-table-row').remove();

          $.each(data.items, function (key, issue) {
            $div = $rows.clone();
            $div.find('.js-issue-title').href('/issue/searchKey/' + issue.number);
            $div.find('.js-issue-title').data('number', issue.number).data('repoName', searchKey).text(issue.title);
            $div.find('.js-issue-description').text(issue.body);
            $div.find('a').href('/user/' + issue.user.login);
            $div.find('img').src(issue.user.avatar_url);
        
            $div.data('repoName', value.name);
            $div.data('fullName', value.full_name);
            $div.find('.js-search').text(value.full_name);
            htmlData += $div[0].outerHTML;
          });
        });
      }
    });
  });

  $('.js-issues-table').on('click', 'js-repo-title', function(e) {
    e.preventDefault();
    var $this = $(this),
        url = $this.find('a').data('url');
  });
});
