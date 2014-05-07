function BidResultController($scope,$navigate,$timeout){
    $scope.go_bid_list = function(){
        $navigate.go("/bid_list", 'slide', 'left');
    }
    $scope.go_price_statistic = function(){
        $navigate.go("/price_statistic", 'slide', 'left');
    }

    $scope.find_winner = function (){
        if(Bid.get_winner()){
            Bid.save_winner_info();
            $scope.winner_name = Bid.get_winner_info().user_name;
            $scope.winner_price= Bid.get_winner_info().price;
            $scope.winner_phone= Bid.get_winner_info().phone;
        }
    }
    $scope.find_winner();
    $scope.show_footer = function(){
        if(Bid.get_winner()){
            $scope.succeed = true;
            return;
        }
        $scope.failed = true;
    }
    $scope.show_alert_info = function(){
//        console.log(Bid.get_winner_info(),"here")
        if(!Bid.get_winner()){
            $timeout(function () {
                $('#bid_failed').modal('show');
                $timeout(function () {
                    $('#bid_failed').modal('hide');
                    $scope.show_footer();
                },3000)
            }, 1);
            return;
        }
        $timeout(function () {
            $('#bid_succeed').modal('show');
            $timeout(function () {
                $('#bid_succeed').modal('hide');
                $scope.show_footer();
            },3000)
        }, 1);
    }
    $scope.show_alert_info();
    $scope.bid_id = Bid.get_current_bid_id();
    $scope.bid_applies = Bid.get_sorted_current_bid_messages();
    $scope.bid_num = Bid.get_sorted_current_bid_messages().length;
}