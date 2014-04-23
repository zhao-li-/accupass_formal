class AdminController < ApplicationController
  def add_user
    @user = User.new
  end

  def del_user
  end

  def manager_index
    @users = User.where("id > 31").paginate(page: params[:page],per_page: 10)
  end
end
