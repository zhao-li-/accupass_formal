class CreateActivities < ActiveRecord::Migration
  def change
    create_table :activities do |t|
      t.string :activity_name
      t.integer :sign_up_counts
      t.integer :bid_counts

      t.timestamps
    end
  end
end
