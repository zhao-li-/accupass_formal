class AddColumnToBidMessages < ActiveRecord::Migration
  def change
    add_column :bid_messages, :activity_name, :string
    add_column :bid_messages, :bid_id, :string
    add_column :bid_messages, :phone, :string
    add_column :bid_messages, :user_name, :string
    add_column :bid_messages, :price, :string
    add_column :bid_messages, :current_user, :string
  end
end
