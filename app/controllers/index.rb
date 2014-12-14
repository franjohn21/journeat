require 'yelp'

$yelp = Yelp::Client.new({
  consumer_key: "ABHseWQ2ikV5ke6mpU-6-A",
  consumer_secret: "2EFEJD4UYc2k9D_nhfUZU3BYszA",
  token: "U8l06FytOYvxYf68d-EFPl-L7buOKTEa",
  token_secret: "vWr4aIV3iwgib9F9mrTHKFTob_E"
})

get '/' do
  File.read(File.join('public', 'index.html'))
end

post '/search' do


  # bounding_box = {
  #   sw_latitude: [params[:start_lat].to_f, params[:end_lat].to_f].min,
  #   sw_longitude: [params[:start_lng].to_f, params[:end_lng].to_f].min,
  #   ne_latitude: [params[:start_lat].to_f, params[:end_lat].to_f].max,
  #   ne_longitude: [params[:start_lng].to_f, params[:end_lng].to_f].max
  # }

  results = []
   params[:coords].each do |coord|
    response = $yelp.search_by_coordinates(coord[1], { term: params[:term], radius_filter: params[:radius] })
    response.businesses.each do |business|
      results.push({
        "name" => business.name,
        "lat" => business.location.coordinate.latitude,
        "lng" => business.location.coordinate.longitude
      })
    end
  end

  content_type :json
  results.to_json
end
