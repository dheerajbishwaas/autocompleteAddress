function initMap() {
  var input = document.getElementById("address");
  var autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.addListener("place_changed", function () {
    var place = autocomplete.getPlace();

    getAddressFromPlace(place);
  });
}

function getAddressFromPlace(place) {
  $(".latitude").val(place.geometry.location.lat());
  $(".longitude").val(place.geometry.location.lng());

  streetAddressArr = [];
  for (var j = 0; j < place.address_components.length; j++) {
    for (var k = 0; k < place.address_components[j].types.length; k++) {
      if (place.address_components[j].types[k] == "locality") {
        city = place.address_components[j].short_name;
        $(".city").val(city);
      }
      if (place.address_components[j].types[k] == "postal_code") {
        zipcode = place.address_components[j].short_name;
        $(".zipcode").val(zipcode);
      }
      if (place.address_components[j].types[k] == "country") {
        country = place.address_components[j].long_name;
        $(".country").val(country);
      }
      if (
        place.address_components[j].types[k] == "administrative_area_level_1"
      ) {
        state = place.address_components[j].short_name;
        $(".state").val(state);
      }
      if (place.address_components[j].types[k] == "street_number") {
        streetAddressArr[0] = place.address_components[j].long_name;
      }
      if (place.address_components[j].types[k] == "route") {
        streetAddressArr[1] = place.address_components[j].short_name;
      }
    }
  }

  streetAddress = streetAddressArr.join(" ").trim();
  $(".streetaddress").val(streetAddress);

  if (
    $("#city").val() == "" ||
    $("#country").val() == "" ||
    $("#state").val() == "" ||
    $("#street_address").val() == ""
  ) {
    $(".address_error").text(
      "Please enter a more specific address and select from the dropdown"
    );
  } else {
    $(".address_error").text("");
  }
}

const signIn = document.querySelector(".form-signin");
var BASEURL = "https://app.dentulu.com/";

signIn.addEventListener("submit", async (e) => {
  e.preventDefault();
  let isChecked = $("#inlineCheckbox1").is(":checked");
  if (isChecked == true) {
    var check_st = 1;
  } else {
    var check_st = "";
  }

  let formData = new FormData(signIn);
  formData.append("agree", check_st);
  $("#loading").show();
  formData.append("add", "Add");
  try {
    let response = await fetch(BASEURL + "api/v2/auth/patientRegister", {
      method: "POST",
      body: formData,
    });

    let result = await response.json();
    $("#loading").hide();
    if (result.status === 0) {
      const myAllClass = document.querySelectorAll(".error");
      for (const myClass of myAllClass) {
        myClass.innerHTML = "";
      }

      if (result.type === "form") {
        for (const [key, value] of Object.entries(result.message)) {
          $("." + key + "_error").html(value);
        }
      } else if (result.type === "register") {
        showMessage("register_status", "danger", result.message);
      }
    } else if (result.status == 1) {
      $("#registerSuccess").modal("show");
      $(".successMessage").text(result.message);
      window.setTimeout(function () {
        window.location.href = result.redirectURL;
      }, 3000);
    } else if (result.status == 2) {
      window.location.href = result.redirectURL;
    }
  } catch (e) {
    console.log("Error: ", e);
  }
});
// checked // onec again