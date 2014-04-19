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

    user = User.find_by_user_name(params[:user_name])
    p '........................'
    p user.authenticate(params[:password])
    if user && user.authenticate(params[:password])
      cookies.permanent[:token] = user.token
      p 'aaaaaaaaaaaaaaaaaaaaaaaa'
      redirect_to :welcome
    else
      redirect_to :login
    end
  end

  def create
    @user = User.new(params[:user])
    if @user.save
      redirect_to :welcome
    else
      render :register
    end
  end
end
