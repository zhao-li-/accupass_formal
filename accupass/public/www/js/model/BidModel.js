function Bid (count){
    this.activity_name = Activity.get_current_activity().name;
    this.bid_id = count;
    this.status = "default";
    this.current_user = localStorage.current_user
}

Bid.get_bid_infos = function (){
    return JSON.parse(localStorage.getItem("bid_infos")) || [];
}

Bid.filter_current_bid_infos= function (){
    return _.filter(Bid.get_bid_infos(),function(bid_info){
        return bid_info.activity_name == Activity.get_current_activity.name &&bid_info.current_user == localStorage.current_user ;
    }) || [];
}

Bid.save_bid_infos = function(bid_infos){
    localStorage.setItem("bid_infos",JSON.stringify(bid_infos));
}

Bid.create_bid = function(count){
    var  bid_info = new Bid(count +1);
    var bid_infos = Bid.get_bid_infos();
    bid_infos.push(bid_info);
    Bid.save_bid_infos(bid_infos);
}

Bid.get_count = function (){
    var bid_lists = _.filter(Bid.get_bid_infos(),function(bid_info){
        return bid_info.activity_name == Activity.get_current_activity_name() &&bid_info.current_user == localStorage.current_user ;
    }) || [];
    var count = bid_lists.length;
    return count;
}

Bid.start_bid = function(){
    Bid.create_bid(Bid.get_count());
    localStorage.setItem("enter_into_bid",Bid.get_count());
}

Bid.bid_list = function (){
    var bid_lists = _.filter(Bid.get_bid_infos(),function(bid_info){
        return bid_info.activity_name == Activity.get_current_activity_name() &&bid_info.current_user == localStorage.current_user ;
    }) || [];
    bid_lists.reverse();
    return bid_lists;
}

Bid.save_current_bid = function(enter_into_bid){
    localStorage.setItem("enter_into_bid",enter_into_bid);
}

Bid.get_current_bid_id = function(){
    return localStorage.enter_into_bid;
}

Bid.get_current_bid =function(){
    return  _.find(Bid.get_bid_infos(),function(bid_info){
        return bid_info.activity_name == localStorage.enter_into_it && bid_info.bid_id == localStorage.enter_into_bid &&bid_info.current_user == localStorage.current_user ;
    })
}

Bid.disable_start_button = function(){
    var have_start_bid = _.find(Bid.get_bid_infos(),function(bid_info){
        return bid_info.status == "start" && bid_info.current_user == localStorage.current_user;
    })
    var have_apply_lists = _.find(ApplyMessages.get_apply_messages(),function(received_message) {
        return received_message.activity_name == Activity.get_current_activity_name() &&received_message.current_user == localStorage.current_user;
    });
    var have_start_activity = _.find(Activity.get_activities(),function(activity){
        return activity.name == Activity.get_current_activity_name() && activity.status =="start" &&activity.user_name == localStorage.current_user
    });
    if(have_start_bid ||!have_apply_lists ||have_start_activity){
        return true;
    }
}

Bid.change_current_bid_status = function(status){
    var bid_infos = Bid.get_bid_infos();
    var current_bid = Bid.get_current_bid();
    _.map(bid_infos,function(bid_info){
        if(bid_info.activity_name == current_bid.activity_name && bid_info.bid_id == current_bid.bid_id && bid_info.current_user==localStorage.current_user){
            bid_info.status = status
        }
    })
    Bid.save_bid_infos(bid_infos);
}

Bid.clear_winner_info = function(){
    var winner_info = [];
    localStorage.setItem("winner_info",JSON.stringify(winner_info));
}

Bid.get_current_bid_messages = function(){
    return _.filter(JSON.parse(localStorage.getItem("bid_messages")),function(bid_message){
        return bid_message.activity_name == localStorage.enter_into_it && bid_message.bid_id == localStorage.enter_into_bid &&bid_message.current_user==localStorage.current_user
    })
}

Bid.get_sorted_current_bid_messages = function(){
    return _.chain(BidMessages.get_bid_messages())
        .filter(function(bid_message){
            return bid_message.activity_name == localStorage.enter_into_it && bid_message.bid_id == localStorage.enter_into_bid &&bid_message.current_user==localStorage.current_user
        })
        .sortBy(function(bid_message){
            return parseInt(bid_message.price)
        })
        .value();
}

Bid.get_winner = function(){
    return _.chain(BidMessages.get_bid_messages())
        .filter(function(bid_message){
            return bid_message.activity_name == localStorage.enter_into_it && bid_message.bid_id == localStorage.enter_into_bid &&bid_message.current_user==localStorage.current_user
        })
        .groupBy(function(bid_message){
            return parseInt(bid_message.price)
        })
        .map(function(value,key){
            return {"price":key,"count":value.length}
        })
        .find(function(bid_message){
            return bid_message.count == 1
        })
        .value();
}

Bid.get_winner_info = function(){
    return _.find(Bid.get_current_bid_messages(),function(this_message){
        return this_message.price == Bid.get_winner().price
    })
}

Bid.save_winner_info = function(){
    var winner_info = Bid.get_winner_info();
    localStorage.setItem("winner_info",JSON.stringify(winner_info));
}

Bid.get_local_winner_info = function(){
    return JSON.parse(localStorage.getItem("winner_info")) ||[];
}

Bid.get_price_statistic = function(){
    return _.chain(BidMessages.get_bid_messages())
        .filter(function(bid_message){
            return bid_message.activity_name == localStorage.enter_into_it && bid_message.bid_id == localStorage.enter_into_bid && bid_message.current_user==localStorage.current_user
        })
        .groupBy(function(bid_message){
            return parseInt(bid_message.price)
        })
        .map(function(value,key){
            return {"price":key,"count":value.length}
        })
        .value();
}

Bid.sort_bids = function(){
    return _.map(Bid.get_bid_infos(),function(bid_info){
        var bid_messages = _.filter(BidMessages.get_bid_messages(),function(bid_message){
            return bid_message.bid_id == bid_info.bid_id
        })
        var people_count = bid_messages.length
        bid_info["people_count"] =people_count;
        return bid_info
    })
}