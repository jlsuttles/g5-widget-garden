(function() {
  var pricingAndAvailability;

  pricingAndAvailability = (function() {
    function pricingAndAvailability(pricingOptions) {
      var cpas_urn, heroku_app_name_max_length, location_urn;
      heroku_app_name_max_length = 30;
      cpas_urn = pricingOptions["clientUrn"].replace(/-c-/, "-cpas-");
      cpas_urn = cpas_urn.substring(0, heroku_app_name_max_length);
      location_urn = pricingOptions["locationUrn"];
      if (cpas_urn && location_urn) {
        this.getPricing(cpas_urn, location_urn);
      }
    }

    pricingAndAvailability.prototype.getPricing = function(cpas_urn, location_urn) {
      var floorplanContainer, loader, pricingURL;
      pricingURL = "http://" + cpas_urn + ".herokuapp.com/locations/" + location_urn;
      floorplanContainer = $('.floorplans');
      loader = '<div id="loading-floorplans"><div class="loader">Loading&hellip;</div>Loading Pricing &amp; Availibility Information&hellip;</div>';
      return $.ajax({
        type: "GET",
        url: pricingURL,
        success: function(data) {
          var $data, floorplanList, floorplans, floorplansHeight;
          floorplanContainer.hide();
          $("[role=main]").append(loader);
          $data = $(data);
          floorplanList = $data.find(".e-content");
          floorplanContainer.append(floorplanList).fadeIn();
          $("#loading-floorplans").fadeOut().remove();
          floorplansHeight = floorplanContainer.outerHeight();
          floorplanContainer.css('height', floorplansHeight);
          floorplans = $(".floorplan");
          $('.filters input[type=radio]').each(function() {
            var klass;
            klass = $(this).attr('id');
            if (!(floorplans.hasClass(klass) || klass.match(/^\w+-all/))) {
              return $(this).prop("disabled", true).next().addClass('disabled');
            }
          });
          $(".filters input").on("change", function(e) {
            var bathFilter, bathSelector, bedFilter, bedSelector;
            bedFilter = $("#beds-filter input:checked").val();
            bathFilter = $("#baths-filter input:checked").val();
            bedSelector = "";
            bathSelector = "";
            if (bedFilter === "beds-all" && bathFilter === "baths-all") {
              return floorplans.fadeIn();
            } else {
              if (bedFilter !== "beds-all") {
                bedSelector = "." + bedFilter;
              }
              if (bathFilter !== "baths-all") {
                bathSelector = "." + bathFilter;
              }
              floorplans.fadeOut();
              return $(bedSelector + bathSelector).fadeIn("fast");
            }
          });
          return $(".floorplans .floorplan-btn").fancybox();
        }
      });
    };

    return pricingAndAvailability;

  })();

  $(function() {
    var pricingOptions;
    $.getScript("http://g5-widget-garden.herokuapp.com/javascripts/libs/fancybox/jquery.fancybox.pack.js");
    pricingOptions = JSON.parse($('.floorplans .config:first').html());
    return new pricingAndAvailability(pricingOptions);
  });

}).call(this);
