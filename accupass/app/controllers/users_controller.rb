#encoding: utf-8
class UsersController < ApplicationController
  def welcome
    if !current_user
      redirect_to :login
    elsif current_user.admin?
      redirect_to :manager_index
    end
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
      if user.admin?
        redirect_to :manager_index
      else
        redirect_to :welcome
      end
    else
      flash[:error]="用户名不存在或密码错误"
      redirect_to :login
    end
  end

  def create
    @user = User.new(params[:user])
    if current_user && current_user.admin?
      if @user.save
        redirect_to :manager_index
      else
        render 'admin/add_user'
      end
    else
      if @user.save
        cookies.permanent[:token]=@user.token
        redirect_to :welcome
      else
        render :register
      end
    end
  end

  def forget_first
  end

  def post_forget_first
    if params[:user][:user_name]==''
      flash.now[:error] ='账号不能为空'
    end
    user = User.find_by_user_name(params[:user][:user_name])
    if user
      session[:change_user_name]=params[:user][:user_name]
      redirect_to forget_second_path
    else
      render :forget_first
    end
  end

  def forget_second
    user =User.find_by_user_name(session[:change_user_name])
    @forget_question = user[:forget_question]
  end

  def post_forget_second
    user =User.find_by_user_name(session[:change_user_name])
    @forget_question = user[:forget_question]
    if params[:user][:forget_answer]==""
      flash.now[:error]="请输入答案"
      render :forget_second
    elsif params[:user][:forget_answer]!=user[:forget_answer]
      flash.now[:error]="忘记密码答案错误"
      render :forget_second
    else
      redirect_to :forget_third
    end
  end

  def forget_third

  end
end
