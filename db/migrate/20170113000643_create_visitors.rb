class CreateVisitors < ActiveRecord::Migration[5.0]
  def change
    create_table :visitors do |t|
      t.string :name
      t.string :specimen_id
      t.date :dob

      t.timestamps
    end
  end
end
