class BidMessage < ActiveRecord::Base
  attr_accessible :activity_name,:bid_id,:phone,:user_name,:price,:current_user

  def self.update_bid_messages(current_user,bid_messages)
    BidMessage.delete_all(:current_user =>current_user)
    bid_messages.each do |(key,value)|
      BidMessage.create(value)
    end
  end

  def self.get_bid_messages(bid_id,activity_name,current_user)
    return BidMessage.where(:bid_id => bid_id,:activity_name=>activity_name,:current_user => current_user)
  end

  def self.get_price_static(bid_id,activity_name,current_user)
    return BidMessage.get_bid_messages(bid_id,activity_name,current_user).group_by{|message|message.price}.map { |key,value|{price: key,count: value.length}}
  end

  def self.get_winner(bid_id,activity_name,current_user)
    price_static=BidMessage.get_price_static(bid_id,activity_name,current_user)
    return price_static.sort_by { |static|static[:price].to_i}.find{|static|static[:count] == 1}
  end

  def self.get_winner_message(bid_id,activity_name,current_user)
    winner=BidMessage.get_winner(bid_id,activity_name,current_user)
    return BidMessage.find_by_price(winner[:price])
  end
end
