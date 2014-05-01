function Activity(name){
    this.name = name;
    this.status = 'default';
    this.user_name = localStorage.current_user
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
        return activity.name == activity_name && activity.user_name == localStorage.current_user
    })
}

Activity.save_current_activity = function(activity_name){
    localStorage.setItem("enter_into_it",activity_name);
}

Activity.reverse_activities = function(){
    var activities = Activity.get_activities();
    var current_activities = _.filter(activities,function(activity){
        return activity.user_name ==localStorage.current_user
    })
    if(current_activities.length != 0){
        current_activities.reverse();
    }
    return current_activities;
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
        return received_message.activity_name == enter_into_it && received_message.current_user == localStorage.current_user;
    });
}

Activity.sort_activities = function(){
    var sign_up_counts_messages = _.chain(ApplyMessages.get_apply_messages())
        .filter(function(sign_up){
            return sign_up.current_user == localStorage.current_user
        })
        .groupBy(function(sign_up){
            return sign_up.activity_name
        })
        .map(function(value,key){
            return {"activity_name":key,"sign_up_counts":value.length}
        })
        .value()
    var activities = Activity.get_activities()
    var sign_up_counts = _.map(activities,function(activity){
        return _.find(sign_up_counts_messages,function(sign_up_count){
           return sign_up_count.activity_name ==activity.name
        }) ||{"activity_name":activity.name,"sign_up_counts":0}
    })
    var bid_counts = _.chain(Bid.get_bid_infos())
        .filter(function(bid_message){
            return bid_message.current_user == localStorage.current_user
        })
        .groupBy(function(bid_message){
            return bid_message.activity_name
        })
        .map(function(value,key){
            return {"activity_name":key,"bid_counts":value.length}
        })
        .value()
    var activities = [];
    for (var i=0;i<sign_up_counts.length;i++){

        var bid = _.find(bid_counts,function(bid_count){
            return bid_count.activity_name == sign_up_counts[i].activity_name
        })
        if (!bid){
            bid ={"activity_name":sign_up_counts[i].activity_name,"bid_counts":0}
        }
        activity = {"activity_name":sign_up_counts[i].activity_name,"sign_up_counts":sign_up_counts[i].sign_up_counts,"bid_counts":bid.bid_counts,"user_name":localStorage.current_user}
        activities.push(activity);
    }
    return activities
}

Activity.post_activity_information = function (){
        $.ajax({
            type: "POST",
            url: "/process_activities_information",
            data: {"user_name":localStorage.current_user,
                   "activities":Activity.sort_activities()},
            success: function () {
                alert('同步成功！')
            },
            error: function () {
                alert('同步失败，请重新同步！')
            }
        });
}
