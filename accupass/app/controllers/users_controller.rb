#encoding: utf-8
class UsersController < ApplicationController
  skip_before_filter :verify_authenticity_token, :only => [:process_bid_over,:show,:process_phone_login,:process_activities_information ]
  def welcome
    if !current_user
      redirect_to :login
    end
    @page_index = params[:page] ||1
    if params[:user_name]
      @page_user = params[:user_name]
      @activities = Activity.get_activities(params[:user_name]).paginate(page: params[:page],per_page: 10)
    else
      @page_user = current_user.user_name
      @activities = Activity.get_activities(current_user.user_name).paginate(page: params[:page],per_page: 10)
    end
    if Bid.get_start_bid
      flash.now[:bidding]="true"
    elfse
      flash.now[:no_bidding]="true"
    end
    if session[:this_bid_over]
      session.delete(:this_bid_over)
    end
  end

  def show
    if session[:this_bid_over]
      @show_over = true
      @winner = session[:winner]
    end
    @bidding = Bid.get_start_bid
    if params[:bid_message]
      BidMessage.create(params[:bid_message])
      respond_to do |format|
        format.html { redirect_to :show }
      end
    end
      @sign_up_messages = SignUpMessage.get_sign_up_messages(@bidding[:activity_name],@bidding[:current_user] ).length
      messages = BidMessage.get_bid_messages( @bidding[:bid_id], @bidding[:activity_name], @bidding[:current_user])
      @bid_messages_count = messages.length
      @bid_messages = messages.last(10)
  end

  def process_bid_over
    if params[:no_winner]
      session[:this_bid_over] = true
      session.delete(:winner)
      respond_to do |format|
        format.json { render json: 'true'}
      end
    end
    if params[:winner_info]
      session[:this_bid_over] = true
      session[:winner]=params[:winner_info]
      respond_to do |format|
        format.json { render json: 'true'}
      end
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
    user = User.get_activity(params[:user_name])
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
    user = User.get_activity(params[:user][:user_name])
    if user
      session[:change_user_name]=params[:user][:user_name]
      redirect_to forget_second_path
    else
      render :forget_first
    end
  end

  def forget_second
    user =User.get_activity(session[:change_user_name])
    @forget_question = user[:forget_question]
  end

  def post_forget_second
    user =User.get_activity(session[:change_user_name])
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
    user = User.get_activity(session[:change_user_name])
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
    user = User.get_activity(params[:user_name])
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
    @bid_messages = BidMessage.get_bid_messages(params[:bid_id],params[:activity_name],params[:current_user]).paginate(page: params[:page],per_page: 10)
    if Bid.get_bid(params[:bid_id],params[:activity_name],params[:current_user])[:status]=="start"
      flash.now[:bidding]="true"
    elsif BidMessage.get_winner(params[:bid_id],params[:activity_name],params[:current_user])
      @winner_info = BidMessage.get_winner_message(params[:bid_id],params[:activity_name],params[:current_user])
      flash.now[:winner]="true"
    else
      flash.now[:no_winner]="true"
    end
  end

  def price_static
    @page_index = params[:page] ||1
    @page_price_static = BidMessage.get_price_static(params[:bid_id],params[:activity_name],params[:current_user]).paginate(page: params[:page],per_page: 10)
    if Bid.get_bid(params[:bid_id],params[:activity_name],params[:current_user])[:status]=="start"
      flash.now[:bidding]="true"
    elsif BidMessage.get_winner(params[:bid_id],params[:activity_name],params[:current_user])
      @winner_info = BidMessage.get_winner_message(params[:bid_id],params[:activity_name],params[:current_user])
      flash.now[:winner]="true"
    else
      flash.now[:no_winner]="true"
    end
  end

end
