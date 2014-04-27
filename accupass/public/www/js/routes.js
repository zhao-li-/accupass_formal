myModule.config(function($routeProvider) {
    $routeProvider.when("/activity_list",{
        templateUrl: "pages/activity_list_page.html",
        controller: ActivityListController
    }).when("/create", {
        templateUrl: "pages/create_activity_page.html",
        controller: CreateActivityController
    }).when("/sign_up", {
        templateUrl: "pages/sign_up_page.html",
        controller: SignUpController
    }).when("/bid_list", {
        templateUrl: "pages/bid_list_page.html",
        controller: BidListController
    }).when("/bid_apply", {
        templateUrl: "pages/bid_apply_page.html",
        controller: BidApplyController
    }).when("/bid_result", {
        templateUrl: "pages/bid_result_page.html",
        controller: BidResultController
    }).when("/price_statistic", {
        templateUrl: "pages/price_statistic_page.html",
        controller: PriceStatisticController
    }).when("/", {
        templateUrl: "pages/login.html",
        controller: LoginController
    }).otherwise({
        redirectTo: "/"
    });
    //routing generate

    //manual routing
});

/** Here is example
myModule.config(function($routeProvider) {
    $routeProvider.when("/", {
        templateUrl: "pages/activity_list_page.html",
        controller: ActivityListController
    }).when("/activity/create", {
            templateUrl: "pages/activity_create_page.html",
            controller: ActivityCreateController
        }).when("/sign_ups/list/:activity_name", {
            templateUrl: "pages/apply_page.html",
            controller: SignUpListController
        }).otherwise({
            redirectTo: "/"
        });
});
**/