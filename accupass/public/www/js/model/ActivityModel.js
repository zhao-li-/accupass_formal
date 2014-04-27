function Activity(name){
    this.name = name;
    this.status = 'default';
}

Activity.prototype.save_activities = function() {
    var activities = Activity.get_activities();
    activities.push(this);
    localStorage.setItem("activities", JSON.stringify(activities));
}

Activity.get_activities = function(){
    return JSON.parse(localStorage.getItem("activities") ) || [];
}

Activity.prototype.is_repeated_in_activities = function(){
    var activity_name = this.name;
    return _.some(Activity.get_activities(),function(activity){
        return activity.name == activity_name
    })
}

Activity.save_current_activity = function(activity_name){
    localStorage.setItem("enter_into_it",activity_name);
}

Activity.reverse_activities = function(){
    var activities = Activity.get_activities();
    if(activities.length != 0){
        activities.reverse();
    }
    return activities;
}

Activity.yellow_when_start_bidding = function(name){
    var bid_infos = Bid.get_bid_infos();
    if(_.some(bid_infos,function(bid_info){
        return bid_info.activity_name == name && bid_info.status == "start";
    })){
        return "start"
    }
}

Activity.is_normal_start = function(){
    if(!_.find(Activity.get_activities(),function(activity){
        return activity.status == "start";
    }) && !_.find(Bid.get_bid_infos(),function(bid_info){
        return bid_info.status == "start"
    })){
        return true
    }
}

Activity.get_current_activity = function(){
    return _.find(Activity.get_activities(),function(activity) {
        return activity.name == localStorage.getItem("enter_into_it");
    })
}

Activity.get_current_activity_name = function(){
    return localStorage.enter_into_it;
}

Activity.change_activities_to= function(activities){
    localStorage.setItem("activities", JSON.stringify(activities));
}

Activity.change_current_activity_status = function(status){
    var activities = Activity.get_activities()
    _.map(activities,function(activity){
        if(activity.name == Activity.get_current_activity().name){
            activity.status = status;
        }
    })
    Activity.change_activities_to(activities);
}

Activity.filter_current_activity_apply_messages = function (){
    return _.filter(ApplyMessages.get_apply_messages(),function(received_message) {
        var enter_into_it = Activity.get_current_activity_name();
        return received_message.activity_name == enter_into_it;
    });
}
