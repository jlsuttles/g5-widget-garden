(function() {
  var customizeUnitGrid, initializeUnitGrid, populateUnitData;

  populateUnitData = (function() {
    var bedroomMarkup, buildHTML, svgIconMarkup;

    function populateUnitData(floorplanConfig) {
      var dataFeed;
      dataFeed = floorplanConfig['floorplanDataFeed'];
      $.getJSON(dataFeed, function(unitData) {
        return buildHTML(unitData, floorplanConfig);
      }).then(function(response) {
        return new customizeUnitGrid(floorplanConfig);
      });
    }

    buildHTML = function(unitData, floorplanConfig) {
      var floorplan, index, unitsDiv, unitsMarkup;
      unitsDiv = $('.floorplans-cards').first();
      unitsMarkup = "";
      for (index in unitData) {
        floorplan = unitData[index];
        unitsMarkup += "<div class='floorplan-card'>                        <div class='floorplan-card-title'>" + floorplan["title"] + "</div>                        <a href='" + floorplan["image_url"] + "' class='floorplan-view-link'>                          " + (svgIconMarkup(floorplanConfig["accentColor2"])) + "                          <div>View<span></span></div>                        </a>                        <div class='unit-details'>                          <div class='unit-beds'>" + (bedroomMarkup(floorplan["beds"])) + "</div>                          <div class='unit-baths'><span>" + floorplan["baths"] + "</span> Bathroom</div>                          <div class='unit-size'>" + floorplan["size"] + " Sq. Ft.</div>                          <div class='unit-rate'>From <span>$" + floorplan["price"] + "</span></div>                        </div>                        <a href='" + floorplan["price_url"] + "' class='unit-cta-button'>" + floorplanConfig["ctaText"] + "</a>                      </div>";
      }
      return unitsDiv.append(unitsMarkup);
    };

    bedroomMarkup = function(bedrooms) {
      if (bedrooms > 0) {
        return "<span>" + bedrooms + "</span> Bedroom";
      } else {
        return "<span>S</span> Studio";
      }
    };

    svgIconMarkup = function(color) {
      var svgMarkup;
      return svgMarkup = "<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='77px' height='111px' viewBox='0 0 77 111' enable-background='new 0 0 77 111' xml:space='preserve'>                    <line fill='none' stroke='" + color + "' stroke-width='3' stroke-miterlimit='10' x1='1.5' y1='0' x2='1.5' y2='111'/>                    <line fill='none' stroke='" + color + "' stroke-width='3' stroke-miterlimit='10' x1='0' y1='109.5' x2='77' y2='109.5'/>                    <line fill='none' stroke='" + color + "' stroke-width='3' stroke-miterlimit='10' x1='75.564' y1='0' x2='75.436' y2='111'/>                    <line fill='none' stroke='" + color + "' stroke-width='3' stroke-miterlimit='10' x1='76.925' y1='1.5' x2='34.075' y2='1.5'/>                    <line fill='none' stroke='" + color + "' stroke-width='3' stroke-miterlimit='10' x1='17.934' y1='1.5' x2='0' y2='1.5'/>                    <line fill='none' stroke='" + color + "' stroke-width='3' stroke-miterlimit='10' x1='50' y1='0' x2='50' y2='22.997'/>                    <line fill='none' stroke='" + color + "' stroke-width='3' stroke-miterlimit='10' x1='50' y1='69.973' x2='50' y2='111'/>                    <line fill='none' stroke='" + color + "' stroke-width='3' stroke-miterlimit='10' x1='35.694' y1='1.5' x2='26.171' y2='17.721'/>                    <line fill='none' stroke='" + color + "' stroke-width='3' stroke-miterlimit='10' x1='50' y1='71.518' x2='29.774' y2='71.646'/>                    <line fill='none' stroke='" + color + "' stroke-width='3' stroke-miterlimit='10' x1='31.25' y1='71.518' x2='31.25' y2='95.842'/>                    <line fill='none' stroke='" + color + "' stroke-width='3' stroke-miterlimit='10' x1='0' y1='71.518' x2='17.934' y2='71.518'/>                    <circle fill='" + color + "' cx='16.519' cy='5.495' r='1.416'/>                    <circle fill='" + color + "' cx='18.578' cy='8.841' r='1.416'/>                    <circle fill='" + color + "' cx='20.578' cy='12.316' r='1.416'/>                    <circle fill='" + color + "' cx='23.409' cy='15.147' r='1.416'/>                  </svg>";
    };

    return populateUnitData;

  })();

  customizeUnitGrid = (function() {
    var setAccents1, setAccents2, setCtaColor, setHeadingColor;

    function customizeUnitGrid(colorConfigurations) {
      setHeadingColor(colorConfigurations['headingColor']);
      setCtaColor(colorConfigurations['ctaColor'], colorConfigurations['accentColor1']);
      setAccents1(colorConfigurations['accentColor1']);
      setAccents2(colorConfigurations['accentColor2']);
      $(".floorplan-view-link").fancybox();
    }

    setHeadingColor = function(color) {
      return $('.floorplan-card-title').css('background-color', color);
    };

    setCtaColor = function(color, hoverColor) {
      var ctaButtons;
      ctaButtons = $('.unit-cta-button');
      ctaButtons.css('background-color', color);
      return ctaButtons.hover(function() {
        return $(this).css('background-color', hoverColor);
      }, function() {
        return $(this).css('background-color', color);
      });
    };

    setAccents1 = function(color) {
      return $('.floorplan-view-link span').css('background-color', color);
    };

    setAccents2 = function(color) {
      return $('.unit-beds span, .unit-baths span, .floorplan-view-link div').css('background-color', color);
    };

    return customizeUnitGrid;

  })();

  initializeUnitGrid = (function() {
    var floorplanConfig;

    function initializeUnitGrid() {}

    floorplanConfig = JSON.parse($('#floorplan-cards-config').html());

    new populateUnitData(floorplanConfig);

    return initializeUnitGrid;

  })();

}).call(this);
