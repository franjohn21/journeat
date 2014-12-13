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
  bounding_box = {
    sw_latitutde: params[:sw_lat],
    sw_longitude: params[:sw_long],
    ne_latitutde: params[:ne_lat],
    ne_longitude: params[:ne_long],
  }

  results = $yelp.search_by_bounding_box(bounding_box, { term: params[:term] })
end
