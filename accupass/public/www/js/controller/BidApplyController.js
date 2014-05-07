function BidApplyController($scope,$navigate){
    $scope.go_bid_list = function(){
        $navigate.go("/bid_list", 'slide', 'left');
    }
    $scope.bid_id = Bid.get_current_bid_id();
    $scope.button_name_function = function (){
        var current_bid = Bid.get_current_bid();
        if (current_bid.status == "default"){
            $scope.disable_end = false;
            $scope.button_name = "开始";
            return;
        }
        if (current_bid.status == "start"){
            $scope.disable_end = false;
            $scope.button_name = "结束";
            return;
        }
        $scope.disable_end = true;
        $scope.button_name = "结束";
    }
    $scope.button_name_function();
    $scope.end_bid_function = function (){
        if (Bid.get_current_bid().status == "default"){
            $scope.disable_end = false;
            $scope.button_name = "结束";
        }
    }
    $scope.start_end_bid = function(){
        $scope.end_bid_function();
        if(Bid.get_current_bid().status == "start"){
            if(confirm("是否确实要终止此次竞价？")){
                $scope.disable_end = true;
                $scope.button_name = "结束";
                Bid.change_current_bid_status("over");
                Bid.clear_winner_info();
                if(Bid.get_winner()){
                    $.ajax({type: "POST",
                        url: "/process_bid_over",
                        data: {"winner_info":Bid.get_winner_info()}})
                }else{
                    $.ajax({type: "POST",
                        url: "/process_bid_over",
                        data: {"no_winner":"no_winner"}})

                }
                $navigate.go("/bid_result", 'slide', 'left');
            }
            return;
        }
        Bid.change_current_bid_status("start");
        Activity.post_activity_information();
    }
    $scope.show_bid_info = function(){
        $scope.bid_applies = Bid.get_current_bid_messages();
        $scope.bid_num = Bid.get_current_bid_messages().length
    }
    $scope.show_bid_info();
}