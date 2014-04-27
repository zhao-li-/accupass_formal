function SignUpController($scope,$navigate){
    $scope.go_list=function(){
        $navigate.go('/activity_list', 'slide', 'left');
    }
    $scope.disable_start_function = function(){
        if($scope.button_name == "结束"){
            $scope.disable_start = false;
            return;
        }
        if(Activity.is_normal_start()){
            $scope.disable_start = false;
            return;
        }
        $scope.disable_start = true;
    }
    $scope.button_name_init=function(){
        if(Activity.get_current_activity().status == "start"){
            $scope.button_name = "结束";
            return;
        }
        $scope.button_name = "开始";
    }
    $scope.button_name_init();
    $scope.button_name_click=function(){
        if(Activity.get_current_activity().status == "start"){
            $scope.button_name = "开始";
            return;
        }
        $scope.button_name = "结束";
    }
    $scope.start_or_end_apply=function(){
        if(Activity.get_current_activity().status == "start"){
            if(confirm("确认要结束本次报名吗？")){
                $scope.button_name_click();
                Activity.change_current_activity_status("over");
                $navigate.go('/bid_list', 'slide', 'left');
            }
            return;
        }
        $scope.button_name_click();
        Activity.change_current_activity_status("start");
    }
    $scope.apply_num = function(){
        $scope.apply_lists = Activity.filter_current_activity_apply_messages();
    }
    $scope.apply_num();
    $scope.disable_start_function();
    $scope.go_bid = function(){
        $navigate.go('/bid_list', 'slide', 'left');
    }
}



