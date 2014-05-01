class Bid < ActiveRecord::Base
  attr_accessible :activity_name,:bid_id,:people_count,:current_user
  def self.update_bids(current_user,bids)
    Bid.delete_all(:current_user =>current_user)
    bids.each do |(key,value)|
      Bid.create(value)
    end

  end
end
