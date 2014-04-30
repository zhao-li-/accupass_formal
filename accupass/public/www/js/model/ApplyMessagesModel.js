function ApplyMessages (json_message){
    this.user_name =json_message.messages[0].message.replace(/\s/g, "").substring(2);
    this.phone = json_message.messages[0].phone;
    var start_activities = _.find(JSON.parse(localStorage.getItem("activities")),function(activity) {
        return activity.status == "start";
    })
    this.activity_name = start_activities.name;
    this.current_user = localStorage.current_user
}

ApplyMessages.get_apply_messages = function(){
    return JSON.parse(localStorage.getItem("received_messages")) || [];
}

ApplyMessages.fore_two_string = function(json_message){
    return json_message.messages[0].message.replace(/\s/g, "").substring(0,2).toUpperCase();
}

ApplyMessages.get_start_activity = function(){
    return _.find(JSON.parse(localStorage.getItem("activities")),function(activity) {
        return activity.status == "start" &&activity.user_name == localStorage.current_user;
    });
}

ApplyMessages.prototype.have_applied = function(){
    var phone = this.phone;
    return _.find(ApplyMessages.get_apply_messages(),function(received_message){
        return received_message.phone == phone && received_message.activity_name == localStorage.enter_into_it &&received_message.current_user == localStorage.current_user
    })
}

ApplyMessages.prototype.save_apply_messages = function (){
    var received_messages = ApplyMessages.get_apply_messages();
    received_messages.push(this);
    localStorage.setItem("received_messages",JSON.stringify(received_messages));
}

ApplyMessages.refresh_sign_up_page = function(){
    var sign_up_view_element = document.getElementById("sign_up_page")
    if(sign_up_view_element) {
        var scope = angular.element(sign_up_view_element).scope()
        scope.$apply(function() {
            scope.apply_num()
        })
    }
}