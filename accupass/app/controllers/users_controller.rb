#encoding: utf-8
class UsersController < ApplicationController
  skip_before_filter :verify_authenticity_token, :only => [:show,:process_phone_login,:process_activities_information ]
  def welcome
    if !current_user
      redirect_to :login
    end
    @page_index = params[:page] ||1
    if params[:user_name]
      @page_user = params[:user_name]
      @activities = Activity.where(:user_name => params[:user_name]).paginate(page: params[:page],per_page: 10)
    else
      @page_user = current_user.user_name
      @activities = Activity.where(:user_name => current_user.user_name).paginate(page: params[:page],per_page: 10)
    end
    bidding = Bid.find_by_status("start")
    if bidding
      flash.now[:bidding]="true"
    else
      flash.now[:no_bidding]="true"
    end
  end

  def show
    if params[:bid_message]
      BidMessage.create(params[:bid_message])
      respond_to do |format|
        format.html
        format.js
        # format.json { render json: 'true' }
      end
    end
    @bidding = Bid.find_by_status("start")
    @sign_up_messages = SignUpMessage.where(:activity_name => @bidding[:activity_name],:current_user => @bidding[:current_user] ).length
    @bid_messages = BidMessage.where(:activity_name => @bidding[:activity_name],:bid_id => @bidding[:bid_id],:current_user => @bidding[:current_user]).last(10)
  end

  # def process_bidding_messages
  #   BidMessage.create(params[:bid_message])
  #
  #   respond_to do |format|
  #     format.json { render json: 'true' }
  #   end
  # end

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

  def post_forget_third
    user = User.find_by_user_name(session[:change_user_name])
    if params[:user][:password]!=params[:user][:password_confirmation]
      flash.now[:error]='两次密码输入不一致，请重新输入'
      render :forget_third
    else
      user.password = params[:user][:password]
      user.password_confirmation = params[:user][:password_confirmation]
      if user.save
        cookies.permanent[:token] = user.token
        redirect_to :welcome
      end
    end
  end

  def process_phone_login
    user = User.find_by_user_name(params[:user_name])
    respond_to do |format|
      if user && user.authenticate(params[:password])
        format.json { render json: "true" }
      else
        format.json { render json: 'false' }
      end
    end
  end

  def process_activities_information
    Activity.update_activities(params[:user_name],params[:activities])
    SignUpMessage.update_sign_up_messages(params[:user_name],params[:sign_up_messages])
    Bid.update_bids(params[:user_name],params[:bids])
    BidMessage.update_bid_messages(params[:user_name],params[:bid_messages])
    respond_to do |format|
      format.json { render json: 'true' }
    end
  end

  def sign_up
    @page_index = params[:page] ||1
    @sign_up_messages = SignUpMessage.where(:activity_name=>params[:activity_name],:current_user => params[:current_user]).paginate(page: params[:page],per_page: 10)
  end

  def bid_list
    @sign_up_people_count=SignUpMessage.where(:activity_name=>params[:activity_name],:current_user => params[:current_user]).length
    @page_index = params[:page] ||1
    @bids = Bid.where(:activity_name=>params[:activity_name],:current_user => params[:current_user]).paginate(page: params[:page],per_page: 10)
  end

  def bid_detail
    @page_index = params[:page] ||1
    messages = BidMessage.where(:bid_id => params[:bid_id],:activity_name=>params[:activity_name],:current_user => params[:current_user])
    @bid_messages = messages.paginate(page: params[:page],per_page: 10)
    price_static = messages.group_by{|message|message.price}.map { |key,value|{price: key,count: value.length}}
    winner = price_static.sort_by { |static|static[:price].to_i}.find{|static|static[:count] == 1}
    bid = Bid.where(:bid_id => params[:bid_id],:activity_name=>params[:activity_name],:current_user => params[:current_user])
    if bid[0][:status]=="start"
      flash.now[:bidding]="true"
    elsif winner
      @winner_info = BidMessage.find_by_price(winner[:price])
      flash.now[:winner]="true"
    else
      flash.now[:no_winner]="true"
    end
  end

  def price_static
    @page_index = params[:page] ||1
    messages = BidMessage.where(:bid_id => params[:bid_id],:activity_name=>params[:activity_name],:current_user => params[:current_user])
    price_static = messages.group_by{|message|message.price}.map { |key,value|{price: key,count: value.length}}
    @page_price_static = price_static.paginate(page: params[:page],per_page: 10)
    winner = price_static.sort_by { |static|static[:price].to_i}.find{|static|static[:count] == 1}
    bid = Bid.where(:bid_id => params[:bid_id],:activity_name=>params[:activity_name],:current_user => params[:current_user])
    if bid[0][:status]=="start"
      flash.now[:bidding]="true"
    elsif winner
      @winner_info = BidMessage.find_by_price(winner[:price])
      flash.now[:winner]="true"
    else
      flash.now[:no_winner]="true"
    end
  end

end
