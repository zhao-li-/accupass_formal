#encoding: utf-8
class UsersController < ApplicationController
  def welcome
  end

  def register
    @user = User.new
  end

  def login
  end

  def create_login_session
    user = User.find_by_name(params[:user_name])
    if user && user.authenticate(params[:password])
      cookies.permanent[:token] = user.token
      redirect_to :welcome
    else
      redirect_to :login
    end
  end

  def create
    @user = User.new(params[:user])
    if @user.save
      render :welcome
    else
      render :register
    end
  end
end
