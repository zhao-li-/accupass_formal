function LoginController($scope,$navigate,$http){
    $scope.post_user = function(){
        var post_data = {'user_name':$scope.user_name,'password':$scope.password};
        var post_url ='/process_phone_login';
        $http.post(post_url,post_data).success(function(data){
            if(data=='false'){
                $scope.show_error=true;
                return;
            }
            localStorage.current_user = $scope.user_name;
            $navigate.go("/activity_list")
        })
    }
}