(function() {
  $(function() {
    var tweetOptions;
    tweetOptions = JSON.parse($('.twitter-feed .config:first').html());
    return $.ajax({
      url: "https://mobile.twitter.com/" + tweetOptions.id,
      dataType: "html",
      type: "GET"
    }).done(function(data) {
      var avatar, tweets;
      tweets = $(".timeline .tweet:lt(" + tweetOptions.count + ")", data.results[0]).toArray();
      avatar = $(".avatar:lt(1) img", data.results[0]);
      return tweets.forEach(function(tweet) {
        var atReply, atReplyUser, tweetAvatar, tweetTemplate, tweetText, tweetTime, tweetTimestamp, tweetUrl;
        atReply = $(tweet).find(".tweet-text .twitter-atreply");
        atReplyUser = function() {
          var replyTemplates;
          replyTemplates = [];
          atReply.each(function(reply) {
            var fullReply, replyText, replyUrl, template;
            fullReply = atReply.get(reply);
            replyUrl = 'http://www.twitter.com' + $(fullReply).attr("href");
            replyText = $(fullReply).text();
            template = "<a href='" + replyUrl + "' target='_blank'>" + replyText + "</a> ";
            return replyTemplates.push(template);
          });
          return replyTemplates.join(" ");
        };
        tweetText = $(tweet).find(".tweet-text p").text();
        tweetTimestamp = $(tweet).find(".timestamp");
        tweetTime = tweetTimestamp.text();
        tweetAvatar = $(avatar[0]).attr('src');
        tweetUrl = "http://www.twitter.com" + tweetTimestamp.find("a").attr("href");
        tweetTemplate = "<li><img class='tweet-avatar' src='" + tweetAvatar + "'/>        <span class='tweet-text'> " + atReplyUser() + tweetText + "<a href=" + tweetUrl + " class='tweet-date' target='_blank'>" + tweetTime + " ago</a></span></li>";
        if (tweetOptions.avatar !== true) {
          $('.tweet-avatar').hide();
        }
        return $('.tweet-list').append(tweetTemplate);
      });
    });
  });

}).call(this);
