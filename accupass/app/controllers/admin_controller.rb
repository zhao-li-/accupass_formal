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

  def change_password
    @user = User.find_by_user_name(params[:user_name])
  end

  def post_change_password
    @user = User.find_by_user_name(params[:user][:user_name])
    if params[:user][:password]!= params[:user][:password_confirmation]
      flash[:error]="两次密码输入不一致，请重新输入"
      render :change_password
    else
      @user.password = params[:user][:password]
      @user.password_confirmation = params[:user][:password_confirmation]
      if @user.save
        flash.now[:succeed] = "jj"
        render :change_password
      end
    end
  end

  def manager_index
    if !current_user
      redirect_to :login
    end
    @page_index = params[:page] ||1
    @users = User.where("id > 2").paginate(page: params[:page],per_page: 10)
  end
end

