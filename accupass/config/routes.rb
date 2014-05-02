Rails.application.routes.draw do
  get 'add_user'=> 'admin#add_user',:as =>'add_user'

  get  'change_password'=> 'admin#change_password',:as => 'change_password'

  get  'manager_index'=> 'admin#manager_index',:as =>'manager_index'

  root to:  'users#welcome', :as => 'welcome'

  get '/register' =>'users#register', :as => 'register'

  get '/login' => 'users#login', :as => 'login'
  post '/create_login_session' => 'users#create_login_session'
  delete "logout" => "users#logout", :as => "logout"
  post '/post_change_password'=>'admin#post_change_password'
  delete '/del_user'=>'admin#del_user'
  get '/forget_first' => 'users#forget_first',:as => 'forget_first'
  post '/post_forget_first' => 'users#post_forget_first'
  get '/forget_second' => 'users#forget_second',:as => 'forget_second'
  post '/post_forget_second'=>'users#post_forget_second'
  get '/forget_third'=>'users#forget_third',:as => 'forget_third'
  post '/post_forget_third'=>'users#post_forget_third'
  post '/process_phone_login'=>'users#process_phone_login'
  post '/process_activities_information'=>'users#process_activities_information'
  get '/sign_up'=>'users#sign_up', :as =>'sign_up'
  get '/bid_list'=>'users#bid_list', :as =>'bid_list'
  get '/bid_detail'=>'users#bid_detail',:as=>'bid_detail'
  get '/show'=>'users#show'
  get '/price_static'=>'users#price_static',:as=>'price_static'

  resource :users, only: [:create]

  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
