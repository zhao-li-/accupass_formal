class Bid < ActiveRecord::Base
  attr_accessible :activity_name,:bid_id,:people_count,:current_user,:status

  def self.update_bids(current_user,bids)
    Bid.delete_all(:current_user =>current_user)
    bids.each do |(key,value)|
      Bid.create(value)
    end
  end

  def self.get_bid(bid_id,activity_name,current_user)
    return Bid.find_by(:bid_id => bid_id,:activity_name=>activity_name,:current_user => current_user)
  end

  def self.get_start_bid
    Bid.find_by_status("start")
  end
end
