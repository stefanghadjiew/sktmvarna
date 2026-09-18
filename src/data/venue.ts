type Coordinates = { lat: number; lng: number }

/**
 * Where the hall is, and the Google Maps links built from it.
 */
export const venue = {
  /**
   * Google's keyless embed only drops a marker when it can resolve its query
   * to one specific place. The club's name isn't in Google's index and the
   * street on its own doesn't geocode, so a text query gives the right
   * neighbourhood with no pin on it.
   *
   * Filling this in switches the embed to pinning by position, which always
   * draws the marker and puts it on the actual building. To get the numbers:
   * open the hall in Google Maps, right-click the building, and click the
   * `43.xxxxxx, 27.xxxxxx` at the top of the menu to copy the pair.
   */
  coordinates: { lat: 43.2266, lng: 27.848 } as Coordinates | null,
  /** Used until `coordinates` is filled in, and for the directions link. */
  searchQuery: 'ул. Западна индустриална, ЗПЗ, Варна, България',
  zoom: 17,
}

/** Coordinates pin exactly; the address only centres the map. */
function mapQuery() {
  return venue.coordinates
    ? `${venue.coordinates.lat},${venue.coordinates.lng}`
    : venue.searchQuery
}

/**
 * The keyless embed endpoint — no Maps JavaScript API key and no billing
 * account, at the cost of not being able to restyle the map.
 */
export function venueEmbedUrl(language: string) {
  const params = new URLSearchParams({
    q: mapQuery(),
    hl: language,
    z: String(venue.zoom),
    output: 'embed',
  })
  return `https://www.google.com/maps?${params}`
}

/** Opens the same place in the Maps app or site, ready for directions. */
export function venueMapsUrl() {
  const params = new URLSearchParams({ api: '1', query: mapQuery() })
  return `https://www.google.com/maps/search/?${params}`
}
