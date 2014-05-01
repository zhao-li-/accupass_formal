class CreateBids < ActiveRecord::Migration
  def change
    create_table :bids do |t|
      t.string :activity_name
      t.string :current_user
      t.string :bid_id
      t.string :people_count

      t.timestamps
    end
  end
end
