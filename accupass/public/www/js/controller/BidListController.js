function BidListController($scope,$navigate){
    $scope.go_sign_up = function(){
        $navigate.go('/sign_up', 'slide', 'left');
    }
    $scope.go_activity_list = function(){
        $navigate.go("/activity_list", 'slide', 'left');
    }
    $scope.start_bid = function (){
        Bid.start_bid();
        $navigate.go('/bid_apply', 'slide', 'left');
    }
    $scope.bid_lists = Bid.bid_list();
    $scope.go_bid_apply = function(enter_into_bid){
        Bid.save_current_bid(enter_into_bid);
        if(Bid.get_current_bid().status =="over"){
            $navigate.go('/bid_result', 'slide', 'left');
            return;
        }
        $navigate.go('/bid_apply', 'slide', 'left');
    }
    $scope.disable_start_button = function(){
        if(Bid.disable_start_button()){
            $scope.disable_bid_list_start = true;
        }
    }
    $scope.disable_start_button();
}