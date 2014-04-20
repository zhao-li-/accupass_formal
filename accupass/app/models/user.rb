class User < ActiveRecord::Base
  has_secure_password
  attr_accessible :user_name, :password, :password_confirmation, :forget_question, :forget_answer, :token
  before_create{generate_token(:token)}
  validates :user_name, :presence => true, :uniqueness => {:case_sensitive => false}
  validates :forget_question, :presence => true
  validates :forget_answer, :presence => true

  def generate_token(column)
    begin
      self[column]=SecureRandom.urlsafe_base64
    end while User.exists?(column=>self[column])
  end


end