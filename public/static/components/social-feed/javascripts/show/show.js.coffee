$ ->

  # Get feed config options
  blogVars = JSON.parse($('#blog-config').html())
  twitterVars = JSON.parse($('#twitter-config').html())

  # Blog feed setup
  blogConfig = new window.BlogConfig(blogVars)
  new window.BlogInterface($("#blog-feed .feed"), blogConfig)

  # Twitter feed setup
  initTweets(twitterVars)

  # Set up tabs
  if blogVars.feedUrl != '' && twitterVars.id != ''
    $('#blog-feed').hide()

    $('.social-feed').on 'click', '.feed-switch', (e) ->
      $('.social-feed .feed-switch').removeClass('active')
      $(this).addClass('active')
      feed = $(this).attr('href')
      $('#blog-feed, #twitter-feed').hide()
      $(feed).show()
      return false



class window.BlogConfig
  constructor: (config) ->
    {@feedUrl, @feedTitle, @showAuthor, @showEntrySummary, @entriesToShow} = config

class BlogFetcher
  constructor: (@url) ->

  fetch: ->
    $.ajax
      url: 'https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=3&callback=?&q=' + encodeURIComponent(@url)
      dataType: 'json'
      success: (data) =>
        @feed = data.responseData.feed
        $(this).trigger("feedReady")

class window.BlogInterface
  constructor: (@list, @config) ->
    fetcher = new BlogFetcher(@config.feedUrl)
    $(fetcher).bind("feedReady", (event) => @updateDom(event))
    fetcher.fetch()

   updateDom: (event) ->
     feed = event.currentTarget.feed
     @list.before("<h2 class=\"title\">#{@config.feedTitle}</h2>") if @config.feedTitle?
     for entry in feed.entries
       jli = $('<li class="h-entry hentry" itemscope itemtype="http://schema.org/BlogPosting">')
       innerText = "<a class='p-name entry-title u-url url' href=\"#{entry.link}\" target=\"_blank\" itemprop='url'><span itemprop='headline'>#{entry.title}</span></a><br />"
       innerText += "<p class='p-summary summary' itemprop='description'>#{entry.contentSnippet}</p>" if @config.showEntrySummary
       innerText += "<p class='p-author author' itemprop='author'>Posted By: #{entry.author}</p>" if @config.showAuthor
       jli.append(innerText)
       @list.append(jli)

window.initTweets = (twitterVars) ->
 $.ajax(
    url: "https://mobile.twitter.com/" + twitterVars.id
    dataType: "html"
    type: "GET"
  ).done (data) ->
    tweets = $(".timeline .tweet:lt(" + twitterVars.count + ")", data.results[0]).toArray()
    avatar = $(".avatar:lt(1) img", data.results[0])

    composeTweet(data, tweets, avatar)

composeTweet = (twitterVars, tweets, avatar) ->
  twitterUrl = "http://www.twitter.com"
  composedTweets = []

  tweets.forEach (tweet) ->
    timestamp = $(tweet).find(".timestamp")
    user = timestamp.find("a").attr("href")
    avatarUrl = $(avatar[0]).attr('src')
    userName = $(tweet).find('.fullname').html()
    userUrl = twitterUrl + '/' + userName
    url = twitterUrl + user
    tweetHtml = $(tweet).find(".tweet-text")
    replyHtml = tweetHtml.find(".twitter-atreply")

    # Handle Retweets
    if $(tweet).has('.context').length > 0
      userInfo = $(tweet).find('.tweet-header')
      avatarUrl = userInfo.find(".avatar img").attr("src")
      userName = userInfo.find(".fullname").html()

    if twitterVars.avatar is false
      avatarUrl = 'https://widgets.g5dxm.com/social-feed/icon-speech.png'

    # Handle Replies
    replyHtml.each ->
      $(this).attr("href", twitterUrl + $(this).attr("href"))

    composedTweets.push(tweetTemplate(avatarUrl, userName, userUrl, tweetHtml.html(), url))

  $('#twitter-feed .tweet-list').append(composedTweets)

tweetTemplate = (avatar, userName, userUrl, text, url) ->
  "<li><span class='tweet-avatar'><img src='" + avatar + "'/></span>
  <a href=" + userUrl + " class='tweet-name' target='_blank'>" + userName + " says:</a>
  <span class='tweet-text'> " + text +
  "</span></li>"
