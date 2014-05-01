class CreateSignUpMessages < ActiveRecord::Migration
  def change
    create_table :sign_up_messages do |t|
      t.string :user_name
      t.string :phone
      t.string :activity_name
      t.string :current_user

      t.timestamps
    end
  end
end
