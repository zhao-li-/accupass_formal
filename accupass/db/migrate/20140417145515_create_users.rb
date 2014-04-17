class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :user_name
      t.string :password_digest
      t.string :token
      t.string :forget_question
      t.string :forget_answer

      t.timestamps
    end
  end
end
