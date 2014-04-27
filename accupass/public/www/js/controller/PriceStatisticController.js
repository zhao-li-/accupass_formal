function PriceStatisticController ($scope,$navigate){
    $scope.go_bid_list = function(){
        $navigate.go("/bid_list", 'slide', 'left');
    }
    $scope.go_bid_result = function(){
        $navigate.go("/bid_result", 'slide', 'left');
    }
    $scope.bid_id = localStorage.enter_into_bid;
    $scope.bid_num = Bid.get_current_bid_messages().length
    $scope.price_count_infos = Bid.get_price_statistic();
    $scope.winner_name = Bid.get_local_winner_info().user_name;
    $scope.winner_price= Bid.get_local_winner_info().price;
    $scope.winner_phone= Bid.get_local_winner_info().phone;
    $scope.show_footer = function(){
        if(Bid.get_local_winner_info().length !=0){
            $scope.succeed = true;
            return;
        }
        $scope.failed = true;
    }
    $scope.show_footer();
}