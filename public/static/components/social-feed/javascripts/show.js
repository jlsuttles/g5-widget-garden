(function() {
  var BlogFetcher, composeTweet, tweetTemplate;

  $(function() {
    var blogConfig, blogVars, twitterVars;
    blogVars = JSON.parse($('#blog-config').html());
    twitterVars = JSON.parse($('#twitter-config').html());
    blogConfig = new window.BlogConfig(blogVars);
    new window.BlogInterface($("#blog-feed .feed"), blogConfig);
    initTweets(twitterVars);
    if (blogVars.feedUrl !== '' && twitterVars.id !== '') {
      $('#blog-feed').hide();
      return $('.social-feed').on('click', '.feed-switch', function(e) {
        var feed;
        $('.social-feed .feed-switch').removeClass('active');
        $(this).addClass('active');
        feed = $(this).attr('href');
        $('#blog-feed, #twitter-feed').hide();
        $(feed).show();
        return false;
      });
    }
  });

  window.BlogConfig = (function() {
    function BlogConfig(config) {
      this.feedUrl = config.feedUrl, this.feedTitle = config.feedTitle, this.showAuthor = config.showAuthor, this.showEntrySummary = config.showEntrySummary, this.entriesToShow = config.entriesToShow;
    }

    return BlogConfig;

  })();

  BlogFetcher = (function() {
    function BlogFetcher(url) {
      this.url = url;
    }

    BlogFetcher.prototype.fetch = function() {
      var _this = this;
      return $.ajax({
        url: 'https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=3&callback=?&q=' + encodeURIComponent(this.url),
        dataType: 'json',
        success: function(data) {
          _this.feed = data.responseData.feed;
          return $(_this).trigger("feedReady");
        }
      });
    };

    return BlogFetcher;

  })();

  window.BlogInterface = (function() {
    function BlogInterface(list, config) {
      var fetcher,
        _this = this;
      this.list = list;
      this.config = config;
      fetcher = new BlogFetcher(this.config.feedUrl);
      $(fetcher).bind("feedReady", function(event) {
        return _this.updateDom(event);
      });
      fetcher.fetch();
    }

    BlogInterface.prototype.updateDom = function(event) {
      var entry, feed, innerText, jli, _i, _len, _ref, _results;
      feed = event.currentTarget.feed;
      if (this.config.feedTitle != null) {
        this.list.before("<h2 class=\"title\">" + this.config.feedTitle + "</h2>");
      }
      _ref = feed.entries;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        entry = _ref[_i];
        jli = $('<li class="h-entry hentry" itemscope itemtype="http://schema.org/BlogPosting">');
        innerText = "<a class='p-name entry-title u-url url' href=\"" + entry.link + "\" target=\"_blank\" itemprop='url'><span itemprop='headline'>" + entry.title + "</span></a><br />";
        if (this.config.showEntrySummary) {
          innerText += "<p class='p-summary summary' itemprop='description'>" + entry.contentSnippet + "</p>";
        }
        if (this.config.showAuthor) {
          innerText += "<p class='p-author author' itemprop='author'>Posted By: " + entry.author + "</p>";
        }
        jli.append(innerText);
        _results.push(this.list.append(jli));
      }
      return _results;
    };

    return BlogInterface;

  })();

  window.initTweets = function(twitterVars) {
    return $.ajax({
      url: "https://mobile.twitter.com/" + twitterVars.id,
      dataType: "html",
      type: "GET"
    }).done(function(data) {
      var avatar, tweets;
      tweets = $(".timeline .tweet:lt(" + twitterVars.count + ")", data.results[0]).toArray();
      avatar = $(".avatar:lt(1) img", data.results[0]);
      return composeTweet(data, tweets, avatar);
    });
  };

  composeTweet = function(twitterVars, tweets, avatar) {
    var composedTweets, twitterUrl;
    twitterUrl = "http://www.twitter.com";
    composedTweets = [];
    tweets.forEach(function(tweet) {
      var avatarUrl, replyHtml, timestamp, tweetHtml, url, user, userInfo, userName, userUrl;
      timestamp = $(tweet).find(".timestamp");
      user = timestamp.find("a").attr("href");
      avatarUrl = $(avatar[0]).attr('src');
      userName = $(tweet).find('.fullname').html();
      userUrl = twitterUrl + '/' + userName;
      url = twitterUrl + user;
      tweetHtml = $(tweet).find(".tweet-text");
      replyHtml = tweetHtml.find(".twitter-atreply");
      if ($(tweet).has('.context').length > 0) {
        userInfo = $(tweet).find('.tweet-header');
        avatarUrl = userInfo.find(".avatar img").attr("src");
        userName = userInfo.find(".fullname").html();
      }
      if (twitterVars.avatar === false) {
        avatarUrl = 'https://widgets.g5dxm.com/social-feed/icon-speech.png';
      }
      replyHtml.each(function() {
        return $(this).attr("href", twitterUrl + $(this).attr("href"));
      });
      return composedTweets.push(tweetTemplate(avatarUrl, userName, userUrl, tweetHtml.html(), url));
    });
    return $('#twitter-feed .tweet-list').append(composedTweets);
  };

  tweetTemplate = function(avatar, userName, userUrl, text, url) {
    return "<li><span class='tweet-avatar'><img src='" + avatar + "'/></span>  <a href=" + userUrl + " class='tweet-name' target='_blank'>" + userName + " says:</a>  <span class='tweet-text'> " + text + "</span></li>";
  };

}).call(this);
