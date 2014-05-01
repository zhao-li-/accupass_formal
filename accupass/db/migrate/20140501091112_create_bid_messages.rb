class CreateBidMessages < ActiveRecord::Migration
  def change
    create_table :bid_messages do |t|

      t.timestamps
    end
  end
end
