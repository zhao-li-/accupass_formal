function ActivityListController($scope,$navigate){
    $scope.go_create=function(){
        $navigate.go('/create', 'slide', 'left');
    }
    $scope.go_sign_up=function(activity_name){
        Activity.save_current_activity(activity_name);
        $navigate.go('/sign_up', 'slide', 'left')
    }
    $scope.reverse_the_activity_list=function(){
        $scope.activities = Activity.reverse_activities();
    }
    $scope.reverse_the_activity_list();
    $scope.no_list=function(){
        if(Activity.reverse_activities().length == 0){
            $navigate.go('/create', 'slide', 'left');
        }
    }
    $scope.no_list();
    $scope.yellow_when_bidding = function(name){
        return  Activity.yellow_when_start_bidding(name);
    }
}