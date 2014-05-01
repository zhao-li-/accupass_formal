class Activity < ActiveRecord::Base
  attr_accessible :activity_name,:sign_up_counts,:bid_counts,:user_name

  def self.update_activities(user_name,activities)
    Activity.delete_all(:user_name =>user_name)
    activities.each do |(key,value)|
      Activity.create(value)
    end

  end
end
