function CreateActivityController($scope,$navigate){
    $scope.go_list=function(){
      $navigate.go('/activity_list', 'slide', 'left');
    }
    $scope.create_activity= function() {
        var activity = new Activity($scope.activity_name);
        if(activity.is_repeated_in_activities()){
            $scope.tips="＊活动名称重复";
            return;
        }
        activity.save_activities();
        Activity.save_current_activity($scope.activity_name);
        $navigate.go('/sign_up', 'slide', 'left');
    }
    $scope.show_back=function(){
        if(Activity.get_activities().length != 0){
            $scope.if_have_activity = true;
        }
    }
    $scope.show_back();
}