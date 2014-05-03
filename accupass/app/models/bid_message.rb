class BidMessage < ActiveRecord::Base
  attr_accessible :activity_name,:bid_id,:phone,:user_name,:price,:current_user
  def self.update_bid_messages(current_user,bid_messages)
    BidMessage.delete_all(:current_user =>current_user)
    bid_messages.each do |(key,value)|
      BidMessage.create(value)
    end
  end
end
