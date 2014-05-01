# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20140501095716) do

  create_table "activities", force: true do |t|
    t.string   "activity_name"
    t.integer  "sign_up_counts"
    t.integer  "bid_counts"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "user_name"
  end

  create_table "admins", force: true do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "bid_messages", force: true do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "activity_name"
    t.string   "bid_id"
    t.string   "phone"
    t.string   "user_name"
    t.string   "price"
    t.string   "current_user"
  end

  create_table "bids", force: true do |t|
    t.string   "activity_name"
    t.string   "current_user"
    t.string   "bid_id"
    t.string   "people_count"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "sign_up_messages", force: true do |t|
    t.string   "user_name"
    t.string   "phone"
    t.string   "activity_name"
    t.string   "current_user"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", force: true do |t|
    t.string   "user_name"
    t.string   "password_digest"
    t.string   "token"
    t.string   "forget_question"
    t.string   "forget_answer"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "admin",           default: false
    t.integer  "index"
  end

end
