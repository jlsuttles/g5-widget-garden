(function() {
  var phoneNumber;

  phoneNumber = (function() {
    function phoneNumber(phoneOptions) {
      var client_urn, location_urn;
      $(".p-tel").css("visibility", "hidden");
      client_urn = phoneOptions["clientUrn"].replace(/^g5-c-/, "g5-cpns-");
      location_urn = phoneOptions["locationUrn"];
      if (client_urn && location_urn) {
        this.getPhoneNumber(client_urn, location_urn);
      }
      $(".p-tel").css("visibility", "visible");
    }

    phoneNumber.prototype.getPhoneNumber = function(client_urn, location_urn) {
      var row_id;
      row_id = "#" + location_urn;
      return $.get("http://" + client_urn + ".herokuapp.com", function(data) {
        var $data, formattedPhone, numbers, phone, screen;
        $data = $(data);
        numbers = $data.find(row_id);
        screen = document.documentElement.clientWidth;
        phone = void 0;
        if (localStorage["ppc"]) {
          phone = numbers.find(".p-tel-ppc").val();
        } else if (screen < 768) {
          phone = numbers.find(".p-tel-mobile").val();
        } else {
          phone = numbers.find(".p-tel-default").val();
        }
        formattedPhone = phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
        return $(".phone.widget").attr("href", "tel://" + phone).find(".p-tel").html(formattedPhone);
      });
    };

    return phoneNumber;

  })();

  $(function() {
    var phoneOptions;
    phoneOptions = JSON.parse($('#phone-number-config:first').html());
    return new phoneNumber(phoneOptions);
  });

}).call(this);