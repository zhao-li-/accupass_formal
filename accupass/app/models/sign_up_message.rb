class SignUpMessage < ActiveRecord::Base
  attr_accessible :user_name,:phone,:activity_name,:current_user
  def self.update_sign_up_messages(current_user,sign_up_messages)
    SignUpMessage.delete_all(:current_user =>current_user)
    sign_up_messages.each do |(key,value)|
      SignUpMessage.create(value)
    end

  end
end
