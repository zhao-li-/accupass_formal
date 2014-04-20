#encoding: utf-8
class UsersController < ApplicationController
  def welcome
    if !current_user
      redirect_to :login
    end
    @users = User.paginate(page: params[:page],per_page: 10)
  end

  def register
    @user = User.new
  end

  def login
  end

  def logout
    cookies.delete(:token)
    redirect_to :login
  end

  def create_login_session
    user = User.find_by_user_name(params[:user_name])
    if user && user.authenticate(params[:password])
      cookies.permanent[:token] = user.token
      redirect_to :welcome
    else
      flash[:error]="用户名不存在或密码错误"
      redirect_to :login
    end
  end

  def create
    @user = User.new(params[:user])
    if @user.save
      cookies.permanent[:token]=@user.token
      redirect_to :welcome
    else
      render :register
    end
  end
end
