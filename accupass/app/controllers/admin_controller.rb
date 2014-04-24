class AdminController < ApplicationController
  def add_user
    if !current_user
      redirect_to :login
    end
    @user = User.new
  end

  def del_user
    User.find_by_user_name(params[:user_name]).delete
    redirect_to :manager_index
  end

  def manager_index
    if !current_user
      redirect_to :login
    end
    @users = User.where("id > 31").paginate(page: params[:page],per_page: 10)
  end
end
