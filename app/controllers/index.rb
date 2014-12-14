require 'yelp'

$yelp = Yelp::Client.new({
  consumer_key: "ABHseWQ2ikV5ke6mpU-6-A",
  consumer_secret: "2EFEJD4UYc2k9D_nhfUZU3BYszA",
  token: "U8l06FytOYvxYf68d-EFPl-L7buOKTEa",
  token_secret: "vWr4aIV3iwgib9F9mrTHKFTob_E"
})

# response = $yelp.search("coffee San Francisco, CA")
# p response.businesses[0].image_url
# p response.businesses[0].rating_img_url
# p response.businesses[0].snippet_text

get '/' do
  File.read(File.join('public', 'index.html'))
end

post '/search' do
  results = []
  params[:coords].each do |coord|
    response = $yelp.search_by_coordinates(coord[1], { term: params[:term], radius_filter: params[:radius] })
    response.businesses[0..4].each do |business|
      results.push({
        "name" => business.name,
        "lat" => business.location.coordinate.latitude,
        "lng" => business.location.coordinate.longitude,
        "image" => business.keys.include?("image_url") ? business.image_url : "",
        "rating_image" => business.keys.include?("rating_img_url") ?  business.rating_img_url : "",
        "snippet" => business.keys.include?("snippet_text") ?  business.snippet_text : "",
        "url" => business.url,
        "rating" => business.rating
      })
    end
  end

  content_type :json
  results.to_json
end
