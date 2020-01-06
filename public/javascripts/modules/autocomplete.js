function autocomplete(input, latInput, lngInput) {
  if (!input) return;

  const autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.setFields(["address_component", "geometry"]);

  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    latInput.value = place.geometry.location.lat();
    lngInput.value = place.geometry.location.lng();
  });

  input.on("keydown", e => {
    if (e.keyCode === 13) e.preventDefault();
  });
}

export default autocomplete;
